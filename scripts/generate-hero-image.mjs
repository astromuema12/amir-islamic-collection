/**
 * Hero banner image generator.
 *
 * Builds `public/hero/hero-essentials.png` — one cohesive, art-directed
 * product arrangement for the homepage hero banner.
 *
 * Source photography is reused from `public/categories/` (already in the
 * repo — no new photography, no external image service, no new dependency):
 *
 *   categories/islamic-books.jpeg  Qur'an with a gold/cream cover
 *   categories/accessories.jpeg    tasbih / prayer beads
 *   categories/perfumes.jpeg       perfume bottles
 *   categories/prayer-mats.jpeg    green prayer mat
 *   categories/hijabs.jpeg         folded modestwear textile
 *
 * Each photo is cut out of its studio backdrop with a border flood-fill,
 * dropped onto an emerald scene with soft shadows and a warm key light, and
 * the outer edge is feathered to transparency so the artwork melts into the
 * banner gradient instead of sitting inside a visible rectangle.
 *
 * Usage: node scripts/generate-hero-image.mjs
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const root = join(import.meta.dirname, "..");
const publicDir = join(root, "public");
const heroDir = join(publicDir, "hero");
const categoriesDir = join(publicDir, "categories");

const OUT = join(heroDir, "hero-essentials.png");

/** Banner palette — matches the emerald gradient in `promo-carousel.tsx`. */
const EMERALD_DEEP = { r: 3, g: 47, b: 36 }; // emerald-950
const EMERALD_MID = { r: 6, g: 78, b: 59 }; // emerald-900
const EMERALD_EDGE = { r: 5, g: 88, b: 66 }; // emerald-800
const GOLD = { r: 251, g: 191, b: 36 }; // amber-400

/** Canvas of the generated artwork (2x the largest on-screen slot). */
const WIDTH = 1400;
const HEIGHT = 1050;

/**
 * Per-photo cut-out tuning.
 *
 * `localTol` is how far a pixel may drift from its neighbour before the
 * flood-fill stops; `seedTol` is how far a border pixel may sit from the
 * median of its own border strip before it is rejected as a seed.
 */
const SOURCES = {
  mat: { file: "prayer-mats.jpeg", localTol: 24, seedTol: 30 },
  quran: { file: "islamic-books.jpeg", localTol: 24, seedTol: 30 },
  tasbih: { file: "accessories.jpeg", localTol: 34, seedTol: 40 },
  perfume: { file: "perfumes.jpeg", localTol: 24, seedTol: 30 },
  textile: { file: "hijabs.jpeg", localTol: 24, seedTol: 30 },
};

/** Median of a list of numbers. */
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

/**
 * Cut a product out of its studio backdrop.
 *
 * Flood-fills inward from every border pixel that matches the median of its
 * own border strip, so a side that is entirely product does not poison the
 * rest of the frame. Everything the fill reaches becomes transparent.
 */
async function cutout({ file, localTol, seedTol }, { feather = 1.1 } = {}) {
  const { data, info } = await sharp(join(categoriesDir, file))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = width * height;

  const channel = (i, c) => data[i * 3 + c];
  const distance = (i, r, g, b) =>
    Math.abs(channel(i, 0) - r) +
    Math.abs(channel(i, 1) - g) +
    Math.abs(channel(i, 2) - b);

  const background = new Uint8Array(pixels);
  const queue = new Int32Array(pixels);
  let head = 0;
  let tail = 0;

  const tryPush = (i, r, g, b) => {
    if (background[i]) return;
    if (distance(i, r, g, b) > localTol) return;
    background[i] = 1;
    queue[tail++] = i;
  };

  const sides = [
    [...Array(width).keys()],
    [...Array(width).keys()].map((x) => (height - 1) * width + x),
    [...Array(height).keys()].map((y) => y * width),
    [...Array(height).keys()].map((y) => y * width + width - 1),
  ];

  for (const side of sides) {
    const reference = [0, 1, 2].map((c) => median(side.map((i) => channel(i, c))));
    for (const i of side) {
      if (distance(i, reference[0], reference[1], reference[2]) <= seedTol) {
        tryPush(i, reference[0], reference[1], reference[2]);
      }
    }
  }

  while (head < tail) {
    const i = queue[head++];
    const x = i % width;
    const y = (i / width) | 0;
    const r = channel(i, 0);
    const g = channel(i, 1);
    const b = channel(i, 2);
    if (x > 0) tryPush(i - 1, r, g, b);
    if (x < width - 1) tryPush(i + 1, r, g, b);
    if (y > 0) tryPush(i - width, r, g, b);
    if (y < height - 1) tryPush(i + width, r, g, b);
  }

  // Feather the matte so the product edge is not hard-cut from its frame.
  let alpha = Buffer.alloc(pixels);
  for (let i = 0; i < pixels; i++) alpha[i] = background[i] ? 0 : 255;

  if (feather > 0) {
    alpha = await sharp(alpha, { raw: { width, height, channels: 1 } })
      .blur(feather)
      .toBuffer();
  }

  const rgba = Buffer.alloc(pixels * 4);
  for (let i = 0; i < pixels; i++) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = alpha[i];
  }

  const cut = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
  const trimmed = await sharp(cut).trim({ threshold: 1 }).toBuffer();
  const meta = await sharp(trimmed).metadata();

  return { buffer: trimmed, width: meta.width, height: meta.height };
}

