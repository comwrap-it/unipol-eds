import { createCheckbox } from '../standard-checkbox/checkbox.js';

/**
 * Create Checkbox Field Component
 *
 * @param {Object} options
 * @param {string} options.typeStatus - "checked" | "unchecked" | "indeterminate"
 * @param {boolean} options.disabled
 * @param {string} options.label - main text
 * @param {string} options.description - secondary text
 * @param {Object} options.instrumentation - AEM props
 * @returns {HTMLElement}
 */
export function createCheckboxField(
  typeStatus,
  disabled,
  label,
  description,
  instrumentation = {},
) {
  const wrapper = document.createElement('div');
  wrapper.className = 'checkbox-field';
  wrapper.style.display = 'inline-flex';
  wrapper.style.alignItems = 'flex-start';
  wrapper.style.gap = '0.5rem';

  const checkboxElement = createCheckbox(typeStatus, disabled, instrumentation);

  const textBox = document.createElement('div');
  textBox.className = 'checkbox-field-text-box';

  const labelEl = document.createElement('div');
  labelEl.className = 'checkbox-field-label';
  labelEl.textContent = label || '';

  const descriptionEl = document.createElement('div');
  descriptionEl.className = 'checkbox-field-description';
  descriptionEl.textContent = description || '';

  if (disabled) {
    labelEl.classList.add('disabled-label');
    descriptionEl.classList.add('disabled-description');
  }

  textBox.appendChild(labelEl);
  textBox.appendChild(descriptionEl);

  wrapper.appendChild(checkboxElement);
  wrapper.appendChild(textBox);

  return wrapper;
}

