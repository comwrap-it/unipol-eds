/* eslint-disable no-console */
/**
 * Utility per riscrivere i path degli asset da /assets/ a /static/assets/
 * per correggere i riferimenti hardcoded nelle applicazioni Angular integrate in AEM EDS
 *
 * @param {string} elementSelector - Selettore CSS per l'elemento root da osservare
 * @param {Object} options - Opzioni di configurazione
 * @param {boolean} options.enableLogging - Abilita il logging delle riscritture (default: true)
 */
export function setupAssetPathInterceptor(elementSelector, options = {}) {
  const { enableLogging = true } = options;

  // Funzione helper per riscrivere i path
  const rewriteAssetPath = (path) => {
    if (typeof path === 'string' && path.startsWith('/assets/')) {
      return path.replace(/^\/assets\//, '/static/assets/');
    }
    return path;
  };

  // Funzione per loggare (se abilitato)
  const log = (message) => {
    if (enableLogging) {
      console.log(message);
    }
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
          log(`[Asset Interceptor] ${attr}: ${value} -> ${newValue}`);
        }
      }
    });

    // Riscrivi background-image negli stili inline
    if (element.style && element.style.backgroundImage) {
      const bgImage = element.style.backgroundImage;
      if (bgImage.includes('/assets/')) {
        const newBgImage = bgImage.replace(/\/assets\//g, '/static/assets/');
        element.style.backgroundImage = newBgImage;
        log(`[Asset Interceptor] background-image: ${bgImage} -> ${newBgImage}`);
      }
    }

    // Controlla anche gli elementi figli
    const elementsWithSrc = element.querySelectorAll('[src^="/assets/"]');
    elementsWithSrc.forEach((el) => {
      const oldSrc = el.getAttribute('src');
      el.setAttribute('src', rewriteAssetPath(oldSrc));
      log(`[Asset Interceptor] src (child): ${oldSrc} -> ${rewriteAssetPath(oldSrc)}`);
    });

    const elementsWithHref = element.querySelectorAll('[href^="/assets/"]');
    elementsWithHref.forEach((el) => {
      const oldHref = el.getAttribute('href');
      el.setAttribute('href', rewriteAssetPath(oldHref));
      log(`[Asset Interceptor] href (child): ${oldHref} -> ${rewriteAssetPath(oldHref)}`);
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
              log(`[Asset Interceptor] ${attr} property: ${value} -> ${modifiedValue}`);
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

  // Avvia l'osservazione sull'elemento specificato quando è disponibile
  const startObserver = () => {
    const targetElement = document.querySelector(elementSelector);
    if (targetElement) {
      observer.observe(targetElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'style'],
      });
      // Riscrivi anche gli elementi già presenti
      rewriteElementPaths(targetElement);
      return true;
    }
    return false;
  };

  // Funzione per riscrivere tutti i path nel DOM periodicamente
  const scanAndRewriteAllPaths = () => {
    const targetElement = document.querySelector(elementSelector);
    if (targetElement) {
      // Cerca tutti gli elementi con path /assets/ in tutto il subtree
      const allElements = targetElement.querySelectorAll('*');
      allElements.forEach((el) => {
        rewriteElementPaths(el);
      });
      rewriteElementPaths(targetElement);
    }
  };

  // Prova ad avviare l'observer immediatamente
  if (!startObserver()) {
    // Se l'elemento non è ancora disponibile, riprova dopo il caricamento
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
      log(`[Asset Interceptor] Fetch: ${originalUrl} -> ${modifiedArgs[0]}`);
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
      log(`[Asset Interceptor] XHR: ${originalUrl} -> ${modifiedUrl}`);
    }
    return originalOpen.call(this, method, modifiedUrl, ...rest);
  };

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
      log(`[Asset Interceptor] setProperty background-image: ${value} -> ${modifiedValue}`);
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
          log(`[Asset Interceptor] backgroundImage setter: ${value} -> ${modifiedValue}`);
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
    const img = Reflect.construct(originalImage, args);
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
            log(`[Asset Interceptor] Image.src: ${value} -> ${modifiedValue}`);
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

  log(`Asset path interceptor configurato per ${elementSelector}: /assets/ -> /static/assets/`);
}

