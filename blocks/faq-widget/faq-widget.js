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

import { createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';
import { getValuesFromBlock, restoreInstrumentation } from '../../scripts/utils.js';
import { loadFragment } from '../fragment/fragment.js';

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

/**
 *
 * @param valuesFromBlock obj that contain title and description objs with value and instrumentation
 * @return {HTMLDivElement}
 */
const createTextBlock = (valuesFromBlock) => {
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

  return faqText;
};

/**
 *
 * @param reference
 * @return {Promise<HTMLDivElement>}
 */
async function createFaqAccordion(reference) {
  const wrapper = document.createElement('div');
  wrapper.className = 'faq-accordion-wrapper';

  const link = reference.querySelector('a');
  const path = link ? link.getAttribute('href') : reference.textContent.trim();
  const fragment = await loadFragment(path);

  if (!fragment) return wrapper;

  const section = fragment.querySelector(':scope .section');
  if (section) {
    section.classList.remove('section');
    wrapper.appendChild(section);
  }

  return wrapper;
}

async function buildFaqAccordions(references = []) {
  return Promise.all(
    references.map(createFaqAccordion),
  );
}

/**
 *
 * @param faqElements
 * @param container
 * @param visibleCount
 * @return {number}
 */
function initFaqVisibility(faqElements, container, visibleCount = 5) {
  let hiddenCount = 0;

  faqElements.forEach((faq, index) => {
    if (index >= visibleCount) {
      faq.classList.add('hidden');
      hiddenCount += 1;
    }
    container.appendChild(faq);
  });

  return hiddenCount;
}

/**
 *
 * @param faqElements
 * @param container
 * @param showMoreButtonLabel
 * @param initialHiddenCount
 * @param step
 */
function setupShowMoreButton(
  {
    faqElements,
    container,
    showMoreButtonLabel,
    initialHiddenCount,
    step = 5,
  },
) {
  let hiddenCount = initialHiddenCount;

  if (hiddenCount <= 0) return;

  const button = createButton(
    showMoreButtonLabel.value ? showMoreButtonLabel.value : 'Carica altro',
    '',
    false,
    BUTTON_VARIANTS.PRIMARY,
    BUTTON_ICON_SIZES.MEDIUM,
    '',
    '',
    showMoreButtonLabel.instrumentation,
  );

  button.addEventListener('click', (e) => {
    e.preventDefault();
    let shown = 0;

    faqElements.forEach((faq) => {
      if (faq.classList.contains('hidden') && shown < step) {
        faq.classList.remove('hidden');
        hiddenCount -= 1;
        shown += 1;
      }
    });

    if (hiddenCount <= 0) {
      button.remove();
    }
  });

  container.appendChild(button);
}

/**
 * Decorates the FAQ Widget block
 * @param {HTMLElement} block - The FAQ block element
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const properties = ['title', 'description', 'showMoreButtonLabel'];
  const valuesFromBlock = getValuesFromBlock(block, properties);

  const rows = Array.from(block.children);
  const references = rows.slice(3);

  const faqSection = document.createElement('div');
  faqSection.className = 'faq-section';

  const faqText = createTextBlock(valuesFromBlock);
  faqSection.appendChild(faqText);

  const faqAccordionsButton = document.createElement('div');
  faqAccordionsButton.className = 'faq-accordions-button';

  const faqElements = await buildFaqAccordions(references ?? []);

  const hiddenCount = initFaqVisibility(
    faqElements,
    faqAccordionsButton,
    5,
  );

  setupShowMoreButton({
    faqElements,
    container: faqAccordionsButton,
    showMoreButtonLabel: valuesFromBlock.showMoreButtonLabel,
    initialHiddenCount: hiddenCount,
    step: 5,
  });

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
