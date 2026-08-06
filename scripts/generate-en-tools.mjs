// 从中文工具源码和集中翻译文案生成英文工具页。
// 这些页面是构建中间产物，不应直接编辑。
import { copyFile, readFile, writeFile, mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function loadLegacyData(file) {
    const sandbox = {};
    vm.runInNewContext(readFileSync(resolve(ROOT, file), "utf8"), sandbox, { filename: file });
    return sandbox;
}

const { ZKTOOL_REGISTRY: items, ZKTOOL_GROUPS: domains } = loadLegacyData("src/data/registry.js");
const { ZKTOOL_I18N: i18n } = loadLegacyData("src/data/i18n.js");

const ORIGIN = "https://tools.zktww.cn";
const tools = items.filter((it) => it.type === "tool");

function localizedItem(it, locale) {
    if (locale !== "en") return it;
    const translated = i18n.tools[it.path];
    if (!translated) throw new Error(`缺少英文注册文案: ${it.path}`);
    return { ...it, name: translated[0], desc: translated[1], tag: translated[2], kw: it.kw + " " + translated.join(" ") };
}

function localeUrl(path, locale) {
    return ORIGIN + "/" + (locale === "en" ? "en/" : "") + path;
}

const COMMON_TEXT_EN = {
    "返回主页": "Back to home", "← 返回主页": "← Back to home", "输入": "Input", "输出": "Output",
    "结果": "Result", "转换": "Convert", "解析": "Parse", "生成": "Generate", "示例": "Example",
    "清空": "Clear", "复制": "Copy", "下载": "Download", "预览": "Preview", "校验": "Validate",
    "格式化": "Format", "美化": "Format", "压缩": "Minify", "编码": "Encode", "解码": "Decode",
    "加密": "Encrypt", "解密": "Decrypt", "搜索": "Search", "全部": "All", "工具": "Tools",
    "演示": "Examples", "收藏": "Favorites", "最近": "Recent", "配置": "Options", "设置": "Settings",
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
    "搜索工具或演示…": "Search tools...", "搜索工具或演示": "Search tools",
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
    "填入当前": "Use current value", "复制分享链接": "Copy share link", "日期 → 时间戳": "Date → timestamp", "智能转换 · 时间戳 ⇄ 日期": "Smart conversion · timestamp ⇄ date",
    "最近使用": "Recent", "模板库": "Templates", "键排序": "Sort keys", "转义": "Escape", "去转义": "Unescape", "主题": "Theme", "肤色": "Skin tone",
    "常用时区对照": "Common time zones", "常用实体速查表（点击行复制命名实体）": "HTML entity reference (click a row to copy)", "常用对照表": "Quick reference",
    "常用权限速查": "Permission reference", "状态码": "Status codes", "MIME 类型": "MIME types", "表达式": "Expression", "请求概览": "Request overview",
    "Markdown 输入": "Markdown input", "SQL 输入": "SQL input", "SVG 源码": "SVG source", "fetch 代码": "fetch code", "Python requests 代码": "Python requests code",
    "参数表": "Parameters", "参数说明": "Parameter details", "字段说明": "Field details", "字符集": "Character set", "对比度": "Contrast", "捕获组": "Capture groups", "签名": "Signature", "色阶": "Shades",
    "城市对照": "City comparison", "基准城市": "Base city", "基准时间": "Base time", "添加城市": "Add city", "状态说明": "Status legend", "环境": "Environment", "视口": "Viewport", "屏幕": "Screen", "能力速查": "Capabilities",
    "设备 / 传感器": "Devices / sensors", "测试画布": "Test canvas", "事件日志": "Event log", "触点 0 / 峰值 0": "Touches 0 / peak 0",
    "工作时段 9:00-18:00": "Working hours 9:00-18:00", "边缘时段": "Edge hours", "休息时段": "Off hours", "等待输入": "Waiting for input", "完成": "Done",
    "转 YAML": "To YAML", "转 CSV": "To CSV", "对比": "Compare", "解析参数": "Parse parameters", "生成密钥对": "Generate key pair", "优化": "Optimize",
    "全小写": "lowercase", "全大写": "UPPERCASE", "去重": "Deduplicate", "倒序": "Reverse", "排序 Z→A": "Sort Z→A", "排序 A→Z": "Sort A→Z", "去空行/首尾空白": "Trim blank lines",
    "清除": "Clear", "选择器": "Picker", "选择本地日期与时间": "Choose local date and time", "点击选择日期与时间": "Choose date and time",
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
    ,"输入文本或 Base64": "Input text or Base64", "颜色选择器": "Color picker", "颜色代码（HEX / RGB / HSL）": "Color code (HEX / RGB / HSL)", "输入 IP/前缀": "IP/prefix input", "正则表达式": "Regular expression",
    "首页": "Home", "生成与凭证": "Generators & Credentials", "格式化与数据": "Formatting & Data", "编码与字符": "Encoding & Characters", "图表与图像": "Charts & Images", "设备与移动": "Devices & Mobile", "时间与调度": "Time & Scheduling", "速查参考": "Quick Reference",
    "显示": "Show", "隐藏": "Hide", "密钥派生": "Key derivation", "随机": "Random", "字符": "characters", "字节": "bytes", "字段": "fields", "数值": "Value", "版本": "Version",
    "粘贴证书后点击「解析」，或点「示例」查看效果。": "Paste a certificate and click Parse, or click Example to see a sample.",
    "对象读 r (4)写 w (2)执行 x (1)": "Owner read r (4), write w (2), execute x (1)", "所有者 (u)": "Owner (u)", "所属组 (g)": "Group (g)", "其他人 (o)": "Others (o)", "特殊位：": "Special bits:", "纯本地计算，Octal支持 3 位（755）或 4 位带特殊位（4755）。": "All calculations run locally. Octal supports 3 digits (755) or 4 digits with special bits (4755).", "数字": "Number", "符号": "Symbolic", "普通文件默认": "Common file default", "目录与脚本常用": "Common for directories and scripts", "私密文件": "Private file", "私密目录": "Private directory", "协作目录": "Shared directory", "协作文件": "Shared file", "任何人可读写执行": "Anyone can read, write, and execute",
    "网络 / IPv4": "Network / IPv4", "输入一个 IP，实时判断它是否属于上方网段。": "Enter an IP to check whether it belongs to the network above.", "把当前网段划分为更小的子网（前缀 +1 ~ +8）。": "Split the current network into smaller subnets (prefix +1 to +8).",
    "复制格式": "Copy format", "Cron Expression（5 字段）": "Cron expression (5 fields)", "每 5 分钟": "Every 5 minutes", "Business days 9 点": "Business days at 9:00", "每月 1 日 2:30": "2:30 on the first day of each month", "每周日": "Every Sunday", "未来 10 次": "Next 10 runs",
    "粘贴 curl 命令后自动解析，全部本地完成。": "Paste a cURL command to parse it locally.", "全部数据均在本地读取，不发送任何网络请求。": "All data is read locally; no network requests are sent.", "可用区域": "Available area", "物理分辨率（估算）": "Physical resolution (estimated)", "屏幕方向": "Screen orientation", "滚动条宽度": "Scrollbar width", "安全区": "Safe area", "语言": "Language", "硬件并发": "Hardware concurrency", "触点数": "Max touch points", "是否触屏": "Touch support", "指针精度": "Pointer precision", "偏好与状态": "Preferences and state", "深色模式偏好": "Dark-mode preference", "减弱动画偏好": "Reduced-motion preference", "在线状态": "Online status",
    "图片": "Image", "支持 JPG / PNG / WebP / HEIC，也可 Ctrl+V 粘贴": "Supports JPG / PNG / WebP / HEIC, and Ctrl+V paste", "选择照片后，这里会分组展示拍摄时间、设备、曝光参数与 GPS 等元数据。": "After choosing a photo, capture time, device, exposure, GPS, and other metadata appear here.", "摘要结果": "Digest result", "字符命名实体": "Named entity", "十进制": "Decimal", "十六进制": "Hexadecimal", "共  条 · 点击条目复制": " entries · click an entry to copy",
    "输出格式WebPJPEGPNG（无损，忽略质量）": "Output format WebP JPEG PNG (lossless; quality is ignored)", "最大边长不缩放": "Maximum edge (no resize)", "压缩转换下载结果": "Compress, convert, and download", "旧 JSON": "Old JSON", "新 JSON": "New JSON", "数组忽略顺序": "Ignore array order", "差异": "Differences", "JSON Format与校验": "JSON Format & validation", "快捷键：Ctrl + Enter 美化当前输入 · Input自动保存至本地，刷新不丢失。": "Shortcut: Ctrl + Enter formats the current input · Input is saved locally and survives refresh.", "仅使用浏览器原生 JSON.parse，数据全程本地处理，不上传服务器；不支持 JSON5 / 尾逗号等非标准语法。": "Uses the browser's native JSON.parse; data stays local and JSON5 or trailing commas are not supported.",
    "验签密钥（可选）：HS 系列填共享密钥；RS / ES 系列贴公钥（PEM 或 JWK）": "Verification key (optional): enter a shared secret for HS, or a public key (PEM or JWK) for RS / ES.", "Header复制 Header": "Header Copy Header", "Payload复制 Payload": "Payload Copy Payload", "算法与参数": "Algorithm and parameters", "密钥长度": "Key size", "曲线": "Curve", "密钥全程在浏览器本地生成，不会上传到任何服务器；请妥善保管私钥，切勿泄露。": "Keys are generated locally in your browser and never uploaded; keep the private key secure.", "选择算法后点击「Generate key pair」。": "Choose an algorithm and click Generate key pair.", "公钥": "Public key", "私钥": "Private key",
    "本页分区": "Page sections", "基准与示例": "Lab & examples", "单位对比": "Unit comparison", "对照表": "Reference table", "显示基准": "Display baseline", "单位示例": "Unit examples", "显示基准与单位示例": "Display baseline and unit examples", "同一环境下": "In the same environment", "基准字体大小 (px)": "Base font size (px)", "参考容器宽度 (px)": "Reference container width (px)", "选择单位": "Choose a unit", "像素": "pixels", "相对于字体": "relative to font size", "相对于根": "relative to root", "视口宽度": "viewport width", "视口高度": "viewport height", "返回工具首页": "Back to tools", "博客": "Blog",
    "返回索引": "Back to index", "基于 HTML5 原生 Drag and Drop API": "Based on the native HTML5 Drag and Drop API", "HTML5 拖拽 API 工具": "HTML5 Drag and Drop playground", "三个循序渐进的案例：": "Three progressive examples: ", "基础拖放": "basic drag and drop", "列表排序": "list sorting", "文件拖拽上传": "file drag-and-drop upload", "右下方日志面板实时显示触发的事件，便于理解": "The log panel shows triggered events in real time, making it easier to understand ", "案例一：基础拖放": "Example 1: Basic drag and drop", "把左侧标签拖到右侧容器。": "Drag a label from the left into the container on the right.", "源区域": "Source area", "目标区域": "Target area", "案例二：列表排序": "Example 2: List sorting", "上下拖动以重排。": "Drag items up and down to reorder.", "案例三：文件拖拽上传": "Example 3: File drag-and-drop upload", "把任意文件拖入下方虚线区域，或点击选择。": "Drop any file into the dashed area below, or click to choose.", "拖放文件到此处": "Drop files here", "正在加载 Emoji 数据…": "Loading Emoji data…", "Emoji 符号库": "Emoji library", "分类": "Category", "码点": "Code point", "短代码": "Shortcode", "收藏与Recent保存在本机浏览器（localStorage）。": "Favorites and recents are stored in this browser (localStorage).", "已复制": "Copied",
    "也可以直接 Ctrl+V 粘贴截图": "You can also paste a screenshot with Ctrl+V", "扫描历史": "Scan history", "本次会话内的识别记录会显示在这里（最多 10 条，点击可复制）。": "Scan history for this session appears here (up to 10 entries; click to copy).",
    "二进制 (Base 2)": "Binary (Base 2)", "十进制 (Base 10)": "Decimal (Base 10)", "十六进制 (Base 16)": "Hexadecimal (Base 16)", "在任意一栏输入，其余进制实时联动换算；负数请在最前面加 -。": "Enter a value in any field to update the other bases; prefix negative values with -.", "位运算速览": "Bitwise overview", "写法": "Notation", "十进制值": "Decimal value",
    "数字串": "Numeric string", "自定义Character set": "Custom character set", "测试文本": "Test text", "替换模板": "Replacement template", "测试ExampleClear": "Test Example Clear", "替换结果": "Replacement result", "匹配高亮": "Highlight matches", "左右互换": "Swap sides", "原文本": "Original text", "新文本": "New text", "方向": "Orientation", "加速度": "Acceleration", "旋转速率": "Rotation rate", "设备没有可用的运动传感器": "This device has no available motion sensors",
    "算法 AES-256-GCM": "Algorithm AES-256-GCM", "随机 salt 16B": "Random salt 16B", "随机 IV 12B": "Random IV 12B", "自包含参数，凭同一密码即可解密。": "It is self-contained and can be decrypted with the same password.",
    "所有者可读写，其他人只读": "owner can read and write; others can read", "所有者全权，其他人可读可执行": "owner has full access; others can read and execute", "仅所有者可读写（SSH 私钥必须）": "only the owner can read and write (required for SSH private keys)", "仅所有者可进入访问": "only the owner can enter and access", "同组成员可写入": "group members can write", "同组成员可编辑": "group members can edit", "高风险，生产环境禁用": "high risk; do not use in production",
    "5 字段": "5 fields", "跳到主要内容": "Skip to main content", "在浏览器里对照绝对单位与相对单位，用同一套基准观察它们如何换算、如何随字体与视口变化。": "Compare absolute and relative CSS units in one environment, and see how they respond to font and viewport changes.", "博客 · 丿似锦": "Blog · Zktww", "01 · 环境": "01 · Environment", "px (像素)": "px (pixels)", "cm (厘米)": "cm (centimeters)", "in (英寸)": "in (inches)", "rlh (根行高)": "rlh (root line height)", "应用": "Apply", "当前长度：": "Current length: ", "第一组": "First value", "第二组": "Second value", "单位 A · 数值": "Unit A · value", "单位 B · 数值": "Unit B · value", "单位Reference table": "Unit reference table",
    "关键点：dragstart 中设置 effectAllowed 与 setData；dragover 必须 preventDefault() 才能成为放置目标。": "Key points: set effectAllowed and setData in dragstart; dragover must call preventDefault() to become a drop target.", "核心是用 getBoundingClientRect() 计算光标相对每个兄弟元素的位置，配合 :not(.dragging) 排除自身，在 dragover 中实时 insertBefore。": "It uses getBoundingClientRect() to compare the pointer with sibling elements, excludes itself with :not(.dragging), and inserts in dragover.", "需求评审": "Requirements review", "技术方案设计": "Technical design", "接口联调": "API integration", "自测与回归": "Self-test and regression", "灰度上线": "Staged rollout", "示例 DataTransfer.files 的读取与展示（不会上传到服务器，仅本地显示）。": "This demonstrates reading and displaying DataTransfer.files. Files are not uploaded and stay local.", "或点击选择": "or click to choose", "所有交互均在浏览器本地运行。工具源码由 Astro 项目统一构建。": "All interactions run locally in your browser. This tool is built by the Astro project.",
    "对支持肤色的人物 / 手势类 emoji 生效，复制时自动应用": "Applies to people and gesture emoji that support skin tones, and is included when copied.", "不同操作系统与字体下，同一字符的图形可能略有差异，以本机显示为准。": "Emoji appearance can differ by operating system and font; your local rendering is authoritative.", "若分组或中文注释 CDN 不可用，会尽量用英文名显示；完全失败时仅显示内置示例，刷新页面可重新加载。": "If category or annotation data is unavailable, English names are used where possible; otherwise only built-in examples are shown until refresh.",
    "命名": "Named", "点击条目复制": "click an entry to copy", "支持 PNG / JPEG / WebP / GIF / AVIF": "Supports PNG / JPEG / WebP / GIF / AVIF", "（无损，忽略质量）": "(lossless; quality is ignored)", "质量": "Quality", "CSV 需要输入是对象数组（如 [{...}, {...}]）。": "CSV input must be an array of objects (for example [{...}, {...}]).", "缩进": "Indentation", "键数量": "Key count", "最大深度": "Maximum depth",
    "位": " bits", "# zktool 使用示例": "# ZKTool example", "一段普通段落：**加粗**、*斜体*、`行内代码` 与 [链接](https://tools.zktww.cn/)。": "A regular paragraph with **bold**, *italic*, `inline code`, and a [link](https://tools.zktww.cn/).", "## 待办列表": "## Task list", "整理会议纪要": "Organize meeting notes", "编写周报": "Write a weekly report", "收集数据": "Collect data", "输出结论": "Write conclusions", "## 功能对比": "## Feature comparison", "功能": "Feature", "实时预览": "Live preview", "输入即渲染": "Renders as you type", "已完成": "Done", "输出净化后的 HTML": "Outputs sanitized HTML", "## 代码块": "## Code block", "你好，": "Hello, ", "引用：所有内容均在浏览器本地渲染，不会上传服务器。": "Quote: all content is rendered locally in your browser and is never uploaded.", "排版样式": "Publishing style", "经典蓝": "Classic blue",
    "Mermaid 图表编辑器": "Mermaid diagram editor", "一键插入": "Insert", "流程图": "Flowchart", "时序图": "Sequence diagram", "类图": "Class diagram", "状态图": "State diagram", "ER 图": "ER diagram", "甘特图": "Gantt chart", "饼图": "Pie chart", "思维导图": "Mindmap", "Git 图": "Git graph", "浅色": "light", "深色": "dark", "Mermaid 代码": "Mermaid code", "Mermaid 代码输入": "Mermaid code input", "在左侧输入代码后自动渲染也可以从上方Templates选择一个示例": "Enter code on the left to render automatically, or choose a template above.",
    "扫码输入": "Scan input", "按当前值的绝对值计算 bit 长度、字节占用与 2 的幂判断。": "Calculates bit length, byte usage, and powers of two from the absolute value.", "联系": "Contact", "或": "or", "绕 Z 轴": "around the Z axis", "绕 X 轴": "around the X axis", "绕 Y 轴": "around the Y axis", "手机模型随设备实时转动；指南针优先使用 iOS 罗盘数据（webkitCompassHeading），否则以 360-alpha 近似。": "The phone model rotates with the device. The compass prefers iOS webkitCompassHeading and otherwise approximates 360 - alpha.", "含重力": "Including gravity", "不含重力": "Excluding gravity", "模长": "magnitude", "条形图为含重力加速度，量程 -20~20 m/s²。设备静止平放时模长约等于重力加速度 9.8 m/s²。": "The bars show acceleration including gravity, in a -20 to 20 m/s² range. A flat device is close to 9.8 m/s².", "陀螺仪角速度，量程 -360~360 °/s，快速转动手机可以看到条形图摆动。": "Gyroscope angular velocity is shown in a -360 to 360 °/s range; rotate the phone to see the bars move.", "未检测到运动传感器": "No motion sensor detected", "当前设备没有可用的运动传感器，建议用手机打开本页。": "This device has no available motion sensors. Open this page on a phone.",
    "方言": "Dialect", "标准 SQL": "Standard SQL", "关键字": "Keywords", "保持原样": "Preserve", "移除 &lt;title&gt;/&lt;desc&gt;": "Remove &lt;title&gt;/&lt;desc&gt;", "小数精度": "Decimal precision", "棋盘": "Checkerboard", "白底": "White background", "黑底": "Black background", "输入（每行一条）": "Input (one per line)", "用结果替换输入": "Replace input with result", "一二三四五六日": "Mon Tue Wed Thu Fri Sat Sun", "已添加的城市保存在本机浏览器，下次打开自动恢复。": "Added cities are saved in this browser and restored next time.", "工作时间": "Working hours", "边缘": "Edge", "休息时间": "Off hours", "24 小时对照": "24-hour comparison", "格内数字为该城市当地小时，列按Base city 0-23 时排列，蓝框为当前选中小时": "Each cell shows the local hour; columns follow the base city from 0 to 23, and the blue outline marks the selected hour.", "当前指针属性": "Current pointer properties", "压力": "pressure", "倾角": "tilt", "旋转": "twist", "接触面积": "contact area", "触控笔调试：压感级别、倾角与笔身旋转在此实时更新。": "Stylus debugging: pressure, tilt, and barrel rotation update here in real time.", "这段里藏了一个零宽空格": "this string contains a zero-width space", "字符明细": "Character details", "cm": "cm", "毫米": "millimeters", "厘米": "centimeters", "四分之一毫米": "quarter-millimeters", "英寸": "inches", "派卡": "picas", "点": "points", "绝对": "Absolute", "相对": "Relative", "描述": "Description", "可视化": "Visualization", "计算值": "Calculated value", "单位量": "unit value", "约略": "approximately", "清新绿": "Fresh green", "暖阳橙": "Warm orange", "紫罗兰": "Violet", "极简黑": "Minimal black", "主色": "Primary color", "字号": "Font size", "Mac 风格代码块": "Mac-style code block", "首行缩进": "First-line indentation", "外链转脚注": "Convert external links to footnotes", "Preview（即公众号粘贴效果）": "Preview (as pasted into a publisher)", "尺寸": "size", "网络": "Network", "连接": "connection", "电池": "Battery", "索引": "index", "案例": "Example", "拖放": "drag and drop", "上传": "upload", "示意条": "illustration bar", "各列出": "shows", "每": "each",
    "对象": "Subject", "读": "Read", "写": "Write", "执行": "Execute", "纯本地计算，八进制支持 3 位（755）或 4 位带特殊位（4755）。": "All calculations run locally. Octal supports 3 digits (755) or 4 digits with special bits (4755).", "工作日 9 点": "Business days at 9:00",
    "各列出 1 单位量的示意条与约略像素；ex、ch 等为浏览器内估算。": "Each row shows one unit with an illustration bar and approximate pixels; ex and ch are browser estimates.", "点 (1pt = 1/72in)": "points (1pt = 1/72in)", "像素 (相对于设备)": "pixels (relative to the device)", "相对于元素字体大小": "relative to the element font size", "相对于根元素字体大小": "relative to the root element font size", "相对于字符 \"x\" 的高度": "relative to the height of character \"x\"", "相对于字符 \"0\" 的宽度": "relative to the width of character \"0\"", "视口宽度的 1%": "1% of viewport width", "视口高度的 1%": "1% of viewport height", "视口较小尺寸的 1%": "1% of the smaller viewport dimension", "视口较大尺寸的 1%": "1% of the larger viewport dimension", "相对于父元素 (通常宽度)": "relative to the parent element (usually width)", "相对于大写字母高度": "relative to capital-letter height", "相对于表意字符宽度": "relative to ideographic-character width", "相对于自身行高": "relative to its own line height", "相对于根元素行高": "relative to the root element line height", "相对于视口内联尺寸": "relative to viewport inline size", "相对于视口块级尺寸": "relative to viewport block size",
    "通过 CSS env(safe-area-inset-*) 探测，非全面屏设备通常为 0px。": "Detected with CSS env(safe-area-inset-*); it is usually 0px on devices without a display cutout.", "关键点：": "Key points: ", "中设置": "set in", "与": "and", "必须": "must", "才能成为放置目标": "to become a drop target", "核心是": "It", "计算光标相对每个兄弟元素的位置": "calculates the pointer position relative to each sibling", "配合": "uses", "排除自身": "to exclude itself", "在": "in", "实时": "live", "的读取与展示": "to read and display", "（不会上传到服务器，仅本地显示）。": "(files are not uploaded and are displayed locally only).",
    "版权": "Copyright", "共 ": "Total ", "最大边长（不缩放）": "Maximum edge (no resize)", "快捷键：Ctrl + Enter 美化当前输入 · 输入自动保存至本地，刷新不丢失。": "Shortcut: Ctrl + Enter formats the current input · input is saved locally and survives refresh.", "2048 位": "2048 bits", "3072 位": "3072 bits", "4096 位": "4096 bits", "预览（即公众号粘贴效果）": "Preview (as pasted into a publisher)",
    "A[开始] --> B[结束]": "A[Start] --> B[End]", "在左侧输入代码后自动渲染": "Enter code on the left to render automatically", "基于 mermaid.js，支持": "Built on mermaid.js. Supports ", "等。": ", and more.", "立即渲染": "render now", "滚轮缩放预览": "mouse-wheel zoom", "拖拽平移": "drag to pan", "UUID v4": "UUID v4", "令牌": "Token", "自定义字符集": "Custom character set", "或 hello@zktool.dev": "or hello@zktool.dev", "测试示例清空": "Test Example Clear", "合加速度模长": "Total acceleration magnitude", "1 位": "1 digit", "2 位": "2 digits", "3 位": "3 digits", "周一二三四五六日": "Mon Tue Wed Thu Fri Sat Sun", "格内数字为该城市当地小时，列按基准城市 0-23 时排列，蓝框为当前选中小时": "Each cell shows the local hour; columns follow the base city from 0 to 23, and the blue outline marks the selected hour."
};

const COMMON_SCRIPT_TEXT_EN = {
    "请先输入内容": "Enter content first", "请输入密码": "Enter a password", "加密中（PBKDF2 派生密钥需片刻）...": "Encrypting (PBKDF2 key derivation may take a moment)...", "加密完成（": "Encryption complete (", " 字节密文）": " ciphertext bytes)", "加密失败：": "Encryption failed: ", "格式不正确：应以 ": "Invalid format: it must start with ", " 开头（仅支持本工具加密的内容）": " (only content encrypted by this tool is supported)", "解密失败：密文 Base64 不完整或已损坏": "Decryption failed: the Base64 ciphertext is incomplete or corrupted", "解密中...": "Decrypting...", "解密完成": "Decryption complete", "解密失败：密码错误或数据已损坏": "Decryption failed: incorrect password or corrupted data", "已清空": "Cleared", "结果已复制": "Result copied", "复制失败，请手动选择复制": "Copy failed. Please select and copy manually.",
    "字节不是有效 UTF-8": "The bytes are not valid UTF-8", "不是有效的 Hex 字符串": "Not a valid Hex string", "未识别到 \\u 转义序列": "No \\u escape sequence found", "转换失败：": "Conversion failed: ", "Base64 编码完成": "Base64 encoding complete", "Base64 解码完成": "Base64 decoding complete", "Hex 转换完成": "Hex conversion complete", "Hex 解码完成": "Hex decoding complete", "Unicode escape 转换完成": "Unicode escape conversion complete", "Unicode 解码完成": "Unicode decoding complete", "字符 ": "Characters ", "字节 ": "Bytes ", "结果 ": "Result ",
    "字段超出范围：": "Field is out of range: ", "请使用 5 字段 Cron，例如 */5 * * * *": "Use a five-field Cron expression, for example */5 * * * *", "未来 5 年内没有匹配": "No matching run time within the next five years", "解析成功": "Parsed successfully", "已复制": "Copied", "复制失败，请手动复制": "Copy failed. Please copy manually.",
    "CSV 转换要求输入为对象数组，例如 [{\"a\":1},{\"a\":2}]": "CSV conversion requires an array of objects, for example [{\"a\":1},{\"a\":2}]", "JSON 解析失败：": "JSON parse failed: ", " 转换完成": " conversion complete", "结果为空，无法下载": "The result is empty and cannot be downloaded", "已下载 ": "Downloaded ",
    "字符集不能为空": "The character set cannot be empty", "极强": "Very strong", "强": "Strong", "中等": "Medium", "弱": "Weak", "模式 ": "Mode ", "熵 ": "Entropy ", "已生成 ": "Generated ", " 条": " items",
    "请选择图片文件": "Choose an image file", "已载入，点击「压缩转换」": "Loaded. Click Compress and convert.", "图片解码失败，格式可能不受支持": "Image decoding failed; the format may not be supported", "转换中...": "Converting...", "浏览器不支持该输出格式": "This browser does not support the selected output format", "转换完成": "Conversion complete", "体积减少 ": "Size reduced by ", "体积增加 ": "Size increased by ", "（试试降低质量或换 WebP）": " (try lowering quality or switching to WebP)",
    "格式化完成": "Formatting complete", "格式化失败：": "Formatting failed: ", "sql-formatter 库未加载": "The sql-formatter library is not loaded", "已压缩为单行（注释已移除）": "Minified to one line (comments removed)",
    "无匹配": "No matches", "匹配 ": "Matched ", " 处": " occurrences", "运行中...": "Running...", "执行超时（可能存在灾难性回溯），已中止": "Execution timed out (possible catastrophic backtracking); aborted",
    "YAML 转 JSON 完成": "YAML to JSON complete", "JSON 转 YAML 完成": "JSON to YAML complete", "请先输入 YAML 内容": "Enter YAML content first", "YAML 语法正确": "YAML syntax is valid", "YAML 语法错误：": "YAML syntax error: ", "校验通过，顶层为 ": "Validation passed; top level is ", "校验失败：": "Validation failed: ",
    "两段 JSON 完全一致 ✓": "The two JSON documents are identical ✓", "新增 ": "Added ", "删除 ": "Removed ", "修改 ": "Modified ", "相同 ": "Same ", "无差异": "No differences", "旧 JSON（左侧）": "Old JSON (left)", "新 JSON（右侧）": "New JSON (right)",
    "没有可复制的内容": "Nothing to copy", "已按 ": "Parsed as ", " 进制解析，其余各栏已更新。": "; other fields were updated.", "Custom base需在 2-36 之间。": "Custom base must be between 2 and 36.", "Custom base已切换为 Base ": "Custom base switched to Base ", "负数": "Negative number",
    "Base time无效，请重新选择日期时间。": "Invalid base time; choose the date and time again.", "已对照 ": "Compared ", " 个城市，基准：": " cities. Base: ", "所有城市都已添加。": "All cities have been added.", "已添加 ": "Added ", "。": ".",
    "请选择有效的开始和结束日期。": "Choose valid start and end dates.", "输入有效的 CIDR 后在这里显示结果。": "Enter a valid CIDR to see the result here.", "IP 格式不正确：应为点分十进制": "Invalid IP format: use dotted decimal notation",
    "未识别到 URL，请检查命令是否完整": "No URL found; check that the command is complete", "解析完成，未识别的参数：": "Parsed with unrecognized options: ", "概览": "Overview", "Python 代码": "Python code"
};

// Small fragments that commonly appear next to already-translated labels.
// Keeping them here prevents mixed Chinese/English controls when the source
// page combines a label, an example, and an action in one attribute/string.
const COMMON_TEXT_BASE_EN = { ...COMMON_TEXT_EN };
Object.assign(COMMON_TEXT_EN, {
    "源区域 (source)": "Source area", "目标区域 (target)": "Target area", "本页二维码": "QR code for this page",
    "当前时间": "Current time", "批量转换": "Batch conversion", "日期 → 时间戳": "Date → timestamp", "时区对照": "Time-zone comparison", "时间戳": "Timestamp", "智能识别": "Auto detect",
    "选择或拖入图片": "Choose or drop an image", "选择或拖入文件": "Choose or drop a file", "选择或拖入照片": "Choose or drop a photo", "选择或拖入二维码": "Choose or drop a QR code",
    "转换结果预览": "Converted result preview", "最大边长": "Maximum edge", "不缩放": "No resize", "粘贴 SVG source，或直接把 .svg File拖到这里...": "Paste SVG source or drop an .svg file here...",
    "Apply当前Example": "Apply current example", "CSS LengthUnit探索": "CSS length unit explorer", "本地live换算": "Local live conversion", "仅供学习参考": "For learning purposes only", "我的Blog": "My blog",
    "如 ": "e.g. ", "在此按": "Enter ", "或查看": "or view ", "回车": "Enter", "Copy": "Copy", "Result": "Result", "Custom baseInput": "custom-base input", "Custom base结果": "Custom-base result",
    "选择Algorithm后点击「Generate key pair」。": "Choose an algorithm and click Generate key pair.", "选择Example模板": "Choose an example template", "选择 Mermaid Theme": "Choose a Mermaid theme", "代码编辑": "Code editor", "图表Preview": "Chart preview", "重置缩放": "Reset zoom",
    "在此Input Mermaid code，例如：": "Enter Mermaid code here, for example:", "也可以从上方Templates选择一个Example": "or choose an example from the Templates above", "基于": "Built on ", "支持": "Supports ", "模板": "Templates", "选择一个": "choose one", "图表": "Chart",
    "基础": "Basic", "解析器": "Parser", "输入为空": "Input is empty", "解析完成": "Parsed", "解析失败": "Parse failed", "格式化失败": "Formatting failed", "库未加载": "Library not loaded",
    "正则": "Regex", "测试": "Test", "InputText": "Input text", "File": "file", "Certificate input": "certificate input", "Octal权限": "octal permissions", "点击Copy": "Click to copy", "读": "Read", "写": "Write", "Execute": "Execute",
    "所有者读": "Owner read", "所有者写": "Owner write", "组读": "Group read", "组写": "Group write", "其他人读": "Others read", "其他人写": "Others write", "JSON Indentation空格数": "JSON indentation spaces",
    "Input YAML 或 JSON": "Input YAML or JSON", "粘贴 YAML 或 JSON...": "Paste YAML or JSON...", "粘贴要检查的Text": "Text to inspect", "粘贴要检查的Text...": "Text to inspect...", "Search：": "Search: ",
    "SearchStatus codes或 MIME types": "Search status codes or MIME types", "粘贴 URL、查询characters串或普通Text": "Paste a URL, query string, or plain text", "查询characters串": "query string", "普通Text": "plain text",
    "PEM Certificate input": "PEM certificate input", "粘贴 PEM 证书（可含多张组成证书链）：": "Paste PEM certificates (a chain is supported):", "JWT Token Input": "JWT token input", "Encrypt：Input任意plaintext": "Encrypt: enter any plaintext", "Decrypt：粘贴 zkaes1: 开头的ciphertext...": "Decrypt: paste ciphertext starting with zkaes1:...",
    "Base date时间": "Base date and time", "选择要添加的城市": "Choose a city to add", "InputText，或在下方拖入File...": "Input text, or drop a file below...", "CIDR 网段": "CIDR network", "待判断的 IP 地址": "IP address to check",
    "输入文本，或在下方拖入文件...": "Enter text, or drop a file below...", "已添加的城市保存在本机浏览器，下次打开自动恢复。": "Added cities are saved in this browser and restored next time.",
    "服务器": "server", "本地": "local", "点击复制": "Click to copy", "选择或拖入": "Choose or drop", "复制": "Copy", "粘贴": "Paste", "日期": "Date", "时间": "Time", "地址": "address", "网段": "network",
    "粘贴 SVG 源码，或直接把 .svg 文件拖到这里...": "Paste SVG source or drop an .svg file here...", "CSS 长度单位探索 · 本地实时换算 · 仅供学习参考": "CSS length unit explorer · live local conversion · for learning purposes only", "我的 Blog": "My blog",
    "2^8 = 256，回车复制": "2^8 = 256, press Enter to copy", "2^10 = 1024，回车复制": "2^10 = 1024, press Enter to copy", "2^16 = 65536，回车复制": "2^16 = 65536, press Enter to copy", "2^32 = 4294967296，回车复制": "2^32 = 4294967296, press Enter to copy", "2^64 = 18446744073709551616，回车复制": "2^64 = 18446744073709551616, press Enter to copy", "0xff = 255，回车复制": "0xff = 255, press Enter to copy", "0xffff = 65535，回车复制": "0xffff = 65535, press Enter to copy", "0x7fffffff = 2147483647，回车复制": "0x7fffffff = 2147483647, press Enter to copy", "0o777 = 511，回车复制": "0o777 = 511, press Enter to copy",
    "选择示例模板": "Choose an example template", "选择 Mermaid 主题": "Choose a Mermaid theme", "在此输入 Mermaid 代码，例如：": "Enter Mermaid code here, for example:", "也可以从上方模板选择一个示例": "or choose an example from the Templates above", "Mermaid 代码": "Mermaid code", "Mermaid 代码输入": "Mermaid code input",
    "plaintext 或 ciphertext": "plaintext or ciphertext", "压缩转换": "Compress and convert", "下载结果": "Download result", "全局肤色": "Global skin tone", "图片预览": "Image preview", "自定义主题色": "Custom theme color", "正文大小": "Body font size",
    "其他人执行": "Others execute", "所有者执行": "Owner execute", "组执行": "Group execute", "Octal 权限": "Octal permissions", "JSON 缩进空格数": "JSON indentation spaces", "Input Text（每行一条）": "Input text (one per line)", "粘贴要检查的文本": "Text to inspect",
    "搜索状态码或 MIME 类型": "Search status codes or MIME types", "搜索：如 404 / 缓存 / json / 图片...": "Search: e.g. 404 / cache / json / image...", "粘贴 URL、查询字符串或普通文本": "Paste a URL, query string, or plain text", "JWT（xxx.yyy.zzz）": "JWT (xxx.yyy.zzz)", "留空则跳过验签；出于安全考虑，密钥不参与草稿保存与分享链接": "Leave blank to skip signature verification; for security, the key is excluded from drafts and share links"
});

const translationConflicts = Object.keys(COMMON_TEXT_EN).filter((key) =>
    Object.prototype.hasOwnProperty.call(COMMON_TEXT_BASE_EN, key) &&
    COMMON_TEXT_BASE_EN[key] !== COMMON_TEXT_EN[key]
);
if (translationConflicts.length) {
    throw new Error(`Conflicting English translation keys: ${translationConflicts.join(", ")}`);
}

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
        .filter(([from]) => from.length >= 4)
        .sort((a, b) => b[0].length - a[0].length);
    const translateFragment = (text) => {
        const trimmed = text.trim();
        if (COMMON_TEXT_EN[trimmed]) return text.replace(trimmed, COMMON_TEXT_EN[trimmed]);
        return entries.reduce((value, [from, to]) => value.split(from).join(to), text);
    };
    html = html.replace(/(<textarea\b[^>]*>)([\s\S]*?)(<\/textarea>)/gi, (match, open, text, close) => open + translateFragment(text) + close);
    html = html.replace(/>([^<>]+)</g, (match, text) => {
        const translated = translateFragment(text);
        return translated === text ? match : ">" + translated + "<";
    });
    html = html.replace(/\b(placeholder|aria-label|title|data-label|data-group)="([^"]*)"/g, (match, attr, value) => {
        const translated = translateFragment(value);
        return translated === value ? match : `${attr}="${translated}"`;
    });
    return html.replace(/@@ZK_PROTECTED_(\d+)@@/g, (match, index) => protectedParts[Number(index)]);
}

