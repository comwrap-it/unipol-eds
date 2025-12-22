import { BUTTON_ICON_SIZES } from "../../../../constants";


/**
 * Create a textarea element with styling
 * @param {string} label - Textarea label (required)
 * @param {string} icon - Icon class name (optional)
 * @param {string} iconSize - Icon size (optional)
 * @param {string} hintText - Hint text (optional)
 * @param {string} hintIcon - Hint icon class name (optional)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The textarea element
 */
export const createTextarea = (
  label,
  icon,
  iconSize = BUTTON_ICON_SIZES.SMALL,
  hintText = '',
  hintIcon = '',
  instrumentation = {},
) => {
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'input-main-wrapper';
  // input container is a relative element to position icon and label absolutely within it
  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-container';
  mainWrapper.appendChild(inputContainer);

  const textarea = document.createElement('textarea');
  textarea.className = 'input textarea';
  textarea.placeholder = ' ';
  textarea.id = 'textarea';
  inputContainer.appendChild(textarea);

  const labelElem = document.createElement('label');
  labelElem.textContent = label;
  labelElem.htmlFor = 'textarea';
  inputContainer.appendChild(labelElem);

  if (icon) {
    const iconSpan = document.createElement('span');
    iconSpan.className = `icon icon-${
      iconSize || BUTTON_ICON_SIZES.MEDIUM
    } ${icon}`;
    inputContainer.appendChild(iconSpan);
  }

  if (hintText) {
    const helperContainer = document.createElement('div');
    helperContainer.className = 'helper-container';
    if (hintIcon) {
      const hintIconSpan = document.createElement('span');
      hintIconSpan.className = `icon icon-small ${hintIcon}`;
      helperContainer.appendChild(hintIconSpan);
    }
    const hintP = document.createElement('p');
    hintP.className = 'hint-text';
    hintP.textContent = hintText;
    helperContainer.appendChild(hintP);
    mainWrapper.appendChild(helperContainer);
  }

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    mainWrapper.setAttribute(name, value);
  });

  return mainWrapper;
};

