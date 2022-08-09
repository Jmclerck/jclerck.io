const CACHE_NAME = "jclerck-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/styles/animations.css",
  "/styles/layout.css",
  "/styles/reset.css",
  "/styles/theme.css",
  "/sprites/companies.svg",
  "/sprites/core.svg",
  "/sprites/frameworks.svg",
  "/sprites/icons.svg",
  "/sprites/tools.svg",
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!CACHE_NAME.includes(key)) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() =>
        caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(urlsToCache);
        })
      )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || !response.ok) {
          return response;
        }

        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
