/* Práctica — service worker
   HTML: red primero, SIN caché HTTP (siempre la última versión), caché como respaldo offline.
   Audio: SIN interceptar — el navegador lo pide directo a la red (iOS exige respuestas de rango 206).
   Al desplegar una versión nueva: subir VERSION (cambia los bytes del archivo) para que el navegador
   detecte el SW nuevo, limpie la caché vieja y (con la recarga del cliente) entregue el HTML nuevo. */

const VERSION = "practica-v6";
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

self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Audio: dejar pasar a la red (el navegador maneja Range/206 correctamente).
  if (req.destination === "audio" || /\.(mp3|m4a|wav|ogg|aac)$/i.test(url.pathname)) return;

  // HTML / navegación: red primero y SIN caché HTTP, para que una versión recién desplegada
  // cargue de inmediato aunque el navegador tenga una copia vieja cacheada.
  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(
      fetch("./index.html", { cache: "no-store" })
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
