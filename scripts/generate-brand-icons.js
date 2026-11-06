import { readFile, writeFile } from "node:fs/promises";
import { deflateSync } from "node:zlib";

/*
 * Brand icon generator, deliberately dependency free.
 *
 * The old version rasterised with `sharp`, which ships a platform specific
 * prebuilt binary. This repository has to install on Android/Termux, where
 * that binary does not exist, so the PNGs are written here instead: a scanline
 * rasteriser for the shapes in maker.json, a box filter to downsample it, and
 * a hand rolled PNG encoder on top of node:zlib. No network, no postinstall,
 * nothing to compile.
 *
 * Shapes are limited to the straight line paths maker.json actually uses
 * (M / L / Z). Adding a curve means extending parsePath, not this renderer.
 */

const maker = JSON.parse(
   await readFile(new URL("../src/assets/brand/maker.json", import.meta.url)),
);
const output = new URL("../public/favicon_io/", import.meta.url);

/* Supersampling factor: the canvas is drawn 8x oversize and box filtered
   down, which is what keeps the polygon edges from stair-stepping. */
const SUPERSAMPLE = 8;

const svg = ({ small = false, app = false } = {}) =>
   `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
${app ? `<rect width="100" height="100" fill="${maker.ink}"/><g transform="translate(10 10) scale(.8)">` : ""}
<path fill="${maker.color}" d="${maker.silhouette}"/>
${small ? "" : `<path fill="${maker.ink}" d="${maker.crest}"/>`}
<path fill="${maker.ink}" d="${maker.visor}"/>
<g fill="${maker.eyeColor}">${maker.eyes
      .map(
         ({ x, y, width, height, rx }) =>
            `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}"/>`,
      )
      .join("")}</g>
