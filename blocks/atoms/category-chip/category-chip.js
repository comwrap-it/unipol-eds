import { createCategoryChip } from '@unipol-ds/components/atoms/category-chip/category-chip.js';
import { extractInstrumentationAttributes } from '../../../scripts/utils.js';

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
