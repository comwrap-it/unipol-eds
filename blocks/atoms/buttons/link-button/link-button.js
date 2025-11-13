/**
 * Link Button - Utility Component
 *
 * This module exports functions for creating and decorating link buttons.
 * It can be imported or used by other components if needed.
 */

/**
 * Size variants for Link Button
 */
export const LINK_BUTTON_SIZES = {
  S: 's',
  M: 'm',
  L: 'l',
  XL: 'xl',
};

/**
 * Create a link button element
 *
 * @param {string} label - Link text
 * @param {string} href - URL for the link
 * @param {string} size - size variant ('S', 'M', 'L', 'XL')
 * @param {boolean} showLeftIcon - show or hide left icon
 * @param {boolean} showRightIcon - show or hide right icon
 * @returns {HTMLElement} link element
 */
export function createLinkButton(
  label,
  href,
  size = LINK_BUTTON_SIZES.M,
  showLeftIcon = false,
  showRightIcon = false,
  disabled = false,
) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  link.className = ['link-btn', `link-btn-${size}`].join(' ');
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');

  if (disabled) {
    link.classList.add('disabled');
    link.style.pointerEvents = 'none';
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
  }

  // Add optional left icon
  if (showLeftIcon) {
    const leftIcon = document.createElement('span');
    leftIcon.className = 'link-btn-icon left';
    link.prepend(leftIcon);
  }

  // Add optional right icon
  if (showRightIcon) {
    const rightIcon = document.createElement('span');
    rightIcon.className = 'link-btn-icon right';
    link.appendChild(rightIcon);
  }

  // Keyboard support
  link.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      link.click();
    }
  });

  // Pressed simulation
  link.addEventListener('mousedown', () => link.classList.add('pressed'));
  link.addEventListener('mouseup', () => link.classList.remove('pressed'));
  link.addEventListener('mouseleave', () => link.classList.remove('pressed'));

  return link;
}

/**
 * Create a link button from Universal Editor rows
 *
 * @param {Array} rows - Array of block children
 * @returns {HTMLElement}
 */
export function createLinkButtonFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const text = rows[0]?.textContent?.trim() || 'Link';
  const href = rows[1]?.querySelector('a')?.href || rows[1]?.textContent?.trim() || '#';
  const size = rows[2]?.textContent?.trim().toLowerCase() || LINK_BUTTON_SIZES.M;
  const showLeftIcon = rows[3]?.textContent?.trim() === 'true';
  const showRightIcon = rows[4]?.textContent?.trim() === 'true';

  return createLinkButton(text, href, size, showLeftIcon, showRightIcon);
}

/**
 * Decorator function for Link Button block
 *
 * @param {HTMLElement} block
 */
export default function decorateLinkButton(block) {
  if (!block) return;

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  const text = rows[0]?.textContent?.trim() || 'Link';
  const href = rows[1]?.querySelector('a')?.href || rows[1]?.textContent?.trim() || '#';
  const size = rows[2]?.textContent?.trim().toLowerCase() || LINK_BUTTON_SIZES.M;
  const showLeftIcon = rows[3]?.textContent?.trim() === 'true';
  const showRightIcon = rows[4]?.textContent?.trim() === 'true';

  if (hasInstrumentation) {
    let linkElement = block.querySelector('a');
    if (!linkElement) {
      linkElement = createLinkButton(text, href, size, showLeftIcon, showRightIcon);
      block.textContent = '';
      block.appendChild(linkElement);
    } else {
      linkElement.textContent = text;
      linkElement.href = href;
      linkElement.className = ['link-btn', `link-btn-${size}`].join(' ');

      linkElement.querySelectorAll('.link-btn-icon').forEach((icon) => icon.remove());
      if (showLeftIcon) {
        const leftIcon = document.createElement('span');
        leftIcon.className = 'link-btn-icon left';
        linkElement.prepend(leftIcon);
      }
      if (showRightIcon) {
        const rightIcon = document.createElement('span');
        rightIcon.className = 'link-btn-icon right';
        linkElement.appendChild(rightIcon);
      }
    }
  } else {
    const link = createLinkButton(text, href, size, showLeftIcon, showRightIcon);
    block.textContent = '';
    block.appendChild(link);
  }

  block.classList.add('link-button-block');
}
