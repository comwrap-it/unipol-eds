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
 * @returns {HTMLElement}
 */
export function createCheckbox(
  typeStatus = CHECKBOX_TYPES.UNCHECKED,
  disabled = false,
) {
  const type = typeStatus;
  const checkbox = document.createElement('input');
  checkbox.name = 'checkbox';
  checkbox.type = 'checkbox';
  checkbox.className = ['checkbox', `checkbox-${type}`].join(' ');
  checkbox.setAttribute('role', 'checkbox');
  checkbox.setAttribute('aria-checked', type === CHECKBOX_TYPES.CHECKED);
  if (disabled) {
    checkbox.classList.add('disabled');
    checkbox.setAttribute('aria-disabled', 'true');
  }

  checkbox.onclick = (e) => {
    e.stopPropagation();
  };

  return checkbox;
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

  const checkboxElement = createCheckbox(typeStatus, disabled);

  block.textContent = '';
  block.appendChild(checkboxElement);
  block.classList.add('checkbox-block');
}
