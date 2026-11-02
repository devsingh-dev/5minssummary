const CACHE_VERSION = '5minsummary-pro-v2.6';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Core pages & JSON data pre-cached immediately on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/Article.html',
  '/History.html',
  '/Science.html',
  '/Weekly.html',
  '/Tools.html',
  '/manifest.json',
  '/content/articles.json',
  '/content/history.json',
  '/content/science.json',
  '/content/weekly.json',
  '/tools/image-compressor.html'
];

// Full list of tools & resources when user clicks "Download Full Offline Pack"
const EXTENDED_OFFLINE_PACK = [
  ...CORE_ASSETS,
  '/tools/age-calculator.html',
  '/tools/bmi-calculator.html',
  '/tools/compound-interest.html',
  '/tools/emi-calculator.html',
  '/tools/percentage-calculator.html',
  '/tools/qr-generator.html',
  '/tools/password-generator.html',
  '/tools/word-counter.html',
  '/tools/unit-converter.html',
  '/tools/json-formatter.html',
  '/tools/pomodoro-timer.html',
  '/tools/stopwatch-timer.html',
  '/tools/color-picker.html',
  '/tools/text-to-speech.html',
  '/tools/2048-game.html',
  '/tools/chess-game.html',
  '/tools/memory-match.html',
  '/tools/minesweeper.html',
  '/tools/snake-game.html',
  '/tools/sudoku.html',
  '/tools/tetris.html',
  '/tools/tic-tac-toe.html',
  '/tools/tower-stacker.html'
];

// Built-in Offline Fallback HTML (Shown if user opens an uncached link without internet)
const OFFLINE_FALLBACK_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline Mode — 5minSummary App</title>
  <style>
    body { margin:0; font-family: Georgia, serif; background:#FBF9F5; color:#191918; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px; text-align:center; }
    .card { max-width:460px; background:#fff; border:1px solid #E6E2D8; border-radius:20px; padding:36px 28px; box-shadow:0 10px 30px rgba(0,0,0,0.04); }
    .badge { display:inline-block; background:#E3EFEA; color:#1A5D42; font-family:sans-serif; font-size:11px; font-weight:700; letter-spacing:0.1em; padding:5px 12px; border-radius:99px; margin-bottom:14px; }
    h1 { font-size:28px; margin:0 0 10px; }
    p { font-family:sans-serif; font-size:14px; color:#6E6D68; line-height:1.6; margin-bottom:24px; }
    .btns { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; font-family:sans-serif; }
    a, button { background:#1A5D42; color:#fff; text-decoration:none; border:none; padding:12px 20px; border-radius:12px; font-size:13px; font-weight:600; cursor:pointer; }
    a.sec { background:#F3EFE6; color:#191918; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">⚡ OFFLINE APP MODE</span>
    <h1>You are currently offline</h1>
    <p>This specific page hasn't been cached yet, but your saved 5minSummary articles and interactive tools are ready to use offline!</p>
    <div class="btns">
      <a href="/index.html">🏠 Go to Home Feed</a>
      <a href="/Tools.html" class="sec">🛠️ Open Offline Tools</a>
      <button onclick="location.reload()">🔄 Retry Connection</button>
    </div>
  </div>
</body>
</html>`;

// 1. Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      for (const url of CORE_ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          // Ignore individual missing files so install never breaks
        }
      }
    })
  );
  self.skipWaiting();
});

// 2. Activate & Clean Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 3. Smart Fetch Strategy (Stale-While-Revalidate for HTML/JSON, Cache-First for Images)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const networkFetch = fetch(req)
        .then((netRes) => {
          if (netRes && netRes.status === 200 && netRes.type === 'basic') {
            const clone = netRes.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(req, clone));
          }
          return netRes;
        })
        .catch(() => {
          if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
            return new Response(OFFLINE_FALLBACK_HTML, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
          }
        });

      return cachedRes || networkFetch;
    })
  );
});

// 4. Listen for "DOWNLOAD_OFFLINE_PACK" from index.html & send live 0% -> 100% progress
self.addEventListener('message', async (event) => {
  if (!event.data || event.data.type !== 'DOWNLOAD_OFFLINE_PACK') return;

  const client = event.source;
  const cache = await caches.open(STATIC_CACHE);

  // Discover all article slugs dynamically from JSON files so every post in /posts/ is also cached!
  const dynamicPostUrls = [];
  const jsonFiles = ['/content/articles.json', '/content/history.json', '/content/science.json', '/content/weekly.json'];

  for (const jf of jsonFiles) {
    try {
      const res = await fetch(jf);
      if (res.ok) {
        const items = await res.json();
        items.forEach((item) => {
          if (item.slug) dynamicPostUrls.push(`/posts/${item.slug}.html`);
        });
      }
    } catch (e) {}
  }

  const allUrls = Array.from(new Set([...EXTENDED_OFFLINE_PACK, ...dynamicPostUrls]));
  let completed = 0;

  for (const url of allUrls) {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (e) {}

    completed++;
    const percent = Math.round((completed / allUrls.length) * 100);
    if (client) {
      client.postMessage({
        type: 'OFFLINE_PACK_PROGRESS',
        completed,
        total: allUrls.length,
        percent
      });
    }
  }

  if (client) {
    client.postMessage({
      type: 'OFFLINE_PACK_COMPLETE',
      totalCached: allUrls.length
    });
  }
});