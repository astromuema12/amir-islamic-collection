import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

const publicDir = join(import.meta.dirname, "..", "public");
const svgBuffer = readFileSync(join(publicDir, "pwa-icon.svg"));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  // Maskable icons (with extra padding for safe zone)
  for (const size of [192, 512]) {
    const padding = Math.round(size * 0.1);
    const inner = size - padding * 2;
    const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="#0F766E"/>
    </svg>`;

    const resizedIcon = await sharp(svgBuffer)
      .resize(inner, inner)
      .png()
      .toBuffer();

    await sharp(Buffer.from(bgSvg))
      .resize(size, size)
      .composite([{ input: resizedIcon, left: padding, top: padding }])
      .png()
      .toFile(join(publicDir, `icon-maskable-${size}.png`));
    console.log(`Generated icon-maskable-${size}.png`);
  }

  // Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, "apple-touch-icon.png"));
  console.log("Generated apple-touch-icon.png");

  // Favicons
  await sharp(svgBuffer).resize(16, 16).png().toFile(join(publicDir, "favicon-16.png"));
  await sharp(svgBuffer).resize(32, 32).png().toFile(join(publicDir, "favicon-32.png"));
  await sharp(svgBuffer).resize(48, 48).png().toFile(join(publicDir, "favicon-48.png"));
  await sharp(svgBuffer).resize(192, 192).png().toFile(join(publicDir, "favicon-192.png"));
  console.log("Generated favicon variants");

  // Safari pinned tab (SVG)
  console.log("All icons generated successfully!");
}

generate().catch(console.error);
