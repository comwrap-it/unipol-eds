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
 * @param {string} variant - Button variant (primary, secondary, accent)
 * @param {string} iconSize - Icon size (small, medium, large, extra-large)
 * @param {string} leftIcon - Left icon (optional)
 * @param {string} rightIcon - Right icon (optional)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The button or link element
 *
 * @example
 * const btn = createButton('Click me', 'https://example.com', 'primary', 'medium');
 * container.appendChild(btn);
 */
export function createButton(
  label,
  href,
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
  }

  // Add accessibility attributes
  element.setAttribute('tabindex', '0');

  // add left icon if provided
  if (leftIcon) {
    const leftIconSpan = document.createElement('span');
    leftIconSpan.className = `icon icon-${
      iconSize || BUTTON_ICON_SIZES.MEDIUM
    } ${leftIcon}`;
    element.appendChild(leftIconSpan);
  }

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.textContent = label;
  element.appendChild(buttonTextSpan);

  // add right icon if provided
  if (rightIcon) {
    const rightIconSpan = document.createElement('span');
    rightIconSpan.className = `icon icon-${
      iconSize || BUTTON_ICON_SIZES.MEDIUM
    } ${rightIcon}`;
    element.appendChild(rightIconSpan);
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

/**
 * Extract instrumentation attributes from an element
 * (Placeholder function - implementation depends on specific requirements)
 *
 * @param {HTMLElement} element - The element to extract attributes from
 * @returns {Object} An object containing instrumentation attributes
 */
export const extractInstrumentationAttributes = (element) => {
  const instrumentation = {};
  if (element) {
    [...element.attributes].forEach((attr) => {
      if (
        attr.name.startsWith('data-aue-')
        || attr.name.startsWith('data-richtext-')
      ) {
        instrumentation[attr.name] = attr.value;
      }
    });
  }
  return instrumentation;
};

/** Extract button properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing button properties
 */
const extractValuesFromRows = (rows) => {
  const text = rows[0]?.textContent?.trim() || 'Button';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const iconSize = rows[2]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const href = rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || '';
  const leftIcon = rows[4]?.textContent?.trim() || '';
  const rightIcon = rows[5]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return {
    text,
    variant,
    iconSize,
    href,
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
 * @returns {HTMLElement} The button element
 */
export function createButtonFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const {
    text,
    variant,
    iconSize,
    href,
    leftIcon,
    rightIcon,
    instrumentation,
  } = extractValuesFromRows(rows);

  return createButton(
    text,
    href,
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
