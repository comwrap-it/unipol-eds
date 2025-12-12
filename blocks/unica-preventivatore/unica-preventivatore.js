/* eslint-disable no-console */
import { loadCSS, loadScript } from '../../scripts/aem.js';
import { setupAssetPathInterceptor } from '../../static/js/utils.js';

export default async function decorate(block) {
  // Creates the Angular custom element
  const angularElement = document.createElement('tpd-disambiguazione-widget');
  block.appendChild(angularElement);

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
  } catch (error) {
    console.error('Error loading the Angular Unica Preventivatore component:', error);
  }
}
