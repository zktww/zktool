/* zktool service worker：stale-while-revalidate。
   同源 GET 一律先回缓存再后台更新；跨域（CDN 库、统计）直接走网络，失败回缓存。 */
var CACHE = "zktool-c8719b1e";
var CORE = [
    /* gen:core */
    "./",
    "./index.html",
    "./404.html",
    "./manifest.webmanifest",
    "./llms.txt",
    "./assets/analytics.js",
    "./assets/clipboard.js",
    "./assets/icon.svg",
    "./assets/palette.js",
    "./assets/registry.js",
    "./assets/theme.js",
    "./assets/tokens.css",
    "./assets/tool-page.css",
    "./assets/tool-shell.css",
    "./assets/toolkit.js",
    "./assets/vendor/exifr.min.js",
    "./assets/vendor/js-yaml.min.js",
    "./assets/vendor/jsQR.min.js",
    "./assets/vendor/marked.min.js",
    "./assets/vendor/purify.min.js",
    "./assets/vendor/qrcode.min.js",
    "./assets/vendor/sql-formatter.min.js",
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
    "./tools/qr-scanner/",
    "./tools/exif-viewer/",
    "./tools/device-info/",
    "./tools/touch-tester/",
    "./tools/sensor-viewer/",
    /* /gen:core */
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
                }).catch(function () {
                    if (cached) return cached;
                    /* 离线且无缓存：导航请求兜底回首页（含命令面板可跳转他处） */
                    if (e.request.mode === "navigate") return cache.match("./index.html");
                    return Response.error();
                });
                return cached || fetched;
            });
        })
    );
});
