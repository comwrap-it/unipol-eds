/**
 * Button Component - Atomic Design System
 * Standard button implementation for EDS
 */

// Button types and variants constants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  ACCENT: 'accent',
  SECONDARY: 'secondary'
};

export const BUTTON_STATES = {
  ENABLED: 'enabled',
  HOVER: 'hover',
  FOCUSED: 'focused',
  PRESSED: 'pressed',
  DISABLED: 'disabled'
};

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

/**
 * Set button variant
 * @param {HTMLElement} element - Button element
 * @param {string} variant - Button variant (primary, accent, secondary)
 */
export function setButtonVariant(element, variant) {
  if (!element) return;
  
  // Remove existing variant classes
  Object.values(BUTTON_VARIANTS).forEach(v => {
    element.classList.remove(v);
  });
  
  // Add new variant class
  if (Object.values(BUTTON_VARIANTS).includes(variant)) {
    element.classList.add(variant);
  }
}

/**
 * Set button state
 * @param {HTMLElement} element - Button element
 * @param {string} state - Button state
 */
export function setButtonState(element, state) {
  if (!element) return;
  
  // Remove existing state classes
  Object.values(BUTTON_STATES).forEach(s => {
    element.classList.remove(s);
  });
  
  // Handle disabled state
  if (state === BUTTON_STATES.DISABLED) {
    element.disabled = true;
    element.classList.add('disabled');
  } else {
    element.disabled = false;
    element.classList.remove('disabled');
    
    // Add state class if valid
    if (Object.values(BUTTON_STATES).includes(state)) {
      element.classList.add(state);
    }
  }
}

/**
 * Set button size
 * @param {HTMLElement} element - Button element
 * @param {string} size - Button size
 */
export function setButtonSize(element, size) {
  if (!element) return;
  
  // Remove existing size classes
  Object.values(BUTTON_SIZES).forEach(s => {
    element.classList.remove(s);
  });
  
  // Add new size class
  if (Object.values(BUTTON_SIZES).includes(size)) {
    element.classList.add(size);
  }
}

/**
 * Create button element
 * @param {Object} config - Button configuration
 * @returns {HTMLButtonElement} Button element
 */
export function createButton(config = {}) {
  const {
    text = 'Button',
    variant = BUTTON_VARIANTS.PRIMARY,
    size = BUTTON_SIZES.MEDIUM,
    disabled = false,
    fullWidth = false,
    loading = false,
    onClick = null,
    className = '',
    id = '',
    type = 'button'
  } = config;

  const button = document.createElement('button');
  button.type = type;
  button.className = `button ${variant} ${size} ${className}`.trim();
  button.textContent = text;
  
  if (id) button.id = id;
  if (disabled) button.disabled = true;
  if (fullWidth) button.classList.add('full-width');
  if (loading) button.classList.add('loading');
  
  // Add click handler
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Add keyboard accessibility
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
  
  return button;
}

/**
 * Initialize button interactions
 * @param {HTMLElement} button - Button element
 */
function initializeButtonInteractions(button) {
  if (!button) return;
  
  // Add hover effects
  button.addEventListener('mouseenter', () => {
    if (!button.disabled) {
      button.classList.add('hover');
    }
  });
  
  button.addEventListener('mouseleave', () => {
    button.classList.remove('hover');
  });
  
  // Add focus effects
  button.addEventListener('focus', () => {
    if (!button.disabled) {
      button.classList.add('focused');
    }
  });
  
  button.addEventListener('blur', () => {
    button.classList.remove('focused');
  });
  
  // Add pressed effects
  button.addEventListener('mousedown', () => {
    if (!button.disabled) {
      button.classList.add('pressed');
    }
  });
  
  button.addEventListener('mouseup', () => {
    button.classList.remove('pressed');
  });
  
  // Handle keyboard interactions
  button.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !button.disabled) {
      button.classList.add('pressed');
    }
  });
  
  button.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      button.classList.remove('pressed');
    }
  });
}

/**
 * Main decoration function for EDS
 * @param {HTMLElement} block - The button block element
 */
export default function decorate(block) {
  if (!block) return;
  
  // Get configuration from block data attributes or content
  const buttonText = block.textContent?.trim() || 'Button';
  const variant = block.dataset.variant || BUTTON_VARIANTS.PRIMARY;
  const size = block.dataset.size || BUTTON_SIZES.MEDIUM;
  const disabled = block.dataset.disabled === 'true';
  const fullWidth = block.dataset.fullWidth === 'true';
  
  // Clear block content
  block.innerHTML = '';
  
  // Create button element
  const button = createButton({
    text: buttonText,
    variant,
    size,
    disabled,
    fullWidth
  });
  
  // Initialize interactions
  initializeButtonInteractions(button);
  
  // Append button to block
  block.appendChild(button);
  
  // Add block-level classes
  block.classList.add('button-block', 'atom');
  
  return block;
}

// Export for Storybook and testing
export { createButton as Button };