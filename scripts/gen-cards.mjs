// zktool 首页卡片生成器（零依赖）。
// 数据源：assets/registry.js（唯一 source of truth）。
// 用法：node scripts/gen-cards.mjs
// 行为：读取 registry，工具区按 ZKTOOL_GROUPS 分域生成小节，演示区单网格，
//       就地重写 index.html 两个分组容器的内容（幂等，可反复运行）。
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
/* registry.js 在 CommonJS 下把导出挂到 module.exports（IIFE 的 this） */
const { ZKTOOL_REGISTRY: items, ZKTOOL_GROUPS: domains } = require(ROOT + "/assets/registry.js");

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

/* 工具区：按 ZKTOOL_GROUPS 顺序生成分域小节；未归组的条目兜底放最后 */
function toolSections() {
    const tools = items.filter((it) => it.type === "tool" || it.type === "external");
    const used = new Set();
    const sections = domains.map((d) => {
        const list = tools.filter((it) => it.group === d.key);
        list.forEach((it) => used.add(it.path));
        return { ...d, list };
    }).filter((s) => s.list.length);
    const rest = tools.filter((it) => !used.has(it.path));
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
${items.filter((it) => it.type === "demo").map(card).join("\n\n")}
        </nav>`;
}

let html = await readFile(ROOT + "/index.html", "utf8");
const blocks = {
    tools: toolSections(),
    demos: demoGrid(),
};
let changed = 0;
for (const [key, inner] of Object.entries(blocks)) {
    const re = new RegExp(`(<!-- gen:${key} -->)[\\s\\S]*?(<!-- /gen:${key} -->)`);
    if (!re.test(html)) throw new Error(`未找到生成锚点: <!-- gen:${key} -->`);
    html = html.replace(re, `$1\n${inner}\n        $2`);
    changed++;
}
await writeFile(ROOT + "/index.html", html, "utf8");

const counts = items.reduce((a, it) => ((a[it.type] = (a[it.type] || 0) + 1), a), {});
console.log(`已生成卡片，重写 ${changed} 个区块。合计 ${items.length} 张：`, counts);
