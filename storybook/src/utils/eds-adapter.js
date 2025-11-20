/**
 * Adapter per componenti EDS (Edge Delivery Services)
 * Questo modulo fornisce utility per integrare i componenti EDS in Storybook
 */

// Mock delle funzioni AEM per Storybook
export const mockAEMFunctions = {
  createOptimizedPicture: (src, alt = '', eager = false, breakpoints = []) => {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = eager ? 'eager' : 'lazy';
    picture.appendChild(img);
    return picture;
  },
  
  getMetadata: (name, doc = document) => {
    // Mock metadata per Storybook
    const mockMetadata = {
      'nav': '/nav',
      'footer': '/footer'
    };
    return mockMetadata[name] || '';
  },
  
  loadCSS: async (href) => {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      document.head.appendChild(link);
    });
  },
  
  loadScript: async (src, attrs = {}) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      Object.entries(attrs).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
};

// Mock delle funzioni scripts per Storybook
export const mockScriptsFunctions = {
  moveInstrumentation: (from, to) => {
    // In Storybook non abbiamo bisogno dell'instrumentazione
    // Questa è una funzione no-op
  }
};

/**
 * Crea un wrapper per componenti EDS che funzioni in Storybook
 * @param {Function} decorateFunction - La funzione decorate del componente EDS
 * @param {string} blockName - Nome del blocco (es. 'cards', 'header')
 * @param {string} cssPath - Path relativo al CSS del componente
 */
export function createEDSComponent(decorateFunction, blockName, cssPath) {
  return {
    /**
     * Renderizza il componente EDS in Storybook
     * @param {Object} args - Argomenti per il componente
     * @param {HTMLElement|string} args.content - Contenuto del blocco
     * @param {Object} args.config - Configurazione aggiuntiva
     */
    render: async (args = {}) => {
      // Carica il CSS del componente se specificato
      if (cssPath) {
        await mockAEMFunctions.loadCSS(cssPath);
      }
      
      // Crea l'elemento blocco
      const block = document.createElement('div');
      block.className = blockName;
      
      // Se è fornito contenuto HTML come stringa, lo parserizziamo
      if (typeof args.content === 'string') {
        block.innerHTML = args.content;
      } else if (args.content instanceof HTMLElement) {
        block.appendChild(args.content);
      } else if (Array.isArray(args.content)) {
        // Se il contenuto è un array di elementi
        args.content.forEach(item => {
          if (typeof item === 'string') {
            const div = document.createElement('div');
            div.innerHTML = item;
            block.appendChild(div);
          } else if (item instanceof HTMLElement) {
            block.appendChild(item);
          }
        });
      }
      
      // Applica la funzione decorate del componente EDS
      try {
        await decorateFunction(block);
      } catch (error) {
        console.warn(`Errore durante la decorazione del componente ${blockName}:`, error);
      }
      
      return block;
    },
    
    /**
     * Crea contenuto di esempio per il componente
     */
    createSampleContent: (sampleData) => {
      const fragment = document.createDocumentFragment();
      
      if (Array.isArray(sampleData)) {
        sampleData.forEach(item => {
          const row = document.createElement('div');
          if (typeof item === 'object') {
            Object.entries(item).forEach(([key, value]) => {
              const cell = document.createElement('div');
              if (key === 'image' && value) {
                const img = document.createElement('img');
                img.src = value;
                img.alt = item.alt || '';
                cell.appendChild(img);
              } else {
                cell.textContent = value;
              }
              row.appendChild(cell);
            });
          } else {
            row.textContent = item;
          }
          fragment.appendChild(row);
        });
      }
      
      return fragment;
    }
  };
}

/**
 * Inizializza l'ambiente Storybook per i componenti EDS
 */
export function initEDSEnvironment() {
  // Imposta le variabili globali che i componenti EDS potrebbero aspettarsi
  if (typeof window !== 'undefined') {
    window.hlx = window.hlx || {};
    window.hlx.rum = window.hlx.rum || {
      sampleRUM: () => {},
      enhance: () => {}
    };
    
    // Mock del matchMedia per componenti responsive
    if (!window.matchMedia) {
      window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      });
    }
  }
}

// Inizializza l'ambiente quando il modulo viene importato
initEDSEnvironment();