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
  // Get all rows from the block
  const rows = [...block.children];

  // Extract button configuration from first row
  let text = 'Button';
  let variant = 'primary';
  let size = 'medium';
  let href = null;

  if (rows.length > 0) {
    const cells = [...rows[0].children];

    // Extract values from cells
    if (cells[0]) text = cells[0].textContent.trim() || 'Button';
    if (cells[1]) variant = cells[1].textContent.trim() || 'primary';
    if (cells[2]) size = cells[2].textContent.trim() || 'medium';
    if (cells[3]) {
      const linkElement = cells[3].querySelector('a');
      if (linkElement) {
        href = linkElement.href;
      } else {
        const linkText = cells[3].textContent.trim();
        if (linkText && (linkText.startsWith('http') || linkText.startsWith('/'))) {
          href = linkText;
        }
      }
    }
  }

  // Clear the block content
  block.innerHTML = '';

  // Create the button or link element
  let element;
  if (href) {
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
  if (href) {
    element.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  }

  // Append to block
  block.appendChild(element);

  // Add block classes
  block.classList.add('button-block');
}
