// Service Worker control utilities
// Unregisters all SWs and clears caches when REACT_APP_ENABLE_SW!=='true'

export async function ensureNoSW() {
  try {
    const enableSW = process.env.REACT_APP_ENABLE_SW === 'true';
    if (enableSW) return; // SW explicitly enabled

    // Run once per page load as early as possible
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Avoid repeated cache clearing in same session
    const clearedKey = '__sw_caches_cleared__';

    // Unregister all service workers
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister().catch(() => {})));
    } catch {}

    // Clear CacheStorage once per session
    try {
      if (!sessionStorage.getItem(clearedKey) && 'caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k).catch(() => {})));
        sessionStorage.setItem(clearedKey, '1');
      }
    } catch {}
  } catch {}
}

