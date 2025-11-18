/**
 * Radio - Utility Component
 */

export const RADIO_TYPES = {
  UNCHECKED: 'unchecked',
  CHECKED: 'checked',
};

/**
 * Create radio button
 *
 * @param {string} typeStatus - "unchecked", "checked"
 * @param {boolean} disabled - disables radio button if true
 * @returns {HTMLElement}
 */
export function createRadio(typeStatus = RADIO_TYPES.UNCHECKED, disabled = false) {
  let type = typeStatus;

  const wrapper = document.createElement('span');
  wrapper.className = 'radio-wrapper';
  wrapper.tabIndex = disabled ? -1 : 0;

  const radio = document.createElement('span');
  radio.className = ['radio', `radio-${type}`].join(' ');
  radio.setAttribute('role', 'radio');
  radio.setAttribute('aria-checked', type === RADIO_TYPES.CHECKED);

  if (disabled) {
    radio.classList.add('disabled');
    radio.setAttribute('aria-disabled', 'true');
  }

  wrapper.appendChild(radio);

  const toggle = () => {
    if (disabled) return;

    type = (type === RADIO_TYPES.UNCHECKED)
      ? RADIO_TYPES.CHECKED
      : RADIO_TYPES.UNCHECKED;

    radio.className = ['radio', `radio-${type}`].join(' ');
    radio.setAttribute('aria-checked', type === RADIO_TYPES.CHECKED);
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
 * Decorate Radio
 *
 * @param {HTMLElement} block
 */
export default function decorateRadio(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const typeStatus = rows[0]?.textContent?.trim() || RADIO_TYPES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim() === 'true';

  const radioElement = createRadio(typeStatus, disabled);

  block.textContent = '';
  block.appendChild(radioElement);
  block.classList.add('radio-block');
}
