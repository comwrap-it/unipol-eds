/**
 * Footer Text Component
 *
 */

/**
 * Extracts footer text data from the block
 *
 * @param {HTMLElement} block - Original block
 * @returns {string} - Text content
 */
function extractFooterTextData(block) {
  return block.querySelector(':scope > div')?.textContent.trim() || '';
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
 * Creates a Footer Text component
 *
 * @param {string} text - Text content
 * @returns {HTMLElement} - Footer Text element
 */
export function createFooterTextComponent(text = '') {
  const container = document.createElement('div');
  container.className = 'footer-text';

  const p = document.createElement('p');
  p.textContent = text;

  container.appendChild(p);
  return container;
}

/**
 * Decorates the Footer Text block
 *
 * @param {HTMLElement} block - Original block element
 */
export default async function decorate(block) {
  if (!block) return;

  const text = extractFooterTextData(block);
  const component = createFooterTextComponent(text);

  preserveBlockAttributes(block, component);

  block.replaceWith(component);
}
