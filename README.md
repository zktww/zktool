# zkdome

个人 **Demo / 实验页** 仓库：放一些静态 HTML 小作品、演示稿和练习页面，方便本地打开或托管在静态站点上浏览。

## 快速开始

- 在资源管理器中打开本目录，双击 **`index.html`** 进入索引页。
- 或用任意静态服务器（例如 `npx serve .`）避免部分环境下 `file://` 的限制。

## 索引

| 入口 | 说明 |
|------|------|
| [index.html](index.html) | 所有 Demo 的导航首页 |
| [cssLengthUnit.html](cssLengthUnit.html) | CSS 长度单位探索器（科技风交互演示） |
| [presentation.html](presentation.html) | 「架构师的成长」全屏 HTML 演示文稿 |

## Demo 摘要

### CSS 长度单位探索器

- **单位反应堆**：实时演示多种 CSS 长度单位的效果  
- **时空对比仪**：比较不同单位之间的数值关系  
- **单位图鉴**：px、rem、vw、vmin、lh 等单位的说明与可视化  
- **可调参数**：基准字号、容器宽度等，观察相对单位变化  

支持的主要单位包括：绝对单位（px、cm、mm、in、pt 等）与相对单位（em、rem、vw、vh、%、lh 等）。

### 演示文稿（presentation.html）

深空主题、视口适配的全屏幻灯片；适合键盘翻页与投屏分享。

## 维护习惯

新增页面时：

1. 在根目录放好 `*.html`；  
2. 在 **`index.html`** 里增加一条卡片链接；  
3. 在本 README 的表格与摘要中各补一行（按需详写）。

---

*非正式产品代码，以自用与展示为主。*
