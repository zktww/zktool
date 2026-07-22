// zktool 站点生成器（零依赖）。gen-cards.mjs 的扩展版。
// 数据源：assets/registry.js（唯一 source of truth）。
// 用法：node scripts/gen-site.mjs          —— 重新生成全部派生文件
//       node scripts/gen-site.mjs --check —— 只校验是否有漂移（CI 用，lastmod 差异不算漂移）
// 生成物：
//   index.html   工具/演示卡片（gen:tools / gen:demos 锚点）、meta 描述中的工具数量、JSON-LD
//   sitemap.xml  全量 URL + lastmod（取 git 最近提交日期，有未提交改动时取今天）
//   llms.txt     工具列表段（gen:llms-tools 锚点）
//   sw.js        预缓存列表（gen:core 锚点，assets 扫描 + registry 工具页）与缓存版本（内容哈希）
//   README.md    工具索引表与 Demo 附录表（gen:readme-tools / gen:readme-demos 锚点）
import { readFile, writeFile, readdir } from "node:fs/promises";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
/* registry.js 在 CommonJS 下把导出挂到 module.exports（IIFE 的 this） */
const { ZKTOOL_REGISTRY: items, ZKTOOL_GROUPS: domains } = require(ROOT + "/assets/registry.js");

const ORIGIN = "https://tools.zktww.cn";
const CHECK = process.argv.includes("--check");
const tools = items.filter((it) => it.type === "tool");
const demos = items.filter((it) => it.type === "demo");

/* ── 一致性：tools/ 目录 ↔ registry 必须一一对应 ── */
async function verifyRegistry() {
    const dirs = (await readdir(ROOT + "/tools", { withFileTypes: true }))
        .filter((d) => d.isDirectory()).map((d) => "tools/" + d.name + "/");
    const reg = new Set(tools.map((it) => it.path));
    const errs = [];
    for (const d of dirs) if (!reg.has(d)) errs.push(`目录未注册: ${d}（补进 assets/registry.js)`);
    for (const p of reg) if (!dirs.includes(p)) errs.push(`注册项无目录: ${p}`);
    if (errs.length) { errs.forEach((e) => console.error("✗ " + e)); process.exit(1); }
}

/* ── 卡片（沿用 gen-cards.mjs 逻辑） ── */
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ARROW_EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

function card(it) {
    const external = it.type === "external";
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    const label = it.type === "demo" ? "打开演示" : "打开工具";
    const arrow = external ? ARROW_EXT : ARROW;
    return `                <a class="card" href="${it.path}" data-kw="${it.kw}"${attrs}>
                    <div class="card-head">
                        <span class="card-icon" style="--c1:${it.c1};--c2:${it.c2}" aria-hidden="true">
                            ${it.icon}
                        </span>
                        <span class="card-title">${it.name}</span>
                        <span class="tag">${it.tag}</span>
                    </div>
                    <p class="card-desc">${it.desc}</p>
                    <span class="card-cta" aria-hidden="true" title="${label}">${arrow}</span>
                </a>`;
}

function toolSections() {
    const list0 = items.filter((it) => it.type === "tool" || it.type === "external");
    const used = new Set();
    const sections = domains.map((d) => {
        const list = list0.filter((it) => it.group === d.key);
        list.forEach((it) => used.add(it.path));
        return { ...d, list };
    }).filter((s) => s.list.length);
    const rest = list0.filter((it) => !used.has(it.path));
    if (rest.length) sections.push({ key: "misc", title: "其他", list: rest });
    return sections.map((s) => `        <section class="subgroup" data-domain="${s.key}">
            <h3 class="subsection-title" id="domain-${s.key}">${s.title}</h3>
            <nav class="grid" aria-labelledby="domain-${s.key}">
${s.list.map(card).join("\n\n")}
            </nav>
        </section>`).join("\n\n");
}

function demoGrid() {
    return `        <nav class="grid" aria-labelledby="demos-heading">
${demos.map(card).join("\n\n")}
        </nav>`;
}

/* ── JSON-LD ── */
function jsonLd() {
    const desc = `免费在线开发者工具箱：JSON 格式化、时间戳转换、Base64 编码、正则测试等 ${tools.length} 款工具，浏览器本地处理不上传数据，支持离线使用。`;
    return JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
            { "@type": "WebSite", name: "zktool", url: ORIGIN + "/", description: desc, inLanguage: "zh-CN" },
            {
                "@type": "ItemList", name: "开发者工具列表", numberOfItems: tools.length,
                itemListElement: tools.map((it, i) => ({
                    "@type": "ListItem", position: i + 1, name: it.name, description: it.desc, url: ORIGIN + "/" + it.path,
                })),
            },
        ],
    });
}

