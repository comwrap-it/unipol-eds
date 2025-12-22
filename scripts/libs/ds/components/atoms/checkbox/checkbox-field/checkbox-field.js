import { createCheckbox, CHECKBOX_TYPES, extractInstrumentationAttributes } from '../standard-checkbox/checkbox.js';

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

/**
 * Decorator for Checkbox Field
 *
 * @param {HTMLElement} block
 */
export default function decorateCheckboxField(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const typeStatus = rows[0]?.textContent?.trim().toLowerCase() || CHECKBOX_TYPES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';
  const label = rows[2]?.textContent?.trim() || '';
  const description = rows[3]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  block.textContent = '';

  const checkboxField = createCheckboxField(
    typeStatus,
    disabled,
    label,
    description,
    instrumentation,
  );

  block.appendChild(checkboxField);
  block.classList.add('checkbox-field-block');
}
