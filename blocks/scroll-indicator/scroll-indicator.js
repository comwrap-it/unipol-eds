/**
 * Scroll Indicator - Molecule
 *
 * Uses icons-button as an atom component for navigational buttons.
 * This component can be used as a molecule within carousels.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import {
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
} from '../atoms/buttons/standard-button/standard-button.js';
import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/scroll-indicator/scroll-indicator.css`,
    ),
  ]);
  isStylesLoaded = true;
}

/**
  @typedef {Object} ScrollIndicatorReturnType
  @property {HTMLElement} leftIconButton: The left navigation button element.
  @property {HTMLElement} scrollIndicator: The scroll indicator wrapper element.
  @property {HTMLElement} rightIconButton: The right navigation button element.
  @property {(state: {isBeginning: boolean, isEnd: boolean}) => void}
*/

/**
 * Decorates the scroll indicator block element
 * @param {boolean} isInsideHero - Whether the scroll indicator is inside a hero block
 * @return {ScrollIndicatorReturnType} scrollIndicator
 */
export default async function createScrollIndicator(
  isInsideHero = false,
) {
  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Create scrollIndicator structure
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  if (isInsideHero) {
    scrollIndicator.classList.add('hero-indicator');
  }

  const leftIconButtonContainer = document.createElement('div');
  leftIconButtonContainer.className = 'left-icon-button';

  const leftIconButton = createIconButton(
    'un-icon-chevron-left',
    BUTTON_VARIANTS.PRIMARY,
    BUTTON_ICON_SIZES.MEDIUM,
    '',
  );
  leftIconButton.classList.add('swiper-button-prev');
  leftIconButtonContainer.appendChild(leftIconButton);

  const expandingDotsContainer = document.createElement('div');
  expandingDotsContainer.className = 'expanding-dots';

  const dots = [1, 2, 3].map((number) => {
    const ellipse = document.createElement('span');
    ellipse.className = `dot ${number === 1 ? 'expanded' : ''}`;
    expandingDotsContainer.appendChild(ellipse);
    return ellipse;
  });

  const rightIconButtonContainer = document.createElement('div');
  rightIconButtonContainer.className = 'right-icon-button';

  const rightIconButton = createIconButton(
    'un-icon-chevron-right',
    BUTTON_VARIANTS.PRIMARY,
    BUTTON_ICON_SIZES.MEDIUM,
    '',
  );
  rightIconButton.classList.add('swiper-button-next');
  rightIconButtonContainer.appendChild(rightIconButton);

  scrollIndicator.appendChild(leftIconButtonContainer);
  scrollIndicator.appendChild(expandingDotsContainer);
  scrollIndicator.appendChild(rightIconButtonContainer);

  function setExpandedDot({ isBeginning, isEnd }) {
    // Clear previous state
    dots.forEach((dot) => dot.classList.remove('expanded'));
    // Decide which to expand
    if (isBeginning) {
      dots[0]?.classList.add('expanded');
    } else if (isEnd) {
      dots[2]?.classList.add('expanded');
    } else {
      dots[1]?.classList.add('expanded');
    }
  }

  return {
    leftIconButton, scrollIndicator, rightIconButton, setExpandedDot,
  };
}
