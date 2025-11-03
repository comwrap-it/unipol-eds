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

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

/**
 * Create a button element with styling
 *
 * @param {string} label - Button text/label
 * @param {string} href - Button URL (optional)
 * @param {string} variant - Button variant (primary, secondary, accent)
 * @param {string} size - Button size (small, medium, large)
 * @returns {HTMLElement} The button or link element
 *
 * @example
 * const btn = createButton('Click me', 'https://example.com', 'primary', 'medium');
 * container.appendChild(btn);
 */
export function createButton(
  label,
  href = '',
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
) {
  // Decide if it's a link or button
  const element = href && href !== ''
    ? document.createElement('a')
    : document.createElement('button');

  // Set common properties
  element.textContent = label;
  element.className = ['btn', `btn-${variant}`, `btn-${size}`].join(' ');

  // Set href for links
  if (href && href !== '') {
    element.href = href;
    element.setAttribute('role', 'button');
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

  // Add focus styles
  element.addEventListener('focus', () => {
    element.classList.add('btn-focus');
  });

  element.addEventListener('blur', () => {
    element.classList.remove('btn-focus');
  });

  return element;
}

/**
 * Process button data from rows and create button element
 * Used when button is rendered from Universal Editor data structure
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {HTMLElement} The button element
 */
export function createButtonFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const text = rows[0]?.textContent?.trim() || 'Button';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const size = rows[2]?.textContent?.trim().toLowerCase() || BUTTON_SIZES.MEDIUM;
  const href = rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || '';

  return createButton(text, href, variant, size);
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

  // Extract button properties
  const text = rows[0]?.textContent?.trim() || 'Button';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const size = rows[2]?.textContent?.trim().toLowerCase() || BUTTON_SIZES.MEDIUM;
  const href = rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || '';

  // Create and append button
  const button = createButton(text, href, variant, size);
  block.textContent = '';
  block.appendChild(button);
  block.classList.add('button-block');
}