/** Soft drop shadow taken from a cut-out's own alpha channel. */
async function shadow(cutBuffer, { blur = 26, offsetY = 18, opacity = 0.45 } = {}) {
  const { width, height } = await sharp(cutBuffer).metadata();
  const alpha = await sharp(cutBuffer)
    .ensureAlpha()
    .extractChannel(3)
    .blur(blur)
    .toBuffer();

  const out = Buffer.alloc(width * (height + offsetY) * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const src = y * width + x;
      const dst = ((y + offsetY) * width + x) * 4;
      out[dst] = 1;
      out[dst + 1] = 26;
      out[dst + 2] = 20;
      out[dst + 3] = Math.round(alpha[src] * opacity);
    }
  }

  return sharp(out, { raw: { width, height: height + offsetY, channels: 4 } }).png().toBuffer();
}

/** Emerald scene the products sit on: gradient, geometric weave, key light. */
async function scene() {
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0.1" x2="1" y2="0.6">
          <stop offset="0%" stop-color="rgb(${EMERALD_DEEP.r},${EMERALD_DEEP.g},${EMERALD_DEEP.b})"/>
          <stop offset="52%" stop-color="rgb(${EMERALD_MID.r},${EMERALD_MID.g},${EMERALD_MID.b})"/>
          <stop offset="100%" stop-color="rgb(${EMERALD_EDGE.r},${EMERALD_EDGE.g},${EMERALD_EDGE.b})"/>
        </linearGradient>
        <radialGradient id="key" cx="0.34" cy="0.16" r="0.68">
          <stop offset="0%" stop-color="rgb(${GOLD.r},${GOLD.g},${GOLD.b})" stop-opacity="0.22"/>
          <stop offset="55%" stop-color="rgb(${GOLD.r},${GOLD.g},${GOLD.b})" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="rgb(${GOLD.r},${GOLD.g},${GOLD.b})" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="pool" cx="0.55" cy="0.9" r="0.6">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.09"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <pattern id="weave" width="132" height="132" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="rgb(${GOLD.r},${GOLD.g},${GOLD.b})" stroke-width="1.1" opacity="0.13">
            <rect x="26" y="26" width="80" height="80"/>
            <path d="M38.4 66 L66 38.4 L93.6 66 L66 93.6 Z"/>
            <path d="M66 0 L66 26 M66 106 L66 132 M0 66 L26 66 M106 66 L132 66"/>
          </g>
        </pattern>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#weave)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#key)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#pool)"/>
    </svg>`
  );

  return sharp(svg).png().toBuffer();
}

/**
 * Feather the outer border so the artwork merges with the banner gradient.
 *
 * The falloff is computed analytically rather than through an SVG mask, so
 * it cannot be thrown off by how the renderer handles masked groups.
 */
async function edgeFade(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const cx = width * 0.52;
  const cy = height * 0.5;
  const rx = width * 0.56;
  const ry = height * 0.6;

  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const distance = Math.hypot((x - cx) / rx, (y - cy) / ry);

      // Fully opaque inside 55% of the radius, fading to nothing at the edge.
      let falloff = 1;
      if (distance > 0.55) {
        const t = Math.min(1, (distance - 0.55) / 0.45);
        falloff = 1 - t * t * (3 - 2 * t);
      }

      out[i * 4] = data[i * channels];
      out[i * 4 + 1] = data[i * channels + 1];
      out[i * 4 + 2] = data[i * channels + 2];
      out[i * 4 + 3] = Math.round(data[i * channels + 3] * falloff);
    }
  }

  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/** Scale a cut-out to a target width or height and rotate it in place. */
async function place(cut, { width, height, angle = 0 }) {
  const resize = width ? { width } : { height };
  const buffer = await sharp(cut.buffer).resize(resize).png().toBuffer();
  if (!angle) return buffer;
  return sharp(buffer)
    .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function generate() {
  mkdirSync(heroDir, { recursive: true });

  const cuts = {};
  for (const [name, config] of Object.entries(SOURCES)) {
    cuts[name] = await cutout(config);
    console.log(`cutout ${name}: ${cuts[name].width}x${cuts[name].height}`);
  }

  // Placement of the arrangement inside the canvas: prayer mat laid flat at
  // the back, Qur'an standing as the centre piece, tasbih draped upper right,
  // folded textile and perfume in the foreground.
  const layout = {
    mat: { width: 600, angle: -7, left: 90, top: 500 },
    textile: { width: 300, angle: 8, left: 820, top: 790 },
    quran: { height: 500, angle: 2, left: 560, top: 300 },
    tasbih: { width: 380, angle: -14, left: 930, top: 140 },
    perfume: { width: 190, angle: -4, left: 1080, top: 620 },
  };

  const shadows = {
    mat: { blur: 42, offsetY: 26, opacity: 0.5 },
    textile: { blur: 30, offsetY: 20, opacity: 0.42 },
    quran: { blur: 36, offsetY: 26, opacity: 0.55 },
    tasbih: { blur: 26, offsetY: 16, opacity: 0.4 },
    perfume: { blur: 22, offsetY: 16, opacity: 0.45 },
  };

  const layers = [];
  const placed = {};

  for (const [name, position] of Object.entries(layout)) {
    const image = await place(cuts[name], position);
    const shadowImage = await shadow(image, shadows[name]);
    placed[name] = { image, shadowImage, ...position };
  }

  // Shadows first, then the products, so overlaps read as one arrangement.
  for (const name of ["mat", "textile", "tasbih", "quran", "perfume"]) {
    const p = placed[name];
    layers.push({ input: p.shadowImage, left: p.left, top: p.top });
  }
  for (const name of ["mat", "textile", "tasbih", "quran", "perfume"]) {
    const p = placed[name];
    layers.push({ input: p.image, left: p.left, top: p.top });
  }

  const composed = await sharp(await scene()).composite(layers).png().toBuffer();
  const faded = await edgeFade(composed);

  writeFileSync(OUT, faded);
  const meta = await sharp(faded).metadata();
  console.log(`Wrote ${OUT} (${meta.width}x${meta.height})`);
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
