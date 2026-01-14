/**
 * Checkbox - Utility Component
 */

import { CHECKBOX_TYPES } from "../../../../constants/index.js";

/**
 * Create checkbox
 *
 * @param {string} typeStatus - "unchecked", "checked", "indeterminate"
 * @param {boolean} disabled - disables checkbox if true
 * @param {Object} instrumentation - AEM props
 * @returns {HTMLElement}
 */
export function createCheckbox(typeStatus, disabled, instrumentation = {}) {
  const wrapper = document.createElement('label');
  wrapper.className = 'checkbox';
  wrapper.setAttribute('role', 'checkbox');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = 'checkbox';

  if (typeStatus === CHECKBOX_TYPES.CHECKED) {
    checkbox.checked = true;
    checkbox.setAttribute('aria-checked', 'true');
  } else if (typeStatus === CHECKBOX_TYPES.INDETERMINATE) {
    checkbox.indeterminate = true;
    checkbox.setAttribute('aria-checked', 'mixed');
  } else {
    checkbox.setAttribute('aria-checked', 'false');
  }

  if (disabled) {
    checkbox.disabled = true;
    wrapper.classList.add('disabled');
    checkbox.setAttribute('aria-disabled', 'true');
  }

  Object.entries(instrumentation).forEach(([attr, value]) => {
    checkbox.setAttribute(attr, value);
  });

  const customSpan = document.createElement('span');
  customSpan.className = 'checkbox-custom';

  customSpan.tabIndex = 0;
  customSpan.setAttribute('role', 'checkbox');
  customSpan.setAttribute('aria-checked', checkbox.checked ? 'true' : 'false');

  checkbox.addEventListener('change', () => {
    customSpan.classList.remove('un-icon-check', 'un-icon-minus');

    if (checkbox.checked) {
      customSpan.classList.add('un-icon-check');
      checkbox.setAttribute('aria-checked', 'true');
    } else {
      checkbox.setAttribute('aria-checked', 'false');
    }
  });

  if (typeStatus === CHECKBOX_TYPES.CHECKED) {
    customSpan.classList.add('un-icon-check');
  } else if (typeStatus === CHECKBOX_TYPES.INDETERMINATE) {
    customSpan.classList.add('un-icon-minus');
  }

  wrapper.appendChild(checkbox);
  wrapper.appendChild(customSpan);

  return wrapper;
}

