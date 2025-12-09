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
export default async function createScrollIndicator(isInsideHero = false) {
  // Ensure CSS is loaded not awaited to avoid block
  ensureStylesLoaded();

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

  // Create dots; keep 'expanded' on a single element permanently
  const dots = [0, 1, 2].map(() => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    expandingDotsContainer.appendChild(dot);
    return dot;
  });

  const expandedDot = dots[0];
  expandedDot.classList.add('expanded');

  // Helper to clear positional classes
  function clearPositions() {
    dots.forEach((dot) => {
      dot.classList.remove('first-dot', 'second-dot', 'third-dot');
    });
  }

  // Helper to apply positions so expandedDot moves between left/center/right
  // activePos: 'first' | 'second' | 'third'
  function applyPositions(activePos) {
    clearPositions();
    const positions = ['first', 'second', 'third'];

    expandingDotsContainer.className = `expanding-dots ${activePos}-expanded`;

    // Assign the active position to the expandedDot
    expandedDot.classList.add(`${activePos}-dot`);

    // Assign remaining positions to the other two dots
    const remaining = positions.filter((p) => p !== activePos);
    dots
      .filter((d) => d !== expandedDot)
      .forEach((dot, idx) => {
        dot.classList.add(`${remaining[idx]}-dot`);
      });
  }

  // Initial positions: expanded on the left
  applyPositions('first');

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
    if (isBeginning) {
      applyPositions('first'); // expanded left
    } else if (isEnd) {
      applyPositions('third'); // expanded right
    } else {
      applyPositions('second'); // expanded center
    }
  }

  return {
    leftIconButton,
    scrollIndicator,
    rightIconButton,
    setExpandedDot,
  };
}
