import { CHECKBOX_TYPES } from '../../../../constants/index.js';
import { createCheckbox } from '../../checkbox/standard-checkbox/checkbox.js';

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
