/**
 * Primary Button - Utility Component
 *
 * This module exports reusable functions for creating and decorating buttons.
 * It can be imported by other components (Card, Accordion, Hero, etc.)
 *
 * Export constants and functions that can be reused across components.
 */
import {
  createButton,
} from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../../../constants/index.js';
import { extractInstrumentationAttributes } from '../../../../scripts/utils.js';

/** Extract button properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing button properties
 *
 * Row mapping (based on _standard-button.json field order):
 * rows[0]: standardButtonLabel (text)
 * rows[1]: standardButtonVariant (select)
 * rows[2]: standardButtonHref (aem-content)
 * rows[3]: standardButtonOpenInNewTab (boolean)
 * rows[4]: standardButtonSize (select)
 * rows[5]: standardButtonLeftIcon (select)
 * rows[6]: standardButtonRightIcon (select)
 */
const extractValuesFromRows = (rows) => {
  const text = rows[0]?.textContent?.trim() || '';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const href = rows[2]?.querySelector('a')?.href || rows[2]?.textContent?.trim() || '';
  const openInNewTab = rows[3]?.textContent?.trim() === 'true';
  const iconSize = rows[4]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const leftIcon = rows[5]?.textContent?.trim() || '';
  const rightIcon = rows[6]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return {
    text,
    variant,
    iconSize,
    href,
    openInNewTab,
    leftIcon,
    rightIcon,
    instrumentation,
  };
};

/**
 * Process button data from rows and create button element
 * Used when button is rendered from Universal Editor data structure
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {HTMLElement|null} The button element, or null if no label is provided
 */
export function createButtonFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const {
    text,
    variant,
    iconSize,
    href,
    openInNewTab,
    leftIcon,
    rightIcon,
    instrumentation,
  } = extractValuesFromRows(rows);

  // Don't create button if there's no label text
  if (!text) return null;

  return createButton(
    text,
    href,
    openInNewTab,
    variant,
    iconSize,
    leftIcon,
    rightIcon,
    instrumentation,
  );
}

/**
 * Decorator function for standalone button component
 * Used when button is rendered as a standalone block
 *
 * @param {HTMLElement} block - The button block element
 */
export default function decorateButton(block) {
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

  // Extract button properties
  const {
    text,
    variant,
    iconSize,
    href,
    openInNewTab,
    leftIcon,
    rightIcon,
    instrumentation,
  } = extractValuesFromRows(rows);

  if (hasInstrumentation) {
    // Preserve structure for Universal Editor
    // Find or create button element preserving instrumentation
    let buttonElement = block.querySelector('a, button');

    if (!buttonElement) {
      // Create button/link element preserving instrumentation from first row
      buttonElement = createButton(
        text,
        href,
        openInNewTab,
        variant,
        iconSize,
        leftIcon,
        rightIcon,
        instrumentation,
      );
      if (rows[0]) {
        // Preserve row structure but add button
        rows[0].textContent = '';
        rows[0].appendChild(buttonElement);
      } else {
        block.appendChild(buttonElement);
      }
    } else {
      // Update existing button with text and href
      buttonElement = createButton(
        text,
        href,
        openInNewTab,
        variant,
        iconSize,
        leftIcon,
        rightIcon,
        instrumentation,
      );
    }

    // Apply button classes
    buttonElement.className = ['btn', `btn-${variant}`].join(' ');
    buttonElement.setAttribute('tabindex', '0');
  } else {
    // No instrumentation - create button normally
    const button = createButton(
      text,
      href,
      openInNewTab,
      variant,
      iconSize,
      leftIcon,
      rightIcon,
    );
    block.textContent = '';
    block.appendChild(button);
  }

  block.classList.add('button-block');
}
