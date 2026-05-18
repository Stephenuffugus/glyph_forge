// Generates PWA app icons from art-slots/title-mark.png
// Usage: npm i sharp  &&  node tools/make-icons.mjs
// Produces art-slots/icon-192.png and art-slots/icon-512.png with maskable-safe
// padding (the title mark is centered on a solid background with ~17% inset so
// it survives Android's maskable circle/squircle crop).
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const sharp = (await import('sharp')).default;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'art-slots', 'title-mark.png');

if (!existsSync(src)) {
  console.error('Missing art-slots/title-mark.png — generate the title mark first (see ART_SHOTLIST.md).');
  process.exit(1);
}

const BG = { r: 0x0a, g: 0x07, b: 0x05, alpha: 1 }; // --ink-deep, matches manifest background_color

for (const size of [192, 512]) {
  const inset = Math.round(size * 0.17);          // maskable safe zone
  const inner = size - inset * 2;
  const mark = await sharp(src)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toFile(join(root, 'art-slots', `icon-${size}.png`));
  console.log(`wrote art-slots/icon-${size}.png`);
}
