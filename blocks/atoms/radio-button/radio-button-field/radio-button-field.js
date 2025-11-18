/**
 * Radio Button Field - Utility Component
 */

export const RADIO_TYPES = {
  UNCHECKED: 'unchecked',
  CHECKED: 'checked',
};

/**
 * Create radio button field
 *
 * @param {string} typeStatus - "unchecked", "checked"
 * @param {boolean} disabled - disables radio if true
 * @param {string} labelText - radio label
 * @param {string} descriptionText - radio description
 * @returns {HTMLElement}
 */
export function createRadio(typeStatus = RADIO_TYPES.UNCHECKED, disabled = false, labelText = '', descriptionText = '') {
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

  const textContainer = document.createElement('span');
  textContainer.className = 'radio-text-container';

  const labelEl = document.createElement('span');
  labelEl.className = 'radio-label';
  labelEl.textContent = labelText;

  const descEl = document.createElement('span');
  descEl.className = 'radio-description';
  descEl.textContent = descriptionText;

  textContainer.appendChild(labelEl);
  textContainer.appendChild(descEl);
  wrapper.appendChild(textContainer);

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
 * Decorate Radio Button Field
 *
 * @param {HTMLElement} block
 */
export default function decorateRadio(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const typeStatus = rows[0]?.textContent?.trim() || RADIO_TYPES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim() === 'true';
  const labelText = rows[2]?.textContent?.trim() || '';
  const descriptionText = rows[3]?.textContent?.trim() || '';

  const radioElement = createRadio(typeStatus, disabled, labelText, descriptionText);

  block.textContent = '';
  block.appendChild(radioElement);
  block.classList.add('radio-block');
}
