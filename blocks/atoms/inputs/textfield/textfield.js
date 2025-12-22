import { BUTTON_ICON_SIZES } from "../../../../constants";
import { extractInstrumentationAttributes } from "../../../../scripts/utils";

/**
 * Create a textfield element with styling
 * @param {string} label - Textfield label (required)
 * @param {string} icon - Icon class name (optional)
 * @param {string} iconSize - Icon size (optional)
 * @param {string} hintText - Hint text (optional)
 * @param {string} hintIcon - Hint icon class name (optional)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The textfield element
 */
export const createTextfield = (
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

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'input textfield';
  input.placeholder = ' ';
  input.id = 'textfield';
  inputContainer.appendChild(input);

  const labelElem = document.createElement('label');
  labelElem.textContent = label;
  labelElem.htmlFor = 'textfield';
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

/**
 * Extract values from block rows
 * @param {HTMLElement[]} rows The block rows
 * @returns {Object} The extracted values
 */
const extractValuesFromRows = (rows) => {
  const label = rows[0].textContent.trim();
  const icon = rows[1] ? rows[1].textContent.trim() : '';
  const iconSize = rows[2] ? rows[2].textContent.trim() : '';
  const hintText = rows[3] ? rows[3].textContent.trim() : '';
  const hintIcon = rows[4] ? rows[4].textContent.trim() : '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return {
    label,
    icon,
    iconSize,
    hintText,
    hintIcon,
    instrumentation,
  };
};

/**
 * Decorate Textfield Block
 * @param {HTMLElement} block The Textfield block element
 */
export default function decorateTextfield(block) {
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
    label, icon, iconSize, hintText, hintIcon, instrumentation,
  } = extractValuesFromRows(rows);

  if (hasInstrumentation) {
    let textfield = block.querySelector('.textfield');
    if (!textfield) {
      textfield = createTextfield(
        label,
        icon,
        iconSize,
        hintText,
        hintIcon,
        instrumentation,
      );
      if (rows[0]) {
        rows[0].textContent = '';
        rows[0].appendChild(textfield);
      } else {
        block.appendChild(textfield);
      }
    } else {
      // Update existing category tab
      textfield = createTextfield(
        label,
        icon,
        iconSize,
        hintText,
        hintIcon,
        instrumentation,
      );
    }
  } else {
    const textfield = createTextfield(
      label,
      icon,
      iconSize,
      hintText,
      hintIcon,
      instrumentation,
    );
    // Clear block and append textfield
    block.textContent = '';
    block.appendChild(textfield);
  }
}
