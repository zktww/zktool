// zktool 站点生成器（零依赖）。gen-cards.mjs 的扩展版。
// 数据源：assets/registry.js（工具）+ assets/i18n.js（英文文案）。
// 用法：node scripts/gen-site.mjs          —— 重新生成全部派生文件
//       node scripts/gen-site.mjs --check —— 只校验是否有漂移（CI 用，lastmod 差异不算漂移）
// 生成物：
//   index.html + en/  中文源页面与构建生成的英文静态页面
//   sitemap.xml  全量 URL + lastmod（取 git 最近提交日期，有未提交改动时取今天）
//   llms.txt     工具列表段（gen:llms-tools 锚点）
//   sw.js        预缓存列表（gen:core 锚点，assets 扫描 + registry 工具页）与缓存版本（内容哈希）
//   README.md    工具索引表与 Demo 附录表（gen:readme-tools / gen:readme-demos 锚点）
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
/* registry.js 在 CommonJS 下把导出挂到 module.exports（IIFE 的 this） */
const { ZKTOOL_REGISTRY: items, ZKTOOL_GROUPS: domains } = require(ROOT + "/assets/registry.js");
const { ZKTOOL_I18N: i18n } = require(ROOT + "/assets/i18n.js");

const ORIGIN = "https://tools.zktww.cn";
const CHECK = process.argv.includes("--check");
const tools = items.filter((it) => it.type === "tool");
const demos = items.filter((it) => it.type === "demo");

function localizedItem(it, locale) {
    if (locale !== "en") return it;
    const translated = i18n.tools[it.path];
    if (!translated) throw new Error(`缺少英文注册文案: ${it.path}`);
    return { ...it, name: translated[0], desc: translated[1], tag: translated[2], kw: it.kw + " " + translated.join(" ") };
}
function localizedDomain(domain, locale) {
    return locale === "en" ? { ...domain, title: i18n.groups[domain.key] || domain.title } : domain;
}
function localeUrl(path, locale) {
    return ORIGIN + "/" + (locale === "en" ? "en/" : "") + path;
}

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

/* ── 国际化覆盖：每个注册页面必须具备英文卡片和 SEO 文案 ── */
function verifyI18nCoverage() {
    const errors = [];
    for (const item of items) {
        const translated = i18n.tools[item.path];
        if (!Array.isArray(translated) || translated.length !== 3 || translated.some((text) => !String(text).trim())) {
            errors.push(`缺少完整英文文案: ${item.path}`);
        }
    }
    for (const domain of domains) {
        if (!i18n.groups[domain.key]) errors.push(`缺少英文分类: ${domain.key}`);
    }
    if (errors.length) {
        errors.forEach((error) => console.error("✗ " + error));
        process.exit(1);
    }
}

/* ── 卡片（沿用 gen-cards.mjs 逻辑） ── */
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ARROW_EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

