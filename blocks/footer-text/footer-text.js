/**
 * Footer Text - Atom Component
 * Footer text element (copyright, legal text, etc.)
 */

/**
 * Creates a footer text element
 *
 * @param {string|HTMLElement} content - Text content or HTML element
 * @param {Object} [instrumentation={}] - AEM Universal Editor attributes
 * @returns {HTMLElement} Footer text element
 */
export function createFooterText(content, instrumentation = {}) {
  const textElement = document.createElement('p');
  textElement.className = 'footer-text';

  if (content instanceof HTMLElement) {
    textElement.appendChild(content);
  } else {
    textElement.textContent = content || '';
  }

  // Apply instrumentation attributes
  Object.entries(instrumentation).forEach(([attr, value]) => {
    if (attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')) {
      textElement.setAttribute(attr, value);
    }
  });

  return textElement;
}

/**
 * Decorates a footer-text block (AEM EDS)
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (!block) return;

  // Extract content from block
  const contentElement = block.querySelector(':scope > div');
  let content = contentElement?.textContent?.trim() || '';

  // Check for richtext content
  const richtextElement = block.querySelector('[data-richtext-prop]');
  if (richtextElement) {
    content = richtextElement.innerHTML || content;
  }

  const instrumentation = {};
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
      instrumentation[attr.name] = attr.value;
    }
  });

  const textElement = createFooterText(content, instrumentation);

  // Preserve block attributes for Universal Editor
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      textElement.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    textElement.dataset.blockName = block.dataset.blockName;
  }

  // Preserve id if present
  if (block.id) {
    textElement.id = block.id;
  }

  block.replaceWith(textElement);
}
