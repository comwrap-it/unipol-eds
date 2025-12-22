/**
 * Link Button - Utility Component
 *
 * This module exports functions for creating and decorating link buttons.
 * It can be imported or used by other components if needed.
 */

import { BUTTON_ICON_SIZES } from '../standard-button/standard-button.js';

/**
 * Create a link button element
 *
 * @param {string} label - Link text
 * @param {string} href - URL for the link
 * @param {boolean} openInNewTab - Open link in new tab (optional)
 * @param {boolean} leftIcon - left icon class
 * @param {boolean} rightIcon - right icon class
 * @param {string} leftIconSize - size of left icon
 * @param {string} rightIconSize - size of right icon
 * @param {boolean} disabled - Disabled state (optional)
 * @returns {HTMLElement} link element
 */
export function createLinkButton(
  label,
  href,
  openInNewTab,
  leftIcon,
  rightIcon,
  leftIconSize = BUTTON_ICON_SIZES.SMALL,
  rightIconSize = BUTTON_ICON_SIZES.SMALL,
  disabled = false,
) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  link.className = ['link-btn'].join(' ');
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');

  // Set target="_blank" if openInNewTab is true
  if (openInNewTab) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }

  if (disabled) {
    link.classList.add('disabled');
    link.style.pointerEvents = 'none';
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
  }

  if (leftIcon) {
    const span = document.createElement('span');
    span.className = `icon icon-${leftIconSize || BUTTON_ICON_SIZES.MEDIUM} ${leftIcon}`;
    link.prepend(span);
  }

  if (rightIcon) {
    const span = document.createElement('span');
    span.className = `icon icon-${rightIconSize || BUTTON_ICON_SIZES.MEDIUM} ${rightIcon}`;
    link.appendChild(span);
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
