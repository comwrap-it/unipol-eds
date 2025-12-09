import { getValuesFromBlock, restoreInstrumentation, isAuthorMode } from '../../scripts/utils.js';

/**
 * Creates Accordion
 *
 * @returns {HTMLElement}
 * @param accordionLabel
 * @param accordionDescription
 */
export function createAccordion(accordionLabel, accordionDescription) {
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion';

  const header = document.createElement('div');
  header.className = 'accordion-header';

  const labelEl = document.createElement('span');
  labelEl.className = 'accordion-label';
  labelEl.textContent = accordionLabel.value || '';
  restoreInstrumentation(labelEl, accordionLabel.instrumentation);

  const icon = document.createElement('span');
  icon.className = 'accordion-icon un-icon-plus';

  header.append(labelEl, icon);

  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.textContent = accordionDescription.value || '';
  if (!isAuthorMode(content)) {
    content.style.maxHeight = '0';
    content.style.paddingTop = '0';
    content.style.paddingBottom = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
  }
  restoreInstrumentation(content, accordionDescription.instrumentation);

  wrapper.append(header, content);

  header.addEventListener('click', () => {
    const isOpen = wrapper.classList.toggle('open');

    if (isOpen) {
      icon.classList.remove('un-icon-plus');
      icon.classList.add('un-icon-minus');
      content.style.maxHeight = `${content.scrollHeight + 20}px`;
      content.style.paddingTop = '16px';
      content.style.paddingBottom = '16px';
    } else {
      icon.classList.add('un-icon-plus');
      icon.classList.remove('un-icon-minus');
      content.style.maxHeight = '0';
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
    }
  });

  return wrapper;
}

/**
 * Decorator for Accordion
 *
 * @param {HTMLElement} block
 */
export default async function decorateAccordion(block) {
  if (!block) return;
  const properties = ['accordionLabel', 'accordionDescription'];
  const values = getValuesFromBlock(block, properties);
  const accordionElement = createAccordion(values.accordionLabel, values.accordionDescription);

  block.textContent = '';
  block.appendChild(accordionElement);

  block.classList.add('accordion-block');
}
