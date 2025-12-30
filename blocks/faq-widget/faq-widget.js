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

import { getValuesFromBlock, isAuthorMode, restoreInstrumentation } from '../../scripts/utils.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../constants/index.js';
import { createButton } from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';

let isStylesLoaded = false;

/**
 * Loads the Accordion stylesheet once prior to initializing FAQ Widget.
 *
 * @return {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/accordion/accordion.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Creates the text block with title and subtitle
 *
 * @param valuesFromBlock obj that contain title and description objs with value and instrumentation
 * @return {HTMLDivElement}
 */
const createTextBlock = (valuesFromBlock) => {
  const faqText = document.createElement('div');
  faqText.className = 'faq-text';

  const faqTitle = document.createElement('div');
  faqTitle.className = 'faq-title';
  faqTitle.textContent = valuesFromBlock?.title?.value || '';
  if (valuesFromBlock && valuesFromBlock.title && valuesFromBlock.title.instrumentation) {
    restoreInstrumentation(faqTitle, valuesFromBlock.title.instrumentation);
  }

  const faqSubtitle = document.createElement('div');
  faqSubtitle.className = 'faq-subtitle';
  faqSubtitle.textContent = valuesFromBlock?.description?.value || '';
  // eslint-disable-next-line max-len
  if (valuesFromBlock && valuesFromBlock.description && valuesFromBlock.description.instrumentation) {
    restoreInstrumentation(faqSubtitle, valuesFromBlock.description.instrumentation);
  }

  faqText.appendChild(faqTitle);
  faqText.appendChild(faqSubtitle);

  return faqText;
};

/**
 * Creates the Accordion from a given page path
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

  moveInstrumentation(reference, wrapper);

  if (!fragment) return wrapper;

  const section = fragment.querySelector(':scope .section');
  if (section) {
    section.classList.remove('section');
    wrapper.appendChild(section);
  }

  return wrapper;
}

/**
 * Builds all the accordion configured
 *
 * @param isAuthor true in AEM env, false otherwise
 * @param references
 * @return {Promise<Awaited<HTMLDivElement>[]>}
 */
async function buildFaqAccordions(isAuthor, references = []) {
  let refs = [];

  if (Array.isArray(references)) {
    refs = isAuthor
      ? references
      : references.filter((ref) => ref.querySelector('a[href]'));
  }

  return Promise.all(refs.map(createFaqAccordion));
}

/**
 * Init the visibility of FAQs
 *
 * @param isAuthor true in AEM env, false otherwise
 * @param faqElements
 * @param container
 * @param visibleCount
 * @return {number}
 */
function initFaqVisibility(isAuthor, faqElements, container, visibleCount = 5) {
  let hiddenCount = 0;

  const faqAccordions = document.createElement('div');
  faqAccordions.className = 'faq-accordions-container';

  faqElements.forEach((faq, index) => {
    if (index >= visibleCount && !isAuthor) {
      faq.classList.add('hidden');
      hiddenCount += 1;
    }
    faqAccordions.appendChild(faq);
  });

  container.appendChild(faqAccordions);

  return hiddenCount;
}

/**
 * Sets the show more button
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

  if (faqElements.length <= step) return;

  const button = createButton(
    showMoreButtonLabel && showMoreButtonLabel.value ? showMoreButtonLabel.value : 'Carica altro',
    '',
    false,
    BUTTON_VARIANTS.PRIMARY,
    BUTTON_ICON_SIZES.MEDIUM,
    '',
    '',
    // eslint-disable-next-line max-len
    showMoreButtonLabel && showMoreButtonLabel.instrumentation ? showMoreButtonLabel.instrumentation : {},
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
 * Creates the FAQ widget
 *
 * @param valuesFromBlock
 * @param references
 * @param isAuthor true in AEM env, false otherwise
 * @return {Promise<HTMLDivElement>}
 */
export async function createFaqWidget(valuesFromBlock, references, isAuthor = false) {
  await ensureStylesLoaded();

  const faqSection = document.createElement('div');
  faqSection.className = 'faq-section reveal-in-up';

  const faqText = createTextBlock(valuesFromBlock);
  faqSection.appendChild(faqText);

  const faqAccordionsButton = document.createElement('div');
  faqAccordionsButton.className = 'faq-accordions-button';

  const faqElements = await buildFaqAccordions(isAuthor, references ?? []);

  const hiddenCount = initFaqVisibility(
    isAuthor,
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

  return faqSection;
}

/**
 * Decorates the FAQ Widget
 * @param {HTMLElement} block - The FAQ block element
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const properties = ['title', 'description', 'showMoreButtonLabel'];
  const valuesFromBlock = getValuesFromBlock(block, properties);

  const rows = Array.from(block.children);
  const references = rows.slice(3);

  const isAuthor = isAuthorMode(block);

  const faqWidget = await createFaqWidget(valuesFromBlock, references, isAuthor);

  // Preserve blockName if present
  if (block.dataset.blockName) {
    faqWidget.dataset.blockName = block.dataset.blockName;
  }

  block.innerText = '';
  // Preserve block class
  faqWidget.classList.add('block');
  // Replace block with carousel
  block.appendChild(faqWidget);
}
