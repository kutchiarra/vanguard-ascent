// Rede primeiro, cache como reserva: online sempre pega a versao nova,
// offline abre a ultima versao vista. Nao precisa trocar numero de versao a cada atualizacao.
// ponytail: com sinal fraco, espera a rede falhar antes de cair no cache;
// trocar por cache-primeiro + versao se a abertura ficar lenta.
const CACHE = "vanguard-ascent";
const ARQUIVOS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
