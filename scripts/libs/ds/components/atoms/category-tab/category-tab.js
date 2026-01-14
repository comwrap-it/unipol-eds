import { BUTTON_ICON_SIZES } from "../../../constants/index.js";

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
  instrumentation = {}
) => {
  const tab = document.createElement("button");
  tab.className = "category-tab";

  if (icon) {
    const iconSpan = document.createElement("span");
    iconSpan.className = `icon icon-${
      iconSize || BUTTON_ICON_SIZES.MEDIUM
    } ${icon}`;
    tab.appendChild(iconSpan);
  }

  const textSpan = document.createElement("span");
  textSpan.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  tab.appendChild(textSpan);

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    tab.setAttribute(name, value);
  });

  tab.onclick = () => {
    tab.classList.add("selected");
  };

  return tab;
};
