import { CHECKED_STATES } from "../../../../constants/index.js";

/**
 * Create Radio Element
 *
 * @param {string} type - "checked" | "unchecked"
 * @param {boolean} disabled - whether radio is disabled
 * @param {Object} instrumentation - AEM props
 * @returns {HTMLElement}
 */
export function createRadio(type, disabled, instrumentation = {}) {
  const wrapper = document.createElement('label');
  wrapper.className = 'radio';

  const input = document.createElement('input');
  input.type = 'radio';

  const uniqueId = `radio-${Math.random().toString(36).substring(2, 9)}`;
  input.id = uniqueId;
  input.name = 'radio-group';

  if (type === CHECKED_STATES.CHECKED) {
    input.checked = true;
    input.classList.add('circle-icon');
  }

  input.addEventListener('change', () => {
    if (input.checked) {
      input.classList.add('circle-icon');
    } else {
      input.classList.remove('circle-icon');
    }
  });

  if (disabled) {
    input.classList.add('custom-disabled');
    wrapper.style.pointerEvents = 'none';
  }

  wrapper.appendChild(input);

  Object.entries(instrumentation).forEach(([attr, value]) => {
    wrapper.setAttribute(attr, value);
  });

  return wrapper;
}
