# zktool

个人 **小工具** 仓库：收纳一批静态 HTML 实用工具页，双击本地打开或托管到静态站点即可使用；同时附带少量 Demo / 实验页作为副产物。

## 目录约定

- **`tools/`** — 主角，日常开发辅助的小工具页；每模块独立文件夹，入口为 **`index.html`**。
- **`demos/`** — 附属，交互探索、演示稿等偏展示向页面；同样每模块一个子文件夹 + **`index.html`**。
- **`assets/`** — 公共资源：`tokens.css`（全站设计变量，含暗色模式与 `data-theme` 手动覆盖）、`tool-shell.css`（工具页公共骨架：reset/背景/返回条/标题/SEO 说明区）、`tool-page.css`（工具页公共组件：面板/表单/按钮等，内部引用 shell）、`theme.js`（主题三态切换：跟随系统/浅/深，存 localStorage，并注入顶部操作按钮）、`toolkit.js`（工具页通用能力：textarea 草稿自动保存、`#zk=` URL 状态分享、工具间「发送到…」管道、PWA share_target 接收；自带保存逻辑的页面加 `<body data-zk-manual>` 退出）、`clipboard.js`（复制封装）、`registry.js`（工具注册表，首页卡片/命令面板/搜索的唯一数据源，含分域 `group` 字段与拼音首字母 kw）、`palette.js`（Ctrl+K 命令面板：最近使用置顶、动作条目、拼音搜索；工具页顶部另有搜索按钮供触屏呼出）、`vendor/`（第三方库本地副本：sql-formatter、js-yaml、marked、DOMPurify、qrcode-generator、jsQR、exifr、mermaid）。
- **`scripts/`** — 构建脚本：`gen-site.mjs`（零依赖 Node 脚本，从 `registry.js` 生成首页卡片与 JSON-LD、`sitemap.xml`、`llms.txt`、`sw.js` 预缓存列表与缓存版本，并给全站页面的本地资源引用盖 `?v=<内容哈希>` 版本戳——发布后浏览器/CDN 的 HTTP 缓存自动失效；`--check` 校验漂移，CI 强制）。
- 根目录保留 **`index.html`** 总索引、**`favicon.ico`**、**`manifest.webmanifest`** 与 **`sw.js`**（PWA：托管到静态站点后支持离线使用；主页卡片支持收藏与最近使用置顶，数据存 localStorage），以及 **`404.html`**、**`sitemap.xml`**、**`robots.txt`**。
- 任意页面按 **Ctrl+K / Cmd+K** 呼出命令面板，搜索并跳转到其他工具。

## 快速开始

- 在资源管理器中打开本目录，双击 **`index.html`** 进入索引页。
- 或用任意静态服务器（例如 `npx serve .`）避免部分环境下 `file://` 的限制。

## 工具索引

