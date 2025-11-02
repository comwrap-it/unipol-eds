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

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
function readBlockConfig(block) {
  const config = {};

  // Look for rows either directly in block or inside default-content-wrapper
  let rows = [...block.querySelectorAll(':scope > div')];

  // If we have a default-content-wrapper, look inside it
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = [...wrapper.querySelectorAll(':scope > div')];
  }

  rows.forEach((row) => {
    if (row.children && row.children.length >= 2) {
      const cols = [...row.children];
      const nameCol = cols[0];
      const valueCol = cols[1];

      if (nameCol && valueCol) {
        const name = nameCol.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        let value = '';

        if (valueCol.querySelector('a')) {
          const as = [...valueCol.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (valueCol.querySelector('img')) {
          const imgs = [...valueCol.querySelectorAll('img')];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map((img) => img.src);
          }
        } else if (valueCol.querySelector('p')) {
          const ps = [...valueCol.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent.trim();
          } else {
            value = ps.map((p) => p.textContent.trim());
          }
        } else {
          value = valueCol.textContent.trim();
        }

        config[name] = value;
      }
    }
  });

  return config;
}

export default function decorate(block) {
  // Use readBlockConfig to extract configuration
  const config = readBlockConfig(block);

  // Extract button configuration with fallbacks
  const text = config.text || config['button-text'] || 'Button';
  const variant = config.variant || 'primary';
  const size = config.size || 'medium';
  const href = config.href || config['link-url'] || null;

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
