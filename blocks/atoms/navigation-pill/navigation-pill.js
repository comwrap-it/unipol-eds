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
 * @param {string} [leftIconSize] - Left Icon size.
 * @param {string} [rightIcon] - Right Icon className.
 * @param {string} [rightIconSize] - Right Icon size.
 * @param {Object} [instrumentation={}] - AEM attributes.
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
) {
  const isLink = Boolean(href);
  const el = isLink ? document.createElement('a') : document.createElement('button');

  if (leftIcon) {
    const span = document.createElement('span');
    span.className = `icon icon-${leftIconSize || NAVIGATION_PILL_ICON_SIZES.MEDIUM} ${leftIcon}`;
    el.appendChild(span);
  }

  const txt = document.createElement('span');
  txt.textContent = label;
  el.appendChild(txt);

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

/**
 * Retrieves Universal Editor values.
 *
 * @param {Array<HTMLElement>} rows
 * @returns {{
 *   text: string,
 *   variant: string,
 *   href: string,
 *   leftIcon: string,
 *   rightIcon: string,
 *   instrumentation: Object
 * }}
 */
function extractValuesFromRows(rows) {
  const text = rows[0]?.textContent?.trim() || 'Navigation Pill';
  const variant = rows[1]?.textContent?.trim().toLowerCase()
    || NAVIGATION_PILL_VARIANTS.PRIMARY;

  const href = rows[2]?.querySelector('a')?.href
    || rows[2]?.textContent?.trim()
    || '';

  const leftIcon = rows[3]?.textContent?.trim() || '';
  const rightIcon = rows[4]?.textContent?.trim() || '';

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    text,
    variant,
    href,
    leftIcon,
    rightIcon,
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
    text,
    variant,
    href,
    leftIcon,
    rightIcon,
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
        text,
        href,
        variant,
        leftIcon,
        rightIcon,
        instrumentation,
      );

      if (rows[0]) {
        rows[0].textContent = '';
        rows[0].appendChild(pillElement);
      } else {
        block.appendChild(pillElement);
      }
    } else {
      pillElement.replaceWith(
        createNavigationPill(
          text,
          href,
          variant,
          leftIcon,
          rightIcon,
          instrumentation,
        ),
      );
    }
  } else {
    block.textContent = '';
    pillElement = createNavigationPill(text, href, variant, leftIcon, rightIcon);
    block.appendChild(pillElement);
  }

  block.classList.add('navigation-pill-block');
}
