// sw.js - Service Worker с версионированием
const CACHE_VERSION = 'v2.0.1'; // ← ОБНОВЛЯЙТЕ ПРИ ИЗМЕНЕНИЯХ
const CACHE_NAME = 'mir-site-' + CACHE_VERSION;

const urlsToCache = [
    '/MiraAN/',
    '/MiraAN/index.html',
    '/MiraAN/icon-192.png',
    '/MiraAN/manifest.json'
];

// УСТАНОВКА - кэшируем файлы
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting()) // ← ПРИНУДИТЕЛЬНАЯ АКТИВАЦИЯ
    );
});

// АКТИВАЦИЯ - удаляем старые кэши
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Удаляем старый кэш:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // ← ПРИНУДИТЕЛЬНОЕ УПРАВЛЕНИЕ
    );
});

// ЗАХВАТ ЗАПРОСОВ
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем из кэша или загружаем с сервера
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        // Сохраняем новый ответ в кэш
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, fetchResponse.clone());
                                return fetchResponse;
                            });
                    });
            })
    );
});
