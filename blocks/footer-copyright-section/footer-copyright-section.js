/**
 * Footer Copyright Section Component — UE-safe
 */

/**
 * Extracts copyright text data from the block
 *
 * @param {HTMLElement} block - Original block
 * @returns {Object} - Object with top and bottom text, plus references to original children
 */
export function extractFooterCopyrightData(block) {
  const children = [...block.children];
  const topText = children[0]?.textContent.trim() || '';
  const bottomText = children[1]?.textContent.trim() || '';
  return {
    topText,
    bottomText,
    topNode: children[0] || null,
    bottomNode: children[1] || null,
  };
}

/**
 * Creates a Footer Copyright component
 *
 * @param {Object} data - Object with topText and bottomText
 * @returns {HTMLElement} - Container element
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
 * Decorates the Footer Copyright block — UE-safe
 *
 * @param {HTMLElement} block - Original block element
 */
export default async function decorate(block) {
  if (!block) return;

  const {
    topText, bottomText, topNode, bottomNode,
  } = extractFooterCopyrightData(block);

  if (topNode) {
    topNode.textContent = topText;
    topNode.classList.add('footer-copyright-top');
  }

  if (bottomNode) {
    bottomNode.textContent = bottomText;
    bottomNode.classList.add('footer-copyright-bottom');
  }

  if (!topNode && topText) {
    const pTop = document.createElement('p');
    pTop.className = 'footer-copyright-top';
    pTop.textContent = topText;
    block.prepend(pTop);
  }

  if (!bottomNode && bottomText) {
    const pBottom = document.createElement('p');
    pBottom.className = 'footer-copyright-bottom';
    pBottom.textContent = bottomText;
    block.appendChild(pBottom);
  }

  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      block.setAttribute(attr.name, attr.value);
    }
  });

  block.classList.add('footer-copyright-section');
}
