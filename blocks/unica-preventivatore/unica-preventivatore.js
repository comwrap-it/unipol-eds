/* eslint-disable no-console */
import { loadCSS, loadScript } from '../../scripts/aem.js';
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
  // The selector 'tpd-disambiguazione-widget' identifies the root element to observe
  setupAssetPathInterceptor('tpd-disambiguazione-widget');

  // Asynchronous, non-blocking load for better performance (Lighthouse optimization).
  const loadAngularAsync = async () => {
    try {
      // Preload resources to improve load time without blocking the main thread.
      const preloadLinks = [
        { href: '/static/js/standalone/runtime.js', as: 'script' },
        { href: '/static/js/standalone/polyfills.js', as: 'script' },
        { href: '/static/js/standalone/vendor.js', as: 'script' },
        { href: '/static/js/standalone/main.js', as: 'script' },
        { href: '/static/css/standalone/styles.css', as: 'style' },
      ];

      preloadLinks.forEach(({ href, as }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (as === 'script') link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Load with requestIdleCallback to avoid blocking main thread.
      const loadFn = async () => {
        try {
          await loadCSS('/static/css/standalone/styles.css');
          console.log('CSS loaded for Unica Preventivatore component');

          await loadScript('/static/js/standalone/runtime.js', { type: 'module' });
          console.log('runtime.js loaded');

          await loadScript('/static/js/standalone/polyfills.js', { type: 'module' });
          console.log('polyfills.js loaded');

          await loadScript('/static/js/standalone/vendor.js', { type: 'module' });
          console.log('vendor.js loaded');

          await loadScript('/static/js/standalone/main.js', { type: 'module' });
          console.log('main.js loaded - Angular Unica Preventivatore component ready');

          if (hasRendered()) reveal('post-load');
        } catch (error) {
          console.error('Error loading Angular resources:', error);
          reveal('error');
        } finally {
          clearTimeout(fallbackTimeout);
        }
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadFn(), { timeout: 2000 });
      } else {
        // Fallback for browsers that don't support requestIdleCallback.
        setTimeout(() => loadFn(), 100);
      }
    } catch (error) {
      console.error('Error in async load setup:', error);
      reveal('error');
      clearTimeout(fallbackTimeout);
    }
  };

  // Start async loading in the background (non-blocking).
  loadAngularAsync();
}
