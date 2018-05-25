const RUNTIME = 'runtime';
let CURRENT_CACHES = localStorage.getItem('CURRENT_CACHES');
if (CURRENT_CACHES) {
  CURRENT_CACHES = JSON.parse(caches);
} else {
  CURRENT_CACHES = [RUNTIME];
  localStorage.setItem('CURRENT_CACHES', JSON.stringify(CURRENT_CACHES));
}
const RUNTIME_ORIGINS = [
  'https://maxcdn.bootstrapcdn.com'
];
const NO_CACHE_ORIGINS = [
  'https://api.mlab.com'
];


// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !CURRENT_CACHES.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for all resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  const reqUrl = new URL(event.request.url);
  const refUrl = new URL(event.request.referrer);
  let CACHE_NAME = RUNTIME;
  if (!RUNTIME_ORIGINS.includes(reqUrl.origin) && 
    reqUrl.origin === refUrl.origin) {
    CACHE_NAME = reqUrl.pathname.split('/')[1];
    if (!CURRENT_CACHES.includes(CACHE_NAME)) {
      CURRENT_CACHES.push(CACHE_NAME);
      localStorage.setItem('CURRENT_CACHES', JSON.stringify(CURRENT_CACHES));
    }
  }
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
          if (event.request.method === 'GET' && 
            !NO_CACHE_ORIGINS.includes(reqUrl.origin)) {
            console.log('sw:caching (', CACHE_NAME, ') - ', event.request.url);
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          } else {
            return response;
          }
        });
      });
    })
  );
});
