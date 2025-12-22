/**
 * Icon Button - Utility Component
 *
 * This module exports reusable functions for creating and decorating icon buttons.
 * It can be imported by other components (Card, Accordion, Hero, etc.)
 *
 */

import {
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
} from '../standard-button/standard-button.js';

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
