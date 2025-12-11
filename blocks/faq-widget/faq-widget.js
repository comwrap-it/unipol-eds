/**
 * Insurance Product Carousel Component
 *
 * A carousel block that displays a horizontal scrollable list of card components.
 * Uses card as a molecule component, which in turn uses primary-button as an atom.
 *
 * Features:
 * - Horizontal scroll with navigation arrows
 * - Dot indicators for slide position
 * - Responsive design (mobile: 1 card, tablet: 2 cards, desktop: 3-4 cards)
 * - Smooth scrolling with snap points
 * - Touch/swipe support on mobile
 * - Keyboard navigation (arrow keys)
 * - Preserves Universal Editor instrumentation
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';
import { getValuesFromBlock } from '../../scripts/utils.js';

/**
 * Decorates the insurance product carousel block
 * @param {HTMLElement} block - The carousel block element
 */
export default async function decorate(block) {
  if (!block) return;

  let isStylesLoaded = false;
  async function ensureStylesLoaded() {
    if (isStylesLoaded) return;
    const { loadCSS } = await import('../../scripts/aem.js');
    await Promise.all([
      loadCSS(
        `${window.hlx.codeBasePath}/blocks/FAQ-widget/FAQ-widget.css`,
      ),
    ]);
    isStylesLoaded = true;
  }

  await ensureStylesLoaded();

  const properties = ['title', 'description', 'showMoreButtonLabel', 'link'];
  const valuesFromBlock = getValuesFromBlock(block, properties);

  // Import card component dynamically
  const accordionModule = await import(
    '../accordion/accordion.js'
  );
  //const decorateAccordion = accordionModule.default(valuesFromBlock.link);

  const showMoreLabel = valuesFromBlock.showMoreButtonLabel || 'Carica altro';

  if (valuesFromBlock && valuesFromBlock.link && valuesFromBlock.link.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('No FAQ configured!');
    return;
  }

  // Process each row as a card
  const faqsPromises = valuesFromBlock.link.map(async (faq, index) => {
    const faqWrapper = document.createElement('div');
    faqWrapper.className = 'faq-wrapper';

    // Preserve instrumentation from faq to faqWrapper
    moveInstrumentation(faq, faqWrapper);

    // Create a faq block element to decorate
    const faqBlock = document.createElement('div');
    faqBlock.className = 'faq-block';
    faqBlock.dataset.blockName = 'faq-block';

    // Preserve faq instrumentation on card block if present
    if (faq.hasAttribute('data-aue-resource')) {
      faqBlock.setAttribute(
        'data-aue-resource',
        faq.getAttribute('data-aue-resource'),
      );
      const aueBehavior = faq.getAttribute('data-aue-behavior');
      if (aueBehavior) faqBlock.setAttribute('data-aue-behavior', aueBehavior);
      const aueType = faq.getAttribute('data-aue-type');
      if (aueType) faqBlock.setAttribute('data-aue-type', aueType);
      const aueLabel = faq.getAttribute('data-aue-label');
      if (aueLabel) faqBlock.setAttribute('data-aue-label', aueLabel);
    }

    // Move all children from faq to card block (preserves their instrumentation)
    while (faq.firstElementChild) {
      faqBlock.appendChild(faq.firstElementChild);
    }

    // Temporarily append faqBlock to faqWrapper
    faqWrapper.appendChild(faqBlock);

    // Decorate the card using card component
    // First card (index 0) is LCP candidate - optimize image loading
    const isFirstCard = index === 0;
    //await decorateAccordion(faqBlock, isFirstCard);

    // Load card styles
    const decoratedFAQ = faqWrapper.querySelector('.faq-container')
      || faqWrapper.firstElementChild;
    if (decoratedFAQ && decoratedFAQ.dataset.blockName) {
      await loadBlock(decoratedFAQ);
    }

    return faqWrapper;
  });

  const faqSection = document.createElement('div');
  faqSection.className = 'faq-section';

  // Wait for all cards to be processed
  const faqElements = await Promise.all(faqsPromises);
  faqElements.forEach((faq) => {
    faqSection.appendChild(faq);
  });

  let showMoreButton;

  function handleShowMoreButton(e) {
    e.preventDefault();
    faqElements.forEach((slide) => {
      if (slide.classList.contains('hidden')) {
        slide.classList.remove('hidden');
      }
    });
    showMoreButton.remove();
  }

  if (faqElements && faqElements.length > 4) {
    showMoreButton = createButton(showMoreLabel, '', false, BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM, '', '');
    showMoreButton.addEventListener('click', handleShowMoreButton);
  }

  if (showMoreButton) {
    faqSection.appendChild(showMoreButton);
  }

  // Preserve blockName if present
  if (block.dataset.blockName) {
    faqSection.dataset.blockName = block.dataset.blockName;
  }

  block.innerText = '';
  // Preserve block class
  faqSection.classList.add('block');
  // Replace block with carousel
  block.appendChild(faqSection);
}
