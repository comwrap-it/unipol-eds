import { createRadioButtonField } from '@unipol-ds/components/atoms/radio-button/radio-button-field/radio-button-field.js';
import { CHECKED_STATES } from '../../../../constants/index.js';
import { extractInstrumentationAttributes } from '../../../../scripts/utils.js';

/**
 * Decorator
 *
 * @param {HTMLElement} block
 */
export default function decorateRadioButtonField(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const type = rows[0]?.textContent?.trim().toLowerCase() || CHECKED_STATES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';
  const label = rows[2]?.textContent?.trim() || '';
  const description = rows[3]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  block.textContent = '';

  const radioButtonField = createRadioButtonField({
    type,
    disabled,
    label,
    description,
    instrumentation,
  });

  block.appendChild(radioButtonField);
  block.classList.add('radio-button-field-block');
}
