const C = "dhun-v21";
const SHELL = ["/", "/app.css?v=21", "/app.js?v=21", "/manifest.webmanifest?v=21", "/favicon.ico?v=21", "/favicon-32.png?v=21", "/icon-192.png?v=21", "/icon-512.png?v=21", "/icon-192.png", "/apple-touch-icon.png?v=21", "/logo-h.webp?v=21", "/dhun-mark.webp?v=21", "/fonts/comic-neue-400.woff2?v=21", "/fonts/comic-neue-700.woff2?v=21"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api/") || u.pathname.endsWith(".apk") || u.pathname === "/app-version.json" || e.request.headers.has("range")) return;
  const nav = e.request.mode === "navigate";
  // network first (fresh app when online), cached shell when offline
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(nav ? "/" : e.request, cp)); } return r; })
    .catch(() => caches.match(nav ? "/" : e.request, { ignoreSearch: nav }).then(r => r || caches.match("/"))));
});
