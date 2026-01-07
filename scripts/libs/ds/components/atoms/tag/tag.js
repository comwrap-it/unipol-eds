/**
 * Create a tag element with styling
 * @param {string} label - Tag label (required)
 * @param {string} category - Category name (required)
 * @param {string} type - Tag type (required)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The tag element
 */
export const createTag = (label, category, type, instrumentation = {}) => {
  const tag = document.createElement('div');
  tag.className = `tag ${category} ${type}`;

  tag.textContent = label;

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    tag.setAttribute(name, value);
  });

  return tag;
};
