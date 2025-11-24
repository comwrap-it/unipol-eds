/**
 * Footer Social Section Component
 *
 */

/**
 * Extracts footer social link data from block children
 *
 * @param {HTMLElement[]} rows - Array of row elements
 * @returns {Array<Object>} - Array of items with img (picture element) and href
 */
function extractFooterSocialData(rows) {
  return rows.map((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return null;

    const imgWrapper = cells[0];
    const urlWrapper = cells[1];

    const picture = imgWrapper?.querySelector('picture');
    const href = urlWrapper?.textContent?.trim();

    if (!picture || !href) return null;

    return { picture: picture.cloneNode(true), href };
  }).filter(Boolean);
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
 * Creates a Footer Social Section component
 *
 * @param {Array<Object>} items - Array of items with picture and href
 * @returns {HTMLElement} - Footer Social Section element
 */
export function createFooterSocialComponent(items = []) {
  const container = document.createElement('div');
  container.className = 'footer-social-section';

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'footer-social-row';

    const link = document.createElement('a');
    link.href = item.href;
    link.setAttribute('aria-label', item.href);
    link.appendChild(item.picture);

    row.appendChild(link);
    container.appendChild(row);
  });

  return container;
}

/**
 * Decorates the Footer Social Section block
 *
 * @param {HTMLElement} block - Original block element
 */
export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const items = extractFooterSocialData(rows);
  const component = createFooterSocialComponent(items);

  preserveBlockAttributes(block, component);

  block.replaceWith(component);
}
