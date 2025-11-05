/**
 * Primary Button - Utility Component
 *
 * Reusable functions for creating and decorating buttons.
 * Can be imported by other components (Text Block, Card, Hero, etc.)
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
 * @param {string} label - Button text/label
 * @param {string} href - Button URL (optional)
 * @param {string} variant - Button variant (primary, secondary, accent)
 * @param {string} size - Button size (small, medium, large)
 * @returns {HTMLElement} The button or link element
 */
export function createButton(
  label,
  href = '',
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
) {
  // Decide if it's a link or button
  const element = href && href.trim() !== ''
    ? document.createElement('a')
    : document.createElement('button');

  // Set common properties
  element.textContent = label || 'Button';
  const classes = ['btn', `btn-${variant}`, `btn-${size}`];
  element.className = classes.join(' ');

  // Debug log: button creation
  // eslint-disable-next-line no-console
  console.log('[Button] Created button:', {
    label,
    href,
    variant,
    size,
    classes,
    element: element.tagName,
  });

  // Set href for links
  if (href && href.trim() !== '') {
    element.href = href;
    element.setAttribute('role', 'button');
  }

  // Add accessibility attributes
  element.setAttribute('tabindex', '0');

  // Add keyboard support
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
 * Extract button data from cell elements
 * @param {HTMLElement[]} cells - Array of cell elements
 * @returns {Object} Button configuration object
 */
export function extractButtonData(cells) {
  if (!cells || cells.length === 0) {
    return {
      text: 'Button',
      variant: BUTTON_VARIANTS.PRIMARY,
      size: BUTTON_SIZES.MEDIUM,
      href: '',
    };
  }

  // Cell structure: [0] = text, [1] = variant, [2] = size, [3] = href
  // Extract text handling both direct textContent and nested elements
  let text = cells[0]?.textContent?.trim() || '';
  if (!text && cells[0]) {
    const existingButton = cells[0].querySelector('a, button');
    text = existingButton?.textContent?.trim() || cells[0].firstChild?.textContent?.trim() || '';
  }

  let variantText = cells[1]?.textContent?.trim() || '';
  if (!variantText && cells[1]?.firstChild) {
    variantText = cells[1].firstChild.textContent?.trim() || '';
  }

  let sizeText = cells[2]?.textContent?.trim() || '';
  if (!sizeText && cells[2]?.firstChild) {
    sizeText = cells[2].firstChild.textContent?.trim() || '';
  }

  const buttonData = {
    text: text || 'Button',
    variant: variantText.toLowerCase() || BUTTON_VARIANTS.PRIMARY,
    size: sizeText.toLowerCase() || BUTTON_SIZES.MEDIUM,
    href: '',
  };

  // Debug log: extracted button data
  // eslint-disable-next-line no-console
  console.log('[Button] Extracted data from cells:', {
    raw: {
      text: cells[0]?.textContent?.trim(),
      variant: cells[1]?.textContent?.trim(),
      size: cells[2]?.textContent?.trim(),
      href: cells[3]?.textContent?.trim(),
    },
    processed: buttonData,
  });

  // Extract href from cell (could be text or link)
  if (cells[3]) {
    const link = cells[3].querySelector('a');
    buttonData.href = link?.href || cells[3].textContent?.trim() || '';
  }

  return buttonData;
}

/**
 * Validate button variant and size values
 * @param {string} variant - Variant value to validate
 * @param {string} size - Size value to validate
 * @returns {Object} Validated variant and size
 */
export function validateButtonProps(variant = '', size = '') {
  const validVariants = Object.values(BUTTON_VARIANTS);
  const validSizes = Object.values(BUTTON_SIZES);

  const validated = {
    variant: validVariants.includes(variant) ? variant : BUTTON_VARIANTS.PRIMARY,
    size: validSizes.includes(size) ? size : BUTTON_SIZES.MEDIUM,
  };

  // Debug log: validation
  if (variant !== validated.variant || size !== validated.size) {
    // eslint-disable-next-line no-console
    console.log('[Button] Validation changed values:', {
      input: { variant, size },
      validated,
    });
  }

  return validated;
}

/**
 * Decorator function for standalone button component
 * Used when button is rendered as a standalone block
 * @param {HTMLElement} block - The button block element
 */
export default function decorateButton(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);

  // Handle wrapper structure
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Extract button properties
  const buttonData = extractButtonData(rows);
  const { variant, size } = validateButtonProps(buttonData.variant, buttonData.size);

  // Create button element
  const button = createButton(buttonData.text, buttonData.href, variant, size);

  // Clear block and add button
  block.textContent = '';
  block.appendChild(button);
  block.classList.add('button-block');
}
