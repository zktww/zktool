/* zktool 工具注册表：命令面板、跨工具跳转等共享数据源。
   path 相对站点根目录；kw 供搜索匹配（与主页卡片 data-kw 保持同步）。 */
(function (global) {
    "use strict";
    global.ZKTOOL_REGISTRY = [
        { name: "时间转换", path: "tools/timestamp-converter/", tag: "时间", type: "tool", desc: "Unix 时间戳与日期互转，批量转换与时区对照", kw: "时间戳 转换 timestamp unix 日期 date utc 时区" },
        { name: "JSON 格式化与校验", path: "tools/json-formatter/", tag: "JSON", type: "tool", desc: "校验、美化、压缩 JSON，树形视图与错误定位", kw: "json 格式化 校验 美化 压缩 format validate" },
        { name: "Emoji 符号库", path: "tools/emoji-tool/", tag: "Unicode", type: "tool", desc: "分类浏览与中英文搜索，收藏与一键复制", kw: "emoji 表情 unicode 复制 搜索" },
        { name: "Mermaid 图表编辑器", path: "tools/mermaid-editor/", tag: "图表", type: "tool", desc: "实时编辑渲染流程图、时序图，导出 PNG / SVG", kw: "mermaid 图表 流程图 时序图 甘特图 编辑器 diagram" },
        { name: "URL 编码与参数解析", path: "tools/url-codec/", tag: "URL", type: "tool", desc: "URL encode/decode 与查询参数解析", kw: "url 编码 解码 encode decode query params 参数" },
        { name: "Base64 编码转换", path: "tools/base64-converter/", tag: "编码", type: "tool", desc: "Base64、Hex、Unicode escape 互转", kw: "base64 hex unicode utf8 编码 解码" },
        { name: "正则表达式测试", path: "tools/regex-tester/", tag: "Regex", type: "tool", desc: "匹配高亮、捕获组与替换结果", kw: "正则 表达式 regexp regex 测试 匹配 替换 捕获组" },
        { name: "随机 ID 生成器", path: "tools/random-generator/", tag: "随机", type: "tool", desc: "UUID、密码、Token 与批量随机字符串", kw: "uuid 随机 字符串 password token nanoid 密码" },
        { name: "Cron 表达式解析", path: "tools/cron-tool/", tag: "Cron", type: "tool", desc: "字段含义与未来执行时间预览", kw: "cron crontab 表达式 定时 解析 下次执行" },
        { name: "颜色转换与对比度", path: "tools/color-tool/", tag: "Color", type: "tool", desc: "HEX/RGB/HSL 互转、色阶与 WCAG 对比度", kw: "颜色 color hex rgb hsl 对比度 调色板 wcag" },
        { name: "文本差异比较", path: "tools/text-diff/", tag: "Diff", type: "tool", desc: "行级差异对比，高亮新增与删除", kw: "文本 diff 差异 对比 compare 配置 日志" },
        { name: "Hash 计算器", path: "tools/hash-tool/", tag: "摘要", type: "tool", desc: "文本/文件的 MD5、SHA-1、SHA-256、SHA-512", kw: "hash md5 sha1 sha256 sha512 摘要 校验 checksum 文件" },
        { name: "JWT 解析器", path: "tools/jwt-decoder/", tag: "Token", type: "tool", desc: "解码 Header/Payload、过期标注与 HS256 验签", kw: "jwt token 解析 解码 decode 过期 签名 hs256 bearer" },
        { name: "JSON 格式互转", path: "tools/json-converter/", tag: "转换", type: "tool", desc: "JSON 转 YAML、TS interface、Go struct、CSV", kw: "json yaml typescript interface go struct csv 转换 convert 类型" },
        { name: "文本命名与行处理", path: "tools/text-case/", tag: "文本", type: "tool", desc: "命名风格互转、去重排序与统计", kw: "大小写 camel snake kebab pascal constant 命名 转换 去重 排序 行" },
        { name: "图片压缩与转换", path: "tools/image-compressor/", tag: "图片", type: "tool", desc: "本地压缩转 WebP/JPEG/PNG，体积对比", kw: "图片 压缩 webp jpeg png 转换 image compress 体积" },
        { name: "HTTP 状态码与 MIME 速查", path: "tools/http-reference/", tag: "速查", type: "tool", desc: "状态码含义与 MIME 类型对照", kw: "http 状态码 status code mime content-type 速查 404 500" },
        { name: "Unicode 字符检查器", path: "tools/unicode-inspector/", tag: "Unicode", type: "tool", desc: "码点/编码明细，零宽字符排查", kw: "unicode 字符 码点 零宽 不可见 编码 utf8 utf16 检查" },
        { name: "SQL 格式化", path: "tools/sql-formatter/", tag: "SQL", type: "tool", desc: "多方言 SQL 格式化与单行压缩", kw: "sql 格式化 美化 压缩 mysql postgresql format" },
        { name: "二维码生成器", path: "https://qc.zktww.cn/", tag: "外部", type: "external", desc: "跳转到独立二维码生成服务", kw: "二维码 生成器 qrcode qr code 链接 外部" },
        { name: "CSS 长度单位探索器", path: "demos/css-length-unit/", tag: "演示", type: "demo", desc: "px、rem、vw 等单位演示与对照", kw: "css 长度 单位 px rem vw vmin lh demo" },
        { name: "HTML5 拖拽演示", path: "demos/drag-and-drop/", tag: "演示", type: "demo", desc: "原生 Drag and Drop API 三合一演示", kw: "拖拽 drag drop 排序 上传 demo" },
        { name: "演示文稿", path: "demos/presentation/", tag: "演示", type: "demo", desc: "「架构师的成长」全屏 HTML 幻灯片", kw: "演示 幻灯片 presentation slides 架构" },
        { name: "象 · 现形记", path: "demos/elephant-alpha/", tag: "演示", type: "demo", desc: "9:16 竖屏叙事长图", kw: "elephant alpha 竖屏 叙事 demo" },
    ];
})(typeof window !== "undefined" ? window : this);
