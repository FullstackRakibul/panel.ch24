// sw.js
const CACHE_NAME = "channel24-v1.0.0"
const urlsToCache = [
  "/", // Caches index.html
  "/login", // If this is a client-side route, it won't fetch a new file. If it's a server route, it should be a full path.
  "/manifest.json",
  "/vite.svg", // Your main icon
  // Add your compiled JS, CSS, and other static assets here.
  // These paths will depend on your Vite build output.
  // For example:
  // "/assets/index-xxxxxxxx.js",
  // "/assets/style-yyyyyyyy.css",
  // "/icons/icon-192x192.png", // If you add new icons
  // "/icons/icon-512x512.png"
]

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache).catch((err) => {
        console.log("Cache addAll failed:", err)
      })
    }),
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request).catch(() => {
        // Only provide a fallback for navigation requests (HTML pages)
        if (event.request.mode === "navigate") {
          return caches.match("/"); // Fallback to index.html
        }
        // For other types of requests (e.g., images, scripts),
        // if they are not in cache and network fails, you might want to return nothing or a specific error.
        // Returning nothing will result in a network error for the browser.
      });
    }),
  )
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  return self.clients.claim(); // Ensures the new service worker takes control immediately
})