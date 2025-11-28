import {
  createSwitch,
  SWITCH_TYPES,
  extractInstrumentationAttributes,
} from '../standard-switch-button/switch-button.js';

/**
 * Create Switch Button Field Component
 *
 * @param {Object} options
 * @param {string} options.type - "checked" | "unchecked"
 * @param {boolean} options.disabled
 * @param {string} options.label - main text
 * @param {string} options.description - secondary text
 * @param {Object} options.instrumentation - AEM props
 * @returns {HTMLElement}
 */
export function createSwitchButtonField(
  type,
  disabled,
  label,
  description,
  instrumentation = {},
) {
  const wrapper = document.createElement('div');
  wrapper.className = 'switch-button-field';
  wrapper.style.display = 'inline-flex';
  wrapper.style.alignItems = 'flex-start';
  wrapper.style.gap = '0.5rem';

  const switchElement = createSwitch(type, disabled, instrumentation);

  const textBox = document.createElement('div');
  textBox.className = 'switch-button-text-box';

  const labelEl = document.createElement('div');
  labelEl.className = 'switch-button-label';
  labelEl.textContent = label || '';

  const descriptionEl = document.createElement('div');
  descriptionEl.className = 'switch-button-description';
  descriptionEl.textContent = description || '';

  if (disabled) {
    labelEl.classList.add('disabled-label');
    descriptionEl.classList.add('disabled-description');
  }

  textBox.appendChild(labelEl);
  textBox.appendChild(descriptionEl);

  wrapper.appendChild(switchElement);
  wrapper.appendChild(textBox);

  return wrapper;
}

/**
 * Decorator
 *
 * @param {HTMLElement} block
 */
export default function decorateSwitchButtonField(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const type = rows[0]?.textContent?.trim().toLowerCase() || SWITCH_TYPES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';
  const label = rows[2]?.textContent?.trim() || '';
  const description = rows[3]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  block.textContent = '';

  const switchButtonField = createSwitchButtonField({
    type,
    disabled,
    label,
    description,
    instrumentation,
  });

  block.appendChild(switchButtonField);
  block.classList.add('switch-button-field-block');
}
