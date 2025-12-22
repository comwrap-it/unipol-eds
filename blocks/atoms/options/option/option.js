import { CHECKBOX_TYPES } from "../../../../constants";
import { createCheckbox } from "../../../../scripts/libs/ds/components/atoms/checkbox/standard-checkbox/checkbox";

/**
 *
 * @param {string} labelText a label for the option (required)
 * @param {string} optionValue the value for the option (required)
 * @param {(event: Event) => void} onClick click event handler (optional)
 * @param {string} descriptionText a description for the option (optional)
 * @param {boolean} shouldShowCheckbox whether to show the checkbox (optional)
 * @param {string} typeStatus - "unchecked", "checked", "indeterminate"
 * @param {boolean} disabled - disables checkbox if true
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @return {HTMLElement}
 */
export default function createOption(
  labelText,
  optionValue,
  onClick,
  descriptionText,
  shouldShowCheckbox = false,
  typeStatus = CHECKBOX_TYPES.UNCHECKED,
  disabled = false,
  instrumentation = {},
) {
  const optionContainer = document.createElement('div');
  optionContainer.className = 'option-container';

  const option = document.createElement('button');
  const optionId = `option-${crypto.randomUUID()}`;
  option.id = optionId;
  option.className = 'option';
  option.setAttribute('type', 'button');
  option.setAttribute('value', optionValue);
  option.setAttribute('aria-selected', 'false');
  option.setAttribute('role', 'option');

  let checkbox = null;
  if (shouldShowCheckbox) {
    checkbox = createCheckbox(typeStatus, disabled);
    checkbox.setAttribute('tabindex', '-1');
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

  const emitOnClick = (e) => {
    const customEvent = new CustomEvent('option-click', {
      bubbles: true,
      cancelable: true,
      detail: { value: optionValue, optionId, originalEvent: e },
    });
    onClick?.(customEvent);
  };

  const toggleSelection = () => {
    option.classList.toggle('selected');
    option.setAttribute(
      'aria-selected',
      option.classList.contains('selected') ? 'true' : 'false',
    );
  };

  const optionSelectHandler = (e) => {
    e.preventDefault();
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
    toggleSelection();
    emitOnClick(e);
  };

  option.addEventListener('click', optionSelectHandler);

  option.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      optionSelectHandler(event);
    }
  });

  checkbox?.addEventListener('click', (e) => {
    e.stopPropagation();
    optionSelectHandler(e);
  });

  return optionContainer;
}

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
