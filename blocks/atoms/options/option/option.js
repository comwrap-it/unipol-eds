import {
  CHECKBOX_TYPES,
  createCheckbox,
} from '../../checkbox/standard-checkbox/checkbox.js';

/**
 *
 * @param {string} labelText a label for the option (required)
 * @param {string} descriptionText a description for the option (optional)
 * @param {boolean} shouldShowCheckbox whether to show the checkbox (optional)
 * @param {string} typeStatus - "unchecked", "checked", "indeterminate"
 * @param {boolean} disabled - disables checkbox if true
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @return {HTMLElement}
 */
export default function createOption(
  labelText,
  descriptionText,
  shouldShowCheckbox = false,
  typeStatus = CHECKBOX_TYPES.UNCHECKED,
  disabled = false,
  instrumentation = {},
) {
  const optionContainer = document.createElement('div');
  optionContainer.className = 'option-container';

  const option = document.createElement('button');
  option.className = 'option';
  option.setAttribute('type', 'button');

  let checkbox = null;
  if (shouldShowCheckbox) {
    checkbox = createCheckbox(typeStatus, disabled);
    option.appendChild(checkbox);
  }

  const textContainer = document.createElement('div');
  textContainer.className = 'texts-container';
  const label = document.createElement('span');
  label.className = 'title';
  label.textContent = labelText;
  textContainer.appendChild(label);
  if (descriptionText) {
    const description = document.createElement('span');
    description.className = 'description';
    description.textContent = descriptionText;
    textContainer.appendChild(description);
  }
  option.appendChild(textContainer);
  optionContainer.appendChild(option);

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    option.setAttribute(name, value);
  });

  option.addEventListener('click', () => {
    option.classList.toggle('selected');
    checkbox?.click();
  });

  return optionContainer;
}

/**
 * Extract option properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing option properties
 *
 * Row mapping (based on _option.json field order):
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
