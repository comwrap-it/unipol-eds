/**
 * Scroll Indicator Component
 *
 * A molecule that contains navigation controls for carousels:
 * - Previous button (chevron-left icon-button)
 * - Indicator bar (visual indicator)
 * - Next button (chevron-right icon-button)
 *
 * This component is stateless and provides only the UI structure.
 * The parent carousel component handles the actual scrolling logic.
 */

import { createIconButton } from '../../atoms/buttons/icon-button/icon-button.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Create scroll indicator element
 *
 * @returns {HTMLElement} The scroll indicator container
 */
export function createScrollIndicator() {
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';

  // Previous button (chevron-left)
  const prevButton = createIconButton(
    'chevron-left',
    'primary',
    'medium',
    '',
  );
  prevButton.classList.add('scroll-prev');
  prevButton.setAttribute('aria-label', 'Previous');

  // Indicator bar (visual separator/indicator)
  const indicatorBar = document.createElement('div');
  indicatorBar.className = 'indicator-bar';

  // Next button (chevron-right)
  const nextButton = createIconButton(
    'chevron-right',
    'primary',
    'medium',
    '',
  );
  nextButton.classList.add('scroll-next');
  nextButton.setAttribute('aria-label', 'Next');

  scrollIndicator.appendChild(prevButton);
  scrollIndicator.appendChild(indicatorBar);
  scrollIndicator.appendChild(nextButton);

  return scrollIndicator;
}

/**
 * Decorator function for Scroll Indicator
 *
 * @param {HTMLElement} block - The scroll-indicator block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Extract instrumentation
  const instrumentation = {};
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      instrumentation[attr.name] = attr.value;
    }
  });

  // Create scroll indicator
  const scrollIndicator = createScrollIndicator();

  // Add instrumentation
  Object.entries(instrumentation).forEach(([name, value]) => {
    scrollIndicator.setAttribute(name, value);
  });

  // Preserve block classes
  scrollIndicator.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block' && cls !== 'scroll-indicator') {
        scrollIndicator.classList.add(cls);
      }
    });
  }

  // Replace block with scroll indicator
  block.replaceWith(scrollIndicator);
}
