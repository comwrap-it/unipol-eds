/* eslint-disable no-console */
import { loadCSS, loadScript } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Crea l'elemento Angular custom element
  const angularElement = document.createElement('tpd-interprete-angular-dx-api-pu');
  block.appendChild(angularElement);

  try {
    // Carica il CSS
    await loadCSS('/static/css/styles.css');
    console.log('CSS caricato per componente Prodotto Unico');

    // Carica i file JavaScript in ordine (tutti type="module")
    // L'ordine è importante: runtime -> polyfills -> vendor -> main
    await loadScript('/static/js/runtime.js', { type: 'module' });
    console.log('runtime.js caricato');

    await loadScript('/static/js/polyfills.js', { type: 'module' });
    console.log('polyfills.js caricato');

    await loadScript('/static/js/vendor.js', { type: 'module' });
    console.log('vendor.js caricato');

    await loadScript('/static/js/main.js', { type: 'module' });
    console.log('main.js caricato - Componente Angular Prodotto Unico pronto');
  } catch (error) {
    console.error('Errore nel caricamento del componente Angular Prodotto Unico:', error);
  }
}
