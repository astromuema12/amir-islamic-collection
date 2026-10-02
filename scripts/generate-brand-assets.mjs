/**
 * Brand asset generator.
 *
 * Single source of truth: `public/logo.png` (the master artwork).
 * Everything else in this list is derived from it and should never be
 * hand-edited:
 *
 *   public/logo-mark.png        trimmed, transparent mark used by <Logo> in the UI
 *   public/icon-{72..512}.png   PWA / web manifest icons
 *   public/icon-maskable-*.png  Android adaptive icons (logo inside safe zone)
 *   public/apple-touch-icon.png iOS home screen icon
 *   public/favicon-{16..192}.png
 *   public/favicon.svg          self-contained (base64) vector favicon
 *   public/icon.svg             self-contained square icon
 *   public/apple-icon.svg       self-contained 180px icon
 *   public/pwa-icon.svg         self-contained 512px icon
 *   public/og-image.png         1200x630 social share card (raster)
 *   public/og-image.svg         same design, vector
 *   src/app/favicon.ico         App Router metadata convention (/favicon.ico)
 *
 * Usage: npm run generate:icons
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const root = join(import.meta.dirname, "..");
const publicDir = join(root, "public");
const appDir = join(root, "src", "app");

const MASTER = join(publicDir, "logo.png");

/**
 * The mark is dark green, so every derived asset sits on a light plate.
 * White keeps maximum contrast and stays legible on both light and dark
 * browser/OS chrome.
 */
const PLATE = "#ffffff";
const OG_TOP = "#022c22";
const OG_BOTTOM = "#064e3b";
const OG_GOLD = "#fbbf24";

/** Pixels with an alpha at or below this are treated as empty canvas. */
const ALPHA_FLOOR = 16;

/** Fraction of the canvas the artwork occupies, per output kind. */
const SCALE = {
  pwa: 0.72,
  maskable: 0.56, // Android masks to a circle of 80% diameter
  apple: 0.66, // iOS squircle clips the corners
  favicon: 0.86,
  svg: 0.74,
};

/** Scan raw pixels for the tight bounding box of visible artwork. */
async function contentBox(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > ALPHA_FLOOR) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right < 0) throw new Error("logo.png is fully transparent - nothing to generate.");

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

/** The artwork cropped to its bounding box, on transparency. */
async function loadMark() {
  const box = await contentBox(readFileSync(MASTER));
  const buffer = await sharp(readFileSync(MASTER))
    .extract(box)
    .png()
    .toBuffer();

  return { buffer, width: box.width, height: box.height };
}

/** Fit the artwork into a `size`x`size` square plate, centred. */
async function renderIcon(mark, size, scale, background = PLATE) {
  const inner = Math.round(size * scale);
  const fitted = await sharp(mark.buffer)
    .resize(inner, inner, { fit: "inside" })
    .png()
    .toBuffer();

  const plate = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .png()
    .toBuffer();

  return sharp(plate)
    .composite([{ input: fitted, gravity: "centre" }])
    .png()
    .toBuffer();
}

/** data URI of the artwork, downscaled and palette-reduced for embedding. */
async function markDataUri(mark, px, colors = 128) {
  const png = await sharp(mark.buffer)
    .resize(px, px, { fit: "inside" })
    .png({ palette: true, colors, compressionLevel: 9, effort: 10 })
    .toBuffer();

  return `data:image/png;base64,${png.toString("base64")}`;
}

