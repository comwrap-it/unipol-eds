/* eslint-disable no-console */
import { loadCSS } from '../../scripts/aem.js';
import { setupAssetPathInterceptor } from '../../static/js/utils.js';
import { isAuthorMode } from '../../scripts/utils.js';

function createSkeleton() {
  const skeleton = document.createElement('div');
  skeleton.className = 'prodotto-unico-skeleton';
  skeleton.setAttribute('role', 'status');
  skeleton.setAttribute('aria-live', 'polite');
  skeleton.innerHTML = `
    <div class="pus-container">
      <div class="pus-header">
        <div class="pus-logo" aria-hidden="true"></div>
        <div class="pus-title" aria-hidden="true"></div>
      </div>
      
      <div class="pus-content">
        <div class="pus-main">
          <div class="pus-section">
            <div class="pus-section-title" aria-hidden="true"></div>
            <div class="pus-cards">
              <div class="pus-card" aria-hidden="true"></div>
              <div class="pus-card" aria-hidden="true"></div>
              <div class="pus-card" aria-hidden="true"></div>
            </div>
          </div>
          
          <div class="pus-section">
            <div class="pus-section-title" aria-hidden="true"></div>
            <div class="pus-form-fields">
              <div class="pus-field" aria-hidden="true"></div>
              <div class="pus-field" aria-hidden="true"></div>
            </div>
          </div>
        </div>
        
        <div class="pus-sidebar">
          <div class="pus-summary" aria-hidden="true">
            <div class="pus-summary-item"></div>
            <div class="pus-summary-item"></div>
            <div class="pus-summary-item"></div>
          </div>
        </div>
      </div>
      
      <div class="pus-actions">
        <div class="pus-button" aria-hidden="true"></div>
      </div>
    </div>
  `;
  return skeleton;
}

export default async function decorate(block) {
  // Show a skeleton immediately to improve perceived performance (LCP/CLS).
  const skeleton = createSkeleton();
  block.appendChild(skeleton);

  // In Universal Editor mode, show only the skeleton (no Angular loading).
  // This provides visual feedback to editors that the component is present.
  if (isAuthorMode(block)) {
    console.log('Universal Editor detected: showing skeleton only (Prodotto Unico)');
    skeleton.classList.add('editor-mode');
    // Add a visual indicator that this is editor mode.
    const editorBadge = document.createElement('div');
    editorBadge.className = 'pus-editor-badge';
    editorBadge.textContent = 'Prodotto Unico (Preview only)';
    skeleton.appendChild(editorBadge);
    return; // Don't load Angular in editor mode.
  }

  // Creates the Angular custom element (hidden until it actually renders).
  const angularElement = document.createElement('tpd-interprete-angular-dx-api-pu');
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
      console.log(`Prodotto Unico: skeleton hidden (${reason})`);
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
  setupAssetPathInterceptor('tpd-interprete-angular-dx-api-pu');

  let angularLoaded = false;

  // Ultra-lazy load: only load Angular when block is visible AND after the "delayed" phase.
  const loadAngularWhenReady = () => {
    if (angularLoaded) return;
    angularLoaded = true;

    console.log('Starting Angular load for Prodotto Unico');

    // Load all scripts in parallel with defer to avoid blocking.
    const scripts = [
      '/static/js/interprete/runtime.js',
      '/static/js/interprete/polyfills.js',
      '/static/js/interprete/vendor.js',
      '/static/js/interprete/main.js',
    ];

    // Load CSS first (non-blocking).
    loadCSS('/static/css/interprete/styles.css').catch((e) => {
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
