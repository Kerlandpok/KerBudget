const CACHE='kerbudget-v6-20260727';
const ASSETS=['./','./index.html','./styles.css','./app.js','./data.js','./excel-extra.js','./manifest.json','./icon.svg'];

self.addEventListener('install', event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate', event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put('./index.html',copy));
        return r;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }
  event.respondWith(
    fetch(event.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(event.request,copy));
      return r;
    }).catch(()=>caches.match(event.request))
  );
});
