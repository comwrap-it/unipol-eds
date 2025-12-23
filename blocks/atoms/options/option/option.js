import { CHECKBOX_TYPES } from '../../../../constants/index.js';
import createOption from '../../../../scripts/libs/ds/components/atoms/options/option/option.js';

/**
 * Extract option properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing option properties
 *
 * Row mapping (based on _option-list.json field order):
 * rows[0]: type (select from checkbox container) - "unchecked", "checked", "indeterminate"
 * rows[1]: disabled (switch from checkbox container) - true/false
 * rows[2]: label (text)
 * rows[3]: description (text)
 * rows[4]: showCheckbox (switch) - true/false
 */
const extractValuesFromRows = (rows) => {
  const typeStatus = rows[0]?.textContent?.trim()?.toLowerCase() || CHECKBOX_TYPES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim()?.toLowerCase() === 'true';
  const labelText = rows[2]?.textContent?.trim() || 'Option';
  const descriptionText = rows[3]?.textContent?.trim() || '';
  const shouldShowCheckbox = rows[4]?.textContent?.trim()?.toLowerCase() === 'true';

  return {
    typeStatus,
    disabled,
    labelText,
    descriptionText,
    shouldShowCheckbox,
  };
};

/**
 * Create an option from Universal Editor rows
 *
 * @param {Array} rows - Array of rows (expected 5 rows per option)
 * @returns {HTMLElement|null} The option element or null if invalid
 */
export function createOptionFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const {
    typeStatus,
    disabled,
    labelText,
    descriptionText,
    shouldShowCheckbox,
  } = extractValuesFromRows(rows);

  return createOption(
    labelText,
    descriptionText,
    shouldShowCheckbox,
    typeStatus,
    disabled,
  );
}

export async function decorate(block) {
  if (!block) return;

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  const optionFromRows = createOptionFromRows(rows);
  block.textContent = '';
  block.appendChild(optionFromRows);
}
