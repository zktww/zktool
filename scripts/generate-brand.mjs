// Run pnpm generate:brand after editing the monochrome master.
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const file = name => new URL("../public/" + name, import.meta.url);
const mark = await readFile(file("assets/zk-mark.svg"), "utf8");
const place = (x, y, width, height) => mark.replace("<svg ", `<svg x="${x}" y="${y}" width="${width}" height="${height}" `);
const frame = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;
const icon = (padding, radius) => frame(128, 128,
    `<rect width="128" height="128" rx="${radius}" fill="#fff"/>` +
    place(padding, padding, 128 - 2 * padding, 128 - 2 * padding));
const normal = icon(8, 22);
await writeFile(file("assets/icon.svg"), normal);
const png = (svg, size) => sharp(Buffer.from(svg), { density: 400 }).resize(size, size).png().toBuffer();
for (const [name, size, svg] of [
    ["icon-192.png", 192, normal], ["icon-512.png", 512, normal],
    ["apple-touch-icon.png", 180, icon(14, 0)], ["icon-maskable-512.png", 512, icon(22, 0)]
]) {
    await writeFile(file("assets/" + name), await png(svg, size));
}

// ICO directory with one PNG entry per native browser size.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(size => png(normal, size)));
const directory = Buffer.alloc(6 + 16 * sizes.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (const [i, size] of sizes.entries()) {
    const entry = 6 + 16 * i;
    directory[entry] = directory[entry + 1] = size;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(images[i].length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += images[i].length;
}
await writeFile(file("favicon.ico"), Buffer.concat([directory, ...images]));
const card = frame(1200, 630, '<rect width="1200" height="630" fill="#fff"/>' + place(350, 160, 500, 310));
await writeFile(file("assets/og-card.jpg"), await sharp(Buffer.from(card)).jpeg({ quality: 94 }).toBuffer());
