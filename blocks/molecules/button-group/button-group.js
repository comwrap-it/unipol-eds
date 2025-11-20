/**
 * Button Group Component
 *
 * A molecule that contains 2 standard buttons with predefined configurations
 * Supports 4 variants:
 * - Primary Horizontal: 2 buttons horizontal (primary + secondary)
 * - Primary Vertical: 2 buttons vertical (primary + secondary)
 * - Accent Horizontal: 2 buttons horizontal (accent + secondary)
 * - Accent Vertical: 2 buttons vertical (accent + secondary)
 */

import { createButtonFromRows } from '../../atoms/buttons/standard-button/standard-button.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../../scripts/aem.js');
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
  );
  isStylesLoaded = true;
}

/**
 * Extract button group properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing button group properties
 *
 * Row mapping (based on _button-group.json field order):
 * rows[0]: buttonGroupVariant (select) - variant type
 * rows[1-6]: button 1 fields (label, variant, href, size, leftIcon, rightIcon)
 * rows[7-12]: button 2 fields (label, variant, href, size, leftIcon, rightIcon)
 */
const extractValuesFromRows = (rows) => {
  const variant = rows[0]?.textContent?.trim()?.toLowerCase() || 'primary-horizontal';

  // Button 1: rows 1-6
  const button1Rows = rows.slice(1, 7);

  // Button 2: rows 7-13
  const button2Rows = rows.slice(7, 13);

  return {
    variant,
    button1Rows,
    button2Rows,
  };
};

/**
 * Create button group from rows
 *
 * @param {Array} rows - Array of rows from Universal Editor
 * @param {Object} instrumentation - Instrumentation attributes
 * @returns {HTMLElement} The button group container
 */
export function createButtonGroup(rows, instrumentation = {}) {
  const { variant, button1Rows, button2Rows } = extractValuesFromRows(rows);

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  // Determine variants based on group variant
  const isAccent = variant.startsWith('accent');
  const isVertical = variant.endsWith('vertical');

  // Add modifier class
  if (isVertical) {
    buttonGroup.classList.add('vertical');
  } else {
    buttonGroup.classList.add('horizontal');
  }

  // Create first button with appropriate variant
  const button1 = createButtonFromRows(button1Rows);
  if (button1) {
    // Override variant based on group type
    const firstVariant = isAccent ? 'accent' : 'primary';
    button1.className = button1.className.replace(/btn-(primary|secondary|accent)/, `btn-${firstVariant}`);
    buttonGroup.appendChild(button1);
  }

  // Create second button (always secondary)
  const button2 = createButtonFromRows(button2Rows);
  if (button2) {
    // Override variant to always be secondary
    button2.className = button2.className.replace(/btn-(primary|secondary|accent)/, 'btn-secondary');
    buttonGroup.appendChild(button2);
  }

  // Add instrumentation
  Object.entries(instrumentation).forEach(([name, value]) => {
    buttonGroup.setAttribute(name, value);
  });

  return buttonGroup;
}

/**
 * Decorator function for Button Group
 *
 * @param {HTMLElement} block - The button-group block element
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

  // Extract instrumentation
  const instrumentation = {};
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      instrumentation[attr.name] = attr.value;
    }
  });

  // Create button group
  const buttonGroup = createButtonGroup(rows, instrumentation);

  // Preserve block classes
  buttonGroup.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block' && cls !== 'button-group') {
        buttonGroup.classList.add(cls);
      }
    });
  }

  // Replace block with button group
  block.replaceWith(buttonGroup);
}
