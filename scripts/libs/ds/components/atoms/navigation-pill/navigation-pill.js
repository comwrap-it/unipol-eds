/**
 * Navigation Pill - Utility Component
 */

export const NAVIGATION_PILL_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
};

export const NAVIGATION_PILL_ICON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra-large',
};

/**
 * Creates a Navigation Pill
 *
 * @param {string} label - Text.
 * @param {string} [href] - link.
 * @param {string} variant - "primary" or "secondary".
 * @param {string} [leftIcon] - Left Icon className.
 * @param {string} [leftIconSize] - Left Icon size.
 * @param {string} [rightIcon] - Right Icon className.
 * @param {string} [rightIconSize] - Right Icon size.
 * @param {Object} [instrumentation={}] - AEM attributes.
 * @param {boolean} hideLabel - If true, hide label and use aria-label.
 * @returns {HTMLElement}
 */
export function createNavigationPill(
  label,
  href,
  variant,
  leftIcon,
  leftIconSize,
  rightIcon,
  rightIconSize,
  instrumentation = {},
  hideLabel = false,
) {
  const isLink = Boolean(href);
  const el = isLink ? document.createElement('a') : document.createElement('button');

  if (leftIcon) {
    const span = document.createElement('span');
    span.className = `icon icon-${leftIconSize || NAVIGATION_PILL_ICON_SIZES.MEDIUM} ${leftIcon}`;
    el.appendChild(span);
  }

  if (!hideLabel) {
    const txt = document.createElement('span');
    txt.textContent = label;
    el.appendChild(txt);
  } else {
    el.setAttribute('aria-label', label);
  }

  if (rightIcon) {
    const span = document.createElement('span');
    span.className = `icon icon-${rightIconSize || NAVIGATION_PILL_ICON_SIZES.MEDIUM} ${rightIcon}`;
    el.appendChild(span);
  }

  const finalVariant = variant || NAVIGATION_PILL_VARIANTS.PRIMARY;
  el.className = `navigation-pill navigation-pill-${finalVariant}`;

  if (isLink) {
    el.href = href;
    el.setAttribute('role', 'button');
  }

  el.tabIndex = 0;

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });

  Object.entries(instrumentation).forEach(([attr, value]) => {
    el.setAttribute(attr, value);
  });

  return el;
}