function card(it, locale) {
    it = localizedItem(it, locale);
    const external = it.type === "external";
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    const label = locale === "en" ? (it.type === "demo" ? "Open demo" : "Open tool") : (it.type === "demo" ? "打开演示" : "打开工具");
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

function toolSections(locale = "zh-CN") {
    const list0 = items.filter((it) => it.type === "tool" || it.type === "external");
    const used = new Set();
    const sections = domains.map((d) => {
        const list = list0.filter((it) => it.group === d.key);
        list.forEach((it) => used.add(it.path));
        return { ...localizedDomain(d, locale), list };
    }).filter((s) => s.list.length);
    const rest = list0.filter((it) => !used.has(it.path));
    if (rest.length) sections.push({ key: "misc", title: locale === "en" ? "Other" : "其他", list: rest });
    return sections.map((s) => `        <section class="subgroup" data-domain="${s.key}">
            <h3 class="subsection-title" id="domain-${s.key}">${s.title}</h3>
            <nav class="grid" aria-labelledby="domain-${s.key}">
${s.list.map((it) => card(it, locale)).join("\n\n")}
            </nav>
        </section>`).join("\n\n");
}

function demoGrid(locale = "zh-CN") {
    return `        <nav class="grid" aria-labelledby="demos-heading">
${demos.map((it) => card(it, locale)).join("\n\n")}
        </nav>`;
}

/* ── JSON-LD ── */
function jsonLd(locale = "zh-CN") {
    const english = locale === "en";
    const desc = english
        ? `Free online developer toolbox with ${tools.length} privacy-friendly tools that run locally in your browser and work offline.`
        : `免费在线开发者工具箱：JSON 格式化、时间戳转换、Base64 编码、正则测试等 ${tools.length} 款工具，浏览器本地处理不上传数据，支持离线使用。`;
    return JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
            { "@type": "WebSite", name: "zktool", url: localeUrl("", locale), description: desc, inLanguage: locale },
            {
                "@type": "ItemList", name: english ? "Developer tools" : "开发者工具列表", numberOfItems: tools.length,
                itemListElement: tools.map((source, i) => {
                    const it = localizedItem(source, locale);
                    return {
                    "@type": "ListItem", position: i + 1, name: it.name, description: it.desc, url: localeUrl(it.path, locale),
                }; }),
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
    function entry(path, date, locale) {
        const zh = localeUrl(path, "zh-CN"), en = localeUrl(path, "en"), current = locale === "en" ? en : zh;
        return `  <url><loc>${current}</loc><lastmod>${date}</lastmod><xhtml:link rel="alternate" hreflang="zh-CN" href="${zh}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${zh}"/></url>`;
    }
    const urls = [entry("", rootDate, "zh-CN"), entry("", rootDate, "en")];
    pages.forEach((p, i) => urls.push(entry(p, dates[i], "zh-CN"), entry(p, dates[i], "en")));
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

/* ── llms.txt 工具列表段 ── */
function llmsTools(locale = "zh-CN") {
    return tools.map((source) => {
        const it = localizedItem(source, locale);
        return locale === "en"
            ? `- [${it.name}](${localeUrl(it.path, locale)}): ${it.desc}`
            : `- [${it.name}](${localeUrl(it.path, locale)})：${it.desc.replace(/。$/, "")}`;
    }).join("\n");
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
        "./", "./index.html", "./404.html", "./manifest.webmanifest", "./llms.txt", "./en/", "./en/index.html", "./en/404.html", "./en/manifest.webmanifest", "./en/llms.txt",
        ...top.sort().map((p) => "./" + p),
        ...vendor.sort().filter((p) => !PRECACHE_EXCLUDE.has(p)).map((p) => "./" + p),
        ...tools.map((it) => "./" + it.path),
        ...demos.map((it) => "./" + it.path),
        ...tools.map((it) => "./en/" + it.path),
        ...demos.map((it) => "./en/" + it.path),
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

const COMMON_TEXT_EN = {
    "返回主页": "Back to home", "← 返回主页": "← Back to home", "输入": "Input", "输出": "Output",
    "结果": "Result", "转换": "Convert", "解析": "Parse", "生成": "Generate", "示例": "Example",
    "清空": "Clear", "复制": "Copy", "下载": "Download", "预览": "Preview", "校验": "Validate",
    "格式化": "Format", "美化": "Format", "压缩": "Minify", "编码": "Encode", "解码": "Decode",
    "加密": "Encrypt", "解密": "Decrypt", "搜索": "Search", "全部": "All", "工具": "Tools",
    "演示": "Demos", "收藏": "Favorites", "最近": "Recent", "配置": "Options", "设置": "Settings",
    "说明": "Description", "状态": "Status", "类型": "Type", "格式": "Format", "算法": "Algorithm",
    "统计": "Statistics", "长度": "Length", "行数": "Lines", "字节数": "Bytes", "字符数": "Characters",
    "文件": "File", "文本": "Text", "颜色": "Color", "背景色": "Background", "前景色": "Foreground",
    "自动": "Auto", "默认": "Default", "确定": "Confirm", "取消": "Cancel", "关闭": "Close",
    "复制结果": "Copy result", "复制全部": "Copy all", "复制文本": "Copy text", "复制代码": "Copy code",
    "转换结果": "Converted result", "解析结果": "Parsed result", "计算结果": "Calculated result",
    "输入内容": "Input", "输出格式": "Output format", "选择文件": "Choose file", "选择图片": "Choose image",
    "粘贴内容": "Paste content", "拖放文件到这里": "Drop a file here", "点击选择文件": "Click to choose a file",
    "关于本工具": "About this tool", "常见问题": "Frequently asked questions", "工作日": "Business days",
    "自然日": "Calendar days", "开始日期": "Start date", "结束日期": "End date", "基准日期": "Base date",
    "日期加减": "Add or subtract dates", "日期间隔": "Date difference", "向后": "Forward", "向前": "Backward",
    "天": "days", "周": "weeks", "月": "months", "年": "years", "小时": "hours", "分钟": "minutes",
    "秒": "seconds", "毫秒": "milliseconds", "当前时间": "Current time", "本地时间": "Local time",
    "Docker Run 命令": "Docker Run command", "Compose YAML": "Compose YAML", "转换为 Compose": "Convert to Compose",
    "人民币金额": "RMB amount", "数字金额": "Numeric amount", "中文大写": "Formal Chinese uppercase",
    "规范数字": "Normalized number", "大写金额反查": "Convert uppercase amount back", "转换为数字": "Convert to number",
    "使用上方结果": "Use the result above", "复制大写金额": "Copy uppercase amount", "复制数字金额": "Copy numeric amount",
    "权限矩阵": "Permission matrix", "八进制": "Octal", "符号表示": "Symbolic notation", "命令": "Command",
    "源码": "Source", "优化结果": "Optimized result", "预览与对比": "Preview and comparison",
    "二维码扫描器": "QR Code Scanner", "识别结果": "Scan result", "扫描记录": "Scan history",
    "EXIF 信息": "EXIF information", "清除元数据并下载": "Remove metadata and download",
    "设备信息面板": "Device information", "触摸事件测试板": "Touch event tester", "清空日志": "Clear log",
    "清空轨迹": "Clear trails", "传感器查看器": "Sensor viewer", "开始读取": "Start reading",
    "停止读取": "Stop reading", "进制互转": "Base conversion", "自定义进制": "Custom base",
    "明文": "Plaintext", "密文": "Ciphertext", "密码": "Password", "证书输入": "Certificate input",
    "证书信息": "Certificate details", "JSON 输入": "JSON input", "左侧 JSON": "Left JSON", "右侧 JSON": "Right JSON",
    "差异结果": "Differences", "CIDR 输入": "CIDR input", "IP 归属判断": "IP membership check",
    "子网划分": "Subnetting", "目标前缀长度": "Target prefix length", "网络地址": "Network address",
    "广播地址": "Broadcast address", "子网掩码": "Subnet mask", "可用主机": "Usable hosts",
    "搜索工具或演示…": "Search tools or demos...", "搜索工具或演示": "Search tools or demos",
    "分类筛选": "Category filters", "没有匹配的工具": "No matching tools", "没有可复制的内容。": "Nothing to copy.",
    "包含开始日": "Include start date", "包含结束日": "Include end date", "工作日（周一至周五）": "Business days (Monday-Friday)",
    "折合周数": "Weeks", "0 天": "0 days", "日历间隔": "Calendar interval",
    "“自然日”和“工作日”受包含首尾选项影响；“日历间隔”按两个日期本身计算。": "Calendar and business-day totals follow the include-start/include-end options; the calendar interval compares the dates themselves.",
    "数量": "Amount", "单位": "Unit", "向前推算": "Subtract", "向后推算": "Add",
    "交换日期": "Swap dates", "交换开始和结束日期": "Swap start and end dates",
    "支持 shell 引号、反斜杠转义和多行续写，命令不会上传。": "Supports shell quotes, backslash escapes, and multiline continuations. Commands are never uploaded.",
    "复制 YAML": "Copy YAML", "下载 compose.yaml": "Download compose.yaml",
    "最多支持 16 位整数和 2 位小数，不使用浮点运算。": "Supports up to 16 integer digits and 2 decimal places without floating-point arithmetic.",
    "支持“元/圆、角、分、整/正”以及财务大写和常用中文数字。": "Supports formal and common Chinese numerals with yuan, jiao, fen, and whole-amount suffixes.",
    "中文大写金额": "Formal Chinese uppercase amount", "例如 123456.78": "For example, 123456.78",
    "例如：壹拾贰万叁仟肆佰伍拾陆元柒角捌分": "For example: 壹拾贰万叁仟肆佰伍拾陆元柒角捌分"
    ,"打开链接": "Open link", "停止扫描": "Stop scanning", "开启摄像头": "Start camera", "开始读取传感器": "Start sensors",
    "暂停": "Pause", "清除不可见字符": "Remove invisible characters", "复制全部信息": "Copy all information", "复制当前读数": "Copy current reading",
    "复制私钥": "Copy private key", "复制公钥": "Copy public key", "复制到公众号": "Copy to publisher", "复制 HTML": "Copy HTML",
    "复制 fetch": "Copy fetch", "复制 Python": "Copy Python", "复制 base64 版": "Copy Base64", "复制概览": "Copy overview", "复制 utf8 版": "Copy UTF-8",
    "Base64 编码": "Base64 encode", "Base64 解码": "Base64 decode", "编码（仅必需）": "Encode (required only)", "解码实体": "Decode entities",
    "下载 .pem": "Download .pem", "下载 .html": "Download .html", "下载 PNG": "Download PNG", "下载 SVG": "Download SVG",
    "全部转十进制": "Convert all to decimal", "全部转十六进制": "Convert all to hexadecimal", "命名实体优先": "Prefer named entities",
    "全屏编辑": "Full-screen editor", "全屏预览": "Full-screen preview", "全屏测试": "Full-screen test", "压缩为单行": "Minify to one line",
    "选择 .svg 文件": "Choose an .svg file", "示例 SVG": "SVG example", "Hex 转文本": "Hex to text", "转 Hex": "To Hex", "转 Unicode": "To Unicode", "Unicode 转文本": "Unicode to text",
    "校验 YAML": "Validate YAML", "从选择器转换": "Convert from picker", "今天": "Today", "从文本解析": "Parse from text", "复制 Emoji": "Copy Emoji",
    "复制码点": "Copy code point", "复制短代码": "Copy shortcode", "☆ 收藏": "☆ Favorite", "文本视图": "Text view", "树形视图": "Tree view",
    "原图": "Original", "转换后": "Converted", "拖动调整分栏宽度": "Drag to resize columns", "暂无参数": "No parameters",
    "输入有效的 CIDR 后在这里显示结果。": "Enter a valid CIDR to see the result here.", "点击任意一行复制其十进制值。": "Click any row to copy its decimal value.",
    "点击任意一行即可复制对应的值。": "Click any row to copy its value.", "点击上方命令即可复制到剪贴板。": "Click a command above to copy it to the clipboard.",
    "填入当前": "Use current value", "复制分享链接": "Copy share link", "批量转换": "Batch convert", "日期 → 时间戳": "Date → timestamp", "智能转换 · 时间戳 ⇄ 日期": "Smart conversion · timestamp ⇄ date",
    "最近使用": "Recent", "模板库": "Templates", "键排序": "Sort keys", "转义": "Escape", "去转义": "Unescape", "主题": "Theme", "肤色": "Skin tone",
    "常用时区对照": "Common time zones", "常用实体速查表（点击行复制命名实体）": "HTML entity reference (click a row to copy)", "常用对照表": "Quick reference",
    "常用权限速查": "Permission reference", "状态码": "Status codes", "MIME 类型": "MIME types", "表达式": "Expression", "请求概览": "Request overview",
    "Markdown 输入": "Markdown input", "SQL 输入": "SQL input", "SVG 源码": "SVG source", "fetch 代码": "fetch code", "Python requests 代码": "Python requests code",
    "参数表": "Parameters", "参数说明": "Parameter details", "字段说明": "Field details", "字符集": "Character set", "对比度": "Contrast", "捕获组": "Capture groups", "签名": "Signature", "色阶": "Shades",
    "城市对照": "City comparison", "基准城市": "Base city", "基准时间": "Base time", "添加城市": "Add city", "状态说明": "Status legend", "环境": "Environment", "视口": "Viewport", "屏幕": "Screen", "能力速查": "Capabilities",
    "设备 / 传感器": "Devices / sensors", "设备信息面板": "Device information", "测试画布": "Test canvas", "事件日志": "Event log", "触点 0 / 峰值 0": "Touches 0 / peak 0",
    "工作时段 9:00-18:00": "Working hours 9:00-18:00", "边缘时段": "Edge hours", "休息时段": "Off hours", "等待输入": "Waiting for input", "完成": "Done",
    "转 YAML": "To YAML", "转 CSV": "To CSV", "对比": "Compare", "解析参数": "Parse parameters", "校验": "Validate", "生成密钥对": "Generate key pair", "优化": "Optimize",
    "全小写": "lowercase", "全大写": "UPPERCASE", "去重": "Deduplicate", "倒序": "Reverse", "排序 Z→A": "Sort Z→A", "排序 A→Z": "Sort A→Z", "去空行/首尾空白": "Trim blank lines",
    "从选择器转换": "Convert from picker", "清除": "Clear", "选择器": "Picker", "选择本地日期与时间": "Choose local date and time", "点击选择日期与时间": "Choose date and time",
    "显示或隐藏密码": "Show or hide password", "适应窗口": "Fit to window", "全屏预览 (Esc 退出)": "Full-screen preview (Esc to exit)", "重置为 100%": "Reset to 100%", "放大": "Zoom in", "缩小": "Zoom out", "关闭详情": "Close details",
    "拖入二维码图片，或点击选择": "Drop a QR image or click to choose", "拖入图片，或点击选择": "Drop an image or click to choose", "拖入文件，或点击选择": "Drop a file or click to choose", "拖入照片，或点击选择": "Drop a photo or click to choose",
    "输入内容后自动校验 YAML 语法。": "YAML syntax is validated as you type.", "全部在浏览器本地转换，不会上传内容。": "Everything is converted locally in your browser; content is never uploaded.",
    "全程本地处理，照片不会上传。": "Everything is processed locally; photos are never uploaded.", "密码与数据均在本地处理，不会上传。": "Passwords and data are processed locally and never uploaded.",
    "支持摄像头实时扫码与图片识别，图像不会上传。": "Supports live camera scanning and image recognition; images are never uploaded.", "支持粘贴多张证书（证书链），逐张解析展示。": "Paste multiple certificates (a chain) and inspect them one by one.",
    "时区数据来自浏览器 Intl API，自动处理夏令时。": "Time-zone data comes from the browser Intl API, including daylight-saving changes.", "输入 IP/前缀（如 10.0.0.0/8），全部在浏览器本地实时计算。": "Enter an IP/prefix such as 10.0.0.0/8; all calculations run locally in the browser.",
    "输入 curl 命令后自动解析，全部本地完成。": "Paste a cURL command to parse it locally.", "输入后自动优化；注释、metadata、inkscape/sodipodi 属性、空 defs/g 会被移除。": "Optimization runs as you type; comments, metadata, Inkscape/Sodipodi attributes, and empty defs/g nodes are removed.",
    "输入 250ms 后自动渲染；样式已内联，粘贴到公众号后台即为预览效果。": "Renders 250 ms after input; styles are inlined for direct publishing.", "输入内容后自动保存至本地，刷新不丢失。": "Input is saved locally and survives refreshes.",
    "点击任意一行即可套用该权限。": "Click any row to apply that permission.", "点击按钮开始读取（iOS 需要在弹窗中允许访问动作与方向）。": "Click the button to start reading (iOS requires motion and orientation permission).",
    "全屏后按 Esc 退出；按住并拖动可绘制轨迹，多指同按测试触控采样。": "Press Esc to exit full screen; drag to draw trails and test multi-touch samples.", "最新在上，最多保留 200 条。": "Newest first, up to 200 entries.",
    "按本地时钟分解的当前时刻（年 → 毫秒），与页眉时间戳同步刷新。": "The current local time broken down from year to milliseconds, refreshed with the header timestamp.", "每行一个时间戳（≤11 位秒 / ≥12 位毫秒自动识别）或日期字符串，一键全部转换。": "One timestamp per line (11 or fewer digits means seconds; 12 or more means milliseconds) or a date string.",
    "自动模式：纯数字按位数识别（≤11 位当秒、≥12 位当毫秒），日期字符串反向转时间戳。": "Auto mode detects numeric timestamps by length and converts date strings back to timestamps.",
    "MD5 已不适合安全用途，仅用于校验与兼容旧系统。": "MD5 is not suitable for security; use it only for checksums and legacy compatibility.", "在浏览器中运行，无需联网；解析依赖本机时区。若文本无时区信息，按本地时间理解。": "Runs in the browser without a network connection; timestamps without a zone use local time.",
    "√ 表示当前浏览器暴露了该 API，实际可用性可能还受权限与安全上下文限制。": "√ means the browser exposes this API; permissions and secure-context requirements may still apply.",
    "缩进宽度": "Indent width", "2 空格": "2 spaces", "4 空格": "4 spaces", "操作": "Actions", "结果视图": "Result view", "统计信息": "Statistics", "复制输入": "Copy input",
    "美化、压缩或转义后的结果将显示在这里": "Formatted, minified, or escaped output appears here", "时间转换": "Time conversion", "相对时间": "Relative time", "星期": "Weekday", "秒时间戳": "Unix seconds", "毫秒时间戳": "Unix milliseconds",
    "时区": "Time zone", "标识": "Identifier", "对应时间": "Local time", "展示上方转换结果对应时刻在各时区的时间；未输入时跟随当前时间。": "Shows the converted time across time zones; follows the current time when no input is provided.", "全部转换": "Convert all",
    "上一月": "Previous month", "下一月": "Next month", "时": "Hour", "分": "Minute", "安全编码": "safe encoding", "不会乱码": "will not be garbled", "或 ISO / 常见格式": "or ISO / common formats",
    "解码时将 + 视为空格（表单查询字符串）": "Treat + as a space when decoding (form query strings)", "支持完整 URL、?a=1&b=2 或 a=1&b=2；参数表按标准 URLSearchParams 解析（+ 一律视为空格）。": "Supports full URLs, ?a=1&b=2, or a=1&b=2. Parameters use standard URLSearchParams parsing (+ is treated as a space).", "UTF-8 安全编码，中文不会乱码。": "UTF-8 encoding keeps non-ASCII text intact."
    ,"输入文本或 Base64": "Input text or Base64", "颜色选择器": "Color picker", "颜色代码（HEX / RGB / HSL）": "Color code (HEX / RGB / HSL)", "输入 IP/前缀": "IP/prefix input", "正则表达式": "Regular expression"
};

const SCRIPT_TEXT_EN = {
    "tools/date-calculator/": {
        "请选择有效的开始和结束日期。": "Choose valid start and end dates.", "两个日期是同一天。": "The dates are the same.",
        "结束日期在开始日期之后 ": "The end date is after the start date by ", "结束日期在开始日期之前 ": "The end date is before the start date by ",
        "请输入有效日期和整数数量。": "Enter a valid date and integer amount.", "推算结果已复制。": "Calculated date copied.",
        "复制失败，请手动复制。": "Copy failed. Please copy manually.", '" 年"': '" years"', '" 个月"': '" months"',
        '" 天"': '" days"', ' 天。': ' days.', 'day:"天"': 'day:"days"', 'business:"个工作日"': 'business:"business days"',
        'week:"周"': 'week:"weeks"', 'month:"个月"': 'month:"months"', 'year:"年"': 'year:"years"'
    },
    "tools/docker-compose-converter/": {
        "命令中存在未闭合的引号": "The command contains an unclosed quote", "请输入以 docker run 开头的命令": "Enter a command that starts with docker run",
        "请输入 docker container run 命令": "Enter a docker container run command", " 缺少参数值": " is missing a value",
        " 无固定端口，未写入 Compose": " has no fixed port and was not added to Compose", "--rm 没有长期 Compose 服务的等价配置": "--rm has no direct equivalent for a long-running Compose service",
        "未识别到镜像名称": "No image name was found", "未识别参数：": "Unrecognized options: ", "服务 ": "Service ", "镜像 ": "Image ",
        "转换完成；": "Converted with warnings: ", "转换完成，建议再运行 docker compose config 校验。": "Converted. Run docker compose config to validate the result.",
        "转换失败：": "Conversion failed: ", "没有可复制的 YAML。": "There is no YAML to copy.", "Compose YAML 已复制。": "Compose YAML copied.",
        "复制失败，请手动选择复制。": "Copy failed. Please select and copy the YAML manually.",
        "支持 shell 引号、反斜杠转义和多行续写，命令不会上传。": "Supports shell quotes, backslash escapes, and multiline continuations. Commands are never uploaded.",
        'join("；")': 'join("; ")'
    },
    "tools/rmb-uppercase/": {
        "请输入金额": "Enter an amount", "金额应为数字，且小数最多两位": "Enter a number with no more than two decimal places",
        "整数部分最多 16 位": "The integer part supports up to 16 digits", "转换完成，共 ": "Converted: ", " 个大写字符。": " Chinese uppercase characters.",
        "转换失败：": "Conversion failed: ", "无法识别字符“": "Unrecognized character: ", "请输入中文大写金额。": "Enter a Chinese uppercase amount.",
        "包含无法识别的字符": "The amount contains unsupported characters", "包含多个元单位": "The amount contains multiple yuan units",
        "反查完成；请与原始票据逐字核对。": "Converted back to a number. Verify it carefully against the source document.",
        "反查失败：": "Reverse conversion failed: ", "没有可复制的内容。": "Nothing to copy.", "已复制。": " copied.",
        "复制失败，请手动复制。": "Copy failed. Please copy manually.", 'copy(upper,"大写金额")': 'copy(upper,"Uppercase amount")',
        'copy(normal,"数字金额")': 'copy(normal,"Numeric amount")',
        "最多支持 16 位整数和 2 位小数，不使用浮点运算。": "Supports up to 16 integer digits and 2 decimal places without floating-point arithmetic."
    }
};

function ensureI18nScript(html) {
    if (/<script[^>]+assets\/i18n\.js/.test(html)) return html;
    return html.replace(
        /(<script\s+defer\s+src="([^"]*assets\/)registry\.js(?:\?v=[0-9a-f]+)?"><\/script>)/,
        `$1<script defer src="$2i18n.js"></script>`
    );
}

function alternates(path) {
    return `<link rel="alternate" hreflang="zh-CN" href="${localeUrl(path, "zh-CN")}" /><link rel="alternate" hreflang="en" href="${localeUrl(path, "en")}" /><link rel="alternate" hreflang="x-default" href="${localeUrl(path, "zh-CN")}" />`;
}

function injectAlternates(html, path) {
    html = html.replace(/\n[ \t]*(?:<link rel="alternate" hreflang="(?:zh-CN|en|x-default)"[^>]*>[ \t]*)+/g, "");
    html = html.replace(/\n(?:[ \t]*\n){2,}/g, "\n");
    return html.replace("</head>", `    ${alternates(path)}\n</head>`);
}

function translateVisibleText(html) {
    const protectedParts = [];
    html = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (part) => {
        const token = `@@ZK_PROTECTED_${protectedParts.length}@@`;
        protectedParts.push(part); return token;
    });
    const entries = Object.entries(COMMON_TEXT_EN)
        .filter(([from]) => from.length >= 3)
        .sort((a, b) => b[0].length - a[0].length);
    const translateFragment = (text) => {
        const trimmed = text.trim();
        if (COMMON_TEXT_EN[trimmed]) return text.replace(trimmed, COMMON_TEXT_EN[trimmed]);
        return entries.reduce((value, [from, to]) => value.split(from).join(to), text);
    };
    html = html.replace(/>([^<>]+)</g, (match, text) => {
        const translated = translateFragment(text);
        return translated === text ? match : ">" + translated + "<";
    });
    html = html.replace(/\b(placeholder|aria-label|title)="([^"]*)"/g, (match, attr, value) => {
        const translated = translateFragment(value);
        return translated === value ? match : `${attr}="${translated}"`;
    });
    return html.replace(/@@ZK_PROTECTED_(\d+)@@/g, (match, index) => protectedParts[Number(index)]);
}

