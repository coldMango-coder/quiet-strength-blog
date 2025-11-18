// Dev-only SW unregistration and cache cleanup for localhost
(function () {
  const isLocal = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname);
  if (!isLocal) return;

  // Unregister any existing service workers on this origin
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister().catch(() => {}));
      if (regs.length) console.log(`[dev] Unregistered ${regs.length} service worker(s)`);
    });
  }

  // Clear CacheStorage entries
  if (window.caches && window.caches.keys) {
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => {
      console.log('[dev] Cleared CacheStorage');
    }).catch(() => {});
  }
})();