/** A self-contained SVG: light rounded plate + embedded artwork. */
async function plateSvg(mark, size, scale, rx) {
  const uri = await markDataUri(mark, Math.min(size * 2, 640));
  const pad = (size * (1 - scale)) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Amir Islamic Collections">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${PLATE}"/>
  <image x="${pad.toFixed(2)}" y="${pad.toFixed(2)}" width="${(size - pad * 2).toFixed(2)}" height="${(size - pad * 2).toFixed(2)}" preserveAspectRatio="xMidYMid meet" xlink:href="${uri}"/>
</svg>
`;
}

/** Build an .ico container holding PNG-compressed images (Vista+). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries = Buffer.alloc(16 * images.length);
  let offset = header.length + entries.length;

  images.forEach(({ size, data }, i) => {
    const at = i * 16;
    entries.writeUInt8(size >= 256 ? 0 : size, at + 0); // width
    entries.writeUInt8(size >= 256 ? 0 : size, at + 1); // height
    entries.writeUInt8(0, at + 2); // palette size
    entries.writeUInt8(0, at + 3); // reserved
    entries.writeUInt16LE(1, at + 4); // colour planes
    entries.writeUInt16LE(32, at + 6); // bits per pixel
    entries.writeUInt32LE(data.length, at + 8);
    entries.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, entries, ...images.map((i) => i.data)]);
}

async function generate() {
  const mark = await loadMark();
  console.log(`Master artwork: ${mark.width}x${mark.height} (content box, transparency trimmed)`);

  // Trimmed mark for the <Logo> component so markSize maps to visible pixels.
  // Capped at 384px on the long edge: the largest usage is 96px, so 4x is
  // already past the point of diminishing returns and this keeps the file small.
  writeFileSync(
    join(publicDir, "logo-mark.png"),
    await sharp(mark.buffer).resize(384, 384, { fit: "inside" }).png({ compressionLevel: 9 }).toBuffer()
  );
  console.log("Wrote logo-mark.png");

  for (const size of [72, 96, 128, 144, 152, 192, 384, 512]) {
    const png = await renderIcon(mark, size, SCALE.pwa);
    writeFileSync(join(publicDir, `icon-${size}.png`), png);
    console.log(`Wrote icon-${size}.png`);
  }

  for (const size of [192, 512]) {
    const png = await renderIcon(mark, size, SCALE.maskable);
    writeFileSync(join(publicDir, `icon-maskable-${size}.png`), png);
    console.log(`Wrote icon-maskable-${size}.png`);
  }

  const apple = await renderIcon(mark, 180, SCALE.apple);
  writeFileSync(join(publicDir, "apple-touch-icon.png"), apple);
  console.log("Wrote apple-touch-icon.png");

  const faviconSizes = [16, 32, 48, 192];
  const icoImages = [];
  for (const size of faviconSizes) {
    const png = await renderIcon(mark, size, SCALE.favicon);
    writeFileSync(join(publicDir, `favicon-${size}.png`), png);
    icoImages.push({ size, data: png });
  }
  console.log("Wrote favicon-{16,32,48,192}.png");

  // App Router serves this at /favicon.ico and it wins over <link rel=icon>.
  mkdirSync(appDir, { recursive: true });
  writeFileSync(join(appDir, "favicon.ico"), buildIco(icoImages));
  console.log("Wrote src/app/favicon.ico");

  writeFileSync(join(publicDir, "favicon.svg"), await plateSvg(mark, 32, SCALE.favicon, 6));
  writeFileSync(join(publicDir, "icon.svg"), await plateSvg(mark, 512, SCALE.svg, 64));
  writeFileSync(join(publicDir, "apple-icon.svg"), await plateSvg(mark, 180, SCALE.apple, 24));
  writeFileSync(join(publicDir, "pwa-icon.svg"), await plateSvg(mark, 512, SCALE.pwa, 96));
  console.log("Wrote favicon.svg, icon.svg, apple-icon.svg, pwa-icon.svg");

  // Social share card. PNG, because Facebook/Twitter/WhatsApp do not render
  // SVG og:images.
  const ogMark = await markDataUri(mark, 360, 200);
  const og = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${OG_TOP}"/>
      <stop offset="100%" stop-color="${OG_BOTTOM}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="486" y="62" width="228" height="228" rx="44" fill="${PLATE}"/>
  <image x="510" y="86" width="180" height="180" preserveAspectRatio="xMidYMid meet" xlink:href="${ogMark}"/>
  <text x="600" y="372" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="bold" fill="${OG_GOLD}" text-anchor="middle">Amir Islamic</text>
  <text x="600" y="452" font-family="Georgia, 'Times New Roman', serif" font-size="50" fill="#ffffff" text-anchor="middle">Collections</text>
  <rect x="540" y="492" width="120" height="3" rx="1.5" fill="${OG_GOLD}"/>
  <text x="600" y="540" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">Premium Islamic Products Marketplace</text>
</svg>
`;

  await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(join(publicDir, "og-image.png"));
  writeFileSync(join(publicDir, "og-image.svg"), og);
  console.log("Wrote og-image.png + og-image.svg");
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
