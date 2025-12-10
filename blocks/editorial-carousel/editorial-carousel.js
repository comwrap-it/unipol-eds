import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import createScrollIndicator from '../scroll-indicator/scroll-indicator.js';
import {
  createButton,
  BUTTON_VARIANTS,
  BUTTON_ICON_SIZES,
} from '../atoms/buttons/standard-button/standard-button.js';
import loadSwiper from '../../scripts/delayed.js';
import { handleSlideChange } from '../../scripts/utils.js';

let isStylesLoaded = false;

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

const initSwiper = (
  Swiper,
  carousel,
  leftIconButton = null,
  rightIconButton = null,
) => new Swiper(carousel, {
  a11y: false,
  navigation: {
    prevEl: leftIconButton || carousel.querySelector('.swiper-button-prev'),
    nextEl: rightIconButton || carousel.querySelector('.swiper-button-next'),
    addIcons: false,
  },
  speed: 700,
  slidesPerView: 'auto',
  allowTouchMove: true,
  breakpoints: {
    1200: {
      allowTouchMove: false,
    },
  },
  resistanceRatio: 0.85,
  touchReleaseOnEdges: true,
  effect: 'slide',
  debugger: true,
});

export default async function handleEditorialProductCarouselWidget(block) {
  // #region Guard clauses
  if (!block) return;
  // #endregion

  // #region Load styles once
  await ensureStylesLoaded();
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
  const showMoreButtonLabel = showMoreElement?.textContent?.trim() || 'Mostra di piu';
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
  const scrollIndicatorProps = {};
  let showMoreButton;

  if (mq.matches && cardElements.length > 0) {
    const {
      leftIconButton,
      scrollIndicator,
      rightIconButton,
      setExpandedDot,
    } = await createScrollIndicator();
    scrollIndicatorProps.leftIconButton = leftIconButton;
    scrollIndicatorProps.scrollIndicator = scrollIndicator;
    scrollIndicatorProps.rightIconButton = rightIconButton;
    scrollIndicatorProps.setExpandedDot = setExpandedDot;
  } else if (!mq.matches && cardElements.length > 4) {
    showMoreButton = createButton(
      showMoreButtonLabel,
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
  if (scrollIndicatorProps.scrollIndicator) {
    carousel.appendChild(scrollIndicatorProps.scrollIndicator);
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

  // #region Swiper initialization
  if (mq.matches) {
    const SwiperLib = await loadSwiper();
    const swiperInstance = initSwiper(
      SwiperLib,
      carousel,
      scrollIndicatorProps.leftIconButton,
      scrollIndicatorProps.rightIconButton,
    );
    if (scrollIndicatorProps.setExpandedDot) {
      handleSlideChange(
        swiperInstance,
        scrollIndicatorProps.setExpandedDot,
        scrollIndicatorProps.leftIconButton,
        scrollIndicatorProps.rightIconButton,
      );
      scrollIndicatorProps.setExpandedDot({
        isBeginning: swiperInstance.isBeginning,
        isEnd: swiperInstance.isEnd,
      });
      if (scrollIndicatorProps.leftIconButton) {
        scrollIndicatorProps.leftIconButton.disabled = swiperInstance.isBeginning;
      }
      if (scrollIndicatorProps.rightIconButton) {
        scrollIndicatorProps.rightIconButton.disabled = swiperInstance.isEnd;
      }
    }
  }
  // #endregion
}
