import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

async function files(dir) {
  const items = await readdir(dir, { withFileTypes: true });
  const result = [];
  for (const item of items) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) result.push(...await files(file));
    else if (item.name !== 'sw.js') result.push('/' + path.relative('dist', file).split(path.sep).join('/'));
  }
  return result;
}
const precache = [...new Set(['/', ...await files('dist')])];
const version = createHash('sha256').update(JSON.stringify(precache)).digest('hex').slice(0, 12);
const worker = `const CACHE='territorios-demo-${version}';
const PRECACHE=${JSON.stringify(precache)};
self.addEventListener('install',e=>e.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(PRECACHE);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('territorios-demo-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith((async()=>{const hit=await caches.match(e.request);if(hit)return hit;try{return await fetch(e.request)}catch{return e.request.mode==='navigate'?await caches.match('/')||Response.error():Response.error()}})())});
self.addEventListener('message',e=>{if(e.data?.type==='CHECK_OFFLINE')e.waitUntil((async()=>{const cache=await caches.open(CACHE);const results=await Promise.all(PRECACHE.map(p=>cache.match(p)));e.ports[0]?.postMessage({ok:results.every(Boolean)})})())});
`;
await writeFile('dist/sw.js', worker);
console.log(`Service worker generated: ${precache.length} local paths.`);
