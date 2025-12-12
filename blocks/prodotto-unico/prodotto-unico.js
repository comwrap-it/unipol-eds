/* eslint-disable no-console */
import { loadCSS, loadScript } from '../../scripts/aem.js';

/**
 * Riscrive i path degli asset da /assets/ a /static/assets/
 * per correggere i riferimenti hardcoded nell'applicazione Angular
 */
function setupAssetPathInterceptor() {
  // Funzione helper per riscrivere i path
  const rewriteAssetPath = (path) => {
    if (typeof path === 'string' && path.startsWith('/assets/')) {
      return path.replace(/^\/assets\//, '/static/assets/');
    }
    return path;
  };

  // Funzione per riscrivere i path in un elemento e nei suoi figli
  const rewriteElementPaths = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

    // Riscrivi attributi src e href
    ['src', 'href'].forEach((attr) => {
      if (element.hasAttribute(attr)) {
        const value = element.getAttribute(attr);
        if (value && value.startsWith('/assets/')) {
          element.setAttribute(attr, rewriteAssetPath(value));
        }
      }
    });

    // Riscrivi background-image negli stili inline
    if (element.style && element.style.backgroundImage) {
      const bgImage = element.style.backgroundImage;
      if (bgImage.includes('/assets/')) {
        element.style.backgroundImage = bgImage.replace(/\/assets\//g, '/static/assets/');
      }
    }

    // Controlla anche gli elementi figli
    const elementsWithSrc = element.querySelectorAll('[src^="/assets/"]');
    elementsWithSrc.forEach((el) => {
      el.setAttribute('src', rewriteAssetPath(el.getAttribute('src')));
    });

    const elementsWithHref = element.querySelectorAll('[href^="/assets/"]');
    elementsWithHref.forEach((el) => {
      el.setAttribute('href', rewriteAssetPath(el.getAttribute('href')));
    });
  };

  // Intercetta le modifiche al DOM per riscrivere src, href, e background-image
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Gestisci i nuovi nodi aggiunti
      mutation.addedNodes.forEach((node) => {
        rewriteElementPaths(node);
      });

      // Gestisci le modifiche agli attributi
      if (mutation.type === 'attributes') {
        rewriteElementPaths(mutation.target);
      }
    });
  });

  // Avvia l'osservazione sul custom element Angular quando è disponibile
  const startObserver = () => {
    const angularElement = document.querySelector('tpd-interprete-angular-dx-api-pu');
    if (angularElement) {
      observer.observe(angularElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'style'],
      });
      // Riscrivi anche gli elementi già presenti
      rewriteElementPaths(angularElement);
      return true;
    }
    return false;
  };

  // Prova ad avviare l'observer immediatamente
  if (!startObserver()) {
    // Se l'elemento non è ancora disponibile, riprova dopo il caricamento di Angular
    const checkInterval = setInterval(() => {
      if (startObserver()) {
        clearInterval(checkInterval);
      }
    }, 100);

    // Timeout di sicurezza dopo 10 secondi
    setTimeout(() => clearInterval(checkInterval), 10000);
  }

  // Intercetta le richieste fetch per riscrivere i path
  const originalFetch = window.fetch;
  window.fetch = function interceptedFetch(...args) {
    const modifiedArgs = [...args];
    if (typeof modifiedArgs[0] === 'string' && modifiedArgs[0].startsWith('/assets/')) {
      modifiedArgs[0] = rewriteAssetPath(modifiedArgs[0]);
    }
    return originalFetch.apply(this, modifiedArgs);
  };

  // Intercetta le richieste XMLHttpRequest per riscrivere i path
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function interceptedOpen(method, url, ...rest) {
    let modifiedUrl = url;
    if (typeof modifiedUrl === 'string' && modifiedUrl.startsWith('/assets/')) {
      modifiedUrl = rewriteAssetPath(modifiedUrl);
    }
    return originalOpen.call(this, method, modifiedUrl, ...rest);
  };

  // Intercetta le modifiche agli stili tramite setProperty
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function interceptedSetProperty(property, value, priority) {
    let modifiedValue = value;
    if (property === 'background-image' && typeof modifiedValue === 'string' && modifiedValue.includes('/assets/')) {
      modifiedValue = modifiedValue.replace(/\/assets\//g, '/static/assets/');
    }
    return originalSetProperty.call(this, property, modifiedValue, priority);
  };

  // Intercetta anche l'assegnazione diretta a backgroundImage
  const styleDescriptor = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'backgroundImage');
  if (styleDescriptor && styleDescriptor.set) {
    const originalSet = styleDescriptor.set;
    Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundImage', {
      set: function interceptedBackgroundImageSetter(value) {
        let modifiedValue = value;
        if (typeof modifiedValue === 'string' && modifiedValue.includes('/assets/')) {
          modifiedValue = modifiedValue.replace(/\/assets\//g, '/static/assets/');
        }
        originalSet.call(this, modifiedValue);
      },
      get: styleDescriptor.get,
      configurable: true,
      enumerable: true,
    });
  }

  console.log('Asset path interceptor configurato: /assets/ -> /static/assets/');
}

export default async function decorate(block) {
  // Crea l'elemento Angular custom element
  const angularElement = document.createElement('tpd-interprete-angular-dx-api-pu');
  block.appendChild(angularElement);

  // Configura l'interceptor per i path degli asset PRIMA di caricare Angular
  setupAssetPathInterceptor();

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