/* ── sitemap：lastmod 取 git 最近提交日期；目录有未提交改动时取今天 ── */
function git(cmd) {
    try { return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim(); } catch (e) { return ""; }
}
const today = new Date().toISOString().slice(0, 10);
function lastmod(path) {
    if (git(`git status --porcelain -- ${path}`)) return today;
    return git(`git log -1 --format=%cs -- ${path}`) || today;
}
function sitemap() {
    const pages = [
        ...tools.map((it) => it.path),
        ...demos.map((it) => it.path),
    ];
    const dates = pages.map(lastmod);
    const rootDate = dates.reduce((a, b) => (a > b ? a : b), lastmod("index.html"));
    const urls = [`  <url><loc>${ORIGIN}/</loc><lastmod>${rootDate}</lastmod></url>`]
        .concat(pages.map((p, i) => `  <url><loc>${ORIGIN}/${p}</loc><lastmod>${dates[i]}</lastmod></url>`));
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

/* ── llms.txt 工具列表段 ── */
function llmsTools() {
    return tools.map((it) => `- [${it.name}](${ORIGIN}/${it.path})：${it.desc.replace(/。$/, "")}`).join("\n");
}

/* ── sw.js 预缓存：站点骨架 + assets 扫描（css/js/svg + vendor）+ registry 工具页 ──
   大体积可选资源不进预缓存（首访任何页面都会触发 SW install，全量下载不划算），
   靠 fetch 的 stale-while-revalidate 在实际使用到时转入缓存。 */
const PRECACHE_EXCLUDE = new Set(["assets/vendor/mermaid.min.js"]);
async function swCore() {
    const top = (await readdir(ROOT + "/assets", { withFileTypes: true }))
        .filter((d) => d.isFile() && /\.(css|js|svg)$/.test(d.name))
        .map((d) => "assets/" + d.name);
    const vendor = (await readdir(ROOT + "/assets/vendor"))
        .filter((n) => /\.(js|json)$/.test(n)).map((n) => "assets/vendor/" + n);
    const list = [
        "./", "./index.html", "./404.html", "./manifest.webmanifest", "./llms.txt",
        ...top.sort().map((p) => "./" + p),
        ...vendor.sort().filter((p) => !PRECACHE_EXCLUDE.has(p)).map((p) => "./" + p),
        ...tools.map((it) => "./" + it.path),
    ];
    return list;
}

/* ── 锚点替换 ── */
function replaceBlock(content, key, inner, indent) {
    const re = new RegExp(`(<!-- gen:${key} -->)[\\s\\S]*?(<!-- /gen:${key} -->)`);
    if (!re.test(content)) throw new Error(`未找到生成锚点: <!-- gen:${key} -->`);
    return content.replace(re, `$1\n${inner}\n${indent || ""}$2`);
}

/* ── 汇总生成 ── */
const sha8 = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 8);

