/**
 * Footer Privacy Section Component — UE-safe
 */

/**
 * Extracts footer privacy link data from block children
 *
 * @param {HTMLElement[]} rows - Array of row elements
 * @returns {Array<Object>} - Array of items with text, href, and original row
 */
export function extractFooterPrivacyData(rows) {
  return rows.map((row) => {
    const children = [...row.children];
    const titleDiv = children[0];
    const linkDiv = children[1];

    const text = titleDiv?.querySelector('p')?.textContent.trim() || '';
    const href = linkDiv?.querySelector('a')?.href || '';

    return { text, href, row };
  });
}

/**
 * Creates a Footer Privacy Section component
 *
 * @param {Array<Object>} items - Array of items with text and href
 * @returns {HTMLElement} - Container element
 */
export function createFooterPrivacyComponent(items = []) {
  const container = document.createElement('div');
  container.className = 'footer-privacy-section';

  items.forEach(({ text, href }) => {
    const row = document.createElement('div');
    row.className = 'footer-privacy-row';

    if (text && href) {
      const link = document.createElement('a');
      link.className = 'footer-privacy-link';
      link.href = href;
      link.textContent = text;
      row.appendChild(link);
    }

    container.appendChild(row);
  });

  return container;
}

/**
 * Decorates the Footer Privacy Section block — UE-safe
 *
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const items = extractFooterPrivacyData(rows);

  // Aggiorniamo in-place ogni row originale
  items.forEach(({ row, text, href }) => {
    row.innerHTML = '';
    if (text && href) {
      const link = document.createElement('a');
      link.className = 'footer-privacy-link';
      link.href = href;
      link.textContent = text;
      row.appendChild(link);
    }
  });

  // Aggiungiamo classe per styling
  block.classList.add('footer-privacy-section');
}
