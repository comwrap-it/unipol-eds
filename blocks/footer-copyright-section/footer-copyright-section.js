/**
 * Footer Copyright Section Component
 *
 */

/**
 * Extracts copyright text data from the block
 *
 * @param {HTMLElement} block - Original block
 * @returns {Object} - Object with top and bottom text
 */
function extractFooterCopyrightData(block) {
  const children = [...block.children];
  const topText = children[0]?.textContent.trim() || '';
  const bottomText = children[1]?.textContent.trim() || '';
  return { topText, bottomText };
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
 * Creates a Footer Copyright component
 *
 * @param {Object} data - Object with topText and bottomText
 * @returns {HTMLElement} - Footer Copyright element
 */
export function createFooterCopyrightComponent(data = {}) {
  const container = document.createElement('div');
  container.className = 'footer-copyright-section';

  if (data.topText) {
    const pTop = document.createElement('p');
    pTop.className = 'footer-copyright-top';
    pTop.textContent = data.topText;
    container.appendChild(pTop);
  }

  if (data.bottomText) {
    const pBottom = document.createElement('p');
    pBottom.className = 'footer-copyright-bottom';
    pBottom.textContent = data.bottomText;
    container.appendChild(pBottom);
  }

  return container;
}

/**
 * Decorates the Footer Copyright block
 *
 * @param {HTMLElement} block - Original block element
 */
export default async function decorate(block) {
  if (!block) return;

  const data = extractFooterCopyrightData(block);
  const component = createFooterCopyrightComponent(data);

  preserveBlockAttributes(block, component);

  block.replaceWith(component);
}
