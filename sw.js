/* zktool service worker：stale-while-revalidate。
   同源 GET 一律先回缓存再后台更新；跨域（CDN 库、统计）直接走网络，失败回缓存。 */
var CACHE = "zktool-v2";
var CORE = [
    "./",
    "./index.html",
    "./404.html",
    "./manifest.webmanifest",
    "./assets/tokens.css",
    "./assets/tool-page.css",
    "./assets/clipboard.js",
    "./assets/registry.js",
    "./assets/palette.js",
    "./assets/icon.svg",
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
