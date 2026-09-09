// versió de la cache, si canvies l'app puja el número i ja et neteja la vella
const CACHE_NAME = 'cartly-v1';

// fitxers bàsics per quan sense internet
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './assets/cartly-logo.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // no caches antigues, que no s'acumuli merda
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // cache-first: si el tenim guardat el servim de seguida, sinó anem a buscar-lo
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
