const CACHE = "zktool-runtime-v3";
const CACHE_PREFIX = "zktool-";
const VERSION_PARAM = "v";

function shouldCache(request, url) {
  return request.method === "GET"
    && url.origin === self.location.origin
    && (request.mode === "navigate" || ["script", "style", "image", "font"].includes(request.destination));
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok && response.type === "basic") await cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const network = fetch(request).then((response) => {
    if (response.ok && response.type === "basic") cache.put(request, response.clone());
    return response;
  });

  if (cached) {
    network.catch(() => {});
    return cached;
  }

  return network;
}

function isStaticAsset(url) {
  return url.pathname.startsWith("/assets/") || url.pathname.startsWith("/_astro/");
}

function isVersionedAsset(url) {
  return url.pathname.startsWith("/_astro/")
    || (url.pathname.startsWith("/assets/") && url.searchParams.has(VERSION_PARAM));
}

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE).map((key) => caches.delete(key))
  )).then(() => self.clients.claim())
));

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!shouldCache(event.request, url)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
  } else if (isVersionedAsset(url)) {
    event.respondWith(cacheFirst(event.request));
  } else if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(event.request));
  } else {
    event.respondWith(networkFirst(event.request));
  }
});