async function build() {
    await verifyRegistry();
    const out = {};

    /* 资源内容哈希：assets 下 css/js/svg + vendor js/json，用于 URL 版本戳与 SW 缓存名 */
    const assetPaths = [
        ...(await readdir(ROOT + "/assets", { withFileTypes: true }))
            .filter((d) => d.isFile() && /\.(css|js|svg)$/.test(d.name)).map((d) => "assets/" + d.name),
        ...(await readdir(ROOT + "/assets/vendor"))
            .filter((n) => /\.(js|json)$/.test(n)).map((n) => "assets/vendor/" + n),
    ].sort();
    const assetHash = {};
    for (const p of assetPaths) assetHash[p] = sha8(await readFile(ROOT + "/" + p));

    /* 给页面里的本地资源引用盖 ?v=<内容哈希>：发布后 URL 变化，浏览器/CDN 的 HTTP 缓存自然失效。
       幂等：已有 ?v= 会被剥掉重盖。 */
    function stamp(html) {
        return html.replace(
            /((?:src|href)=")([^"]*?)(assets\/[^"?#]+?\.(?:css|js|svg))(?:\?v=[0-9a-f]+)?(")/g,
            (m, pre, prefix, asset, post) => {
                const h = assetHash[asset];
                return h ? pre + prefix + asset + "?v=" + h + post : m;
            }
        );
    }

    /* index.html：卡片 + JSON-LD + 工具数量 + 资源版本戳 */
    let html = await readFile(ROOT + "/index.html", "utf8");
    html = replaceBlock(html, "tools", toolSections(), "        ");
    html = replaceBlock(html, "demos", demoGrid(), "        ");
    html = html.replace(/\d+ 款工具/g, `${tools.length} 款工具`);
    html = html.replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        `<script type="application/ld+json">${jsonLd()}</script>`
    );
    out["index.html"] = stamp(html);

    /* 全部工具/演示页 + 404：盖资源版本戳；工具页另注入/更新 BreadcrumbList JSON-LD */
    const groupTitle = Object.fromEntries(domains.map((d) => [d.key, d.title]));
    function breadcrumbLd(tool) {
        const items = [{ "@type": "ListItem", position: 1, name: "首页", item: ORIGIN + "/" }];
        if (groupTitle[tool.group]) items.push({ "@type": "ListItem", position: 2, name: groupTitle[tool.group], item: ORIGIN + "/#domain-" + tool.group });
        items.push({ "@type": "ListItem", position: items.length + 1, name: tool.name, item: ORIGIN + "/" + tool.path });
        return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items })}</script>`;
    }
    function injectBreadcrumb(html, tool) {
        const tag = breadcrumbLd(tool);
        const re = /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList"[\s\S]*?<\/script>/;
        if (re.test(html)) return html.replace(re, tag);
        return html.replace("</head>", `    ${tag}\n</head>`);
    }
    const pagePaths = [
        ...tools.map((it) => it.path + "index.html"),
        ...demos.map((it) => it.path + "index.html"),
        "404.html",
    ];
    for (const p of pagePaths) {
        let page = stamp(await readFile(ROOT + "/" + p, "utf8"));
        const tool = tools.find((it) => it.path + "index.html" === p);
        if (tool) page = injectBreadcrumb(page, tool);
        out[p] = page;
    }

    /* sitemap.xml */
    out["sitemap.xml"] = sitemap();

    /* llms.txt */
    let llms = await readFile(ROOT + "/llms.txt", "utf8");
    llms = replaceBlock(llms, "llms-tools", llmsTools());
    out["llms.txt"] = llms;

    /* sw.js：CORE 列表 + 缓存名（资源与页面的内容哈希，任何发布变更自动换新缓存并清旧） */
    let sw = await readFile(ROOT + "/sw.js", "utf8");
    const core = await swCore();
    const coreJs = core.map((p) => `    ${JSON.stringify(p)},`).join("\n");
    sw = sw.replace(/(\/\* gen:core \*\/)[\s\S]*?(\/\* \/gen:core \*\/)/, `$1\n${coreJs}\n    $2`);
    const pageHashes = pagePaths.map((p) => sha8(out[p]));
    const hash = sha8(core.join("\n") + Object.values(assetHash).join("") + pageHashes.join("") + sha8(out["index.html"]));
    sw = sw.replace(/var CACHE = "zktool-[^"]*";/, `var CACHE = "zktool-${hash}";`);
    out["sw.js"] = sw;

    /* README.md 两张表 */
    let readme = await readFile(ROOT + "/README.md", "utf8");
    const toolRows = items.filter((it) => it.type === "tool" || it.type === "external").map((it) =>
        it.type === "external"
            ? `| [${it.name}](${it.path}) | 外部工具：${it.desc} |`
            : `| [${it.path}](${it.path}) | ${it.name}：${it.desc.replace(/。$/, "")} |`
    ).join("\n");
    const demoRows = demos.map((it) => `| [${it.path}](${it.path}) | ${it.name}：${it.desc.replace(/。$/, "")} |`).join("\n");
    readme = replaceBlock(readme, "readme-tools", toolRows);
    readme = replaceBlock(readme, "readme-demos", demoRows);
    out["README.md"] = readme;

    return out;
}

/* --check 时忽略 lastmod 差异（CI 浅克隆下 git 日期不可靠） */
function normalize(name, s) {
    return name === "sitemap.xml" ? s.replace(/<lastmod>[^<]*<\/lastmod>/g, "<lastmod/>") : s;
}

const out = await build();
if (CHECK) {
    let drift = 0;
    for (const [name, content] of Object.entries(out)) {
        const cur = await readFile(ROOT + "/" + name, "utf8").catch(() => "");
        if (normalize(name, cur) !== normalize(name, content)) { console.error(`✗ 有漂移: ${name}（运行 node scripts/gen-site.mjs 重新生成）`); drift++; }
    }
    if (drift) process.exit(1);
    console.log(`✓ 一致性检查通过（${Object.keys(out).length} 个生成物，${items.length} 个注册条目）`);
} else {
    for (const [name, content] of Object.entries(out)) await writeFile(ROOT + "/" + name, content, "utf8");
    const counts = items.reduce((a, it) => ((a[it.type] = (a[it.type] || 0) + 1), a), {});
    console.log(`已生成 ${Object.keys(out).join("、")}。合计 ${items.length} 条：`, counts);
}
