// sw.js - Service Worker для PWA
const CACHE_NAME = 'mira-pwa-v4';
const urlsToCache = [
    '/MiraAN/',
    '/MiraAN/index.html',
    '/MiraAN/manifest.json',
    '/MiraAN/icon-192.png',
    '/MiraAN/icon-512.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Кеш открыт');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});