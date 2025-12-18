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
 * Retrieves instrumentation attributes
 *
 * @param {HTMLElement} element
 * @returns {Object}
 */
export function extractInstrumentationAttributes(element) {
  const instrumentation = {};
  if (!element) return instrumentation;

  [...element.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
      instrumentation[attr.name] = attr.value;
    }
  });

  return instrumentation;
}

/**
 * Creates a Navigation Pill
 *
 * @param {string} label - Text.
 * @param {string} [href] - link.
 * @param {string} variant - "primary" or "secondary".
 * @param {string} [leftIcon] - Left Icon className.
 * @param {string} [rightIcon] - Right Icon className.
 * @param {string} [iconSize] - Icons size.
 * @param {Object} [instrumentation={}] - AEM attributes.
 * @param {boolean} hideLabel - If true, hide label and use aria-label.
 * @returns {HTMLElement}
 */
export function createNavigationPill(
  label,
  href,
  variant,
  leftIcon,
  rightIcon,
  iconSize,
  instrumentation = {},
  hideLabel = false,
) {
  const isLink = Boolean(href);
  const el = isLink ? document.createElement('a') : document.createElement('button');

  if (leftIcon) {
    const span = document.createElement('span');
    span.className = `icon icon-${iconSize || NAVIGATION_PILL_ICON_SIZES.MEDIUM} ${leftIcon}`;
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
    span.className = `icon icon-${iconSize || NAVIGATION_PILL_ICON_SIZES.MEDIUM} ${rightIcon}`;
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

/**
 * Retrieves Universal Editor values.
 *
 * @param {Array<HTMLElement>} rows
 * @returns {Object}
 */
function extractValuesFromRows(rows) {
  // row 0 = boolean flag
  const rawFlag = rows[0]?.textContent?.trim() || 'false';
  const hideLabel = rawFlag === 'true';

  // IMPORTANT: remove true/false from DOM
  if (rows[0]) rows[0].textContent = '';

  const text = rows[1]?.textContent?.trim() || 'Navigation Pill';
  const variant = rows[2]?.textContent?.trim().toLowerCase()
    || NAVIGATION_PILL_VARIANTS.PRIMARY;

  const href = rows[3]?.querySelector('a')?.href
    || rows[3]?.textContent?.trim()
    || '';

  const leftIcon = rows[4]?.textContent?.trim() || '';
  const rightIcon = rows[5]?.textContent?.trim() || '';
  const iconSize = rows[6]?.textContent?.trim() || NAVIGATION_PILL_ICON_SIZES.MEDIUM;


  const instrumentation = extractInstrumentationAttributes(rows[1]);

  return {
    hideLabel,
    text,
    variant,
    href,
    leftIcon,
    rightIcon,
    iconSize,
    instrumentation,
  };
}

/**
 * Decorator for Navigation Pill
 *
 * @param {HTMLElement} block
 * @returns {void}
 */
export default function decorateNavigationPill(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const {
    hideLabel,
    text,
    variant,
    href,
    leftIcon,
    rightIcon,
    iconSize,
    instrumentation,
  } = extractValuesFromRows(rows);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  let pillElement;

  if (hasInstrumentation) {
    pillElement = block.querySelector('a, button');

    if (!pillElement) {
      pillElement = createNavigationPill(
        hideLabel,
        text,
        href,
        variant,
        leftIcon,
        rightIcon,
        iconSize,
        instrumentation,
      );

      if (rows[1]) {
        rows[1].textContent = '';
        rows[1].appendChild(pillElement);
      } else {
        block.appendChild(pillElement);
      }
    } else {
      pillElement.replaceWith(
        createNavigationPill(
          hideLabel,
          text,
          href,
          variant,
          leftIcon,
          rightIcon,
          iconSize,
          instrumentation,
        ),
      );
    }
  } else {
    block.textContent = '';
    pillElement = createNavigationPill(
      hideLabel,
      text,
      href,
      variant,
      leftIcon,
      rightIcon,
      iconSize,
      {},
    );
    block.appendChild(pillElement);
  }

  block.classList.add('navigation-pill-block');
}
