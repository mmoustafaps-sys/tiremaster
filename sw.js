const VER='tiremaster-v1', SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const CDN=['https://unpkg.com/lucide@0.344.0','https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js','https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js','https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js','https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.js','https://cdn.tailwindcss.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(async c=>{await c.addAll(SHELL);
  await Promise.all(CDN.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{})));}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VER).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const same=u.origin===location.origin;
  // app shell: network-first (always get updates when online), fall back to cache
  if(same){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(VER).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));return}
  // third-party (CDN, fonts, flags): cache-first, fill on demand
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{const cp=r.clone();caches.open(VER).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>m)));
});
