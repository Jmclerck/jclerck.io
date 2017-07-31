`use strict`;

const cacheVersion = `2.0.0`;
const cacheName = `${self.location.host}-${cacheVersion}`;
const cacheContents = [
  `/`,
  `index.html`,
  `static/cv.html`,
  `static/wedding.html`,
  `translations/`,
  `downloads/`,
  `images/`,
  `styles/`,
];

self.onactivate = event => {
  const clear = () => {
    caches
      .keys()
      .then(cacheNames => {
        const cacheDeletions = cacheNames.filter(cache => cache !== cacheName).map(cache => caches.delete(cache));

        return Promise.all(cacheDeletions);
      })
      .then(() => self.clients.claim());
  };

  event.waitUntil(clear);
};

self.oninstall = event => {
  const cache = () => {
    caches.open(cacheName).then(cache => cache.addAll(cacheContents)).then(() => self.skipWaiting());
  };

  event.waitUntil(cache);
};

self.onfetch = event => {
  const offlineResponse = () => {
    const isImage = event.request.headers.get(`Accept`).includes(`image`);

    return isImage
      ? caches.match(`images/404.png`)
      : new Response(`<h1>Offline</h1>`, { headers: { 'Content-Type': `text/html` } });
  };

  const cacheResponse = response => {
    caches.open(cacheName).then(cache => cache.put(event.request, response));

    return response.clone();
  };

  const respondFromNetwork = () => fetch(event.request).then(cacheResponse);

  const respondFromCache = () =>
    caches.match(event.request).then(response => (response ? response : offlineResponse()));

  event.respondWith(respondFromNetwork(event).catch(respondFromCache));
};

self.onpush = event => {
  if (!self.Notification || self.Notification.permission !== `granted`) {
    return;
  }

  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || `notification`;
  const body = data.message || `notification`;
  const icon = `images/icons/notification.png`;

  self.registration.showNotification(title, { body, icon });
};
// self.onsync = event => {};
