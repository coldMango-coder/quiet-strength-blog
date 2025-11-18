// Performance-optimized Service Worker for 100/100 Lighthouse scores
const CACHE_NAME = 'quiet-strength-performance-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/images/logo.avif',
  '/images/logo.webp', 
  '/images/logo.png',
  '/manifest.json',
  '/favicon.ico'
];

const DYNAMIC_CACHE_NAME = 'quiet-strength-dynamic-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response immediately, update cache in background
          fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.ok) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone));
              }
            })
            .catch(() => {
              // Network failed, cached version is fine
            });
          
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((fetchResponse) => {
            if (!fetchResponse.ok) {
              throw new Error('Network response was not ok');
            }

            const responseClone = fetchResponse.clone();
            
            // Cache successful responses
            if (request.url.includes('/static/') || 
                request.url.includes('/images/') ||
                request.url.includes('.css') ||
                request.url.includes('.js')) {
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseClone));
            } else {
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => cache.put(request, responseClone));
            }

            return fetchResponse;
          })
          .catch(() => {
            // Network failed and not in cache
            if (request.destination === 'document') {
              return caches.match('/');
            }
            throw new Error('Network and cache failed');
          });
      })
  );
});

// Background sync for better performance
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform any background sync tasks
      console.log('Background sync completed')
    );
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/images/logo.png',
        badge: '/images/logo.png',
      })
    );
  }
});