function translateScriptText(html, map) {
    const entries = Object.entries(map).sort(([a], [b]) => b.length - a.length);
    return html.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (whole, open, body, close) => {
        const translated = entries.reduce((value, [from, to]) => value.split(from).join(to), body);
        return open + translated + close;
    });
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
    html = `<!-- Generated from /${path}; edit the Chinese source page and src/data/i18n.js instead. -->\n` + html;
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
    const scriptText = { ...COMMON_SCRIPT_TEXT_EN, ...(SCRIPT_TEXT_EN[tool.path] || {}) };
    html = translateScriptText(html, scriptText);
    // Keep only the generated application JSON-LD. The source breadcrumb JSON-LD
    // contains Chinese labels and would otherwise leak into the English payload.
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?BreadcrumbList[\s\S]*?<\/script>/g, "");
    html = html.replace(/<!--[\s\S]*?-->/g, "");
    html = html.replace(/(["'])\.\.\/\.\.\/(assets\/|favicon\.ico)/g, "$1../../../$2");
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

function verifyI18nCoverage() {
    const errors = [];
    for (const tool of tools) {
        const translated = i18n.tools[tool.path];
        if (!Array.isArray(translated) || translated.length !== 3 || translated.some((text) => !String(text).trim())) errors.push(`Missing English copy: ${tool.path}`);
    }
    for (const group of domains) if (!i18n.groups[group.key]) errors.push(`Missing English group: ${group.key}`);
    if (errors.length) throw new Error(errors.join("\n"));
}

verifyI18nCoverage();
await copyFile(resolve(ROOT, "src/data/registry.js"), resolve(ROOT, "public/assets/registry.js"));
await copyFile(resolve(ROOT, "src/data/i18n.js"), resolve(ROOT, "public/assets/i18n.js"));
for (const tool of tools) {
    const source = resolve(ROOT, "src", tool.path, "index.html");
    const target = resolve(ROOT, "src/locales/en", tool.path, "index.html");
    const english = localizeEnglishPage(await readFile(source, "utf8"), tool, tool.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, english, "utf8");
}
console.log(`Generated ${tools.length} English tool pages from src/tools/.`);
