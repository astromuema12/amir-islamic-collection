const STATIC_CACHE = "amir-static-v1";
const DYNAMIC_CACHE = "amir-dynamic-v1";
const MAX_DYNAMIC_ENTRIES = 80;

const STATIC_ASSETS = [
  "/",
  "/products",
  "/categories",
  "/cart",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log("[SW] Some static assets failed to cache");
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

async function pruneCache(cacheName) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  if (requests.length > MAX_DYNAMIC_ENTRIES) {
    await Promise.all(requests.slice(0, requests.length - MAX_DYNAMIC_ENTRIES).map((req) => cache.delete(req)));
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (!url.origin || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: "Offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    return;
  }

  // Network-first for document navigations so users always get fresh pages
  if (request.destination === "document" || request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match("/");
          if (fallback) return fallback;
          return new Response("Offline", { status: 503 });
        })
    );
    return;
  }

  // Images/fonts: stale-while-revalidate with pruning
  if (request.destination === "image" || request.destination === "font") {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          const networkFetch = fetch(request)
            .then((response) => {
              if (response && response.ok) {
                cache.put(request, response.clone());
                pruneCache(DYNAMIC_CACHE);
              }
              return response;
            })
            .catch(() => cached);
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // Other same-origin GETs (JS/CSS chunks etc.): network-first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => (await caches.match(request)) || new Response("Offline", { status: 503 }))
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow("/");
    })
  );
});