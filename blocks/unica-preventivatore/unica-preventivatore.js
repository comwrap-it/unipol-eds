/* eslint-disable no-console */
import { loadCSS, loadScript } from '../../scripts/aem.js';
import { setupAssetPathInterceptor } from '../../static/js/utils.js';

export default async function decorate(block) {
  // Crea l'elemento Angular custom element
  const angularElement = document.createElement('tpd-disambiguazione-widget');
  block.appendChild(angularElement);

  // Configura l'interceptor per i path degli asset PRIMA di caricare Angular
  // Il selettore 'tpd-disambiguazione-widget' identifica l'elemento root da osservare
  setupAssetPathInterceptor('tpd-disambiguazione-widget');

  try {
    // Carica il CSS
    await loadCSS('/static/css/standalone/styles.css');
    console.log('CSS caricato per componente Unica Preventivatore');

    // Carica i file JavaScript in ordine (tutti type="module")
    // L'ordine è importante: runtime -> polyfills -> vendor -> main
    await loadScript('/static/js/standalone/runtime.js', { type: 'module' });
    console.log('runtime.js caricato');

    await loadScript('/static/js/standalone/polyfills.js', { type: 'module' });
    console.log('polyfills.js caricato');

    await loadScript('/static/js/standalone/vendor.js', { type: 'module' });
    console.log('vendor.js caricato');

    await loadScript('/static/js/standalone/main.js', { type: 'module' });
    console.log('main.js caricato - Componente Angular Unica Preventivatore pronto');
  } catch (error) {
    console.error('Errore nel caricamento del componente Angular Unica Preventivatore:', error);
  }
}
