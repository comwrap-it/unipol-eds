/**
 * Footer Privacy Section Component
 */

/**
 * Extracts footer privacy link data from block children
 *
 * @param {HTMLElement[]} rows - Array of row elements
 * @returns {Array<Object>} - Array of items with text and href
 */
function extractFooterPrivacyData(rows) {
  return rows.map((row) => {
    const children = [...row.children];
    const titleDiv = children[0];
    const linkDiv = children[1];

    const linkText = titleDiv?.querySelector('p')?.textContent.trim() || '';
    const linkHref = linkDiv?.querySelector('a')?.href || '';

    return { text: linkText, href: linkHref };
  });
}

/**
 * Preserves attributes from the original block
 *
 * @param {HTMLElement} source - Original block
 * @param {HTMLElement} target - New block
 */
function preserveBlockAttributes(source, target) {
  [...source.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      target.setAttribute(attr.name, attr.value);
    }
  });

  if (source.dataset.blockName) target.dataset.blockName = source.dataset.blockName;
  if (source.id) target.id = source.id;
}

/**
 * Creates a Footer Privacy Section component
 *
 * @param {Array<Object>} items - Array of items with text and href
 * @returns {HTMLElement} - Footer Privacy Section element
 */
export function createFooterPrivacyComponent(items = []) {
  const container = document.createElement('div');
  container.className = 'footer-privacy-section';

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'footer-privacy-row';

    if (item.text && item.href) {
      const link = document.createElement('a');
      link.className = 'footer-privacy-link';
      link.href = item.href;
      link.textContent = item.text;
      row.appendChild(link);
    }

    container.appendChild(row);
  });

  return container;
}

/**
 * Decorates the Footer Privacy Section block
 *
 * @param {HTMLElement} block - Original block element
 */
export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const items = extractFooterPrivacyData(rows);
  const component = createFooterPrivacyComponent(items);

  preserveBlockAttributes(block, component);

  block.replaceWith(component);
}
