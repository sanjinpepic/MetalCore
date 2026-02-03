self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Simple pass-through to satisfy Chrome's PWA requirement
    // For a real PWA you'd add caching logic here
    event.respondWith(fetch(event.request));
});
