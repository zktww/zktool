# zktool

个人 **小工具** 仓库：收纳一批静态 HTML 实用工具页，双击本地打开或托管到静态站点即可使用；同时附带少量 Demo / 实验页作为副产物。

## 目录约定

- **`tools/`** — 主角，日常开发辅助的小工具页；每模块独立文件夹，入口为 **`index.html`**。
- **`demos/`** — 附属，交互探索、演示稿等偏展示向页面；同样每模块一个子文件夹 + **`index.html`**。
- 根目录保留 **`index.html`** 总索引与 **`favicon.ico`**。

## 快速开始

- 在资源管理器中打开本目录，双击 **`index.html`** 进入索引页。
- 或用任意静态服务器（例如 `npx serve .`）避免部分环境下 `file://` 的限制。

## 工具索引

| 入口 | 说明 |
|------|------|
| [tools/timestamp-converter/](tools/timestamp-converter/) | 时间转换：时间戳与日期时间互转（秒/毫秒、UTC、复制） |
| [tools/json-formatter/](tools/json-formatter/) | JSON 格式化与校验：美化、压缩、树形视图与统计 |
| [tools/emoji-tool/](tools/emoji-tool/) | Emoji 符号库：分类浏览、CLDR 中文名、搜索与一键复制 |
| [tools/mermaid-editor/](tools/mermaid-editor/) | Mermaid 图表实时编辑与预览，支持导出 PNG / SVG |
| [tools/url-codec/](tools/url-codec/) | URL 编码与参数解析：编解码、查询参数解析与对象互转 |
| [tools/base64-converter/](tools/base64-converter/) | Base64 编码转换：Base64、Hex 与 Unicode escape 转换 |
| [tools/regex-tester/](tools/regex-tester/) | 正则表达式测试：匹配高亮、捕获组与替换预览 |
| [tools/random-generator/](tools/random-generator/) | 随机 ID 生成器：UUID v4、随机密码、Token 与批量字符串 |
| [tools/cron-tool/](tools/cron-tool/) | Cron 表达式解析：字段解释与未来执行时间预览 |
| [tools/color-tool/](tools/color-tool/) | 颜色转换与对比度：格式互转、色阶生成与 WCAG 检查 |
| [tools/text-diff/](tools/text-diff/) | 文本差异比较：左右文本行级差异对比 |
| [二维码生成器](https://qc.zktww.cn/) | 外部工具：二维码生成服务 |

## 工具说明

### 时间转换（`tools/timestamp-converter/`）

与索引页同系的浅色界面：Unix 时间戳与可读日期互转，秒/毫秒自动识别、当前时间拆解、本地与 UTC ISO 输出、时区对照、批量转换及复制；支持文本解析与自定义日期时间选择器。

### JSON 格式化与校验（`tools/json-formatter/`）

双栏输入与结果区：基于原生 `JSON.parse` 校验，一键美化或压缩；可选 2/4 空格或 Tab 缩进、对象键排序；支持复制输入/结果与 `Ctrl+Enter` 快捷美化。

### Emoji 符号库（`tools/emoji-tool/`）

从 CDN 加载 `unicode-emoji-json` 分组列表，并用 Unicode CLDR `cldr-annotations-modern` 的 `annotations/zh` 提供中文名称与关键词（搜索支持中文）；无匹配时回退英文。失败时回退内置示例；含收藏、最近使用、肤色切换与详情弹层。

### Mermaid 图表编辑器（`tools/mermaid-editor/`）

左右分栏布局，移动端上下分栏：左侧 textarea 编辑 Mermaid 代码，右侧实时渲染图表；输入防抖自动刷新。内置流程图、时序图、类图、状态图、ER 图、甘特图、饼图、思维导图、Git 图等中文示例模板；支持复制代码、分享链接、导出 SVG 与高清 PNG。基于 CDN 加载 `mermaid@11`。

### URL 编码与参数解析（`tools/url-codec/`）

支持 `encodeURIComponent` / `decodeURIComponent`、完整 URL 查询参数解析、`URLSearchParams` 参数表展示，以及参数对象 JSON 输出与复制。

### Base64 编码转换（`tools/base64-converter/`）

基于 `TextEncoder` / `TextDecoder` 做 UTF-8 安全的 Base64 编码解码；同时提供 Hex、Unicode escape 转换与字符/字节统计。

### 正则表达式测试（`tools/regex-tester/`）

运行 JavaScript `RegExp`，实时显示匹配高亮、捕获组列表与替换结果；支持 flags 和替换模板调试。

### 随机 ID 生成器（`tools/random-generator/`）

基于浏览器 Crypto API 生成 UUID v4、随机密码、Token、数字串和自定义字符集字符串，支持批量输出与复制。

### Cron 表达式解析（`tools/cron-tool/`）

解析常见 Linux crontab 风格 5 字段表达式（分钟、小时、日期、月份、星期），展示字段展开结果并预览未来 10 次执行时间。

### 颜色转换与对比度（`tools/color-tool/`）

支持 HEX、RGB、HSL 互转，生成浅深色阶，并计算前景色与背景色的 WCAG 对比度等级。

### 文本差异比较（`tools/text-diff/`）

左右输入两段文本，基于 LCS 做行级差异对比，高亮新增、删除和未变内容，适合快速比较配置、日志和接口响应片段。

### 二维码生成器（外部工具）

跳转到 [https://qc.zktww.cn/](https://qc.zktww.cn/)，用于快速生成二维码。

## Demo 附录

| 入口 | 说明 |
|------|------|
| [demos/css-length-unit/](demos/css-length-unit/) | CSS 长度单位探索器（暖色编辑风交互页） |
| [demos/drag-and-drop/](demos/drag-and-drop/) | HTML5 拖拽 API 三合一演示（基础/排序/文件上传） |
| [demos/presentation/](demos/presentation/) | 「架构师的成长」全屏 HTML 演示文稿 |
| [demos/elephant-alpha/](demos/elephant-alpha/) | 「象 · 现形记」9:16 抖音风竖屏叙事长图 |

- **CSS 长度单位探索器**：单位演示、对比与对照表，覆盖 px、rem、vw、vmin、lh 等绝对/相对单位，可调基准字号与容器宽度观察差异。
- **HTML5 拖拽 API 演示**：原生 Drag and Drop API 的三个递进案例——源/目标间基础拖放、`getBoundingClientRect` 实时排序、`DataTransfer.files` 文件读取；右下角固定日志面板实时打印事件流。
- **演示文稿**：深空主题、视口适配的全屏幻灯片，适合键盘翻页与投屏分享。
- **象 · 现形记**：9:16 竖屏 14 页叙事，霓虹渐变 + 抖音 HUD 风格，追踪 OpenRouter 隐身代号 `elephant-alpha` 揭晓为蚂蚁 `inclusionai/ling-2.6-flash` 的全过程；支持上下滑动 / 键盘翻页 / 侧边圆点导航。

## 维护习惯

新增页面时：

1. 工具类放 **`tools/<模块名>/`**；演示/实验类放 **`demos/<模块名>/`**，入口命名为 **`index.html`**（模块内还可放专属脚本、样式或数据文件）；
2. 在根目录 **`index.html`** 对应分区增加一条卡片链接；
3. 在本 README 的表格与说明中各补一行（按需详写）。

---

*非正式产品代码，以自用与展示为主。*
