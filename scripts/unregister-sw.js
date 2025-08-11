// Service Worker Unregistration Script
// Run this in the browser dev console if experiencing cross-project service worker conflicts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      console.log('Unregistering service worker:', registration);
      registration.unregister();
    });
  }).catch(error => {
    console.log('Service worker unregistration failed:', error);
  });
}