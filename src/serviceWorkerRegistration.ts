// src/serviceWorkerRegistration.ts

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
  
  export function register() {
    if ('serviceWorker' in navigator) {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
      if (isLocalhost) {
        // This is running on localhost. Check if a service worker still exists or not.
        checkValidServiceWorker(swUrl);
      } else {
        // Register service worker
        registerValidSW(swUrl);
      }
    }
  }
  
  function registerValidSW(swUrl: string) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('✅ Service worker registered:', registration);
      })
      .catch((error) => {
        console.error('❌ Error during service worker registration:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl: string) {
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then((response) => {
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // No service worker found. Reload.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Service worker found.
          registerValidSW(swUrl);
        }
      })
      .catch(() => {
        console.log('🌐 No internet connection found. App is running in offline mode.');
      });
  }
  