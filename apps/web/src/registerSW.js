export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/farm' }).then(
        (registration) => {
          console.log('SW registered for /farm scope:', registration.scope);
        },
        (err) => {
          console.log('SW registration failed:', err);
        }
      );
    });
  }
}