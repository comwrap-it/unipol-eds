/**
 * Footer Link Column - Molecule Component
 * Column of links with optional title (uses text-list)
 */

/**
 * Creates a footer link column
 * This component wraps text-list to create a footer column
 *
 * @param {HTMLElement} textListElement - Pre-decorated text-list element
 * @returns {HTMLElement} Footer link column element
 */
export function createFooterLinkColumn(textListElement) {
  const column = document.createElement('div');
  column.className = 'footer-link-column';

  if (textListElement) {
    // Clone the text-list element
    const clonedList = textListElement.cloneNode(true);
    column.appendChild(clonedList);
  }

  return column;
}

/**
 * Decorates a footer-link-column block (AEM EDS)
 * This block should contain a text-list block
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (!block) return;

  // Find text-list element (should be already decorated)
  const textList = block.querySelector('.text-list') || block.querySelector('[data-block-name="text-list"]');

  if (textList) {
    const column = createFooterLinkColumn(textList);

    // Preserve block attributes
    [...block.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-') || attr.name === 'id') {
        column.setAttribute(attr.name, attr.value);
      }
    });

    block.replaceWith(column);
  } else {
    // If no text-list found, just wrap the content
    const column = document.createElement('div');
    column.className = 'footer-link-column';
    while (block.firstChild) {
      column.appendChild(block.firstChild);
    }

    [...block.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-') || attr.name === 'id') {
        column.setAttribute(attr.name, attr.value);
      }
    });

    block.replaceWith(column);
  }
}

