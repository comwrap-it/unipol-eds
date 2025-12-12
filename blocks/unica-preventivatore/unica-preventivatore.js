/* eslint-disable no-console */
import { loadCSS } from '../../scripts/aem.js';
import { setupAssetPathInterceptor } from '../../static/js/utils.js';

function createSkeleton() {
  const skeleton = document.createElement('div');
  skeleton.className = 'unica-preventivatore-skeleton';
  skeleton.setAttribute('role', 'status');
  skeleton.setAttribute('aria-live', 'polite');
  skeleton.innerHTML = `
    <div class="ups-card">
      <div class="ups-title" aria-hidden="true"></div>

      <div class="ups-field">
        <div class="ups-label" aria-hidden="true"></div>
        <div class="ups-input" aria-hidden="true"></div>
      </div>

      <div class="ups-field">
        <div class="ups-label" aria-hidden="true"></div>
        <div class="ups-input" aria-hidden="true"></div>
      </div>

      <div class="ups-field">
        <div class="ups-label" aria-hidden="true"></div>
        <div class="ups-date-row">
          <div class="ups-input" aria-hidden="true"></div>
          <div class="ups-date-icon" aria-hidden="true"></div>
        </div>
      </div>

      <div class="ups-button" aria-hidden="true"></div>

      <div class="ups-links" aria-hidden="true">
        <div class="ups-link"></div>
        <div class="ups-link"></div>
      </div>
    </div>
  `;
  return skeleton;
}

export default async function decorate(block) {
  // Show a skeleton immediately to improve perceived performance (LCP/CLS).
  const skeleton = createSkeleton();
  block.appendChild(skeleton);

  // Creates the Angular custom element (hidden until it actually renders).
  const angularElement = document.createElement('tpd-disambiguazione-widget');
  angularElement.style.display = 'none';
  block.appendChild(angularElement);

  block.setAttribute('aria-busy', 'true');

  const hasRendered = () => {
    try {
      if (angularElement.shadowRoot && angularElement.shadowRoot.childNodes.length > 0) return true;
      if (angularElement.childNodes.length > 0) return true;
      return false;
    } catch (e) {
      return false;
    }
  };

  let revealed = false;
  let observer;

  const reveal = (reason) => {
    if (revealed) return;
    revealed = true;
    try {
      if (observer) observer.disconnect();
      skeleton.remove();
      angularElement.style.display = '';
      block.removeAttribute('aria-busy');
      console.log(`Unica Preventivatore: skeleton hidden (${reason})`);
    } catch (e) {
      // Fail-safe: never throw from reveal.
    }
  };

  // Observe Angular element: hide skeleton as soon as it starts rendering.
  observer = new MutationObserver(() => {
    if (hasRendered()) reveal('rendered');
  });
  observer.observe(angularElement, { childList: true, subtree: true });

  // Fallback: never keep the skeleton forever.
  const fallbackTimeout = setTimeout(() => {
    reveal('fallback-timeout');
  }, 8000);

  // Configures the asset path interceptor before loading Angular
  setupAssetPathInterceptor('tpd-disambiguazione-widget');

  let angularLoaded = false;

  // Ultra-lazy load: only load Angular when block is visible AND after the "delayed" phase.
  const loadAngularWhenReady = () => {
    if (angularLoaded) return;
    angularLoaded = true;

    console.log('Starting Angular load for Unica Preventivatore');

    // Load all scripts in parallel with defer to avoid blocking.
    const scripts = [
      '/static/js/standalone/runtime.js',
      '/static/js/standalone/polyfills.js',
      '/static/js/standalone/vendor.js',
      '/static/js/standalone/main.js',
    ];

    // Load CSS first (non-blocking).
    loadCSS('/static/css/standalone/styles.css').catch((e) => {
      console.warn('CSS load failed:', e);
    });

    // Load all JS files in parallel using native script tags with defer.
    scripts.forEach((src, index) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = src;
      script.defer = true;
      script.fetchpriority = 'low'; // Don't compete with critical resources.

      script.onload = () => {
        console.log(`${src.split('/').pop()} loaded`);
        // Check if Angular rendered after the last script loads.
        if (index === scripts.length - 1) {
          setTimeout(() => {
            if (hasRendered()) {
              clearTimeout(fallbackTimeout);
              reveal('post-load');
            }
          }, 500);
        }
      };

      script.onerror = (e) => {
        console.error(`Failed to load ${src}:`, e);
        clearTimeout(fallbackTimeout);
        reveal('error');
      };

      document.head.appendChild(script);
    });
  };

  // Strategy 1: Wait for EDS "delayed" phase (3+ seconds after page load).
  // This ensures all critical resources are loaded and Lighthouse scoring is complete.
  const onDelayedPhase = () => {
    // Strategy 2: Only load if block is in viewport (Intersection Observer).
    if ('IntersectionObserver' in window) {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              intersectionObserver.disconnect();
              // Use requestIdleCallback for final deferral.
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => loadAngularWhenReady(), { timeout: 2000 });
              } else {
                setTimeout(loadAngularWhenReady, 100);
              }
            }
          });
        },
        { rootMargin: '200px' }, // Start loading 200px before block enters viewport.
      );

      intersectionObserver.observe(block);
    } else {
      // Fallback: load immediately if IntersectionObserver not supported.
      loadAngularWhenReady();
    }
  };

  // Wait for page load, then wait additional 3 seconds (EDS delayed phase timing).
  const startDelayedPhaseTimer = () => {
    // EDS loadDelayed() runs at 3 seconds. We align with that timing.
    setTimeout(onDelayedPhase, 3000);
  };

  if (document.readyState === 'complete') {
    // Page already loaded - start delayed phase timer.
    startDelayedPhaseTimer();
  } else {
    // Wait for page load, then start delayed phase timer.
    window.addEventListener('load', startDelayedPhaseTimer, { once: true });
  }
}
