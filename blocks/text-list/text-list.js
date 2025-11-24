/**
 * Text Link / Text List Component
 *
 * Refactor secondo le linee guida AEM EDS
 */

/**
 * Extracts text/link data from block children
 *
 * @param {HTMLElement[]} rows - Array of row elements
 * @returns {Array<Object>} - Array of items with hideTitle, text, and href
 */
function extractTextLinkData(rows) {
  return rows.map((row) => {
    const children = [...row.children];
    const hideTitle = children[0]?.textContent.trim() === 'true';
    const titleDiv = children[1]?.textContent.trim() || '';
    const linkText = children[2]?.querySelector('p')?.textContent.trim() || '';
    const linkHref = children[3]?.querySelector('a')?.href || '';

    return {
      hideTitle, title: titleDiv, linkText, linkHref,
    };
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
 * Creates a Text Link / Text List component
 *
 * @param {Array<Object>} items - Array of items with hideTitle, title, linkText, linkHref
 * @returns {HTMLElement} - Text List component element
 */
export function createTextLinkComponent(items = []) {
  const container = document.createElement('div');
  container.className = 'text-link-list';

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'text-link-row';

    if (item.hideTitle && item.title) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'text-link-title';
      titleDiv.textContent = item.title;
      row.appendChild(titleDiv);
    }

    if (!item.hideTitle && item.linkText && item.linkHref) {
      const link = document.createElement('a');
      link.className = 'text-link';
      link.href = item.linkHref;
      link.textContent = item.linkText;
      row.appendChild(link);
    }

    container.appendChild(row);
  });

  return container;
}

/**
 * Decorates the Text Link / Text List block
 *
 * @param {HTMLElement} block - Original block element
 */
export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const items = extractTextLinkData(rows);
  const component = createTextLinkComponent(items);

  preserveBlockAttributes(block, component);

  block.replaceWith(component);
}
