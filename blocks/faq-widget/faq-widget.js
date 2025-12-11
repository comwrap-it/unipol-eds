/**
 * FAQ Widget Component
 *
 * A FAQ block that displays a title, subtitle, accordions with FAQs.
 * Uses accordion and fragment components as a molecule component, standard-button as an atom.
 *
 * Features:
 * - Title aligned to the left
 * - Subtitle under the title
 * - Responsive design (mobile, tablet, desktop)
 * - Preserves Universal Editor instrumentation
 *
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import { createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';
import { getValuesFromBlock, restoreInstrumentation } from '../../scripts/utils.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Decorates the FAQ Widget block
 * @param {HTMLElement} block - The FAQ block element
 */
export default async function decorate(block) {
  if (!block) return;

  let isStylesLoaded = false;
  async function ensureStylesLoaded() {
    if (isStylesLoaded) return;
    const { loadCSS } = await import('../../scripts/aem.js');
    await Promise.all([
      loadCSS(
        `${window.hlx.codeBasePath}/blocks/accordion/accordion.css`,
      ),
    ]);
    isStylesLoaded = true;
  }

  await ensureStylesLoaded();

  const properties = ['title', 'description', 'showMoreButtonLabel'];
  const valuesFromBlock = getValuesFromBlock(block, properties);

  const showMoreLabel = valuesFromBlock.showMoreButtonLabel.value || 'Carica altro';

  const rows = Array.from(block.children);
  const references = rows.slice(3);

  if (references && references.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('No FAQ configured!');
    return;
  }

  // Process each row as a fragment containing one Accordion
  const faqsPromises = references.map(async (reference) => {
    const faqAccordionWrapper = document.createElement('div');
    faqAccordionWrapper.className = 'faq-accordion-wrapper';

    const link = reference.querySelector('a');
    const path = link ? link.getAttribute('href') : reference.textContent.trim();
    const fragment = await loadFragment(path);

    if (fragment) {
      const fragmentSection = fragment.querySelector(':scope .section');
      if (fragmentSection) {
        fragmentSection.classList.remove('section');
        faqAccordionWrapper.appendChild(fragmentSection);
      }
    }

    // Preserve instrumentation from faq to faqWrapper
    moveInstrumentation(reference, faqAccordionWrapper);

    return faqAccordionWrapper;
  });

  const faqSection = document.createElement('div');
  faqSection.className = 'faq-section';

  const faqText = document.createElement('div');
  faqText.className = 'faq-text';

  const faqTitle = document.createElement('div');
  faqTitle.className = 'faq-title';
  faqTitle.textContent = valuesFromBlock.title.value;
  restoreInstrumentation(faqTitle, valuesFromBlock.title.instrumentation);

  const faqSubtitle = document.createElement('div');
  faqSubtitle.className = 'faq-subtitle';
  faqSubtitle.textContent = valuesFromBlock.description.value;
  restoreInstrumentation(faqSubtitle, valuesFromBlock.description.instrumentation);

  faqText.appendChild(faqTitle);
  faqText.appendChild(faqSubtitle);

  faqSection.appendChild(faqText);

  const faqAccordionsButton = document.createElement('div');
  faqAccordionsButton.className = 'faq-accordions-button';

  // Wait for all cards to be processed
  const faqElements = await Promise.all(faqsPromises);
  faqElements.forEach((faq) => {
    faqAccordionsButton.appendChild(faq);
  });

  let showMoreButton;

  /* function handleShowMoreButton(e) {
    e.preventDefault();
    faqElements.forEach((slide) => {
      if (slide.classList.contains('hidden')) {
        slide.classList.remove('hidden');
      }
    });
    showMoreButton.remove();
  } */

  if (faqElements && faqElements.length > 5) {
    showMoreButton = createButton(showMoreLabel, '', false, BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM, '', '', valuesFromBlock.showMoreButtonLabel.instrumentation);
    // showMoreButton.addEventListener('click', handleShowMoreButton);
  }

  if (showMoreButton) {
    faqAccordionsButton.appendChild(showMoreButton);
  }

  faqSection.appendChild(faqAccordionsButton);

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
