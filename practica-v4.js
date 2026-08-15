/* Práctica — service worker
   Cachea el shell para que la app funcione sin señal.
   El HTML va "red primero": siempre carga la última versión cuando hay conexión,
   y usa el caché solo como respaldo offline. Sube la versión al cambiar el shell. */

const VERSION = "practica-v3";
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
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // El audio de tus grabaciones se sirve de la red (o de su propio caché del navegador).
  if (req.destination === "audio" || /\.(mp3|m4a|wav|ogg|aac)$/i.test(url.pathname)) return;

  // HTML / navegación: red primero. Así una versión recién desplegada carga de inmediato.
  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copia = res.clone();
            caches.open(VERSION).then(c => c.put("./index.html", copia));
          }
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
          if (res && res.ok && url.origin === location.origin) {
            const copia = res.clone();
            caches.open(VERSION).then(c => c.put(req, copia));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
