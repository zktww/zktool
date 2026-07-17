/* zktool service worker：stale-while-revalidate。
   同源 GET 一律先回缓存再后台更新；跨域（CDN 库、统计）直接走网络，失败回缓存。 */
var CACHE = "zktool-v5";
var CORE = [
    "./",
    "./index.html",
    "./404.html",
    "./manifest.webmanifest",
    "./llms.txt",
    "./assets/tokens.css",
    "./assets/tool-shell.css",
    "./assets/tool-page.css",
    "./assets/clipboard.js",
    "./assets/theme.js",
    "./assets/toolkit.js",
    "./assets/registry.js",
    "./assets/palette.js",
    "./assets/icon.svg",
    "./assets/vendor/sql-formatter.min.js",
    "./assets/vendor/js-yaml.min.js",
    "./assets/vendor/marked.min.js",
    "./assets/vendor/qrcode.min.js",
    /* 工具页全部预缓存：兑现“支持离线使用”（依赖 CDN 的页面本体可离线，功能视缓存而定） */
    "./tools/timestamp-converter/",
    "./tools/json-formatter/",
    "./tools/emoji-tool/",
    "./tools/mermaid-editor/",
    "./tools/url-codec/",
    "./tools/base64-converter/",
    "./tools/regex-tester/",
    "./tools/random-generator/",
    "./tools/cron-tool/",
    "./tools/color-tool/",
    "./tools/text-diff/",
    "./tools/hash-tool/",
    "./tools/jwt-decoder/",
    "./tools/json-converter/",
    "./tools/text-case/",
    "./tools/image-compressor/",
    "./tools/http-reference/",
    "./tools/unicode-inspector/",
    "./tools/sql-formatter/",
    "./tools/yaml-converter/",
    "./tools/curl-parser/",
    "./tools/html-entities/",
    "./tools/keypair-generator/",
    "./tools/markdown-preview/",
    "./tools/timezone-planner/",
    "./tools/chmod-calculator/",
    "./tools/svg-optimizer/",
];

self.addEventListener("install", function (e) {
    e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener("fetch", function (e) {
    if (e.request.method !== "GET") return;
    var url = new URL(e.request.url);
    if (url.origin !== location.origin) return; /* CDN 等跨域资源不代理，避免缓存第三方脚本 */
    e.respondWith(
        caches.open(CACHE).then(function (cache) {
            return cache.match(e.request).then(function (cached) {
                var fetched = fetch(e.request).then(function (res) {
                    if (res && res.ok) cache.put(e.request, res.clone());
                    return res;
                }).catch(function () { return cached; });
                return cached || fetched;
            });
        })
    );
});
