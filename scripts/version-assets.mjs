import { readFile, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative, dirname } from "node:path";

// Version emitted assets, including CSS imports. Source files remain untouched.
export async function versionAssets(dist) {
    const hashes = new Map();
    const visiting = new Set();
    async function files(dir) {
        const entries = await readdir(dir, { withFileTypes: true });
        return (await Promise.all(entries.map(e => e.isDirectory() ? files(resolve(dir, e.name)) : resolve(dir, e.name)))).flat();
    }
    const all = await files(dist);
    const assets = new Set(all.filter(p => relative(dist, p).startsWith("assets/")));
    function target(url, source) {
        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return null;
        const pathname = url.split(/[?#]/)[0];
        const path = pathname.startsWith("/") ? resolve(dist, "." + pathname) : resolve(dirname(source), pathname);
        return assets.has(path) ? path : null;
    }
    function version(url, hash) {
        const parsed = new URL(url, "https://local.invalid/");
        parsed.searchParams.set("v", hash);
        return url.split(/[?#]/)[0] + parsed.search + parsed.hash;
    }
    async function hashFile(path) {
        if (hashes.has(path)) return hashes.get(path);
        if (visiting.has(path)) throw new Error(`Circular CSS import: ${path}`);
        visiting.add(path);
        let bytes = await readFile(path);
        if (path.endsWith(".css")) {
            let css = bytes.toString("utf8");
            const matches = [...css.matchAll(/url\(\s*(["']?)([^\s"')]+)\1\s*\)/g)];
            for (const match of matches) {
                const dependency = target(match[2], path);
                if (dependency) css = css.replace(match[0], `url("${version(match[2], await hashFile(dependency))}")`);
            }
            bytes = Buffer.from(css);
            await writeFile(path, bytes);
        }
        const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
        hashes.set(path, hash); visiting.delete(path);
        return hash;
    }
    // Sequential traversal avoids treating concurrently visited dependencies as cycles.
    for (const path of assets) await hashFile(path);
    for (const path of all.filter(p => p.endsWith(".html"))) {
        let html = await readFile(path, "utf8");
        html = html.replace(/\b(src|href)=(["'])([^"']+)\2/g, (match, attr, quote, url) => {
            const asset = target(url, path);
            return asset ? `${attr}=${quote}${version(url, hashes.get(asset))}${quote}` : match;
        });
        await writeFile(path, html);
    }
    console.log(`Versioned ${hashes.size} assets and their CSS dependencies.`);
}