${app ? "</g>" : ""}
</svg>`;

/* ------------------------------------------------------------------ */
/* Path parsing: the M / L / Z subset maker.json uses.                  */
/* ------------------------------------------------------------------ */

const parsePath = (d) => {
   const tokens = d.match(/[MLZ]|-?\d*\.?\d+/gi) ?? [];
   const polygons = [];
   let points = [];

   for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      const command = token.toUpperCase();
      if (command === "M" || command === "L") {
         const point = {
            x: Number(tokens[i + 1]),
            y: Number(tokens[i + 2]),
         };
         i += 2;
         if (command === "M") {
            if (points.length > 0) polygons.push(points);
            points = [point];
         } else {
            points.push(point);
         }
      } else if (command === "Z") {
         if (points.length > 0) polygons.push(points);
         points = [];
      }
   }
   if (points.length > 0) polygons.push(points);
   return polygons;
};

const hex = (value) => {
   const text = value.replace("#", "");
   return [0, 2, 4].map((at) => Number.parseInt(text.slice(at, at + 2), 16));
};

const insidePolygon = (polygons, px, py) => {
   let inside = false;
   for (const points of polygons) {
      for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
         const a = points[i];
         const b = points[j];
         if (
            a.y > py !== b.y > py &&
            px < ((b.x - a.x) * (py - a.y)) / (b.y - a.y) + a.x
         ) {
            inside = !inside;
         }
      }
   }
   return inside;
};

/* A rounded rectangle is a rect with its four corners clipped to a circle:
   outside the rect is out, inside the corner circles is in, and the square
   between the corners is in too. */
const insideRoundedRect = ({ x, y, width, height, rx }, px, py) => {
   if (px < x || px > x + width || py < y || py > y + height) return false;
   const r = Math.min(rx, width / 2, height / 2);
   const cornerX = px < x + r ? x + r : px > x + width - r ? x + width - r : px;
   const cornerY =
      py < y + r ? y + r : py > y + height - r ? y + height - r : py;
   return (px - cornerX) ** 2 + (py - cornerY) ** 2 <= r * r;
};

/* ------------------------------------------------------------------ */
/* Rasterisation and downsampling.                                      */
/* ------------------------------------------------------------------ */

const draw = (size, { small = false, app = false }) => {
   const oversize = size * SUPERSAMPLE;
   const rgba = new Uint8Array(oversize * oversize * 4);

   const silhouette = parsePath(maker.silhouette);
   const crest = parsePath(maker.crest);
   const visor = parsePath(maker.visor);

   /* The app icon pads the mark into a solid ink tile, like the SVG's
      translate(10 10) scale(.8). */
   const scale = app ? 0.8 : 1;
   const pad = app ? (100 - 100 * scale) / 2 : 0;

   /* Geometry stays in the source viewBox's 0..100 coordinates. `paint`
      samples those same coordinates from each supersampled pixel. */
   const mapX = (x) => pad + x * scale;
   const mapY = (y) => pad + y * scale;
   const mapLen = (length) => length * scale;

   const paint = (fn, color) => {
      const [r, g, b] = hex(color);
      for (let py = 0; py < oversize; py += 1) {
         const y = py / (oversize / 100);
         for (let px = 0; px < oversize; px += 1) {
            if (!fn(px / (oversize / 100), y)) continue;
            const at = (py * oversize + px) * 4;
            rgba[at] = r;
            rgba[at + 1] = g;
            rgba[at + 2] = b;
            rgba[at + 3] = 255;
         }
      }
   };

   const scaledPolygons = (polygons) =>
      polygons.map((points) =>
         points.map((point) => ({ x: mapX(point.x), y: mapY(point.y) })),
      );

   if (app) paint(() => true, maker.ink);
   paint(
      (x, y) => insidePolygon(scaledPolygons(silhouette), x, y),
      maker.color,
   );
   if (!small) {
      paint((x, y) => insidePolygon(scaledPolygons(crest), x, y), maker.ink);
   }
   paint((x, y) => insidePolygon(scaledPolygons(visor), x, y), maker.ink);
   for (const eye of maker.eyes) {
      const box = {
         x: mapX(eye.x),
         y: mapY(eye.y),
         width: mapLen(eye.width),
         height: mapLen(eye.height),
         rx: mapLen(eye.rx),
      };
      paint((x, y) => insideRoundedRect(box, x, y), maker.eyeColor);
   }

   /* Box filter down to the requested size. */
   const out = new Uint8Array(size * size * 4);
   const span = SUPERSAMPLE * SUPERSAMPLE;
   for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
         let r = 0;
         let g = 0;
         let b = 0;
         let a = 0;
         for (let sy = 0; sy < SUPERSAMPLE; sy += 1) {
            for (let sx = 0; sx < SUPERSAMPLE; sx += 1) {
               const at =
                  ((y * SUPERSAMPLE + sy) * oversize + (x * SUPERSAMPLE + sx)) *
                  4;
               r += rgba[at];
               g += rgba[at + 1];
               b += rgba[at + 2];
               a += rgba[at + 3];
            }
         }
         const at = (y * size + x) * 4;
         out[at] = Math.round(r / span);
         out[at + 1] = Math.round(g / span);
         out[at + 2] = Math.round(b / span);
         out[at + 3] = Math.round(a / span);
      }
   }
   return out;
};

/* ------------------------------------------------------------------ */
/* A minimal PNG encoder (8 bit RGBA, no interlace) on node:zlib.        */
/* ------------------------------------------------------------------ */

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
   let c = index;
   for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
   }
   return c >>> 0;
});

const crc32 = (bytes) => {
   let c = 0xffffffff;
   for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
   return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, body) => {
   const length = Buffer.alloc(4);
   length.writeUInt32BE(body.length);
   const typeAndBody = Buffer.concat([Buffer.from(type, "ascii"), body]);
   const crc = Buffer.alloc(4);
   crc.writeUInt32BE(crc32(typeAndBody));
   return Buffer.concat([length, typeAndBody, crc]);
};

const encodePng = (size, rgba) => {
   const header = Buffer.alloc(13);
   header.writeUInt32BE(size, 0);
   header.writeUInt32BE(size, 4);
   header[8] = 8; // bit depth
   header[9] = 6; // colour type: truecolour with alpha
   header[10] = 0; // compression
   header[11] = 0; // filter
   header[12] = 0; // interlace

   /* Each scanline is prefixed with a filter type byte; 0 (none) is fine
      because the box filter already smoothed the edges. */
   const raw = Buffer.alloc(size * (size * 4 + 1));
   for (let y = 0; y < size; y += 1) {
      const rowAt = y * (size * 4 + 1);
      raw[rowAt] = 0;
      raw.set(rgba.subarray(y * size * 4, (y + 1) * size * 4), rowAt + 1);
   }

   return Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", header),
      chunk("IDAT", deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
   ]);
};

/* ------------------------------------------------------------------ */

const icons = [
   ["favicon-16x16.png", 16, { small: true }],
   ["favicon-32x32.png", 32, { small: true }],
   ["apple-touch-icon.png", 180, { app: true }],
   ["android-chrome-192x192.png", 192, { app: true }],
   ["android-chrome-512x512.png", 512, { app: true }],
];

await writeFile(new URL("maker.svg", output), svg({ small: true }));
const generated = new Map();
for (const [name, size, options] of icons) {
   const png = encodePng(size, draw(size, options));
   generated.set(size, png);
   await writeFile(new URL(name, output), png);
   process.stdout.write(`${name} ${size}x${size}\n`);
}

/* ICO supports PNG payloads. Keep 16/32/48px entries for browser chrome. */
const icoSizes = [16, 32, 48];
const icoImages = icoSizes.map(
   (size) =>
      generated.get(size) ?? encodePng(size, draw(size, { small: size <= 24 })),
);
const icoHeader = Buffer.alloc(6 + icoSizes.length * 16);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoSizes.length, 4);
let offset = icoHeader.length;
icoImages.forEach((image, index) => {
   const entry = 6 + index * 16;
   icoHeader[entry] = icoSizes[index] === 256 ? 0 : icoSizes[index];
   icoHeader[entry + 1] = icoSizes[index] === 256 ? 0 : icoSizes[index];
   icoHeader.writeUInt16LE(1, entry + 4);
   icoHeader.writeUInt16LE(32, entry + 6);
   icoHeader.writeUInt32LE(image.length, entry + 8);
   icoHeader.writeUInt32LE(offset, entry + 12);
   offset += image.length;
});
await writeFile(
   new URL("../public/favicon.ico", import.meta.url),
   Buffer.concat([icoHeader, ...icoImages]),
);
process.stdout.write("favicon.ico (16, 32 and 48px)\nmaker.svg 100x100\n");
