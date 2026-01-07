/**
 * Template Filters Configuration
 *
 * This file centralizes the configuration of Universal Editor filters
 * based on the template of the page (defined through metadata).
 *
 * HOW IT WORKS:
 * 1. The "template" metadata is read from the page
 * 2. Based on the template, specific filters are applied to:
 *    - main element (what can be added as widget/sections)
 *    - sections (what can be added inside each section)
 * 3. It is possible to define rules for specific sections (e.g. first section)
 * based on the template of the page (defined through metadata).
 *
 * AVAILABLE FILTERS:
 * Filters must be defined in component-filters.json
 * Each filter specifies which components can be added by the editor.
 */

/**
 * Configuration of filters for templates
 *
 * Structure:
 * {
 *   'template-name': {
 *     main: 'filter-id',           // Filter for the main element
 *     sections: {
 *       default: 'filter-id',      // Default filter for sections
 *       byIndex: {                 // Filters for specific sections (optional)
 *         0: 'filter-id',          // First section
 *         1: 'filter-id',          // Second section
 *         // ...
 *       }
 *     }
 *   }
 * }
 */
export const TEMPLATE_FILTERS = {
  // Template Footer: allows only unipol-footer in the main
  // Sections are transparent: label and filter come from the contained widget
  footer: {
    main: 'footer-template',
    sections: {
      default: null, // null = don't set filter, let the widget handle it
      transparent: true, // Sections take label/filter from the contained widget model
    },
  },
  header: {
    main: 'header-template',
    sections: {
      default: null, // null = don't set filter, let the widget handle it
      transparent: true, // Sections take label/filter from the contained widget model
    },
  },

  // Template Homepage: allows various widgets in the main
  /* 'homepage': {
    main: 'main', // Filtro standard del main
    sections: {
      default: 'section',
      byIndex: {
        0: 'homepage-hero-section', // First section: only hero
      }
    }
  }, */

  // Add other templates as needed
  // 'product-page': {
  //   main: 'main',
  //   sections: {
  //     default: 'section',
  //   }
  // },
};

/**
 * Default filter for unconfigured templates
 */
export const DEFAULT_TEMPLATE_CONFIG = {
  main: 'main',
  sections: {
    default: 'section',
  },
};

/**
 * Gets the filter configuration for a specific template
 * @param {string} templateName - Template name (normalized with toClassName)
 * @returns {Object} Filter configuration for the template
 */
export function getTemplateFilterConfig(templateName) {
  return TEMPLATE_FILTERS[templateName] || DEFAULT_TEMPLATE_CONFIG;
}

/**
 * Gets the filter for the main element based on the template
 * @param {string} templateName - Template name (normalized with toClassName)
 * @returns {string} Filter ID to apply to the main
 */
export function getMainFilter(templateName) {
  const config = getTemplateFilterConfig(templateName);
  return config.main;
}

/**
 * Gets the filter for a specific section based on the template
 * @param {string} templateName - Template name (normalized with toClassName)
 * @param {number} sectionIndex - Section index (0-based)
 * @returns {string} Filter ID to apply to the section
 */
export function getSectionFilter(templateName, sectionIndex) {
  const config = getTemplateFilterConfig(templateName);

  // Check if there is a specific filter for this index
  if (config.sections.byIndex && config.sections.byIndex[sectionIndex]) {
    return config.sections.byIndex[sectionIndex];
  }

  // Otherwise use the default filter
  return config.sections.default;
}
