import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import createScrollIndicator from '../scroll-indicator/scroll-indicator.js';
import { createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';

/**
 * Monolithic decorator for editorial carousel with region markers.
 * @param {HTMLElement} block
 */
export default async function handleEditorialProductCarouselWidget(block) {
  // #region Guard clauses
  if (!block) return;
  // #endregion

  // #region Load styles once
  if (!handleEditorialProductCarouselWidget.stylesLoaded) {
    const { loadCSS } = await import('../../scripts/aem.js');
    await Promise.all([
      loadCSS(
        `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`,
      ),
    ]);
    handleEditorialProductCarouselWidget.stylesLoaded = true;
  }
  // #endregion

  // #region Instrumentation check and card module
  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  const cardModule = await import('../editorial-carousel-card/editorial-carousel-card.js');
  const decorateEditorialProductCard = cardModule.default;
  // #endregion

  // #region Carousel structure
  const carousel = document.createElement('div');
  carousel.className = 'editorial-carousel-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Product carousel');
  carousel.setAttribute('tabindex', '0');

  const track = document.createElement('div');
  track.className = 'editorial-carousel swiper-wrapper';
  track.setAttribute('role', 'list');
  // #endregion

  // #region Rows extraction
  const rows = Array.from(block.children);
  const showMoreElement = rows.shift();
  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Editorial Carousel: No cards found');
    return;
  }
  // #endregion

  // #region Build slides
  const cardPromises = rows.map(async (row) => {
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
    await decorateEditorialProductCard(cardBlock);

    const decoratedCard = slide.querySelector('.editorial-carousel-card-container, .card')
      || slide.firstElementChild;
    if (decoratedCard?.dataset.blockName) {
      await loadBlock(decoratedCard);
    }

    return slide;
  });

  const mq = window.matchMedia('(min-width: 768px)');
  const cardElements = await Promise.all(cardPromises);

  cardElements.forEach((slide, index) => {
    if (slide && !hasInstrumentation && slide.innerText) {
      if (index >= 4 && !mq.matches) {
        slide.classList.add('hidden');
      }
      track.appendChild(slide);
    } else if (slide && hasInstrumentation) {
      track.appendChild(slide);
    }
  });
  // #endregion

  // #region Navigation controls
  let scrollIndicator;
  let showMoreButton;

  if (mq.matches) {
    if (cardElements && cardElements.length > 4) {
      const { scrollIndicator: createdScrollIndicator } = await createScrollIndicator();
      scrollIndicator = createdScrollIndicator;
    }
  } else if (cardElements && cardElements.length > 4) {
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

  if (showMoreButton) {
    showMoreButton.addEventListener('click', (event) => {
      event.preventDefault();
      cardElements.forEach((slide) => slide.classList.remove('hidden'));
      showMoreButton.remove();
    });
  }
  // #endregion

  // #region Assemble
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
  // #endregion

  // #region Desktop widget behavior
  if (mq.matches) {
    const widgetModule = await import('../editorial-carousel-widget/editorial-carousel-widget.js');
    widgetModule.default();
  }
  // #endregion
}
