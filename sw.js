const CACHE = 'mewat-cattle-v2'; // bump this (v3, v4, ...) each time you update index.html — helps force a clean cache reset on install
const FILES = [
  '/Mewat-cattle/',
  '/Mewat-cattle/index.html'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

// NETWORK-FIRST: always try to fetch the latest version from the internet first.
// Only fall back to the cached copy if the network request fails (e.g. no internet).
// This is the key fix — it means the app shows your newest update automatically,
// without anyone needing to clear their cache by hand after every change.
self.addEventListener('fetch', e=>{
  if(!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(response=>{
      if(response && response.status===200){
        const clone = response.clone();
        caches.open(CACHE).then(c=>c.put(e.request, clone));
      }
      return response;
    }).catch(()=>
      caches.match(e.request).then(cached=>cached || caches.match('/Mewat-cattle/index.html'))
    )
  );
});
