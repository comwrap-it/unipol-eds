/**
 * Extracts AEM instrumentation attributes
 */
export function extractInstrumentationAttributes(element) {
  const instrumentation = {};
  if (!element) return instrumentation;

  [...element.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
      instrumentation[attr.name] = attr.value;
    }
  });

  return instrumentation;
}

/**
 * Creates Accordion
 *
 * @param {string} label
 * @param {string} description
 * @param {Object} instrumentation
 * @returns {HTMLElement}
 */
export function createAccordion(accordionLabel, accordionDescription, instrumentation = {}) {
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

  Object.entries(instrumentation).forEach(([attr, value]) => {
    wrapper.setAttribute(attr, value);
  });

  return wrapper;
}

/**
 * Extracts editorial values from UE
 */
function extractValuesFromRows(rows) {
  const accordionLabel = rows[0]?.textContent?.trim() || '';
  const accordionDescription = rows[1]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return { accordionLabel, accordionDescription, instrumentation };
}

/**
 * Decorator for Accordion
 *
 * @param {HTMLElement} block
 */
export default function decorateAccordion(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const {
    accordionLabel,
    accordionDescription,
    instrumentation,
  } = extractValuesFromRows(rows);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  let accordionElement;

  if (hasInstrumentation) {
    accordionElement = block.querySelector('.accordion');

    if (!accordionElement) {
      accordionElement = createAccordion(
        accordionLabel,
        accordionDescription,
        instrumentation,
      );
      rows[0].textContent = '';
      rows[0].appendChild(accordionElement);
    } else {
      accordionElement.replaceWith(
        createAccordion(
          accordionLabel,
          accordionDescription,
          instrumentation,
        ),
      );
    }
  } else {
    block.textContent = '';
    accordionElement = createAccordion(accordionLabel, accordionDescription);
    block.appendChild(accordionElement);
  }

  block.classList.add('accordion-block');
}
