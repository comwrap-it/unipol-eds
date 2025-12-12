// add swiper from CDN
export default function loadSwiper() {
  return new Promise((resolve, reject) => {
    // Check if Swiper is already loaded
    if (typeof window.Swiper !== 'undefined') {
      resolve(window.Swiper);
      return;
    }

    // Then load JavaScript
    const scriptRule = document.createElement('script');
    scriptRule.setAttribute('type', 'text/javascript');
    scriptRule.src = 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js';

    scriptRule.onload = () => {
      // Give it a moment for the global Swiper to be available
      setTimeout(() => {
        if (typeof window.Swiper !== 'undefined') {
          resolve(window.Swiper);
        } else {
          reject(new Error('Swiper not found on window after CDN load'));
        }
      }, 100);
    };

    scriptRule.onerror = () => {
      reject(new Error('Failed to load Swiper script'));
    };

    document.head.append(scriptRule);
  });
}
