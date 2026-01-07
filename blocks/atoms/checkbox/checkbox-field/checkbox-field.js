import { createCheckboxField } from '@unipol-ds/components/atoms/checkbox/checkbox-field/checkbox-field.js';
import { CHECKBOX_TYPES } from '../../../../constants/index.js';
import { extractInstrumentationAttributes } from '../../../../scripts/utils.js';

/**
 * Decorator for Checkbox Field
 *
 * @param {HTMLElement} block
 */
export default function decorateCheckboxField(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const typeStatus = rows[0]?.textContent?.trim().toLowerCase() || CHECKBOX_TYPES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';
  const label = rows[2]?.textContent?.trim() || '';
  const description = rows[3]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  block.textContent = '';

  const checkboxField = createCheckboxField(
    typeStatus,
    disabled,
    label,
    description,
    instrumentation,
  );

  block.appendChild(checkboxField);
  block.classList.add('checkbox-field-block');
}
