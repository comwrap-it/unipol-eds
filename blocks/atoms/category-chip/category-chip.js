import { extractInstrumentationAttributes } from '../buttons/standard-button/standard-button.js';

/**
 * Create a category chip element with styling
 * @param {string} category - Category name (required) mobility | welfare | property
 * @param {string} icon - Icon class name (required)
 * @param {string} text - Text displayed
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The category chip element
 */
export const createCategoryChip = (category, icon, text, instrumentation = {}) => {
  const chip = document.createElement('div');
  chip.className = `category-chip ${category}`;

  const iconSpan = document.createElement('span');
  iconSpan.className = `icon icon-medium ${icon}`;
  chip.appendChild(iconSpan);

  const textSpan = document.createElement('span');
  textSpan.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  if (text) {
    textSpan.textContent = text;
  }
  chip.appendChild(textSpan);

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    chip.setAttribute(name, value);
  });

  return chip;
};

/**
 * Extract values from block rows
 * @param {HTMLElement[]} rows The block rows
 * @returns {Object} The extracted values
 */
const extractValuesFromRows = (rows) => {
  const category = rows[0]
    ? rows[0].textContent.trim().toLowerCase()
    : 'mobility';
  const icon = rows[1] ? rows[1].textContent.trim() : '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return { category, icon, instrumentation };
};

/**
 * Decorate Category Chip Block
 * @param {HTMLElement} block The Category Chip block element
 */
export default function decorateCategoryChip(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Check if block has instrumentation (Universal Editor)
  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  // Extract category chip properties
  const { category, icon, instrumentation } = extractValuesFromRows(rows);

  if (hasInstrumentation) {
    let categoryChip = block.querySelector('.category-chip');
    if (!categoryChip) {
      categoryChip = createCategoryChip(category, icon, instrumentation);
      if (rows[0]) {
        rows[0].textContent = '';
        rows[0].appendChild(categoryChip);
      } else {
        block.appendChild(categoryChip);
      }
    } else {
      // Update existing category chip
      categoryChip = createCategoryChip(category, icon, instrumentation);
    }
  } else {
    const categoryChip = createCategoryChip(category, icon, instrumentation);
    // Clear block and append category chip
    block.textContent = '';
    block.appendChild(categoryChip);
  }
}
