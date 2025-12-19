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
 * Creates a navigation button for the scroll indicator
 * @param {string} containerClass - The class name for the button container
 * @param {string} iconName - The name of the icon to use
 * @param {string} buttonClass - The class name for the button itself
 * @returns {HTMLElement} The navigation button container element
 */
const createNavButton = (containerClass, iconName, buttonClass) => {
  const iconButtonContainer = document.createElement('div');
  iconButtonContainer.className = containerClass;

  const iconButton = createIconButton(
    iconName,
    BUTTON_VARIANTS.PRIMARY,
    BUTTON_ICON_SIZES.MEDIUM,
    '',
  );
  iconButton.classList.add(buttonClass);
  iconButtonContainer.appendChild(iconButton);
  return { iconButtonContainer, iconButton };
};

const createExpandingDots = () => {
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

  // method to update the expanded dot position from swiper carousel
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
    expandingDotsContainer,
    setExpandedDot,
  };
};
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

  const {
    iconButtonContainer: leftIconButtonContainer,
    iconButton: leftIconButton,
  } = createNavButton(
    'left-icon-button',
    'un-icon-chevron-left',
    'swiper-button-prev',
  );

  const { expandingDotsContainer, setExpandedDot } = createExpandingDots();

  const {
    iconButtonContainer: rightIconButtonContainer,
    iconButton: rightIconButton,
  } = createNavButton(
    'right-icon-button',
    'un-icon-chevron-right',
    'swiper-button-next',
  );

  scrollIndicator.appendChild(leftIconButtonContainer);
  scrollIndicator.appendChild(expandingDotsContainer);
  scrollIndicator.appendChild(rightIconButtonContainer);

  const handleScrollIndicatorResize = () => {
    if (window.innerWidth < 1200) {
      leftIconButton?.classList?.remove('btn-icon');
      leftIconButton?.classList?.add('link-btn');

      rightIconButton?.classList?.remove('btn-icon');
      rightIconButton?.classList?.add('link-btn');
    } else {
      leftIconButton?.classList?.remove('link-btn');
      leftIconButton?.classList?.add('btn-icon');

      rightIconButton?.classList?.remove('link-btn');
      rightIconButton?.classList?.add('btn-icon');
    }
  };

  handleScrollIndicatorResize();
  window.addEventListener('resize', handleScrollIndicatorResize);

  return {
    leftIconButton,
    scrollIndicator,
    rightIconButton,
    setExpandedDot,
  };
}
