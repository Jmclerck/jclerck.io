'use strict';

let cacheVersion = '1.2.2';
let cacheName = `${self.location.host}-${cacheVersion}`;
let cacheContents = [
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
        let cacheDeletions = cacheNames
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
  let offlineResponse = () => {
    let isImage = event.request.headers.get('Accept').includes('image');

    return isImage ? caches.match('images/404.png') : new Response('<h1>Offline</h1', {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  };

  let cacheResponse = response => {
    caches.open(cacheName)
      .then(cache => cache.put(event.request, response));

    return response.clone();
  };

  let respondFromNetwork = () => {
    return fetch(event.request)
      .then(cacheResponse);
  };

  let respondFromCache = () => {
    return caches.match(event.request)
      .then(response => {
        return response ? response : offlineResponse();
      });
  };

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

  let title = data.title || 'notification';
  let body = data.message || 'notification';
  let icon = 'images/notification.png';

  self.registration.showNotification(title, {
    body,
    icon,
  });
};

// self.onsync = event => {};
