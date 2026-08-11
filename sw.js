const CACHE = 'mewat-cattle-v1';
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

self.addEventListener('fetch', e=>{
  if(!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(response=>{
        if(response && response.status===200){
          const clone = response.clone();
          caches.open(CACHE).then(c=>c.put(e.request, clone));
        }
        return response;
      }).catch(()=>caches.match('/Mewat-cattle/index.html'));
    })
  );
});
