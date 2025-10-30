/**
 * Link Button Component - Atomic Design System
 * Link button implementation for EDS with href functionality
 */

// Import shared constants from base button
import { BUTTON_VARIANTS, BUTTON_STATES, BUTTON_SIZES } from '../button/button.js';

/**
 * Set link button variant
 * @param {HTMLElement} element - Link button element
 * @param {string} variant - Button variant (primary, accent, secondary)
 */
export function setLinkButtonVariant(element, variant) {
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
 * Set link button state
 * @param {HTMLElement} element - Link button element
 * @param {string} state - Button state
 */
export function setLinkButtonState(element, state) {
  if (!element) return;
  
  // Remove existing state classes
  Object.values(BUTTON_STATES).forEach(s => {
    element.classList.remove(s);
  });
  
  // Handle disabled state
  if (state === BUTTON_STATES.DISABLED) {
    element.classList.add('disabled');
    element.setAttribute('aria-disabled', 'true');
    element.removeAttribute('href'); // Remove href to disable navigation
  } else {
    element.classList.remove('disabled');
    element.removeAttribute('aria-disabled');
    
    // Add state class if valid
    if (Object.values(BUTTON_STATES).includes(state)) {
      element.classList.add(state);
    }
  }
}

/**
 * Set link button size
 * @param {HTMLElement} element - Link button element
 * @param {string} size - Button size
 */
export function setLinkButtonSize(element, size) {
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
 * Create link button element
 * @param {Object} config - Link button configuration
 * @returns {HTMLAnchorElement} Link button element
 */
export function createLinkButton(config = {}) {
  const {
    text = 'Link Button',
    href = '#',
    variant = BUTTON_VARIANTS.PRIMARY,
    size = BUTTON_SIZES.MEDIUM,
    disabled = false,
    fullWidth = false,
    loading = false,
    external = false,
    download = false,
    target = null,
    rel = null,
    className = '',
    id = '',
    onClick = null
  } = config;

  const linkButton = document.createElement('a');
  linkButton.className = `link-button ${variant} ${size} ${className}`.trim();
  linkButton.textContent = text;
  linkButton.href = disabled ? undefined : href;
  
  if (id) linkButton.id = id;
  if (disabled) linkButton.classList.add('disabled');
  if (fullWidth) linkButton.classList.add('full-width');
  if (loading) linkButton.classList.add('loading');
  if (external) linkButton.classList.add('external');
  if (download) linkButton.classList.add('download');
  
  // Set target and rel attributes
  if (target) linkButton.target = target;
  if (rel) linkButton.rel = rel;
  
  // Auto-set external link attributes
  if (external || (href && (href.startsWith('http') || href.startsWith('//')))) {
    linkButton.target = target || '_blank';
    linkButton.rel = rel || 'noopener noreferrer';
    linkButton.classList.add('external');
  }
  
  // Set download attribute
  if (download) {
    linkButton.download = typeof download === 'string' ? download : '';
    linkButton.classList.add('download');
  }
  
  // Add click handler
  if (onClick && typeof onClick === 'function') {
    linkButton.addEventListener('click', (e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick(e);
    });
  }
  
  // Prevent navigation when disabled
  if (disabled) {
    linkButton.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }
  
  // Add keyboard accessibility
  linkButton.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      if (e.key === ' ') {
        e.preventDefault(); // Prevent page scroll on space
      }
      linkButton.click();
    }
  });
  
  return linkButton;
}

/**
 * Initialize link button interactions
 * @param {HTMLElement} linkButton - Link button element
 */
function initializeLinkButtonInteractions(linkButton) {
  if (!linkButton) return;
  
  // Add hover effects
  linkButton.addEventListener('mouseenter', () => {
    if (!linkButton.classList.contains('disabled')) {
      linkButton.classList.add('hover');
    }
  });
  
  linkButton.addEventListener('mouseleave', () => {
    linkButton.classList.remove('hover');
  });
  
  // Add focus effects
  linkButton.addEventListener('focus', () => {
    if (!linkButton.classList.contains('disabled')) {
      linkButton.classList.add('focused');
    }
  });
  
  linkButton.addEventListener('blur', () => {
    linkButton.classList.remove('focused');
  });
  
  // Add pressed effects
  linkButton.addEventListener('mousedown', () => {
    if (!linkButton.classList.contains('disabled')) {
      linkButton.classList.add('pressed');
    }
  });
  
  linkButton.addEventListener('mouseup', () => {
    linkButton.classList.remove('pressed');
  });
  
  // Handle keyboard interactions
  linkButton.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !linkButton.classList.contains('disabled')) {
      linkButton.classList.add('pressed');
    }
  });
  
  linkButton.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      linkButton.classList.remove('pressed');
    }
  });
}

/**
 * Main decoration function for EDS
 * @param {HTMLElement} block - The link button block element
 */
export default function decorate(block) {
  if (!block) return;
  
  // Get configuration from block data attributes or content
  const linkText = block.textContent?.trim() || 'Link Button';
  const href = block.dataset.href || '#';
  const variant = block.dataset.variant || BUTTON_VARIANTS.PRIMARY;
  const size = block.dataset.size || BUTTON_SIZES.MEDIUM;
  const disabled = block.dataset.disabled === 'true';
  const fullWidth = block.dataset.fullWidth === 'true';
  const external = block.dataset.external === 'true';
  const download = block.dataset.download;
  const target = block.dataset.target;
  const rel = block.dataset.rel;
  
  // Clear block content
  block.innerHTML = '';
  
  // Create link button element
  const linkButton = createLinkButton({
    text: linkText,
    href,
    variant,
    size,
    disabled,
    fullWidth,
    external,
    download,
    target,
    rel
  });
  
  // Initialize interactions
  initializeLinkButtonInteractions(linkButton);
  
  // Append link button to block
  block.appendChild(linkButton);
  
  // Add block-level classes
  block.classList.add('link-button-block', 'atom');
  
  return block;
}

// Export for Storybook and testing
export { createLinkButton as LinkButton };