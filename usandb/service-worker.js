var CACHE_NAME = "usbv4";
var urlsToCache = [
  "./",
  "./manifest.json",
  "./nav.html",
  "./index.html",
  "./assets/about.jpg",
  "./assets/background1.jpg",
  "./assets/comingsoon.jpg",
  "./assets/contact.jpg",
  "./assets/icon.png",
  "./assets/logo.png",
  "./css/materialize.css",
  "./css/materialize.min.css",
  "./css/style.css",
  "./js/init.js",
  "./js/materialize.js",
  "./js/materialize.min.js",
  "./js/nav.js",
  "./pages/home.html",
  "./pages/about.html",
  "./pages/contact.html",
  "./pages/categories.html",
  "./pages/register.html",
  "./pages/showcase.html",
  
    "./images/icons/icon-72x72.png",
  "./images/icons/icon-96x96.png",
  "./images/icons/icon-128x128.png",
  "./images/icons/icon-144x144.png",
  "./images/icons/icon-152x152.png",
  "./images/icons/icon-192x192.png",
  "./images/icons/icon-384x384.png",
  "./images/icons/icon-512x512.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",


  "https://code.jquery.com/jquery-2.1.1.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0",

  "https://fonts.googleapis.com/css2?family=Archivo:wght@600&display=swap",
  "https://fonts.gstatic.com/s/archivo/v7/k3kVo8UDI-1M0wlSdQbMO0bhLIiP-Q8.woff2"
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
