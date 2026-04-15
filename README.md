# zkdome

个人 **Demo / 实验页** 仓库：放一些静态 HTML 小作品、演示稿和练习页面，方便本地打开或托管在静态站点上浏览。

## 目录约定

- **`demos/`** — 演示、交互探索、幻灯片等偏展示向页面；每个模块一个子文件夹，入口为 **`index.html`**。
- **`tools/`** — 小工具页；同样每模块独立文件夹 + **`index.html`**。
- 根目录保留 **`index.html`** 总索引与 **`favicon.ico`**。

## 快速开始

- 在资源管理器中打开本目录，双击 **`index.html`** 进入索引页。
- 或用任意静态服务器（例如 `npx serve .`）避免部分环境下 `file://` 的限制。

## 索引

| 入口 | 说明 |
|------|------|
| [index.html](index.html) | 总导航（演示 / 工具分区） |
| [demos/css-length-unit/](demos/css-length-unit/) | CSS 长度单位探索器（暖色编辑风交互页） |
| [demos/presentation/](demos/presentation/) | 「架构师的成长」全屏 HTML 演示文稿 |
| [tools/timestamp-converter/](tools/timestamp-converter/) | 时间戳与日期时间互转（秒/毫秒、UTC、复制） |
| [tools/json-formatter/](tools/json-formatter/) | JSON 校验、美化与压缩（缩进、键排序、复制） |

## Demo 摘要

### CSS 长度单位探索器（`demos/css-length-unit/`）

- **单位演示**：实时演示所选单位在进度条与文案上的效果
- **单位对比**：比较两组「数值 + 单位」的相对长度与比例
- **单位对照表**：px、rem、vw、vmin、lh 等说明与示意条
- **可调参数**：基准字号、容器宽度等，观察相对单位变化

支持的主要单位包括：绝对单位（px、cm、mm、in、pt 等）与相对单位（em、rem、vw、vh、%、lh 等）。

### 演示文稿（`demos/presentation/`）

深空主题、视口适配的全屏幻灯片；适合键盘翻页与投屏分享。

### 时间戳转换工具（`tools/timestamp-converter/`）

与索引页同系的深色界面：Unix 时间戳与可读日期互转，秒/毫秒分段开关、当前时间戳跳动展示、本地与 UTC ISO 输出及复制；支持文本解析与 `datetime-local` 选择器。

### JSON 格式化工具（`tools/json-formatter/`）

双栏输入与结果区：基于原生 `JSON.parse` 校验，一键美化或压缩；可选 2/4 空格或 Tab 缩进、对象键排序；支持复制输入/结果与 `Ctrl+Enter` 快捷美化。

## 维护习惯

新增页面时：

1. 在 **`demos/<模块名>/`** 或 **`tools/<模块名>/`** 下创建文件夹，入口命名为 **`index.html`**（模块内还可放专属脚本、样式或数据文件）；
2. 在根目录 **`index.html`** 对应分区增加一条卡片链接；
3. 在本 README 的表格与摘要中各补一行（按需详写）。

---

*非正式产品代码，以自用与展示为主。*
