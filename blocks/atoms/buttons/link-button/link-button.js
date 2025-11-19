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
 * @param {boolean} leftIcon - left icon class
 * @param {boolean} rightIcon - right icon class
 * @param {string} leftIconSize - size of left icon
 * @param {string} rightIconSize - size of right icon
 * @returns {HTMLElement} link element
 */
export function createLinkButton(
  label,
  href,
  leftIcon,
  rightIcon,
  leftIconSize = BUTTON_ICON_SIZES.M,
  rightIconSize = BUTTON_ICON_SIZES.M,
  disabled = false,
) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  link.className = ['link-btn'].join(' ');
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');

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
  const leftIcon = rows[2]?.textContent?.trim() === 'true';
  const rightIcon = rows[3]?.textContent?.trim() === 'true';
  const leftIconSize = (rows[4]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM).toLowerCase();
  const rightIconSize = (rows[5]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM).toLowerCase();

  return createLinkButton(
    text,
    href,
    leftIcon,
    rightIcon,
    leftIconSize,
    rightIconSize,
  );
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
  const leftIcon = rows[2]?.textContent?.trim() === 'true';
  const rightIcon = rows[3]?.textContent?.trim() === 'true';
  const leftIconSize = (rows[4]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM).toLowerCase();
  const rightIconSize = (rows[5]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM).toLowerCase();

  if (hasInstrumentation) {
    let linkElement = block.querySelector('a');
    if (!linkElement) {
      linkElement = createLinkButton(
        text,
        href,
        leftIcon,
        rightIcon,
        leftIconSize,
        rightIconSize,
      );
      block.textContent = '';
      block.appendChild(linkElement);
    } else {
      linkElement.textContent = text;
      linkElement.href = href;
      linkElement.className = ['link-btn'].join(' ');

      linkElement.querySelectorAll('.link-btn-icon').forEach((icon) => icon.remove());
      if (leftIcon) {
        const span = document.createElement('span');
        span.className = `icon icon-${leftIconSize || BUTTON_ICON_SIZES.MEDIUM} ${leftIcon}`;
        linkElement.prepend(span);
      }

      if (rightIcon) {
        const span = document.createElement('span');
        span.className = `icon icon-${rightIconSize || BUTTON_ICON_SIZES.MEDIUM} ${rightIcon}`;
        linkElement.appendChild(span);
      }
    }
  } else {
    const link = createLinkButton(
      text,
      href,
      leftIcon,
      rightIcon,
      leftIconSize,
      rightIconSize,
    );
    block.textContent = '';
    block.appendChild(link);
  }

  block.classList.add('link-button-block');
}
