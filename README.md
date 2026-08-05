# zktool

浏览器本地运行的开发者工具站。项目使用 Astro 静态生成，Vue 仅用于需要客户端交互的公共组件；部署产物是纯静态 `dist/` 目录，不需要后端服务。

## 开发

```bash
pnpm install
pnpm dev
pnpm build
```

`pnpm build` 会生成中文与英文静态页面、sitemap、llms.txt、双语 Manifest 和 Service Worker。发布时仅上传 `dist/`。

## 目录

```text
src/
  pages/                 Astro 路由：首页、工具页、英文路由和 404
  components/            可复用页面组件，Vue 组件按需 hydration
  layouts/               站点公共布局、SEO、语言切换
  data/                  工具注册表和国际化文案
  tools/                 中文工具交互源，按工具目录维护
  locales/en/tools/      英文构建中间产物（自动生成，不纳入版本控制）
public/
  assets/                浏览器运行时资源和本地第三方库
  tools/                 工具运行时数据文件
scripts/
  generate-en-tools.mjs  根据中文工具源码与翻译文案生成英文页面
  postbuild.mjs          生成 sitemap、llms 和英文 Manifest
```

## 路由与国际化

- 中文工具：`/tools/<slug>/`
- 英文工具：`/en/tools/<slug>/`
- 每个工具都由 Astro 在构建时输出两份静态路由。
- 首页提供手动语言切换；工具页保留对应语言入口。
- `hreflang`、canonical、sitemap 和英文 Manifest 均随构建生成。

## 工具维护

工具元数据维护在 `src/data/registry.js`，英文名称、简介和标签维护在 `src/data/i18n.js`。
构建会将这两份数据同步到 `public/assets/`，供传统工具页的命令面板和语言运行时使用。

新增工具时：

1. 在 `src/tools/<slug>/` 创建工具页面或组件；
2. 在 `src/data/registry.js` 注册工具并指定分组；
3. 在 `src/data/i18n.js` 补充英文卡片与 SEO 文案；
4. 运行 `pnpm build`。构建会先自动生成英文工具页，再输出 `dist/tools/<slug>/` 和 `dist/en/tools/<slug>/`。

当前工具站不再包含 Demo 分类。CSS 长度单位探索器已归入图表与图像工具，HTML 拖拽交互测试器已归入图表与图像工具；展示型 `presentation` 和 `elephant-alpha` 已删除。
