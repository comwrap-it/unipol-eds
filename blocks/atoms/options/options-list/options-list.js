import { createOptionFromRows } from '../option/option.js';

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
