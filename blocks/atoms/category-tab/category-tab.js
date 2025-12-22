import { BUTTON_ICON_SIZES } from '../../../constants/index.js';
import { extractInstrumentationAttributes } from '../../../scripts/utils.js';

/**
 * Create a category tab element with styling
 * @param {string} category - Category name (required)
 * @param {string} icon - Icon class name (required)
 * @param {string} iconSize - Icon size (optional)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The category tab element
 */
export const createCategoryTab = (
  category,
  icon,
  iconSize = BUTTON_ICON_SIZES.MEDIUM,
  instrumentation = {},
) => {
  const tab = document.createElement('button');
  tab.className = 'category-tab';

  const iconSpan = document.createElement('span');
  iconSpan.className = `icon icon-${
    iconSize || BUTTON_ICON_SIZES.MEDIUM
  } ${icon}`;
  tab.appendChild(iconSpan);

  const textSpan = document.createElement('span');
  textSpan.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  tab.appendChild(textSpan);

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    tab.setAttribute(name, value);
  });

  tab.onclick = () => {
    tab.classList.add('selected');
  };

  return tab;
};

/**
 * Extract values from block rows
 * @param {HTMLElement[]} rows The block rows
 * @returns {Object} The extracted values
 */
const extractValuesFromRows = (rows) => {
  const category = rows[0].textContent.trim();
  const icon = rows[1] ? rows[1].textContent.trim() : '';
  const iconSize = rows[2] ? rows[2].textContent.trim() : '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return {
    category, icon, iconSize, instrumentation,
  };
};

/**
 * Decorate Category Tab Block
 * @param {HTMLElement} block The Category Tab block element
 */
export default function decorateCategoryTab(block) {
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
  const {
    category, icon, iconSize, instrumentation,
  } = extractValuesFromRows(rows);

  if (hasInstrumentation) {
    let categoryTab = block.querySelector('.category-tab');
    if (!categoryTab) {
      categoryTab = createCategoryTab(
        category,
        icon,
        iconSize,
        instrumentation,
      );
      if (rows[0]) {
        rows[0].textContent = '';
        rows[0].appendChild(categoryTab);
      } else {
        block.appendChild(categoryTab);
      }
    } else {
      // Update existing category tab
      categoryTab = createCategoryTab(
        category,
        icon,
        iconSize,
        instrumentation,
      );
    }
  } else {
    const categoryTab = createCategoryTab(category, icon, iconSize, instrumentation);
    // Clear block and append category tab
    block.textContent = '';
    block.appendChild(categoryTab);
  }
}
