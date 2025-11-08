/**
 * Icon Button Component - Atomic Design System
 * Icon button implementation for EDS with icon support
 */

// Import shared constants from primary button
import { BUTTON_VARIANTS, BUTTON_STATES, BUTTON_SIZES } from '../primary-button/primary-button.js';

// Icon button specific constants
export const ICON_POSITIONS = {
  LEADING: 'leading',
  TRAILING: 'trailing',
  ONLY: 'only',
};

export const ICON_BUTTON_STYLES = {
  STANDARD: 'standard',
  CIRCULAR: 'circular',
  FAB: 'fab',
};

/**
 * Set icon button variant
 * @param {HTMLElement} element - Icon button element
 * @param {string} variant - Button variant (primary, accent, secondary)
 */
export function setIconButtonVariant(element, variant) {
  if (!element) return;

  // Remove existing variant classes
  Object.values(BUTTON_VARIANTS).forEach((v) => {
    element.classList.remove(v);
  });

  // Add new variant class
  if (Object.values(BUTTON_VARIANTS).includes(variant)) {
    element.classList.add(variant);
  }
}

/**
 * Set icon button state
 * @param {HTMLElement} element - Icon button element
 * @param {string} state - Button state
 */
export function setIconButtonState(element, state) {
  if (!element) return;

  // Remove existing state classes
  Object.values(BUTTON_STATES).forEach((s) => {
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
 * Set icon button size
 * @param {HTMLElement} element - Icon button element
 * @param {string} size - Button size
 */
export function setIconButtonSize(element, size) {
  if (!element) return;

  // Remove existing size classes
  Object.values(BUTTON_SIZES).forEach((s) => {
    element.classList.remove(s);
  });

  // Add new size class
  if (Object.values(BUTTON_SIZES).includes(size)) {
    element.classList.add(size);
  }
}

/**
 * Create icon element
 * @param {string|Object} icon - Icon name or configuration
 * @param {string} position - Icon position (leading, trailing, only)
 * @returns {HTMLElement} Icon element
 */
function createIcon(icon, position = ICON_POSITIONS.ONLY) {
  const iconElement = document.createElement('span');
  iconElement.className = `icon ${position}`;

  if (typeof icon === 'string') {
    // Handle different icon types
    if (icon.startsWith('<svg')) {
      // SVG string
      iconElement.innerHTML = icon;
    } else if (icon.includes('.')) {
      // Image file
      const img = document.createElement('img');
      img.src = icon;
      img.alt = '';
      iconElement.appendChild(img);
    } else {
      // Font icon or text
      iconElement.textContent = icon;
      iconElement.classList.add('font-icon');
    }
  } else if (icon && typeof icon === 'object') {
    // Icon configuration object
    const { type, content, alt = '' } = icon;

    switch (type) {
      case 'svg':
        iconElement.innerHTML = content;
        break;
      case 'image': {
        const img = document.createElement('img');
        img.src = content;
        img.alt = alt;
        iconElement.appendChild(img);
        break;
      }
      case 'font':
        iconElement.textContent = content;
        iconElement.classList.add('font-icon');
        break;
      default:
        iconElement.textContent = content;
    }
  }

  return iconElement;
}

/**
 * Create icon button element
 * @param {Object} config - Icon button configuration
 * @returns {HTMLButtonElement} Icon button element
 */
export function createIconButton(config = {}) {
  const {
    text = '',
    icon = '★',
    iconPosition = text ? ICON_POSITIONS.LEADING : ICON_POSITIONS.ONLY,
    variant = BUTTON_VARIANTS.PRIMARY,
    size = BUTTON_SIZES.MEDIUM,
    style = ICON_BUTTON_STYLES.STANDARD,
    disabled = false,
    fullWidth = false,
    loading = false,
    toggle = false,
    active = false,
    badge = null,
    onClick = null,
    className = '',
    id = '',
    type = 'button',
    ariaLabel = '',
  } = config;

  const button = document.createElement('button');
  button.type = type;

  // Build class list
  const classes = ['icon-button', variant, size];
  if (style !== ICON_BUTTON_STYLES.STANDARD) classes.push(style);
  if (!text) classes.push('icon-only');
  if (fullWidth) classes.push('full-width');
  if (loading) classes.push('loading');
  if (toggle) classes.push('toggle');
  if (toggle && active) classes.push('active');
  if (className) classes.push(className);

  button.className = classes.join(' ');

  if (id) button.id = id;
  if (disabled) button.disabled = true;

  // Set aria-label for accessibility
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  } else if (!text) {
    button.setAttribute('aria-label', 'Icon button');
  }

  // Add icon
  if (icon) {
    const iconElement = createIcon(icon, iconPosition);
    button.appendChild(iconElement);
  }

  // Add text if provided
  if (text) {
    const textElement = document.createElement('span');
    textElement.textContent = text;
    textElement.className = 'button-text';
    button.appendChild(textElement);
  }

  // Add badge if provided
  if (badge) {
    const badgeElement = document.createElement('span');
    badgeElement.className = 'badge';
    badgeElement.textContent = badge;
    button.appendChild(badgeElement);
  }

  // Add click handler
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', (e) => {
      if (toggle && !disabled) {
        button.classList.toggle('active');
      }
      onClick(e);
    });
  } else if (toggle) {
    button.addEventListener('click', () => {
      if (!disabled) {
        button.classList.toggle('active');
      }
    });
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
 * Initialize icon button interactions
 * @param {HTMLElement} button - Icon button element
 */
function initializeIconButtonInteractions(button) {
  if (!button) return;

  // Add hover effects
  button.addEventListener('mouseenter', () => {
    if (!button.disabled && !button.classList.contains('disabled')) {
      button.classList.add('hover');
    }
  });

  button.addEventListener('mouseleave', () => {
    button.classList.remove('hover');
  });

  // Add focus effects
  button.addEventListener('focus', () => {
    if (!button.disabled && !button.classList.contains('disabled')) {
      button.classList.add('focused');
    }
  });

  button.addEventListener('blur', () => {
    button.classList.remove('focused');
  });

  // Add pressed effects
  button.addEventListener('mousedown', () => {
    if (!button.disabled && !button.classList.contains('disabled')) {
      button.classList.add('pressed');
    }
  });

  button.addEventListener('mouseup', () => {
    button.classList.remove('pressed');
  });

  // Handle keyboard interactions
  button.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !button.disabled && !button.classList.contains('disabled')) {
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
 * @param {HTMLElement} block - The icon button block element
 */
export default function decorate(block) {
  if (!block) return;

  // Get configuration from block data attributes or content
  const buttonText = block.dataset.text || '';
  const icon = block.dataset.icon || '★';
  const iconPosition = block.dataset.iconPosition
    || (buttonText ? ICON_POSITIONS.LEADING : ICON_POSITIONS.ONLY);
  const variant = block.dataset.variant || BUTTON_VARIANTS.PRIMARY;
  const size = block.dataset.size || BUTTON_SIZES.MEDIUM;
  const style = block.dataset.style || ICON_BUTTON_STYLES.STANDARD;
  const disabled = block.dataset.disabled === 'true';
  const fullWidth = block.dataset.fullWidth === 'true';
  const toggle = block.dataset.toggle === 'true';
  const active = block.dataset.active === 'true';
  const { badge } = block.dataset;
  const ariaLabel = block.dataset.ariaLabel || block.getAttribute('aria-label');

  // Clear block content
  block.innerHTML = '';

  // Create icon button element
  const button = createIconButton({
    text: buttonText,
    icon,
    iconPosition,
    variant,
    size,
    style,
    disabled,
    fullWidth,
    toggle,
    active,
    badge,
    ariaLabel,
  });

  // Initialize interactions
  initializeIconButtonInteractions(button);

  // Append button to block
  block.appendChild(button);

  // Add block-level classes
  block.classList.add('icon-button-block', 'atom');
}

// Export for Storybook and testing
export { createIconButton as IconButton };
