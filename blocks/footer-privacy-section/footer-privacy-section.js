/**
 * Footer Privacy Section Component — UE-safe (Text Link style)
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

    return {
      text: linkText,
      href: linkHref,
      row, // keep reference to original row
    };
  });
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

  items.forEach((item) => {
    const { row, text, href } = item;

    // Svuotiamo solo il contenuto del row
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
