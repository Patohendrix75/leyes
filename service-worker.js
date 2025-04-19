const CACHE_NAME = 'anf-cache-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/banner.jpg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/documento1.html',
  '/documento2.html',
  '/documento3.html',
  '/documento4.html',
  '/documento5.html',
  '/documento6.html',
  '/documento7.html',
  '/documento8.html',
  '/documento9.html',
  '/documento10.html',
  '/documento11.html'
  '/offline.html' // ← opcional si decides agregarla
];

// Instalación: precache de archivos básicos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activación: eliminar versiones antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Interceptar solicitudes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then(networkResponse => {
            // Almacena en caché dinámico (opcional)
            return caches.open(CACHE_NAME).then(cache => {
              if (event.request.url.startsWith(self.location.origin)) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            });
          })
          .catch(() => {
            // Si falla todo, muestra página offline si es navegación
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          })
      );
    })
  );
});
