import { access, readdir, readFile, stat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

const DIST = resolve(process.cwd(), "dist");

async function findHtml(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) return findHtml(path);
        return entry.name.endsWith(".html") ? [path] : [];
    }));
    return nested.flat();
}

async function resolvesToPageOrFile(path) {
    try {
        const info = await stat(path);
        if (!info.isDirectory()) return true;
        await access(resolve(path, "index.html"));
        return true;
    } catch {
        return false;
    }
}

const pages = await findHtml(DIST);
const missing = [];

for (const page of pages) {
    const html = await readFile(page, "utf8");
    const urls = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map((match) => match[1]);
    for (const url of urls) {
        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) continue;
        const pathname = url.split(/[?#]/, 1)[0];
        if (!pathname) continue;
        const target = pathname.startsWith("/")
            ? resolve(DIST, `.${pathname}`)
            : resolve(dirname(page), pathname);
        if (relative(DIST, target).startsWith("..") || !(await resolvesToPageOrFile(target))) {
            missing.push(`${relative(DIST, page)} -> ${url}`);
        }
    }
}

if (missing.length) {
    console.error(`Broken local references:\n${missing.join("\n")}`);
    process.exit(1);
}

console.log(`Verified local references in ${pages.length} static pages.`);