function setMetaContent(html, selector, value) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(<meta\\s+${escaped}\\s+content=")[^"]*("\\s*\\/?>)`);
    return html.replace(re, `$1${value}$2`);
}

function englishSeoSection(tool) {
    const item = localizedItem(tool, "en");
    return `<section class="seo-notes">
        <h2>About ${item.name}</h2>
        <p>${item.desc} Processing happens locally in your browser, and the tool does not upload the entered content.</p>
        <h2>Privacy and compatibility</h2>
        <p>Results depend on browser capabilities and the supplied input. Review generated output before using it in production or formal documents.</p>
    </section>`;
}

function localizeEnglishPage(html, tool, path) {
    const item = localizedItem(tool, "en");
    html = `<!-- Generated from /${path}; edit the Chinese source page and assets/i18n.js instead. -->\n` + html;
    html = html.replace(/<html lang="[^"]+">/, '<html lang="en">');
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${item.name} - Free Online Tool | zktool</title>`);
    html = setMetaContent(html, 'name="description"', item.desc);
    html = setMetaContent(html, 'property="og:title"', `${item.name} | zktool`);
    html = setMetaContent(html, 'property="og:description"', item.desc);
    html = setMetaContent(html, 'property="og:url"', localeUrl(tool.path, "en"));
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${localeUrl(tool.path, "en")}" />`);
    html = html.replace(/(<h1[^>]*>[\s\S]*?<span class="title">)[\s\S]*?(<\/span>[\s\S]*?<\/h1>)/, `$1${item.name}$2`);
    html = html.replace(/<p class="lead">[\s\S]*?<\/p>/, `<p class="lead">${item.desc}</p>`);
    html = html.replace(/<section class="seo-notes">[\s\S]*?<\/section>/, englishSeoSection(tool));
    html = translateVisibleText(html);
    const scriptText = SCRIPT_TEXT_EN[tool.path] || {};
    Object.entries(scriptText).forEach(([from, to]) => { html = html.split(from).join(to); });
    html = html.replace(/(["'])\.\.\/\.\.\/(assets\/)/g, "$1../../../$2");
    html = html.replace(/href="\.\.\/\.\.\/"/g, 'href="../../../"');
    html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (whole, body) => body.includes("BreadcrumbList") ? whole : "");
    const appLd = JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication", name: item.name,
        url: localeUrl(tool.path, "en"), applicationCategory: "DeveloperApplication",
        operatingSystem: "Web", inLanguage: "en", description: item.desc,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
    });
    html = html.replace("</head>", `    <script type="application/ld+json">${appLd}</script>\n</head>`);
    return injectAlternates(ensureI18nScript(html), tool.path);
}

