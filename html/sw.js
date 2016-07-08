'use strict';

const cacheVersion = '1.2.3';
const cacheName = `${self.location.host}-${cacheVersion}`;
const cacheContents = [
  '/',
  'app.js',
  'index.html',
  'images/404.png',
  'scripts/flickr.js',
  'styles/default.css',
];

self.onactivate = event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        const cacheDeletions = cacheNames
          .filter(cache => cache !== cacheName)
          .map(cache => caches.delete(cache));

        return Promise.all(cacheDeletions);
      })
      .then(() => self.clients.claim())
  );
};

self.oninstall = event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(cacheContents))
      .then(() => self.skipWaiting())
  );
};

self.onfetch = event => {
  const offlineResponse = () => {
    const isImage = event.request.headers.get('Accept').includes('image');

    return isImage ? caches.match('images/404.png') : new Response('<h1>Offline</h1', {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  };

  const cacheResponse = response => {
    caches.open(cacheName)
      .then(cache => cache.put(event.request, response));

    return response.clone();
  };

  const respondFromNetwork = () => fetch(event.request).then(cacheResponse);

  const respondFromCache = () => caches.match(event.request).then(response => response ? response : offlineResponse());

  event.respondWith(
    respondFromNetwork(event).catch(respondFromCache)
  );
};

self.onpush = event => {
  if (!self.Notification || self.Notification.permission !== 'granted') {
    return;
  }

  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'notification';
  const body = data.message || 'notification';
  const icon = 'images/notification.png';

  self.registration.showNotification(title, {
    body,
    icon,
  });
};

// self.onsync = event => {};
