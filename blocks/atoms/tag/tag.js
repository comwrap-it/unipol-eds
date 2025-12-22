import { createTextElementFromRow } from '../../../scripts/domHelpers.js';
import { extractInstrumentationAttributes } from '../../../scripts/utils.js';

/**
 * Create a tag element with styling
 * @param {string} label - Tag label (required)
 * @param {string} category - Category name (required)
 * @param {string} type - Tag type (required)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @param {HTMLElement} labelRow - The label row element (optional)
 * @returns {HTMLElement} The tag element
 */
export const createTag = (
  label,
  category,
  type,
  instrumentation = {},
  labelRow = null,
) => {
  const tag = document.createElement('div');
  tag.className = `tag ${category} ${type}`;

  if (labelRow) {
    const textElement = createTextElementFromRow(labelRow, 'tag-label', 'span');
    tag.appendChild(textElement);
  } else {
    tag.textContent = label;
  }

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    tag.setAttribute(name, value);
  });

  return tag;
};

/**
 * Extract values from block rows
 * @param {HTMLElement[]} rows The block rows
 * @returns {Object} The extracted values
 */
const extractValuesFromRows = (rows) => {
  const label = rows[0].textContent.trim();
  const category = rows[1].textContent.trim();
  const type = rows[2].textContent.trim();
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return {
    label,
    category,
    type,
    instrumentation,
    labelRow: rows[0],
  };
};

/**
 * Process tag data from rows and create tag element
 * Used when tag is rendered from Universal Editor data structure
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {HTMLElement|null} The tag element, or null if no label is provided
 */
export function createTagFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const {
    label, category, type, instrumentation, labelRow,
  } = extractValuesFromRows(rows);

  // Don't tag if there's no label text
  if (!label) return null;

  return createTag(label, category, type, instrumentation, labelRow);
}

/**
 * Decorate Tag Block
 * @param {HTMLElement} block The Tag block element
 */
export default function decorateTag(block) {
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

  // Extract tag properties
  const {
    label, category, type, instrumentation,
  } = extractValuesFromRows(rows);

  if (hasInstrumentation) {
    let tag = block.querySelector('.tag');
    if (!tag) {
      tag = createTag(label, category, type, instrumentation);
      if (rows[0]) {
        rows[0].textContent = '';
        rows[0].appendChild(tag);
      } else {
        block.appendChild(tag);
      }
    } else {
      // Update existing tag
      tag = createTag(label, category, type, instrumentation);
    }
  } else {
    const tag = createTag(label, category, type, instrumentation);
    // Clear block and append tag
    block.textContent = '';
    block.appendChild(tag);
  }
}
