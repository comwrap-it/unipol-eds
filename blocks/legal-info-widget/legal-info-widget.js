const extractLegalText = (rows) => {
  const richtextContainer = rows[0];
  if (!richtextContainer) return '';
  return richtextContainer.innerHTML.trim();
};

/**
 * Creates Legal Info Widget
 * @param {string} htmlContent - richtext
 * @returns {HTMLElement} wrapper
 */
export const createLegalInfoWidget = (htmlContent) => {
  const container = document.createElement('div');
  container.className = 'legal-info-content';
  container.innerHTML = htmlContent;
  return container;
};

/**
 * Decorate Legal Info Widget
 */
export default function decorateLegalInfoWidget(block) {
  if (!block) return;

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  const htmlContent = extractLegalText(rows);

  if (hasInstrumentation) {
    let content = block.querySelector('.legal-info-content');
    if (!content) {
      content = createLegalInfoWidget(htmlContent);
      rows[0].innerHTML = '';
      rows[0].appendChild(content);
    } else {
      content.innerHTML = htmlContent;
    }
  } else {
    const content = createLegalInfoWidget(htmlContent);
    block.innerHTML = '';
    block.appendChild(content);
  }
}
