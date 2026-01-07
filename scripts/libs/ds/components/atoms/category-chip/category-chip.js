/**
 * Create a category chip element with styling
 * @param {string} category - Category name (required) mobility | welfare | property
 * @param {string} icon - Icon class name (required)
 * @param {string} text - Text displayed
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The category chip element
 */
export const createCategoryChip = (category, icon, text = '', instrumentation = {}) => {
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
