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

  try {
    // Loads the CSS
    await loadCSS('/static/css/standalone/styles.css');
    console.log('CSS loaded for Unica Preventivatore component');

    // Loads the JavaScript files in order (all type="module")
    // The order is important: runtime -> polyfills -> vendor -> main
    await loadScript('/static/js/standalone/runtime.js', { type: 'module' });
    console.log('runtime.js loaded');

    await loadScript('/static/js/standalone/polyfills.js', { type: 'module' });
    console.log('polyfills.js loaded');

    await loadScript('/static/js/standalone/vendor.js', { type: 'module' });
    console.log('vendor.js loaded');

    await loadScript('/static/js/standalone/main.js', { type: 'module' });
    console.log('main.js loaded - Angular Unica Preventivatore component ready');

    // If Angular rendered very fast, ensure we remove the skeleton promptly.
    if (hasRendered()) reveal('post-load');
  } catch (error) {
    console.error('Error loading the Angular Unica Preventivatore component:', error);
    // Even on error, do not leave the skeleton stuck forever.
    reveal('error');
  } finally {
    clearTimeout(fallbackTimeout);
  }
}
