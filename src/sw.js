importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js');

if (workbox) {
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
    workbox.routing.registerRoute(
        /\.js$/,
        new workbox.strategies.NetworkFirst()
    );
    workbox.loadModule('workbox-strategies');
    self.addEventListener('fetch', (event) => {
        if (event.request.url.endsWith('.png')) {
            // Referencing workbox.strategies will now work as expected.
            const cacheFirst = new workbox.strategies.CacheFirst();
            event.respondWith(cacheFirst.handle({ request: event.request }));
        }
    });
} else {
    console.log(`Workbox didn't load`);
}