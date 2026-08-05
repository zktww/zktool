import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import vm from "node:vm";

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, "dist");
const ORIGIN = "https://tools.zktww.cn";

async function loadData(file) {
    const sandbox = {};
    vm.runInNewContext(await readFile(resolve(ROOT, file), "utf8"), sandbox, { filename: file });
    return sandbox;
}

const registry = await loadData("src/data/registry.js");
const i18n = await loadData("src/data/i18n.js");
const tools = registry.ZKTOOL_REGISTRY.filter((item) => item.type === "tool");
const today = new Date().toISOString().slice(0, 10);

function url(path, locale = "zh-CN") {
    return `${ORIGIN}/${locale === "en" ? "en/" : ""}${path}`;
}

const sitemapEntries = ["", ...tools.map((tool) => tool.path)].flatMap((path) => {
    const zh = url(path), en = url(path, "en");
    return [zh, en].map((current) => `  <url><loc>${current}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="zh-CN" href="${zh}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${zh}"/></url>`);
});
await writeFile(resolve(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries.join("\n")}\n</urlset>\n`);

function list(locale) {
    return tools.map((tool) => {
        const translated = locale === "en" ? i18n.ZKTOOL_I18N.tools[tool.path] : null;
        const name = translated?.[0] || tool.name;
        const desc = translated?.[1] || tool.desc;
        return `- [${name}](${url(tool.path, locale)}): ${desc}`;
    }).join("\n");
}

await writeFile(resolve(DIST, "llms.txt"), `# zktool\n\n## Tools\n\n${list("zh-CN")}\n`);
await writeFile(resolve(DIST, "en/llms.txt"), `# zktool\n\n> Free online developer tools that run locally in your browser.\n\n## Tools\n\n${list("en")}\n`);

const manifest = JSON.parse(await readFile(resolve(ROOT, "public/manifest.webmanifest"), "utf8"));
await writeFile(resolve(DIST, "en/manifest.webmanifest"), `${JSON.stringify({
    ...manifest,
    name: "zktool Developer Tools",
    short_name: "zktool",
    description: "Privacy-friendly developer tools that run locally in your browser.",
    lang: "en",
    start_url: "/en/",
    scope: "/en/"
}, null, 2)}\n`);
