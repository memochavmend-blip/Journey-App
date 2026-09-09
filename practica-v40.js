/* Práctica — service worker
   HTML: red primero (siempre la última versión, caché como respaldo offline).
   Audio: SIN interceptar — el navegador lo pide directo a la red. iOS Safari exige
   respuestas de rango (206) para medios; si el SW devuelve una respuesta completa, las rechaza.
   (El audio offline se puede añadir después con manejo correcto de Range.) */

const VERSION = "practica-v5";
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

  // Audio: dejar pasar a la red (el navegador maneja Range/206 correctamente).
  if (req.destination === "audio" || /\.(mp3|m4a|wav|ogg|aac)$/i.test(url.pathname)) return;

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
