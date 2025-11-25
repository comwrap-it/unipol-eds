/**
 * Footer Social Section Component — UE-safe
 */

/**
 * Extracts footer social link data from block children
 *
 * @param {HTMLElement[]} rows - Array of row elements
 * @returns {Array<Object>} - Array of items with picture, href, and original row
 */
export function extractFooterSocialData(rows) {
  return rows.map((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return null;

    const imgWrapper = cells[0];
    const urlWrapper = cells[1];

    const picture = imgWrapper?.querySelector('picture');
    const href = urlWrapper?.textContent?.trim();

    if (!picture || !href) return null;

    return { picture, href, row };
  }).filter(Boolean);
}

/**
 * Creates a Footer Social Section component
 *
 * @param {Array<Object>} items - Array of items with picture and href
 * @returns {HTMLElement} - Container element
 */
export function createFooterSocialComponent(items = []) {
  const container = document.createElement('div');
  container.className = 'footer-social-section';

  items.forEach(({ picture, href }) => {
    const row = document.createElement('div');
    row.className = 'footer-social-row';

    if (picture && href) {
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('aria-label', href);
      link.appendChild(picture.cloneNode(true));
      row.appendChild(link);
    }

    container.appendChild(row);
  });

  return container;
}

/**
 * Decorates the Footer Social Section block — UE-safe
 *
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const items = extractFooterSocialData(rows);

  items.forEach(({ row, picture, href }) => {
    row.innerHTML = '';
    if (picture && href) {
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('aria-label', href);
      link.appendChild(picture.cloneNode(true));
      row.appendChild(link);
    }
  });

  block.classList.add('footer-social-section');
}
