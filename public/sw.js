const CACHE = "zktool-runtime-v2";
const CACHE_PREFIX = "zktool-";

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

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE).map((key) => caches.delete(key))
  )).then(() => self.clients.claim())
));

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!shouldCache(event.request, url)) return;
  event.respondWith(networkFirst(event.request));
});
