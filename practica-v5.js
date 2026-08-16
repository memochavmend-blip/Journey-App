/* Práctica — service worker
   HTML: red primero (siempre la última versión, caché como respaldo offline).
   Audio del repo: caché primero en un caché aparte y persistente (offline tras la 1ª reproducción).
   Sube VERSION al cambiar el shell; sube AUDIO_CACHE solo si reemplazas archivos de audio. */

const VERSION = "practica-v4";
const AUDIO_CACHE = "practica-audio-v1";
const SHELL = ["./", "./index.html"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== AUDIO_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Audio del mismo origen (los MP3 del repo): caché primero, persistente, offline tras oírlo una vez.
  if (url.origin === location.origin && (req.destination === "audio" || /\.(mp3|m4a|wav|ogg|aac)$/i.test(url.pathname))) {
    e.respondWith((async () => {
      const c = await caches.open(AUDIO_CACHE);
      const hit = await c.match(req.url);
      if (hit) return hit;
      try {
        const res = await fetch(url.href);              // GET completo (200), sin Range
        if (res && res.status === 200) c.put(req.url, res.clone());
        return res;
      } catch (err) {
        const any = await c.match(req.url);
        return any || Response.error();
      }
    })());
    return;
  }

  // HTML / navegación: red primero. Una versión recién desplegada carga de inmediato.
  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) { const copia = res.clone(); caches.open(VERSION).then(c => c.put("./index.html", copia)); }
          return res;
        })
        .catch(() => caches.match("./index.html").then(h => h || caches.match("./")))
    );
    return;
  }

  // Resto de recursos: caché primero, red como respaldo.
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req)
        .then(res => {
          if (res && res.ok && url.origin === location.origin) { const copia = res.clone(); caches.open(VERSION).then(c => c.put(req, copia)); }
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
