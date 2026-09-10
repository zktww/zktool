import { access, readdir, readFile, stat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { createHash } from "node:crypto";
import vm from "node:vm";

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
const checks = [];
const data = {};
vm.runInNewContext(await readFile(resolve('src/data/registry.js'), 'utf8'), data);
const toolPaths = data.ZKTOOL_REGISTRY.filter((item) => item.type === 'tool').map((item) => item.path);
for (const prefix of ['', 'en/']) for (const path of toolPaths) {
    if (!(await resolvesToPageOrFile(resolve(DIST, prefix + path)))) checks.push(`Missing route: ${prefix}${path}`);
}

for (const page of pages) {
    const html = await readFile(page, "utf8");
    if (/[/\\]tools[/\\]/.test(page)) {
        if ([...html.matchAll(/<a\b[^>]*class="[^"]*\bzk-lang-link\b/g)].length !== 1) checks.push(`Expected one language link: ${relative(DIST, page)}`);
        if (html.includes('#domain-')) checks.push(`Legacy category anchor: ${relative(DIST, page)}`);
    }
    if (relative(DIST, page).startsWith('en/tools/')) {
        const ui = html.replace(/<(script|style|textarea)\b[\s\S]*?<\/\1>/gi, '').replace(/<a\b[^>]*lang="zh-CN"[^>]*>[\s\S]*?<\/a>/g, '');
        for (const match of ui.matchAll(/>([^<>]*[\u4e00-\u9fff][^<>]*)</g)) checks.push(`Untranslated visible text in ${relative(DIST, page)}: ${match[1].trim()}`);
        const attributes = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
        for (const match of attributes.matchAll(/\b(aria-label|placeholder|title)=(["'])(.*?)\2/g)) {
            // A Chinese uppercase amount is intentional example data, not UI copy.
            const currencyExample = page.includes('/rmb-uppercase/') && match[1] === 'placeholder' && match[3].startsWith('For example: ');
            if (!currencyExample && /[\u4e00-\u9fff]/.test(match[3])) checks.push(`Untranslated ${match[1]} in ${relative(DIST, page)}: ${match[3]}`);
        }
    }
    for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
        if (/src=|type="module"/.test(match[1])) continue;
        try { if (match[1].includes('application/ld+json')) JSON.parse(match[2]); else new vm.Script(match[2]); }
        catch (error) { checks.push(`Invalid inline script in ${relative(DIST, page)}: ${error.message}`); }
    }
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
        } else if (relative(DIST, target).startsWith('assets/')) {
            const hash = createHash('sha256').update(await readFile(target)).digest('hex').slice(0, 12);
            if (new URL(url, 'https://local.invalid').searchParams.get('v') !== hash) checks.push(`Stale asset version: ${relative(DIST, page)} -> ${url}`);
        }
    }
}

if (missing.length || checks.length) {
    console.error(`Static page verification failed:\n${[...missing, ...checks].join("\n")}`);
    process.exit(1);
}

console.log(`Verified ${pages.length} pages: routes, references, language links, visible English copy, inline scripts, and asset hashes.`);
