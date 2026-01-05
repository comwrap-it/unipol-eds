/**
 * @typedef {Object} OptionConfig
 * @property {string} labelText - Required label displayed as the option title.
 * @property {string} optionValue - The value for the option (required).
 * @property {string} [descriptionText] - Optional supporting text under the title.
 * @property {boolean} [shouldShowCheckbox=false] - If true, renders a checkbox for the option.
 * @property {"unchecked"|"checked"|"indeterminate"} [typeStatus="unchecked"] - checkbox state
 * @property {boolean} [disabled=false] - Disables the checkbox when true.
 * @property {Record<string, string>} [instrumentation={}] - Optional attributes from editor.
 */

import createOption from '../option/option.js';


/**
 * Builds an options list container with one visual option per item.
 *
 * @param {OptionConfig[]} optionsArray - Ordered list of options to render.
 * @param {(event: Event) => void} setSelectedOption - Callback to set the selected option.
 * @param {boolean} canSelectMultiple - Whether multiple options can be selected.
 * @param {Object} instrumentation - Instrumentation attributes for the options list (optional).
 * @returns {HTMLDivElement} Root element with class `options-list`.
 */
export function createOptionsList(
  optionsArray,
  setSelectedOption,
  canSelectMultiple = false,
  instrumentation = {},
) {
  const optionsListContainer = document.createElement('div');
  optionsListContainer.className = 'options-list';

  const handleOptionSelection = (e) => {
    if (!canSelectMultiple) {
      const { optionId } = e.detail;
      const alreadySelectedOptions = optionsListContainer.querySelectorAll('.option.selected');
      const selectedOptionsWithoutCurrent = Array.from(alreadySelectedOptions).filter(
        (btn) => btn.id !== optionId,
      );
      selectedOptionsWithoutCurrent.forEach((btn) => {
        const checkbox = btn.querySelector("input[type='checkbox']");
        if (checkbox) {
          checkbox.checked = false;
        }
        btn.classList.remove('selected');
        btn.setAttribute('aria-selected', 'false');
      });
    }
    setSelectedOption(e);
  };

  optionsArray.forEach((optionConfig) => {
    const option = createOption(
      optionConfig.labelText,
      optionConfig.optionValue,
      handleOptionSelection,
      optionConfig.descriptionText,
      optionConfig.shouldShowCheckbox,
      optionConfig.typeStatus,
      optionConfig.disabled,
      optionConfig.instrumentation,
    );

    optionsListContainer.appendChild(option);
  });
  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    optionsListContainer.setAttribute(name, value);
  });
  return optionsListContainer;
}

