/* zktool service worker 缓存策略：
   - HTML 导航请求：网络优先（短超时回退缓存）——发布后用户第一次打开就是新页面，离线才用缓存；
   - 带 ?v= 内容哈希的静态资源：缓存优先——URL 即版本，命中即最新；
   - 其余同源 GET：stale-while-revalidate；跨域（CDN、统计）不代理。 */
var CACHE = "zktool-1d3b60e4";
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

    /* HTML 导航：网络优先（3s 超时回退缓存），保证发布后首次打开即最新 */
    if (e.request.mode === "navigate") {
        e.respondWith(
            caches.open(CACHE).then(function (cache) {
                var ctrl = new AbortController();
                var timer = setTimeout(function () { ctrl.abort(); }, 3000);
                return fetch(e.request, { signal: ctrl.signal }).then(function (res) {
                    clearTimeout(timer);
                    if (res && res.ok) cache.put(e.request, res.clone());
                    return res;
                }).catch(function () {
                    clearTimeout(timer);
                    return cache.match(e.request, { ignoreSearch: true }).then(function (cached) {
                        return cached || cache.match("./index.html");
                    });
                });
            })
        );
        return;
    }

    /* 带 ?v= 内容哈希的资源：URL 即版本，缓存优先 */
    var versioned = url.searchParams.has("v");
    e.respondWith(
        caches.open(CACHE).then(function (cache) {
            return cache.match(e.request).then(function (cached) {
                if (versioned && cached) return cached;
                var fetched = fetch(e.request).then(function (res) {
                    if (res && res.ok) cache.put(e.request, res.clone());
                    return res;
                }).catch(function () {
                    if (cached) return cached;
                    /* 预缓存的资源不带 ?v=，忽略查询参数再匹配一次兜底 */
                    return cache.match(e.request, { ignoreSearch: true }).then(function (loose) {
                        return loose || Response.error();
                    });
                });
                return cached || fetched;
            });
        })
    );
});
