const C = "dhun-v18";
const SHELL = ["/", "/app.css?v=18", "/app.js?v=18", "/manifest.webmanifest?v=18", "/favicon.ico?v=18", "/favicon-32.png?v=18", "/icon-192.png?v=18", "/icon-512.png?v=18", "/icon-192.png", "/apple-touch-icon.png?v=18", "/logo-h.webp?v=18", "/dhun-mark.webp?v=18", "/fonts/comic-neue-400.woff2?v=18", "/fonts/comic-neue-700.woff2?v=18"];
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
