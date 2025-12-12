/* Simple offline shell cache for MengLayer */
const VERSION = "v1.0.1";
const CACHE = `menglayer-shell-${VERSION}`;
const ASSETS = [
  
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/js/i18n.js",
  "./assets/js/links.js",
  "./assets/js/app.js",
  "./assets/images/avatar.jpg",
  "./assets/images/favicon.jpg",
  "./assets/images/wechat-qr.jpg",
  "./assets/images/icon-192.png",
  "./assets/images/icon-512.png",
  "./assets/images/icon-512-maskable.png"

];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k.startsWith("menglayer-shell-") && k !== CACHE) ? caches.delete(k) : null))
    ).then(() => self.clients.claim())
  );
});

// Navigation: network-first (fallback cache). Assets: cache-first.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  const isNav = req.mode === "navigate" || (req.destination === "" && req.headers.get("accept")?.includes("text/html"));
  if (isNav) {
    event.respondWith(
      fetch(req).then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put("./index.html", copy)).catch(() => {});
        return r;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return r;
    }))
  );
});
