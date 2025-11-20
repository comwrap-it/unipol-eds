/**
 * @typedef {Object} OptionConfig
 * @property {string} labelText - Required label displayed as the option title.
 * @property {string} [descriptionText] - Optional supporting text under the title.
 * @property {boolean} [shouldShowCheckbox=false] - If true, renders a checkbox for the option.
 * @property {"unchecked"|"checked"|"indeterminate"} [typeStatus="unchecked"] - checkbox state
 * @property {boolean} [disabled=false] - Disables the checkbox when true.
 * @property {Record<string, string>} [instrumentation={}] - Optional attributes from editor.
 */

import createOptionsList from '../../options/options-list/options-list.js';

/**
 * Create a textarea element with styling
 * @param {string} label - Textarea label (required)
 * @param {OptionConfig[]} optionsArray - Ordered list of options to render. (required)
 * @param {string} hintText - Hint text (optional)
 * @param {string} hintIcon - Hint icon class name (optional)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The textarea element
 */
export default function createSelect(
  label,
  optionsArray,
  hintText = '',
  hintIcon = '',
  instrumentation = {},
) {
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'input-main-wrapper';
  // input container is a relative element to position icon and label absolutely within it
  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-container';
  mainWrapper.appendChild(inputContainer);

  const select = document.createElement('button');
  select.className = 'input select';
  select.type = 'button';
  select.id = 'select';
  select.setAttribute('aria-haspopup', 'listbox');
  select.setAttribute('aria-expanded', 'false');
  inputContainer.appendChild(select);

  const labelElem = document.createElement('label');
  labelElem.textContent = label;
  labelElem.htmlFor = 'select';
  inputContainer.appendChild(labelElem);

  const dropdownIcon = document.createElement('span');
  dropdownIcon.className = 'icon icon-small dropdown-icon';
  inputContainer.appendChild(dropdownIcon);

  const optionsList = createOptionsList(optionsArray);
  mainWrapper.appendChild(optionsList);

  select.addEventListener('click', () => {
    const isExpanded = select.getAttribute('aria-expanded') === 'true';
    select.setAttribute('aria-expanded', String(!isExpanded));
    optionsList.classList.toggle('options-list-visible');
  });

  if (hintText) {
    const helperContainer = document.createElement('div');
    helperContainer.className = 'helper-container';
    if (hintIcon) {
      const hintIconSpan = document.createElement('span');
      hintIconSpan.className = `icon icon-small ${hintIcon}`;
      helperContainer.appendChild(hintIconSpan);
    }
    const hintP = document.createElement('p');
    hintP.className = 'hint-text';
    hintP.textContent = hintText;
    helperContainer.appendChild(hintP);
    mainWrapper.appendChild(helperContainer);
  }

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    mainWrapper.setAttribute(name, value);
  });

  return mainWrapper;
}
