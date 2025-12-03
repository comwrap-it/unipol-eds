/**
 * Navigation Pill - Updated Version
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

export const NAVIGATION_PILL_TYPOLOGIES = {
  CUSTOM: 'custom',
  PREVENTIVATORE: 'preventivatore',
  LOCATOR: 'locator',
};

/**
 * Retrieves instrumentation attributes
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
 */
export function createNavigationPill(
  label,
  href,
  variant,
  leftIcon,
  leftIconSize,
  rightIcon,
  rightIconSize,
  openInNewTab,
  typology,
  showLeftIcon,
  showRightIcon,
  instrumentation = {},
) {
  const isCustom = typology === NAVIGATION_PILL_TYPOLOGIES.CUSTOM;
  const isLink = Boolean(href) && isCustom;

  const el = isLink ? document.createElement('a') : document.createElement('button');

  // LEFT ICON
  if (showLeftIcon && leftIcon) {
    const span = document.createElement('span');
    span.className = `icon icon-${leftIconSize || NAVIGATION_PILL_ICON_SIZES.MEDIUM} ${leftIcon}`;
    el.appendChild(span);
  }

  // TEXT
  const txt = document.createElement('span');
  txt.textContent = label;
  el.appendChild(txt);

  // RIGHT ICON
  if (showRightIcon && rightIcon) {
    const span = document.createElement('span');
    span.className = `icon icon-${rightIconSize || NAVIGATION_PILL_ICON_SIZES.MEDIUM} ${rightIcon}`;
    el.appendChild(span);
  }

  const finalVariant = variant || NAVIGATION_PILL_VARIANTS.PRIMARY;
  el.className = `navigation-pill navigation-pill-${finalVariant}`;

  if (isLink) {
    el.href = href;
    el.setAttribute('role', 'button');

    if (openInNewTab) {
      el.target = '_blank';
      el.rel = 'noopener';
    }
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
 */
function extractValuesFromRows(rows) {
  const typology = rows[0]?.textContent?.trim() || NAVIGATION_PILL_TYPOLOGIES.CUSTOM;

  const text = rows[1]?.textContent?.trim() || 'Navigation Pill';

  const variant = rows[2]?.textContent?.trim().toLowerCase()
    || NAVIGATION_PILL_VARIANTS.PRIMARY;

  const href = typology === NAVIGATION_PILL_TYPOLOGIES.CUSTOM
    ? (rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || '')
    : '';

  const openInNewTab = typology === NAVIGATION_PILL_TYPOLOGIES.CUSTOM
    ? rows[4]?.textContent?.trim() === 'true'
    : false;

  const showLeftIcon = rows[5]?.textContent?.trim() === 'true';
  const showRightIcon = rows[6]?.textContent?.trim() === 'true';

  const leftIcon = showLeftIcon ? (rows[7]?.textContent?.trim() || '') : '';
  const leftIconSize = showLeftIcon ? (rows[8]?.textContent?.trim() || NAVIGATION_PILL_ICON_SIZES.MEDIUM) : '';

  const rightIcon = showRightIcon ? (rows[9]?.textContent?.trim() || '') : '';
  const rightIconSize = showRightIcon ? (rows[10]?.textContent?.trim() || NAVIGATION_PILL_ICON_SIZES.MEDIUM) : '';

  const instrumentation = extractInstrumentationAttributes(rows[1]);

  return {
    typology,
    text,
    variant,
    href,
    openInNewTab,
    showLeftIcon,
    leftIcon,
    leftIconSize,
    showRightIcon,
    rightIcon,
    rightIconSize,
    instrumentation,
  };
}

/**
 * Decorator for Navigation Pill
 */
export default function decorateNavigationPill(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const values = extractValuesFromRows(rows);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  let pillElement;

  if (hasInstrumentation) {
    pillElement = block.querySelector('a, button');

    const newPill = createNavigationPill(
      values.text,
      values.href,
      values.variant,
      values.leftIcon,
      values.leftIconSize,
      values.rightIcon,
      values.rightIconSize,
      values.openInNewTab,
      values.typology,
      values.showLeftIcon,
      values.showRightIcon,
      values.instrumentation,
    );

    if (!pillElement) {
      if (rows[0]) {
        rows[0].textContent = '';
        rows[0].appendChild(newPill);
      } else {
        block.appendChild(newPill);
      }
    } else {
      pillElement.replaceWith(newPill);
    }
  } else {
    block.textContent = '';

    pillElement = createNavigationPill(
      values.text,
      values.href,
      values.variant,
      values.leftIcon,
      values.leftIconSize,
      values.rightIcon,
      values.rightIconSize,
      values.openInNewTab,
      values.typology,
      values.showLeftIcon,
      values.showRightIcon,
    );

    block.appendChild(pillElement);
  }

  block.classList.add('navigation-pill-block');
}
