import { restoreInstrumentation } from '../../../scripts/utils';

/**
 * Creates Accordion
 *
 * @param {Object} accordionLabel - Object containing value (string) and instrumentation (object) for EDS component
 * @param {string} accordionLabel.value - The label text for the accordion
 * @param {Object} accordionLabel.instrumentation - The instrumentation object for the label
 * @param {Object} accordionDescription - Object containing value (string) and instrumentation (object) for EDS component
 * @param {string} accordionDescription.value - The description content for the accordion
 * @param {Object} accordionDescription.instrumentation - The instrumentation object for the description
 * @returns {HTMLElement} The accordion wrapper element
 */
export function createAccordion(accordionLabel, accordionDescription) {
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion';

  const header = document.createElement('div');
  header.className = 'accordion-header';

  const labelEl = document.createElement('span');
  labelEl.className = 'accordion-label';
  labelEl.textContent = accordionLabel?.value || '';
  if (accordionLabel?.instrumentation) {
    restoreInstrumentation(labelEl, accordionLabel.instrumentation);
  }

  const icon = document.createElement('span');
  icon.className = 'accordion-icon un-icon-plus';

  header.append(labelEl, icon);

  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.append(...(accordionDescription?.value ?? []));
  if (isAuthorMode(content)) {
    wrapper.classList.add('open');
  }
  if (accordionDescription?.instrumentation) {
    restoreInstrumentation(content, accordionDescription.instrumentation);
  }

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
