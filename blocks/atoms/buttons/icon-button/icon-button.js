/**
 * Icon Button - Utility Component
 *
 * This module exports reusable functions for creating and decorating icon buttons.
 * It can be imported by other components (Card, Accordion, Hero, etc.)
 *
 */

import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../../../constants';
import { extractInstrumentationAttributes } from '../../../../scripts/utils';

/**
 * Create a button element with styling
 *
 * @param {string} icon - icon (required)
 * @param {string} variant - Button variant (primary, secondary)
 * @param {string} iconSize - Icon size (small, medium, large, extra-large)
 * @param {string} href - Button URL (optional)
 * @param {boolean} openInNewTab - Open link in new tab (optional)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The button or link element
 *
 */
export function createIconButton(
  icon,
  variant,
  iconSize,
  href,
  openInNewTab,
  instrumentation = {},
) {
  // Decide if it's a link or button
  const isLink = !!href;

  const element = isLink
    ? document.createElement('a')
    : document.createElement('button');
  element.className = [
    'btn-icon',
    `btn-icon-${variant || BUTTON_VARIANTS.PRIMARY}`,
  ].join(' ');

  const iconSpan = document.createElement('span');
  iconSpan.className = `icon icon-${
    iconSize || BUTTON_ICON_SIZES.MEDIUM
  } ${icon}`;
  element.appendChild(iconSpan);

  // Set href for links
  if (isLink) {
    element.href = href;
    element.setAttribute('role', 'button');

    // Set target="_blank" if openInNewTab is true
    if (openInNewTab) {
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Add accessibility attributes
  element.setAttribute('tabindex', '0');

  // Add keyboard support for buttons
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      element.click();
    }
  });

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  return element;
}

/** Extract button properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing button properties
 *
 * Row mapping (based on _icon-button.json field order):
 * rows[0]: iconButtonIcon (select)
 * rows[1]: iconButtonVariant (select)
 * rows[2]: iconButtonSize (select)
 * rows[3]: iconButtonHref (aem-content)
 * rows[4]: iconButtonOpenInNewTab (boolean)
 */
const extractValuesFromRows = (rows) => {
  const icon = rows[0]?.textContent?.trim() || '';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const iconSize = rows[2]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const href = rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || '';
  const openInNewTab = rows[4]?.textContent?.trim() === 'true';
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return {
    icon,
    variant,
    iconSize,
    href,
    openInNewTab,
    instrumentation,
  };
};

/**
 * Process button data from rows and create button element
 * Used when button is rendered from Universal Editor data structure
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {HTMLElement} The button element
 */
export function createButtonFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const {
    icon, variant, iconSize, href, openInNewTab, instrumentation,
  } = extractValuesFromRows(rows);

  return createIconButton(
    icon,
    variant,
    iconSize,
    href,
    openInNewTab,
    instrumentation,
  );
}

/**
 * Decorator function for icon button block
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
    icon, variant, iconSize, href, openInNewTab, instrumentation,
  } = extractValuesFromRows(rows);

  if (hasInstrumentation) {
    // Preserve structure for Universal Editor
    // Find or create button element preserving instrumentation
    let buttonElement = block.querySelector('a, button');

    if (!buttonElement) {
      // Create button/link element preserving instrumentation from first row
      buttonElement = createIconButton(
        icon,
        variant,
        iconSize,
        href,
        openInNewTab,
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
      buttonElement = createIconButton(
        icon,
        variant,
        iconSize,
        href,
        openInNewTab,
        instrumentation,
      );
    }

    // Apply button classes
    buttonElement.className = ['btn-icon', `btn-icon-${variant}`].join(' ');
    buttonElement.setAttribute('tabindex', '0');
  } else {
    // No instrumentation - create button normally
    const button = createIconButton(
      icon,
      variant,
      iconSize,
      href,
      openInNewTab,
    );
    block.textContent = '';
    block.appendChild(button);
  }
}
