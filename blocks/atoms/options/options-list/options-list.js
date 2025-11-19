/**
 * @typedef {Object} OptionConfig
 * @property {string} labelText - Required label displayed as the option title.
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
 * @param {Object} instrumentation - Instrumentation attributes for the options list (optional).
 * @returns {HTMLDivElement} Root element with class `options-list`.
 */
export default function createOptionsList(optionsArray, instrumentation = {}) {
  const optionsListContainer = document.createElement('div');
  optionsListContainer.className = 'options-list';

  optionsArray.forEach((optionConfig) => {
    const option = createOption(
      optionConfig.labelText,
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
