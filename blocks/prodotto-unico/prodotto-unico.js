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
    ['src', 'href', 'data-src', 'data-href'].forEach((attr) => {
      if (element.hasAttribute(attr)) {
        const value = element.getAttribute(attr);
        if (value && value.startsWith('/assets/')) {
          const newValue = rewriteAssetPath(value);
          element.setAttribute(attr, newValue);
          console.log(`[Asset Interceptor] ${attr}: ${value} -> ${newValue}`);
        }
      }
    });

    // Riscrivi background-image negli stili inline
    if (element.style && element.style.backgroundImage) {
      const bgImage = element.style.backgroundImage;
      if (bgImage.includes('/assets/')) {
        const newBgImage = bgImage.replace(/\/assets\//g, '/static/assets/');
        element.style.backgroundImage = newBgImage;
        console.log(`[Asset Interceptor] background-image: ${bgImage} -> ${newBgImage}`);
      }
    }

    // Controlla anche gli elementi figli
    const elementsWithSrc = element.querySelectorAll('[src^="/assets/"]');
    elementsWithSrc.forEach((el) => {
      const oldSrc = el.getAttribute('src');
      el.setAttribute('src', rewriteAssetPath(oldSrc));
      console.log(`[Asset Interceptor] src (child): ${oldSrc} -> ${rewriteAssetPath(oldSrc)}`);
    });

    const elementsWithHref = element.querySelectorAll('[href^="/assets/"]');
    elementsWithHref.forEach((el) => {
      const oldHref = el.getAttribute('href');
      el.setAttribute('href', rewriteAssetPath(oldHref));
      console.log(`[Asset Interceptor] href (child): ${oldHref} -> ${rewriteAssetPath(oldHref)}`);
    });
  };

  // Intercetta anche la creazione di elementi con createElement
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = function interceptedCreateElement(tagName, options) {
    const element = originalCreateElement(tagName, options);

    // Intercetta l'assegnazione di src e href
    ['src', 'href', 'data-src', 'data-href'].forEach((attr) => {
      const descriptor = Object.getOwnPropertyDescriptor(element, attr);
      if (descriptor && descriptor.set) {
        Object.defineProperty(element, attr, {
          set: function interceptedAttrSetter(value) {
            let modifiedValue = value;
            if (typeof modifiedValue === 'string' && modifiedValue.startsWith('/assets/')) {
              modifiedValue = rewriteAssetPath(modifiedValue);
              console.log(`[Asset Interceptor] ${attr} property: ${value} -> ${modifiedValue}`);
            }
            descriptor.set.call(this, modifiedValue);
          },
          get: descriptor.get,
          configurable: true,
          enumerable: true,
        });
      }
    });

    return element;
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
        const { target } = mutation;
        const attrName = mutation.attributeName;
        if (['src', 'href', 'style'].includes(attrName)) {
          rewriteElementPaths(target);
        }
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

  // Funzione per riscrivere tutti i path nel DOM periodicamente
  const scanAndRewriteAllPaths = () => {
    const angularElement = document.querySelector('tpd-interprete-angular-dx-api-pu');
    if (angularElement) {
      // Cerca tutti gli elementi con path /assets/ in tutto il subtree
      const allElements = angularElement.querySelectorAll('*');
      allElements.forEach((el) => {
        rewriteElementPaths(el);
      });
      rewriteElementPaths(angularElement);
    }
  };

  // Prova ad avviare l'observer immediatamente
  if (!startObserver()) {
    // Se l'elemento non è ancora disponibile, riprova dopo il caricamento di Angular
    const checkInterval = setInterval(() => {
      if (startObserver()) {
        clearInterval(checkInterval);
        // Esegui una scansione completa dopo che l'observer è attivo
        setTimeout(scanAndRewriteAllPaths, 500);
      }
    }, 100);

    // Timeout di sicurezza dopo 10 secondi
    setTimeout(() => {
      clearInterval(checkInterval);
      // Esegui una scansione finale anche se l'observer non si è attivato
      scanAndRewriteAllPaths();
    }, 10000);
  } else {
    // Se l'observer si è avviato immediatamente, esegui una scansione dopo un breve delay
    setTimeout(scanAndRewriteAllPaths, 1000);
  }

  // Esegui scansioni periodiche per catturare elementi creati dinamicamente
  const periodicScan = setInterval(() => {
    scanAndRewriteAllPaths();
  }, 2000);

  // Ferma la scansione periodica dopo 30 secondi (dovrebbe essere sufficiente)
  setTimeout(() => clearInterval(periodicScan), 30000);

  // Intercetta le richieste fetch per riscrivere i path
  const originalFetch = window.fetch;
  window.fetch = function interceptedFetch(...args) {
    const modifiedArgs = [...args];
    if (typeof modifiedArgs[0] === 'string' && modifiedArgs[0].startsWith('/assets/')) {
      const originalUrl = modifiedArgs[0];
      modifiedArgs[0] = rewriteAssetPath(originalUrl);
      console.log(`[Asset Interceptor] Fetch: ${originalUrl} -> ${modifiedArgs[0]}`);
    }
    return originalFetch.apply(this, modifiedArgs);
  };

  // Intercetta le richieste XMLHttpRequest per riscrivere i path
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function interceptedOpen(method, url, ...rest) {
    let modifiedUrl = url;
    if (typeof modifiedUrl === 'string' && modifiedUrl.startsWith('/assets/')) {
      const originalUrl = modifiedUrl;
      modifiedUrl = rewriteAssetPath(originalUrl);
      console.log(`[Asset Interceptor] XHR: ${originalUrl} -> ${modifiedUrl}`);
    }
    return originalOpen.call(this, method, modifiedUrl, ...rest);
  };

  // Intercetta anche le richieste di risorse (immagini, CSS, etc.)
  // a livello di Service Worker/Request.
  // Questo intercetta anche le richieste dirette del browser per immagini, font, etc.
  if ('serviceWorker' in navigator) {
    // Se c'è un service worker, potrebbe intercettare le richieste
    // Ma per ora ci concentriamo su fetch e XHR
  }

  // Intercetta le modifiche agli stili tramite setProperty
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function interceptedSetProperty(
    property,
    value,
    priority,
  ) {
    let modifiedValue = value;
    if (
      property === 'background-image'
      && typeof modifiedValue === 'string'
      && modifiedValue.includes('/assets/')
    ) {
      modifiedValue = modifiedValue.replace(/\/assets\//g, '/static/assets/');
      console.log(`[Asset Interceptor] setProperty background-image: ${value} -> ${modifiedValue}`);
    }
    return originalSetProperty.call(this, property, modifiedValue, priority);
  };

  // Intercetta anche l'assegnazione diretta a backgroundImage
  const styleDescriptor = Object.getOwnPropertyDescriptor(
    CSSStyleDeclaration.prototype,
    'backgroundImage',
  );
  if (styleDescriptor && styleDescriptor.set) {
    const originalSet = styleDescriptor.set;
    Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundImage', {
      set: function interceptedBackgroundImageSetter(value) {
        let modifiedValue = value;
        if (typeof modifiedValue === 'string' && modifiedValue.includes('/assets/')) {
          modifiedValue = modifiedValue.replace(/\/assets\//g, '/static/assets/');
          console.log(`[Asset Interceptor] backgroundImage setter: ${value} -> ${modifiedValue}`);
        }
        originalSet.call(this, modifiedValue);
      },
      get: styleDescriptor.get,
      configurable: true,
      enumerable: true,
    });
  }

  // Intercetta anche la creazione di elementi Image
  const originalImage = window.Image;
  window.Image = function InterceptedImage(...args) {
    const img = new originalImage(...args);
    const originalSrcSetter = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'src',
    )?.set;
    if (originalSrcSetter) {
      Object.defineProperty(img, 'src', {
        set: function interceptedSrcSetter(value) {
          let modifiedValue = value;
          if (typeof modifiedValue === 'string' && modifiedValue.startsWith('/assets/')) {
            modifiedValue = rewriteAssetPath(modifiedValue);
            console.log(`[Asset Interceptor] Image.src: ${value} -> ${modifiedValue}`);
          }
          originalSrcSetter.call(this, modifiedValue);
        },
        get: Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')?.get,
        configurable: true,
        enumerable: true,
      });
    }
    return img;
  };
  window.Image.prototype = originalImage.prototype;

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
