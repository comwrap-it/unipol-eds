import { BUTTON_ICON_SIZES, NAVIGATION_PILL_VARIANTS } from "../../../constants/index.js";
import { createNavigationPill } from "../../../scripts/libs/ds/components/atoms/navigation-pill/navigation-pill.js";
import { extractInstrumentationAttributes } from "../../../scripts/utils.js";

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
  const leftIconSize = rows[5]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM;

  const rightIcon = rows[6]?.textContent?.trim() || '';
  const rightIconSize = rows[7]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM;

  const instrumentation = extractInstrumentationAttributes(rows[1]);

  return {
    hideLabel,
    text,
    variant,
    href,
    leftIcon,
    leftIconSize,
    rightIcon,
    rightIconSize,
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
    leftIconSize,
    rightIcon,
    rightIconSize,
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
        leftIconSize,
        rightIcon,
        rightIconSize,
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
          leftIconSize,
          rightIcon,
          rightIconSize,
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
      leftIconSize,
      rightIcon,
      rightIconSize,
      {},
    );
    block.appendChild(pillElement);
  }

  block.classList.add('navigation-pill-block');
}
