/**
 * Primary Button - Utility Component
 *
 * This module exports reusable functions for creating and decorating buttons.
 * It can be imported by other components (Card, Accordion, Hero, etc.)
 *
 * Export constants and functions that can be reused across components.
 */

// Button constants for shared use
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  ACCENT: 'accent',
};

export const BUTTON_ICON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra-large',
};

export const BUTTON_STATES = {
  DEFAULT: 'default',
  HOVER: 'hover',
  ACTIVE: 'active',
  DISABLED: 'disabled',
  FOCUSED: 'focused',
};

/**
 * Create a button element with styling
 *
 * @param {string} label - Button text/label
 * @param {string} href - Button URL (optional)
 * @param {boolean} openInNewTab - Open link in new tab (optional)
 * @param {string} variant - Button variant (primary, secondary, accent)
 * @param {string} iconSize - Icon size (small, medium, large, extra-large)
 * @param {string} leftIcon - Left icon (optional)
 * @param {string} rightIcon - Right icon (optional)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The button or link element
 *
 * @example
 * const btn = createButton('Click me', 'https://example.com', false, 'primary', 'medium');
 * container.appendChild(btn);
 */
export function createButton(
  label,
  href,
  openInNewTab,
  variant,
  iconSize,
  leftIcon,
  rightIcon,
  instrumentation = {},
) {
  // Decide if it's a link or button
  const isLink = !!href;

  const element = isLink
    ? document.createElement('a')
    : document.createElement('button');

  element.className = ['btn', `btn-${variant || BUTTON_VARIANTS.PRIMARY}`].join(
    ' ',
  );

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

  // add left icon if provided
  if (leftIcon) {
    const leftIconSpan = document.createElement('span');
    leftIconSpan.id = 'left-icon';
    leftIconSpan.className = `icon icon-${
      iconSize || BUTTON_ICON_SIZES.MEDIUM
    } ${leftIcon}`;
    element.appendChild(leftIconSpan);
  } else {
    const alreadyPresentIcon = element.querySelector('#left-icon');
    if (alreadyPresentIcon) {
      alreadyPresentIcon.remove();
    }
  }

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.textContent = label;
  element.appendChild(buttonTextSpan);

  // add right icon if provided
  if (rightIcon) {
    const rightIconSpan = document.createElement('span');
    rightIconSpan.id = 'right-icon';
    rightIconSpan.className = `icon icon-${
      iconSize || BUTTON_ICON_SIZES.MEDIUM
    } ${rightIcon}`;
    element.appendChild(rightIconSpan);
  } else {
    const alreadyPresentIcon = element.querySelector('#right-icon');
    if (alreadyPresentIcon) {
      alreadyPresentIcon.remove();
    }
  }

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
