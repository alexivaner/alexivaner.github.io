const CACHE_NAME = "usbv3";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/assets/about.jpg",
  "/assets/background1.jpg",
  "/assets/comingsoon.jpg",
  "/assets/contact.jpg",
  "/assets/icon.png",
  "/assets/logo.png",
  "/css/materialize.css",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/init.js",
  "/js/materialize.js",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/pages/categories.html",
  "/pages/register.html",
  "/pages/showcase.html",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
  "https://fonts.googleapis.com/css2?family=Archivo:wght@600&display=swap"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches
      .match(event.request, { cacheName: CACHE_NAME })
      .then(function(response) {
        if (response) {
          console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
          return response;
        }

        console.log(
          "ServiceWorker: Memuat aset dari server: ",
          event.request.url
        );
        return fetch(event.request);
      })
  );
});



self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
