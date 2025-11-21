/**
 * Footer Link - Atom Component
 * Single footer link element
 */

/**
 * Creates a footer link element
 *
 * @param {string} label - Link text
 * @param {string} href - Link URL
 * @param {string} [variant='default'] - Link variant: 'default' | 'utility'
 * @param {Object} [instrumentation={}] - AEM Universal Editor attributes
 * @returns {HTMLElement} Footer link element
 */
export function createFooterLink(label, href, variant = 'default', instrumentation = {}) {
  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = label || '';
  link.className = `footer-link footer-link-${variant}`;

  // Set aria-label if href is provided
  if (href && href !== '#') {
    link.setAttribute('aria-label', `${label} - ${href}`);
  }

  // Apply instrumentation attributes
  Object.entries(instrumentation).forEach(([attr, value]) => {
    if (attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')) {
      link.setAttribute(attr, value);
    }
  });

  return link;
}

/**
 * Extracts footer link data from AEM rows
 *
 * @param {HTMLElement} row - Row element containing link data
 * @returns {Object} Link configuration
 */
function extractLinkData(row) {
  const linkElement = row.querySelector('a');
  const label = linkElement?.textContent?.trim() || row.textContent?.trim() || '';
  const href = linkElement?.href || linkElement?.getAttribute('href') || '#';

  const instrumentation = {};
  [...row.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
      instrumentation[attr.name] = attr.value;
    }
  });

  return { label, href, instrumentation };
}

/**
 * Decorates a footer-link block (AEM EDS)
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (!block) return;

  const { label, href, instrumentation } = extractLinkData(block);
  const variant = block.classList.contains('footer-link-utility') ? 'utility' : 'default';

  const link = createFooterLink(label, href, variant, instrumentation);

  // Preserve block attributes
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-') || attr.name === 'id') {
      link.setAttribute(attr.name, attr.value);
    }
  });

  block.replaceWith(link);
}

