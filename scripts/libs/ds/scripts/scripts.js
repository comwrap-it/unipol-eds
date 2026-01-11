import {
  decorateButtons,
  decorateIcons,
  toClassName,
  getMetadata,
  decorateBlocks,
  readBlockConfig,
  toCamelCase,
} from './aem.js';

import {
  getMainFilter,
  getSectionFilter,
  getTemplateFilterConfig,
} from './template-filters-config.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter(
        (attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-'),
      ),
  );
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Applies the Universal Editor filter to the main element based on the template.
 * This controls which widgets/sections can be added to the main element.
 * @param {Element} main - The main element to decorate
 */
function applyMainFilter(main) {
  const templateName = toClassName(getMetadata('template'));
  const mainFilter = getMainFilter(templateName);

  // Apply Universal Editor attributes to the main element
  main.dataset.aueType = 'container';
  main.dataset.aueFilter = mainFilter;

  // Log for debugging (remove in production if needed)
  // eslint-disable-next-line no-console
  console.log(`[Template Filters] Template: "${templateName}" -> Main Filter: "${mainFilter}"`);
}

/**
 * Decorates all sections in a container element.
 * Shadowing the original function from aem.js to handle Universal Editor
 * with support for template-based filters.
 * @param {Element} main - The main element containing the sections
 */
export function decorateSections(main) {
  const templateName = toClassName(getMetadata('template'));

  main.querySelectorAll(':scope > div:not([data-section-status])').forEach((section, index) => {
    // --- STANDARD LOGIC: Creation of wrappers ---
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((e) => {
      if ((e.tagName === 'DIV' && e.className) || !defaultContent) {
        const wrapper = document.createElement('div');
        wrappers.push(wrapper);
        defaultContent = e.tagName !== 'DIV' || !e.className;
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].append(e);
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add('section');
    section.dataset.sectionStatus = 'initialized';
    section.style.display = 'none';

    // --- UNIVERSAL EDITOR: Section configuration ---
    section.dataset.aueType = 'container';

    // Check if the template has "transparent" sections
    // (where label and filter come from the contained widget model)
    const templateConfig = getTemplateFilterConfig(templateName);
    const isTransparent = templateConfig.sections?.transparent === true;

    if (!isTransparent) {
      // Normal section: set label and filter ONLY if not already set
      // (widgets with models may already have their own label/filter)
      if (!section.dataset.aueLabel) {
        section.dataset.aueLabel = 'Section';
      }
      if (!section.dataset.aueFilter) {
        const sectionFilter = getSectionFilter(templateName, index);
        section.dataset.aueFilter = sectionFilter;
      }
    }
    // If transparent=true, we don't set anything
    // The contained widget (with data-aue-model) will handle label/filter automatically

    // --- METADATA: Processing section-metadata (can override filters) ---
    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      Object.keys(meta).forEach((key) => {
        if (key === 'style') {
          const styles = meta.style
            .split(',')
            .filter((style) => style)
            .map((style) => toClassName(style.trim()));
          styles.forEach((style) => section.classList.add(style));
        } else {
          section.dataset[toCamelCase(key)] = meta[key];

          // Override: If the metadata specifies an explicit filter, it takes priority
          if (key === 'filter' || key === 'aue-filter') {
            section.dataset.aueFilter = meta[key];
          }
        }
      });
      sectionMeta.parentNode.remove();
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);

  // Apply the Universal Editor filter to the main element based on the template
  applyMainFilter(main);

  decorateSections(main);
  decorateBlocks(main);
}

// handle viewport-based theming
const THEME_CLASSES = ['theme-mobile', 'theme-tablet-portrait', 'theme-tablet'];

function applyViewportTheme() {
  const w = window.innerWidth;
  const { body } = document;
  body.classList.remove(...THEME_CLASSES);

  if (w < 768) {
    body.classList.add('theme-mobile');
  } else if (w < 1280) {
    body.classList.add('theme-tablet-portrait');
  } else if (w < 1440) {
    body.classList.add('theme-tablet');
  }
}

// Run once after body appears, then on resize (debounced)
let rafId = null;
function onResize() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    applyViewportTheme();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyViewportTheme();
  window.addEventListener('resize', onResize, { passive: true });
});
