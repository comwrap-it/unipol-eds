import { createRadio } from '@unipol-ds/components/atoms/radio-button/standard-radio-button/radio-button.js';
import { CHECKED_STATES } from '../../../../constants/index.js';
import { extractInstrumentationAttributes } from '../../../../scripts/utils.js';

/**
 * Reads UE rows and extracts values
 *
 * @param {Array<HTMLElement>} rows
 */
function extractRadioButtonValuesFromRows(rows) {
  const type = rows[0]?.textContent?.trim().toLowerCase()
    || CHECKED_STATES.UNCHECKED;

  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    type,
    disabled,
    instrumentation,
  };
}

/**
 * Decorator for Radio Button
 *
 * @param {HTMLElement} block
 */
export default function decorateRadio(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const { type, disabled, instrumentation } = extractRadioButtonValuesFromRows(rows);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  let radioElement;

  if (hasInstrumentation) {
    radioElement = block.querySelector('label.radio');

    if (!radioElement) {
      radioElement = createRadio(type, disabled, instrumentation);
      rows[0].textContent = '';
      rows[0].appendChild(radioElement);
    } else {
      radioElement.replaceWith(createRadio(type, disabled, instrumentation));
    }
  } else {
    block.textContent = '';
    radioElement = createRadio(type, disabled);
    block.appendChild(radioElement);
  }

  block.classList.add('radio-block');
}
