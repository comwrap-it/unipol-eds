/**
 * Scroll Indicator - Molecule
 *
 * Uses icons-button as an atom component for navigational buttons.
 * This component can be used as a molecule within carousels.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../atoms/buttons/standard-button/standard-button.js';
import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/scroll-indicator/scroll-indicator.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Decorates the scroll indicator block element
 * @return {HTMLElement} scrollIndicator - The scroll indicator block element
 */
export default async function createScrollIndicator() {
  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Create scrollIndicator structure
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';

  const leftIconButtonContainer = document.createElement('div');
  leftIconButtonContainer.className = 'left-icon-button';

  const leftIconButton = createIconButton('un-icon-chevron-left', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM, '');
  leftIconButtonContainer.appendChild(leftIconButton);

  const expandingDotsContainer = document.createElement('div');
  expandingDotsContainer.className = 'expanding-dots';

  const rectangle = document.createElement('span');
  rectangle.className = 'rectangle';
  expandingDotsContainer.appendChild(rectangle);

  fetch('../../icons/ellipse.svg')
    .then((res) => res.text())
    .then((svgContent) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const ellipseOne = svgDoc.documentElement.cloneNode(true);
      const ellipseTwo = svgDoc.documentElement.cloneNode(true);
      expandingDotsContainer.appendChild(ellipseOne);
      expandingDotsContainer.appendChild(ellipseTwo);
    });

  const rightIconButtonContainer = document.createElement('div');
  rightIconButtonContainer.className = 'right-icon-button';

  const rightIconButton = createIconButton('un-icon-chevron-right', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM, '');
  rightIconButtonContainer.appendChild(rightIconButton);

  scrollIndicator.appendChild(leftIconButtonContainer);
  scrollIndicator.appendChild(expandingDotsContainer);
  scrollIndicator.appendChild(rightIconButtonContainer);

  return scrollIndicator;
}
