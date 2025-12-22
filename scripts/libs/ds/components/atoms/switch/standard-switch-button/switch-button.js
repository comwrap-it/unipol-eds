export const SWITCH_TYPES = {
  CHECKED: 'checked',
  UNCHECKED: 'unchecked',
};

/**
 * Create Switch Element
 *
 * @param {string} type - "checked" | "unchecked"
 * @param {boolean} disabled
 * @param {Object} instrumentation
 * @returns {HTMLElement}
 */
export function createSwitch(type, disabled, instrumentation = {}) {
  const wrapper = document.createElement('label');
  wrapper.className = 'switch';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.role = 'switch';

  const uniqueId = `switch-${Math.random().toString(36).substring(2, 9)}`;
  input.id = uniqueId;
  input.name = 'switch-group';

  if (type === SWITCH_TYPES.CHECKED) {
    input.checked = true;
  }

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
