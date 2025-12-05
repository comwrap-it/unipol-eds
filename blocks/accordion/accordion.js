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
  labelEl.textContent = accordionLabel || '';

  const icon = document.createElement('span');
  icon.className = 'accordion-icon un-icon-plus';

  header.append(labelEl, icon);

  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.textContent = accordionDescription || '';
  content.style.maxHeight = '0';
  content.style.paddingTop = '0';
  content.style.paddingBottom = '0';
  content.style.overflow = 'hidden';
  content.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

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
 * Extracts editorial values from UE
 */
function getValuesFromBlock(block, keys) {
  const result = {};

  if (!block) return result;

  const rows = Array.from(block.children);

  rows.forEach((row) => {
    const items = row.querySelectorAll(':scope > div');
    const key = items[0].textContent.trim();
    const valueNode = items[1];

    const value = valueNode.querySelector('a')?.getAttribute('href') || valueNode.textContent.trim();

    if (keys.includes(key)) {
      result[key] = value;
    }
  });

  return result;
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
