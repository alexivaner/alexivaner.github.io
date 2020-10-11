const CACHE_NAME = "usbv3";
var urlsToCache = [
  "./usandb",
  "./usandb/nav.html",
  "./usandb/index.html",
  "./usandb/assets/about.jpg",
  "./usandb/assets/background1.jpg",
  "./usandb/assets/comingsoon.jpg",
  "./usandb/assets/contact.jpg",
  "./usandb/assets/icon.png",
  "./usandb/assets/logo.png",
  "./usandb/css/materialize.css",
  "./usandb/css/materialize.min.css",
  "./usandb/css/style.css",
  "./usandb/js/init.js",
  "./usandb/js/materialize.js",
  "./usandb/js/materialize.min.js",
  "./usandb/js/nav.js",
  "./usandb/pages/home.html",
  "./usandb/pages/about.html",
  "./usandb/pages/contact.html",
  "./usandb/pages/categories.html",
  "./usandb/pages/register.html",
  "./usandb/pages/showcase.html",
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