| 入口 | 说明 |
|------|------|
<!-- gen:readme-tools -->
| [tools/timestamp-converter/](tools/timestamp-converter/) | 时间转换：Unix 时间与日期互转，秒/毫秒自动识别、批量转换、多格式输出与时区对照 |
| [tools/json-formatter/](tools/json-formatter/) | JSON 格式化与校验：校验、美化、压缩 JSON，语法高亮、树形视图、错误定位、转义与统计信息 |
| [tools/emoji-tool/](tools/emoji-tool/) | Emoji 符号库：分类浏览与中英文搜索，收藏、最近使用、肤色切换与一键复制 |
| [tools/mermaid-editor/](tools/mermaid-editor/) | Mermaid 图表编辑器：实时编辑渲染流程图、时序图等，模板库、缩放平移、分享链接与导出 PNG / SVG |
| [tools/url-codec/](tools/url-codec/) | URL 编码与参数解析：URL encode/decode、查询参数解析、参数对象互转，适合排查接口与分享链接 |
| [tools/base64-converter/](tools/base64-converter/) | Base64 编码转换：UTF-8 文本 Base64 编码/解码，并支持 Hex、Unicode escape 与字节统计 |
| [tools/regex-tester/](tools/regex-tester/) | 正则表达式测试：实时测试 JavaScript 正则，展示匹配高亮、捕获组和替换结果 |
| [tools/random-generator/](tools/random-generator/) | 随机 ID 生成器：生成 UUID v4、随机密码、Token、数字串与批量自定义随机字符串 |
| [tools/cron-tool/](tools/cron-tool/) | Cron 表达式解析：解析 5 字段 Cron，展示字段含义，并预览未来 10 次执行时间 |
| [tools/color-tool/](tools/color-tool/) | 颜色转换与对比度：HEX / RGB / HSL 互转，生成色阶，并检查前景与背景的 WCAG 对比度 |
| [tools/text-diff/](tools/text-diff/) | 文本差异比较：左右文本行级对比，高亮新增、删除与未变内容，适合配置和日志片段 |
| [tools/hash-tool/](tools/hash-tool/) | Hash 计算器：计算文本或文件的 MD5 / SHA-1 / SHA-256 / SHA-512，支持拖拽文件 |
| [tools/jwt-decoder/](tools/jwt-decoder/) | JWT 解析器：本地解码 JWT 的 Header 与 Payload，标注过期状态，支持 HS / RS / ES 验签 |
| [tools/json-converter/](tools/json-converter/) | JSON 格式互转：JSON 转 YAML、TypeScript interface、Go struct 与 CSV，写配置定类型一步到位 |
| [tools/text-case/](tools/text-case/) | 文本命名与行处理：camelCase / snake_case 等命名互转，行去重、排序、去空行与统计 |
| [tools/image-compressor/](tools/image-compressor/) | 图片压缩与转换：本地压缩并转换 WebP / JPEG / PNG，调质量看体积对比，不上传服务器 |
| [tools/http-reference/](tools/http-reference/) | HTTP 状态码与 MIME 速查：常用状态码含义与 MIME 类型对照，搜索过滤、点击复制 |
| [tools/unicode-inspector/](tools/unicode-inspector/) | Unicode 字符检查器：逐字符查看码点与编码，揪出零宽字符、同形字等看不见的坑 |
| [tools/sql-formatter/](tools/sql-formatter/) | SQL 格式化：格式化或压缩 SQL，支持 MySQL、PostgreSQL 等常见方言与关键字风格 |
| [二维码生成器](https://qc.zktww.cn/) | 外部工具：快速生成二维码，支持跳转到独立二维码生成服务，适合链接、文本和分享场景。 |
| [tools/yaml-converter/](tools/yaml-converter/) | YAML 转换与校验：YAML 与 JSON 双向转换、语法校验与错误定位，写配置排查缩进问题 |
| [tools/curl-parser/](tools/curl-parser/) | cURL 命令解析：解析 cURL 命令为结构化请求，生成 fetch 与 Python requests 代码 |
| [tools/html-entities/](tools/html-entities/) | HTML 实体编解码：HTML 特殊字符与命名/十进制/十六进制实体互转，附常用实体速查表 |
| [tools/keypair-generator/](tools/keypair-generator/) | 密钥对生成器：浏览器本地生成 RSA / ECDSA / Ed25519 密钥对，导出 PEM 与 JWK |
| [tools/markdown-preview/](tools/markdown-preview/) | Markdown 排版预览：Markdown 实时渲染，多套公众号主题与自定义主色，全屏编辑，一键复制到公众号 |
| [tools/timezone-planner/](tools/timezone-planner/) | 时区会议规划：多城市时间对照与工作时段标注，跨时区约会议不再算错时间 |
| [tools/chmod-calculator/](tools/chmod-calculator/) | chmod 权限计算器：Linux 文件权限三向换算：勾选、八进制与符号表示实时同步 |
| [tools/svg-optimizer/](tools/svg-optimizer/) | SVG 优化与预览：SVG 本地优化压缩、预览与转 data URI，看体积对比 |
| [tools/qr-scanner/](tools/qr-scanner/) | 二维码扫描器：摄像头实时扫码或识别图片中的二维码，本地解码不上传 |
| [tools/exif-viewer/](tools/exif-viewer/) | 图片 EXIF 查看清除：查看照片拍摄时间、设备与 GPS 定位等元数据，一键抹除保护隐私 |
| [tools/device-info/](tools/device-info/) | 设备信息面板：屏幕分辨率、DPR、视口、safe-area、UA 与网络状态一屏速查 |
| [tools/touch-tester/](tools/touch-tester/) | 触摸事件测试板：多指触点可视化、滑动轨迹与事件日志，调试触屏交互 |
| [tools/sensor-viewer/](tools/sensor-viewer/) | 传感器查看器：陀螺仪、加速度计与指南针实时数值可视化，需手机访问 |
<!-- /gen:readme-tools -->

## 工具说明

### 时间转换（`tools/timestamp-converter/`）

与索引页同系的浅色界面：Unix 时间戳与可读日期互转，秒/毫秒自动识别、当前时间拆解、本地与 UTC ISO 输出、时区对照、批量转换及复制；支持文本解析与自定义日期时间选择器。

### JSON 格式化与校验（`tools/json-formatter/`）

双栏输入与结果区：基于原生 `JSON.parse` 校验，一键美化或压缩；可选 2/4 空格或 Tab 缩进、对象键排序；支持复制输入/结果与 `Ctrl+Enter` 快捷美化。

### Emoji 符号库（`tools/emoji-tool/`）

本地数据文件（`unicode-emoji-json` 分组列表 + Unicode CLDR `cldr-annotations-modern` 的 `annotations/zh` 中文名称与关键词，加载失败回退 CDN 再回退内置示例）提供分类浏览与中文搜索；无中文名时回退英文。含收藏、最近使用、肤色切换与详情弹层。

### Mermaid 图表编辑器（`tools/mermaid-editor/`）

左右分栏布局，移动端上下分栏：左侧 textarea 编辑 Mermaid 代码，右侧实时渲染图表；输入防抖自动刷新。内置流程图、时序图、类图、状态图、ER 图、甘特图、饼图、思维导图、Git 图等中文示例模板；支持复制代码、分享链接、导出 SVG 与高清 PNG。基于本地 vendor 的 `mermaid@11`（加载失败时回退 CDN）。

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

### Hash 计算器（`tools/hash-tool/`）

计算文本或文件（拖拽/选择）的 MD5、SHA-1、SHA-256、SHA-512 摘要；SHA 系列基于 Web Crypto，MD5 为内置实现，文件不会上传。

### JWT 解析器（`tools/jwt-decoder/`）

本地解码 JWT 的 Header 与 Payload，标注 `exp` / `iat` / `nbf` 的本地时间与过期状态；填入共享密钥或公钥（PEM/JWK）可用 Web Crypto 做 HS / RS / ES 系列本地验签，Token 不离开浏览器。

### JSON 格式互转（`tools/json-converter/`）

把 JSON 转换为 YAML、TypeScript interface、Go struct（含 json tag）或 CSV（要求对象数组），适合写配置、定义类型与导出数据。

### 文本命名与行处理（`tools/text-case/`）

camelCase、PascalCase、snake_case、kebab-case、CONSTANT_CASE 等命名风格互转（多行批量、支持 HTTPResponse 类缩写边界），以及行去重、排序、去空行、倒序与字符/词/行统计；支持「用结果替换输入」叠加操作。

### 图片压缩与转换（`tools/image-compressor/`）

基于 Canvas 在本地压缩图片并转换 WebP / JPEG / PNG，可调质量与最大边长，展示转换前后体积对比；支持拖拽和粘贴图片，不上传服务器。

### HTTP 状态码与 MIME 速查（`tools/http-reference/`）

常用 HTTP 状态码含义（含排查提示）与常用 MIME 类型 / 扩展名对照，双页签切换、关键词过滤、点击条目复制。

### Unicode 字符检查器（`tools/unicode-inspector/`）

逐字符展示码点、UTF-8 / UTF-16 编码与字符类别，高亮零宽字符、控制字符、BOM 等不可见字符并支持一键清除（保留换行和制表符）；适合排查"看起来一样但比对不过"的文本问题。

### SQL 格式化（`tools/sql-formatter/`）

基于本地 vendor 的 [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) 格式化 SQL，支持 MySQL、PostgreSQL、SQLite、T-SQL 等方言与关键字大小写、缩进风格；另提供保留字符串字面量的单行压缩。

### YAML 转换与校验（`tools/yaml-converter/`）

基于本地 vendor 的 js-yaml：YAML ↔ JSON 双向转换（可选缩进）、语法校验与行列级错误定位，输入实时校验，适合排查配置文件缩进与类型问题。

### cURL 命令解析（`tools/curl-parser/`）

粘贴 cURL 命令（支持引号、转义与换行续行），解析为方法 / URL / 查询参数 / Headers / Body 的结构化概览，并生成等价的 fetch 与 Python requests 代码，接口调试转代码一步到位。

### HTML 实体编解码（`tools/html-entities/`）

HTML 特殊字符与实体互转：支持仅必需转义、命名实体优先、十进制与十六进制全量转义四种模式，解码兼容全部实体形式；附常用实体速查表，点击复制。

### 密钥对生成器（`tools/keypair-generator/`）

基于 Web Crypto API 在浏览器本地生成 RSA（2048/3072/4096）、ECDSA（P-256/384/521）与 Ed25519 密钥对，导出 PEM（SPKI/PKCS#8）与 JWK 格式，支持复制与下载 .pem 文件；私钥不离开浏览器。

### Markdown 排版预览（`tools/markdown-preview/`）

基于本地 vendor 的 marked 实时渲染 Markdown，输出经本地 vendor 的 DOMPurify 白名单消毒；内置经典蓝/清新绿/暖阳橙/紫罗兰/极简黑五套内联样式排版主题（自定义主题色、可调字号、Mac 风格代码块、首行缩进、外链转脚注），支持全屏左右分栏编辑（滚动同步、Esc 退出），「复制到公众号」以富文本写入剪贴板、粘贴到微信公众号等编辑器即得预览效果；也可复制 HTML 源码或下载完整页面，附字符/行/词统计。

### 时区会议规划（`tools/timezone-planner/`）

纯 Intl API 实现的多城市时间对照：选基准时间与城市，逐城市显示当地时间、时差与是否处于工作时段（红黄绿标注），另有 24 小时条形对照视图辅助找共同空档；城市列表存 localStorage。

### chmod 权限计算器（`tools/chmod-calculator/`）

Linux 文件权限三向换算：权限勾选矩阵、八进制（含 setuid/setgid/sticky 特殊位）与符号表示（-rwxr-xr-x）实时同步，生成可复制的 chmod 命令；附常用权限速查与风险提示。

### SVG 优化与预览（`tools/svg-optimizer/`）

纯浏览器 SVG 优化：移除注释/元数据/编辑器属性、数字精度压缩与空白折叠，展示优化前后体积对比；支持棋盘格/黑/白背景预览与转 data URI（URL 编码或 base64）。

### 二维码扫描器（`tools/qr-scanner/`）

摄像头实时扫码（优先原生 BarcodeDetector，不支持时回退本地 vendor 的 jsQR）或选择/拖拽/粘贴图片识别，全程本地解码不上传；结果可复制、URL 可直接打开，附会话内扫码历史。PC 无摄像头时展示本页二维码引导手机打开，图片识别仍可用。

### 图片 EXIF 查看清除（`tools/exif-viewer/`）

基于本地 vendor 的 exifr 解析照片元数据：拍摄时间、设备、镜头、曝光参数等分组展示，含 GPS 时红色警示并可跳转地图确认；「清除元数据并下载」经 canvas 重绘导出无 EXIF 副本。全程本地，照片不上传。

### 设备信息面板（`tools/device-info/`）

屏幕分辨率/DPR/物理分辨率、视口与滚动条宽度、safe-area 四边、UA/语言/硬件并发/触点数、深色模式与网络状态、常用 Web API 能力速查；逐行点击复制，支持一键复制全部（贴 bug 报告），旋转与缩放实时刷新。

### 触摸事件测试板（`tools/touch-tester/`）

基于 Pointer Events 的触屏调试板：多指触点彩色圆环（坐标/压力/接触面积）、滑动轨迹绘制、事件日志与指针属性表（含触控笔 tilt/twist），支持全屏测试。桌面无触屏时提示用手机打开（附二维码），鼠标可模拟单指。

### 传感器查看器（`tools/sensor-viewer/`）

陀螺仪（方向 alpha/beta/gamma + 3D 手机模型示意 + 指南针）、加速度计（含重力/线性加速度条形图）与旋转速率实时可视化，显示事件频率；兼容 iOS 13+ 的手势授权流程，无传感器的桌面设备自动提示扫码用手机打开。

### 二维码生成器（外部工具）

跳转到 [https://qc.zktww.cn/](https://qc.zktww.cn/)，用于快速生成二维码。

## Demo 附录

| 入口 | 说明 |
|------|------|
<!-- gen:readme-demos -->
| [demos/css-length-unit/](demos/css-length-unit/) | CSS 长度单位探索器：暖色深色主题下对照 px、rem、vw 等单位，含基准调节、演示条、两两对比与单位表 |
| [demos/drag-and-drop/](demos/drag-and-drop/) | HTML5 拖拽 API 演示：三合一示例：基础拖放、列表排序、文件拖拽上传，附实时事件日志面板辅助理解事件流 |
| [demos/presentation/](demos/presentation/) | 架构师的成长 · 演示文稿：全屏幻灯片式 HTML 演示，深空主题与键盘导航，适合分享或复盘 |
| [demos/elephant-alpha/](demos/elephant-alpha/) | 象 · 现形记：9:16 抖音风竖屏叙事：追踪 OpenRouter 隐身代号 elephant-alpha，揭晓其为蚂蚁 Ling-2.6-flash |
<!-- /gen:readme-demos -->

- **CSS 长度单位探索器**：单位演示、对比与对照表，覆盖 px、rem、vw、vmin、lh 等绝对/相对单位，可调基准字号与容器宽度观察差异。
- **HTML5 拖拽 API 演示**：原生 Drag and Drop API 的三个递进案例——源/目标间基础拖放、`getBoundingClientRect` 实时排序、`DataTransfer.files` 文件读取；右下角固定日志面板实时打印事件流。
- **演示文稿**：深空主题、视口适配的全屏幻灯片，适合键盘翻页与投屏分享。
- **象 · 现形记**：9:16 竖屏 14 页叙事，霓虹渐变 + 抖音 HUD 风格，追踪 OpenRouter 隐身代号 `elephant-alpha` 揭晓为蚂蚁 `inclusionai/ling-2.6-flash` 的全过程；支持上下滑动 / 键盘翻页 / 侧边圆点导航。

## 维护习惯

新增页面时：

1. 工具类放 **`tools/<模块名>/`**；演示/实验类放 **`demos/<模块名>/`**，入口命名为 **`index.html`**（模块内还可放专属脚本、样式或数据文件）；
2. 在 **`assets/registry.js`** 注册表中补一条（首页卡片、命令面板与站内搜索的唯一数据源；卡片还需 `icon`/`c1`/`c2` 字段，工具类另需 `group` 字段对应 `ZKTOOL_GROUPS` 分域）；
3. 运行 **`node scripts/gen-site.mjs`**：自动重生成首页卡片与 JSON-LD、`sitemap.xml`、`llms.txt`、`sw.js` 预缓存与缓存版本、全站资源版本戳、本 README 的两张索引表（勿手改生成区块，会被覆盖）。**每次改动任何 assets 下的 CSS/JS 后发布前都要跑一次**，否则版本戳不更新、线上会命中旧缓存；
4. 在本 README 的「工具说明」中补一段详细说明（按需详写）。

> 站点部署域名变更时：全局替换页面 `og:url`、`sitemap.xml` 与 `robots.txt` 中的 `https://tools.zktww.cn`。

---

*非正式产品代码，以自用与展示为主。*
