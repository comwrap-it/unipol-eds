/**
 * Button Component - AEM EDS Atomic Design
 * Follows EDS best practices for block structure
 */

// Button constants for shared use
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  ACCENT: 'accent',
  SECONDARY: 'secondary',
};

export const BUTTON_STATES = {
  DEFAULT: 'default',
  HOVER: 'hover',
  PRESSED: 'pressed',
  DISABLED: 'disabled',
  FOCUS: 'focus',
};

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

export default function decorate(block) {
  // Look for rows either directly in block or inside default-content-wrapper
  let rows = [...block.children];

  // If we have a default-content-wrapper, look inside it
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = [...wrapper.children];
  }

  // Extract properties from all rows to create a single button
  const text = rows[0]?.textContent?.trim() || 'Button';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || 'primary';
  const size = rows[2]?.textContent?.trim().toLowerCase() || 'medium';
  const href = rows[3]?.textContent?.trim() || null;

  // Create the button or link element
  let element;
  if (href && href !== '') {
    element = document.createElement('a');
    element.href = href;
    element.setAttribute('role', 'button');
  } else {
    element = document.createElement('button');
    element.type = 'button';
  }

  // Set text content
  element.textContent = text;

  // Add CSS classes
  element.className = `btn btn-${variant} btn-${size}`;

  // Add accessibility attributes
  element.setAttribute('tabindex', '0');

  // Add keyboard support for links acting as buttons
  if (href && href !== '') {
    element.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  }

  // Clear the entire block and append the single button
  block.innerHTML = '';
  block.appendChild(element);

  // Add block classes
  block.classList.add('button-block');
}
