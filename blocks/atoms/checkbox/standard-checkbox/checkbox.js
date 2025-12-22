/**
 * Checkbox - Utility Component
 */

import { createCheckbox } from "../../../../scripts/libs/ds/components/atoms/checkbox/standard-checkbox/checkbox";
import { extractInstrumentationAttributes } from "../../../../scripts/utils";
import { CHECKBOX_TYPES } from "../../../../constants/index.js";

/**
 * Reads UE rows and extracts values
 *
 * @param {Array<HTMLElement>} rows
 */
function extractValuesFromRows(rows) {
  const typeStatus = rows[0]?.textContent?.trim().toLowerCase()
    || CHECKBOX_TYPES.UNCHECKED;

  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    typeStatus,
    disabled,
    instrumentation,
  };
}

/**
 * Decorator for Checkbox
 *
 * @param {HTMLElement} block
 */
export default function decorateCheckbox(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const { typeStatus, disabled, instrumentation } = extractValuesFromRows(rows);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  let checkboxElement;

  if (hasInstrumentation) {
    checkboxElement = block.querySelector('input.checkbox');

    if (!checkboxElement) {
      checkboxElement = createCheckbox(typeStatus, disabled, instrumentation);
      rows[0].textContent = '';
      rows[0].appendChild(checkboxElement);
    } else {
      checkboxElement.replaceWith(
        createCheckbox(typeStatus, disabled, instrumentation),
      );
    }
  } else {
    block.textContent = '';
    checkboxElement = createCheckbox(typeStatus, disabled);
    block.appendChild(checkboxElement);
  }

  block.classList.add('checkbox-block');
}
