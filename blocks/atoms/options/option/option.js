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
