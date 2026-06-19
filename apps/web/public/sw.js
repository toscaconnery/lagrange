const CACHE = 'plantations-v1';

const PRECACHE_URLS = [
  '/farm',
  '/farm/add',
  '/src/css/farm.css',
  '/src/components/FarmHeader.jsx',
  '/src/pages/farm/FarmList.jsx',
  '/src/pages/farm/FarmDetail.jsx',
  '/src/pages/farm/FarmAdd.jsx',
];

// Install: pre-cache core farm assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Only handle /farm requests
  if (!event.request.url.includes('/farm')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});