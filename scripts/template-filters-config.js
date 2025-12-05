/**
 * Template Filters Configuration
 *
 * Questo file centralizza la configurazione dei filtri Universal Editor
 * basati sul template della pagina (definito tramite metadata).
 *
 * COME FUNZIONA:
 * 1. Il metadata "template" viene letto dalla pagina
 * 2. In base al template, vengono applicati filtri specifici a:
 *    - main element (cosa può essere aggiunto come widget/sezioni)
 *    - sections (cosa può essere aggiunto dentro ogni sezione)
 * 3. È possibile definire regole per sezioni specifiche (es. prima sezione)
 *
 * FILTRI DISPONIBILI:
 * I filtri devono essere definiti in component-filters.json
 * Ogni filtro specifica quali componenti possono essere aggiunti dall'editor.
 */

/**
 * Configurazione dei filtri per template
 *
 * Struttura:
 * {
 *   'template-name': {
 *     main: 'filter-id',           // Filtro per il main element
 *     sections: {
 *       default: 'filter-id',      // Filtro di default per le sezioni
 *       byIndex: {                 // Filtri per sezioni specifiche (opzionale)
 *         0: 'filter-id',          // Prima sezione
 *         1: 'filter-id',          // Seconda sezione
 *         // ...
 *       }
 *     }
 *   }
 * }
 */
export const TEMPLATE_FILTERS = {
  // Template Footer: permette solo unipol-footer nel main
  footer: {
    main: 'footer-template-main',
    sections: {
      default: 'section', // Le sezioni usano il filtro standard
    },
  },

  // Template Homepage: permette vari widget nel main
  /* 'homepage': {
    main: 'main', // Filtro standard del main
    sections: {
      default: 'section',
      byIndex: {
        0: 'homepage-hero-section', // Prima sezione: solo hero
      }
    }
  }, */

  // Aggiungi qui altri template secondo necessità
  // 'product-page': {
  //   main: 'main',
  //   sections: {
  //     default: 'section',
  //   }
  // },
};

/**
 * Filtro di default per template non configurati
 */
export const DEFAULT_TEMPLATE_CONFIG = {
  main: 'main',
  sections: {
    default: 'section',
  },
};

/**
 * Ottiene la configurazione del filtro per un template specifico
 * @param {string} templateName - Nome del template (normalizzato con toClassName)
 * @returns {Object} Configurazione del filtro per il template
 */
export function getTemplateFilterConfig(templateName) {
  return TEMPLATE_FILTERS[templateName] || DEFAULT_TEMPLATE_CONFIG;
}

/**
 * Ottiene il filtro per il main element basato sul template
 * @param {string} templateName - Nome del template (normalizzato con toClassName)
 * @returns {string} ID del filtro da applicare al main
 */
export function getMainFilter(templateName) {
  const config = getTemplateFilterConfig(templateName);
  return config.main;
}

/**
 * Ottiene il filtro per una sezione specifica basato sul template
 * @param {string} templateName - Nome del template (normalizzato con toClassName)
 * @param {number} sectionIndex - Indice della sezione (0-based)
 * @returns {string} ID del filtro da applicare alla sezione
 */
export function getSectionFilter(templateName, sectionIndex) {
  const config = getTemplateFilterConfig(templateName);

  // Controlla se esiste un filtro specifico per questo indice
  if (config.sections.byIndex && config.sections.byIndex[sectionIndex]) {
    return config.sections.byIndex[sectionIndex];
  }

  // Altrimenti usa il filtro di default
  return config.sections.default;
}