function localizeEnglishIndex(html) {
    html = `<!-- Generated from /index.html; edit the Chinese source and assets/i18n.js instead. -->\n` + html;
    html = html.replace(/<html lang="[^"]+">/, '<html lang="en">');
    html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>zktool - Free Online Developer Tools</title>");
    html = setMetaContent(html, 'name="description"', `Free online developer toolbox with ${tools.length} privacy-friendly utilities that run locally in your browser.`);
    html = setMetaContent(html, 'property="og:title"', "zktool - Free Online Developer Tools");
    html = setMetaContent(html, 'property="og:description"', "Developer tools that run locally in your browser without uploading your data.");
    html = setMetaContent(html, 'property="og:url"', localeUrl("", "en"));
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${localeUrl("", "en")}" />`);
    html = replaceBlock(html, "tools", toolSections("en"), "        ");
    html = replaceBlock(html, "demos", demoGrid("en"), "        ");
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${jsonLd("en")}</script>`);
    const replacements = new Map([
        ["Personal Playground · 持续更新", "Personal Playground · Always evolving"],
        ["工具与演示集", "Tools & Demos"],
        ["实验页与实用小工具的入口 —— <strong>工具</strong>侧重日常开发辅助，<strong>演示</strong>侧重交互与展示。全部为纯静态 HTML，开箱即用。", "A practical collection of <strong>tools</strong> for everyday development and interactive <strong>demos</strong>. Everything is static, private, and ready to use."],
        ["全部 <span", "All <span"], ["工具 <span", "Tools <span"], ["演示 <span", "Demos <span"], ["⭐ 收藏 <span", "Favorites <span"],
        [">实用工具<", ">Developer tools<"], [">交互演示<", ">Interactive demos<"],
        ["没有找到匹配 <strong id=\"empty-q\"></strong> 的内容，换个关键词试试？", "No results matched <strong id=\"empty-q\"></strong>. Try another search."],
        ["所有工具均在浏览器本地运行，数据不上传服务器，支持离线使用", "All tools run locally in your browser. Your data is not uploaded, and offline use is supported."],
        ["随处呼出命令面板", "opens the command palette anywhere"], ["GitHub 开源仓库", "GitHub repository"],
        ["问题反馈 / 功能建议", "Issues / feature requests"], ["站点有新版本，点击刷新", "A new version is available. Click to refresh"],
        ["'取消收藏'", "'Remove favorite'"], ["'收藏'", "'Add favorite'"], ["'最近'", "'Recent'"], ["'当前筛选'", "'the current filter'"]
    ]);
    replacements.forEach((to, from) => { html = html.split(from).join(to); });
    html = translateVisibleText(html);
    html = html.replace(/(["'])\.?\/?assets\//g, "$1../assets/");
    html = html.replace(/href="favicon\.ico"/g, 'href="../favicon.ico"');
    html = html.replace(/href="manifest\.webmanifest"/g, 'href="manifest.webmanifest"');
    html = html.replace(/navigator\.serviceWorker\.register\('sw\.js'/g, "navigator.serviceWorker.register('../sw.js'");
    return injectAlternates(ensureI18nScript(html), "");
}

function localizeEnglish404(html) {
    html = `<!-- Generated from /404.html; edit the Chinese source instead. -->\n` + html;
    html = html.replace(/<html lang="[^"]+">/, '<html lang="en">');
    html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>Page not found | zktool</title>");
    html = setMetaContent(html, 'name="description"', "The requested page could not be found. Return to the zktool developer tools.");
    html = html.replace(/页面不存在/g, "Page not found");
    html = html.replace(/地址可能拼写有误，或该工具已被移动。按 <span class="mono">Ctrl\+K<\/span> 搜索工具，或返回主页浏览全部。/, "The address may be incorrect or the tool may have moved. Press <span class=\"mono\">Ctrl+K</span> to search, or browse all tools from the home page.");
    html = html.replace(/← 返回主页/g, "← Back to home").replace(/搜索工具（Ctrl\+K）/g, "Search tools (Ctrl+K)");
    html = html.replace(/href="\/"/g, 'href="/en/"');
    html = html.replace(/href="\/assets\//g, 'href="/assets/');
    return injectAlternates(ensureI18nScript(html), "");
}

function verifyEnglishOutput(out) {
    const errors = [];
    const pages = [...tools, ...demos];
    for (const item of pages) {
        const name = `en/${item.path}index.html`;
        const html = out[name];
        if (!html) { errors.push(`未生成英文页面: ${name}`); continue; }
        if (!/<html lang="en">/.test(html)) errors.push(`英文页面 lang 缺失: ${name}`);
        if (!html.includes(`href="${localeUrl(item.path, "en")}"`)) errors.push(`英文 canonical 缺失: ${name}`);
        if (!/assets\/i18n\.js/.test(html)) errors.push(`英文运行时缺失: ${name}`);
    }
    if (errors.length) throw new Error(errors.join("\n"));
}

async function build() {
    await verifyRegistry();
    verifyI18nCoverage();
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
    html = replaceBlock(html, "tools", toolSections("zh-CN"), "        ");
    html = replaceBlock(html, "demos", demoGrid("zh-CN"), "        ");
    html = html.replace(/\d+ 款工具/g, `${tools.length} 款工具`);
    html = html.replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        `<script type="application/ld+json">${jsonLd("zh-CN")}</script>`
    );
    out["index.html"] = injectAlternates(ensureI18nScript(stamp(html)), "");
    out["en/index.html"] = stamp(localizeEnglishIndex(html));

    /* 全部工具/演示页 + 404：盖资源版本戳；工具页另注入/更新 BreadcrumbList JSON-LD */
    function breadcrumbLd(tool, locale = "zh-CN") {
        const item = localizedItem(tool, locale);
        const groupTitle = Object.fromEntries(domains.map((d) => [d.key, localizedDomain(d, locale).title]));
        const home = locale === "en" ? "Home" : "首页";
        const items = [{ "@type": "ListItem", position: 1, name: home, item: localeUrl("", locale) }];
        if (groupTitle[tool.group]) items.push({ "@type": "ListItem", position: 2, name: groupTitle[tool.group], item: localeUrl("", locale) + "#domain-" + tool.group });
        items.push({ "@type": "ListItem", position: items.length + 1, name: item.name, item: localeUrl(tool.path, locale) });
        return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items })}</script>`;
    }
    function injectBreadcrumb(html, tool, locale = "zh-CN") {
        const tag = breadcrumbLd(tool, locale);
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
        let page = ensureI18nScript(stamp(await readFile(ROOT + "/" + p, "utf8")));
        const tool = tools.find((it) => it.path + "index.html" === p);
        if (tool) page = injectBreadcrumb(page, tool);
        out[p] = injectAlternates(page, p.replace(/index\.html$/, ""));
        const source = await readFile(ROOT + "/" + p, "utf8");
        const relativePath = p.replace(/index\.html$/, "");
        let english = p === "404.html"
            ? localizeEnglish404(source)
            : localizeEnglishPage(source, tool || demos.find((it) => it.path + "index.html" === p), relativePath);
        if (tool) english = injectBreadcrumb(english, tool, "en");
        out[`en/${p}`] = stamp(english);
    }

    /* sitemap.xml */
    out["sitemap.xml"] = sitemap();

    /* llms.txt */
    let llms = await readFile(ROOT + "/llms.txt", "utf8");
    llms = replaceBlock(llms, "llms-tools", llmsTools("zh-CN"));
    out["llms.txt"] = llms;
    out["en/llms.txt"] = `# zktool\n\n> Free online developer tools that run locally in your browser.\n\n## Tools\n\n${llmsTools("en")}\n`;

    const manifest = JSON.parse(await readFile(ROOT + "/manifest.webmanifest", "utf8"));
    const enManifest = {
        ...manifest,
        name: "zktool Developer Tools",
        short_name: "zktool",
        description: "Privacy-friendly developer tools that run locally in your browser",
        lang: "en",
        start_url: "./",
        scope: "./",
        icons: (manifest.icons || []).map((icon) => ({ ...icon, src: icon.src === "favicon.ico" ? "../favicon.ico" : "../" + icon.src })),
        shortcuts: (manifest.shortcuts || []).map((item) => ({ ...item,
            name: ({ "./tools/json-formatter/": "JSON Formatter", "./tools/timestamp-converter/": "Timestamp Converter", "./tools/base64-converter/": "Base64 Converter", "./tools/regex-tester/": "Regex Tester" }[item.url] || item.name),
            description: ({ "./tools/json-formatter/": "Validate and format JSON", "./tools/timestamp-converter/": "Convert timestamps and dates", "./tools/base64-converter/": "Encode and decode Base64", "./tools/regex-tester/": "Test regular expressions" }[item.url] || item.description)
        }))
    };
    out["en/manifest.webmanifest"] = JSON.stringify(enManifest, null, 4) + "\n";

    /* sw.js：CORE 列表 + 缓存名（资源与页面的内容哈希，任何发布变更自动换新缓存并清旧） */
    let sw = await readFile(ROOT + "/sw.js", "utf8");
    const core = await swCore();
    const coreJs = core.map((p) => `    ${JSON.stringify(p)},`).join("\n");
    sw = sw.replace(/(\/\* gen:core \*\/)[\s\S]*?(\/\* \/gen:core \*\/)/, `$1\n${coreJs}\n    $2`);
    const allPagePaths = [...pagePaths, ...pagePaths.map((p) => `en/${p}`)];
    const pageHashes = allPagePaths.map((p) => sha8(out[p]));
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

    verifyEnglishOutput(out);
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
    for (const [name, content] of Object.entries(out)) {
        await mkdir(resolve(ROOT, name, ".."), { recursive: true });
        await writeFile(ROOT + "/" + name, content, "utf8");
    }
    const counts = items.reduce((a, it) => ((a[it.type] = (a[it.type] || 0) + 1), a), {});
    console.log(`已生成 ${Object.keys(out).join("、")}。合计 ${items.length} 条：`, counts);
}
