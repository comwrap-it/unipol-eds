/**
 * Checkbox - Utility Component
 */

export const CHECKBOX_TYPES = {
  UNCHECKED: 'unchecked',
  CHECKED: 'checked',
  INDETERMINATE: 'indeterminate',
};

/**
 * Create checkbox
 *
 * @param {string} typeStatus - "unchecked", "checked", "indeterminate"
 * @param {boolean} disabled - disables checkbox if true
 * @param {string} labelText - checkbox label
 * @param {boolean} descriptionText - checkbox description
 * @returns {HTMLElement}
 */
export function createCheckbox(typeStatus = CHECKBOX_TYPES.UNCHECKED, disabled = false, labelText = '', descriptionText = '') {
  let type = typeStatus;

  const wrapper = document.createElement('span');
  wrapper.className = 'checkbox-wrapper';
  wrapper.tabIndex = disabled ? -1 : 0;

  const checkbox = document.createElement('span');
  checkbox.className = ['checkbox', `checkbox-${type}`].join(' ');
  checkbox.setAttribute('role', 'checkbox');
  checkbox.setAttribute('aria-checked', type === CHECKBOX_TYPES.CHECKED);
  if (disabled) {
    checkbox.classList.add('disabled');
    checkbox.setAttribute('aria-disabled', 'true');
  }

  wrapper.appendChild(checkbox);

  const textContainer = document.createElement('span');
  textContainer.className = 'checkbox-text-container';

  const labelEl = document.createElement('span');
  labelEl.className = 'checkbox-label';
  labelEl.textContent = labelText;

  const descEl = document.createElement('span');
  descEl.className = 'checkbox-description';
  descEl.textContent = descriptionText;

  textContainer.appendChild(labelEl);
  textContainer.appendChild(descEl);
  wrapper.appendChild(textContainer);

  const toggle = () => {
    if (disabled) return;

    if (type === CHECKBOX_TYPES.UNCHECKED) type = CHECKBOX_TYPES.CHECKED;
    else if (type === CHECKBOX_TYPES.CHECKED) type = CHECKBOX_TYPES.UNCHECKED;
    else if (type === CHECKBOX_TYPES.INDETERMINATE) type = CHECKBOX_TYPES.CHECKED;

    checkbox.className = ['checkbox', `checkbox-${type}`].join(' ');
    checkbox.classList.remove('checked-icon', 'minus-icon');
    if (type === CHECKBOX_TYPES.CHECKED) checkbox.classList.add('checked-icon');
    else if (type === CHECKBOX_TYPES.INDETERMINATE) checkbox.classList.add('minus-icon');

    checkbox.setAttribute('aria-checked', type === CHECKBOX_TYPES.CHECKED);
  };

  wrapper.addEventListener('click', toggle);
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  });

  return wrapper;
}

/**
 * Decorate Checkbox
 *
 * @param {HTMLElement} block
 */
export default function decorateCheckbox(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const typeStatus = rows[0]?.textContent?.trim() || CHECKBOX_TYPES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim() === 'true';
  const labelText = rows[2]?.textContent?.trim() || '';
  const descriptionText = rows[3]?.textContent?.trim() || '';

  const checkboxElement = createCheckbox(typeStatus, disabled, labelText, descriptionText);

  block.textContent = '';
  block.appendChild(checkboxElement);
  block.classList.add('checkbox-block');
}
