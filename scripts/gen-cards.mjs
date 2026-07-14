// zktool 首页卡片生成器（零依赖）。
// 数据源：assets/registry.js（唯一 source of truth）。
// 用法：node scripts/gen-cards.mjs
// 行为：读取 registry，按 type 分组，生成静态卡片 HTML，
//       就地重写 index.html 中两个 <nav class="grid"> 的内容（幂等，可反复运行）。
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { ZKTOOL_REGISTRY: items } = require(ROOT + "/assets/registry.js");

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ARROW_EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

function card(it) {
    const external = it.type === "external";
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    const ctaLabel = it.type === "demo" ? "打开演示" : "打开工具";
    const arrow = external ? ARROW_EXT : ARROW;
    return `            <a class="card" href="${it.path}"${attrs} data-kw="${it.kw}">
                <div class="card-head">
                    <span class="card-icon" style="--c1:${it.c1};--c2:${it.c2}" aria-hidden="true">
                        ${it.icon}
                    </span>
                    <span class="card-title">${it.name}</span>
                    <span class="tag">${it.tag}</span>
                </div>
                <p class="card-desc">${it.desc}</p>
                <span class="card-cta"><span class="cta-label">${ctaLabel}</span>${arrow}</span>
            </a>`;
}

function grid(types) {
    return "\n" + items.filter((it) => types.includes(it.type)).map(card).join("\n\n") + "\n        ";
}

// tools 分组含 tool + external；demos 分组含 demo
const groups = {
    "tools-heading": grid(["tool", "external"]),
    "demos-heading": grid(["demo"]),
};

let html = await readFile(ROOT + "/index.html", "utf8");
let changed = 0;
for (const [id, inner] of Object.entries(groups)) {
    const re = new RegExp(`(<nav class="grid" aria-labelledby="${id}">)[\\s\\S]*?(</nav>)`);
    if (!re.test(html)) throw new Error("未找到 nav 锚点: " + id);
    html = html.replace(re, `$1${inner}$2`);
    changed++;
}
await writeFile(ROOT + "/index.html", html, "utf8");

const counts = items.reduce((a, it) => ((a[it.type] = (a[it.type] || 0) + 1), a), {});
console.log(`已生成卡片，重写 ${changed} 个网格。合计 ${items.length} 张：`, counts);
