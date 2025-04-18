const CACHE_NAME = 'anf-cache-v1';  // ← cambia a v2 cuando necesites forzar actualización

const FILES_TO_CACHE = [
  '/',               // acceso raíz
  '/index.html',
  '/banner.jpg',
  '/documento1.html',
  '/documento2.html',
  '/documento3.html',
  '/documento4.html',
  '/documento5.html',
  '/documento6.html'
];

// Instala y guarda archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // activa este SW de inmediato
});

// Activa y elimina cachés anteriores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // toma el control de todas las pestañas abiertas
});

// Intercepta solicitudes y sirve desde caché si existe
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
