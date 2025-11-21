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

import createOption, { createOptionFromRows } from '../option/option.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/options/option/option.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/checkbox/standard-checkbox/checkbox.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Builds an options list container with one visual option per item.
 *
 * @param {OptionConfig[]} optionsArray - Ordered list of options to render.
 * @param {(event: Event) => void} setSelectedOption - Callback to set the selected option.
 * @param {boolean} canSelectMultiple - Whether multiple options can be selected.
 * @param {Object} instrumentation - Instrumentation attributes for the options list (optional).
 * @returns {HTMLDivElement} Root element with class `options-list`.
 */
export default function createOptionsList(
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

/**
 * Decorator function for Options List block
 * Processes Universal Editor data structure with multiple option items
 *
 * @param {HTMLElement} block - The options-list block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Each option item has 5 fields (rows):
  // 0: checkbox type, 1: checkbox disabled, 2: label, 3: description, 4: showCheckbox
  const FIELDS_PER_OPTION = 5;
  const optionCount = Math.floor(rows.length / FIELDS_PER_OPTION);

  // Create container for all options
  const optionsListContainer = document.createElement('div');
  optionsListContainer.className = 'options-list';

  // Process each option
  for (let i = 0; i < optionCount; i += 1) {
    const startIndex = i * FIELDS_PER_OPTION;
    const optionRows = rows.slice(startIndex, startIndex + FIELDS_PER_OPTION);

    const optionElement = createOptionFromRows(optionRows);
    if (optionElement) {
      optionsListContainer.appendChild(optionElement);
    }
  }

  // Preserve block instrumentation attributes
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      optionsListContainer.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present
  if (block.dataset.blockName) {
    optionsListContainer.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  optionsListContainer.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block' && cls !== 'options-list') {
        optionsListContainer.classList.add(cls);
      }
    });
  }

  // Replace block content with options list
  block.replaceWith(optionsListContainer);
}
