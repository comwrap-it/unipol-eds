/**
 * Editorial Carousel Component
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
import createScrollIndicator from '../scroll-indicator/scroll-indicator.js';
import { createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';

let isStylesLoaded = false;

/**
 * Ensures carousel/widget styles are loaded once.
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`,
    ),
  ]);
  isStylesLoaded = true;
}

/**
 * Check if block has instrumentation (Universal Editor).
 * @param {HTMLElement} block
 * @returns {boolean}
 */
function hasInstrumentation(block) {
  return (
    block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]')
  );
}

/**
 * Creates the carousel root container with accessibility attributes.
 * @returns {{carousel: HTMLDivElement, track: HTMLDivElement}}
 */
function createCarouselStructure() {
  const carousel = document.createElement('div');
  carousel.className = 'editorial-carousel-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Product carousel');
  carousel.setAttribute('tabindex', '0');

  const track = document.createElement('div');
  track.className = 'editorial-carousel swiper-wrapper';
  track.setAttribute('role', 'list');

  return { carousel, track };
}

/**
 * Creates a single slide from an authored row.
 * @param {HTMLElement} row
 * @param {(el: HTMLElement) => Promise<void>} decorateCard
 * @returns {Promise<HTMLDivElement>}
 */
async function createSlideFromRow(row, decorateCard) {
  const slide = document.createElement('div');
  slide.className = 'editorial-carousel-card-wrapper swiper-slide';
  slide.setAttribute('role', 'listitem');
  moveInstrumentation(row, slide);

  const cardBlock = document.createElement('div');
  cardBlock.className = 'editorial-carousel-card';
  cardBlock.dataset.blockName = 'editorial-carousel-card';

  if (row.hasAttribute('data-aue-resource')) {
    cardBlock.setAttribute('data-aue-resource', row.getAttribute('data-aue-resource'));
    const aueBehavior = row.getAttribute('data-aue-behavior');
    if (aueBehavior) cardBlock.setAttribute('data-aue-behavior', aueBehavior);
    const aueType = row.getAttribute('data-aue-type');
    if (aueType) cardBlock.setAttribute('data-aue-type', aueType);
    const aueLabel = row.getAttribute('data-aue-label');
    if (aueLabel) cardBlock.setAttribute('data-aue-label', aueLabel);
  }

  while (row.firstElementChild) {
    cardBlock.appendChild(row.firstElementChild);
  }

  slide.appendChild(cardBlock);
  await decorateCard(cardBlock);

  const decoratedCard = slide.querySelector('.editorial-carousel-card-container, .card') || slide.firstElementChild;
  if (decoratedCard?.dataset.blockName) {
    await loadBlock(decoratedCard);
  }

  return slide;
}

/**
 * Appends slides to the track, respecting mobile hidden state and instrumentation.
 * @param {HTMLDivElement[]} slides
 * @param {HTMLDivElement} track
 * @param {boolean} withInstrumentation
 * @param {MediaQueryList} mq
 */
function appendSlides(slides, track, withInstrumentation, mq) {
  slides.forEach((slide, index) => {
    if (slide && !withInstrumentation && slide.innerText) {
      if (index >= 4 && !mq.matches) {
        slide.classList.add('hidden');
      }
      track.appendChild(slide);
    } else if (slide && withInstrumentation) {
      track.appendChild(slide);
    }
  });
}

/**
 * Creates the show more button (mobile) or scroll indicator (desktop).
 * @param {HTMLDivElement[]} slides
 * @param {MediaQueryList} mq
 * @returns {{scrollIndicator?: HTMLElement, showMoreButton?: HTMLElement}}
 */
async function createNavigationControls(slides, mq) {
  let scrollIndicator;
  let showMoreButton;

  if (mq.matches) {
    if (slides && slides.length > 4) {
      const { scrollIndicator: createdScrollIndicator } = await createScrollIndicator();
      scrollIndicator = createdScrollIndicator;
    }
  } else if (slides && slides.length > 4) {
    showMoreButton = createButton(
      '',
      '',
      false,
      BUTTON_VARIANTS.SECONDARY,
      BUTTON_ICON_SIZES.MEDIUM,
      '',
      '',
    );
  }

  return { scrollIndicator, showMoreButton };
}

/**
 * Wire up the mobile "show more" behavior.
 * @param {HTMLElement} showMoreButton
 * @param {HTMLDivElement[]} slides
 */
function bindShowMore(showMoreButton, slides) {
  if (!showMoreButton) return;
  showMoreButton.addEventListener('click', (event) => {
    event.preventDefault();
    slides.forEach((slide) => slide.classList.remove('hidden'));
    showMoreButton.remove();
  });
}

/**
 * Entry point: decorates the editorial carousel block.
 * @param {HTMLElement} block - The carousel block element
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  const instrumented = hasInstrumentation(block);
  const cardModule = await import('../editorial-carousel-card/editorial-carousel-card.js');
  const decorateEditorialProductCard = cardModule.default;

  const { carousel, track } = createCarouselStructure();
  const rows = Array.from(block.children);
  const showMoreElement = rows.shift();
  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Editorial Carousel: No cards found');
    return;
  }

  const cardPromises = rows.map((row) => createSlideFromRow(row, decorateEditorialProductCard));
  const mq = window.matchMedia('(min-width: 768px)');
  const cardElements = await Promise.all(cardPromises);

  appendSlides(cardElements, track, instrumented, mq);

  const { scrollIndicator, showMoreButton } = await createNavigationControls(cardElements, mq);
  bindShowMore(showMoreButton, cardElements);

  carousel.appendChild(track);
  if (scrollIndicator) {
    carousel.appendChild(scrollIndicator);
  } else if (showMoreButton) {
    carousel.appendChild(showMoreButton);
  }

  showMoreElement?.remove();

  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  block.innerText = '';
  carousel.classList.add('block', 'editorial-carousel-block');
  block.appendChild(carousel);

  if (mq.matches) {
    const handleEditorialProductCarouselWidget = await import('../editorial-carousel-widget/editorial-carousel-widget.js');
    handleEditorialProductCarouselWidget.default();
  }
}
