/* eslint-disable max-len */
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
import { initCarouselAnimations } from '../../scripts/reveal.js';

let stylesLoaded = false;
const DEFAULT_ARIA_LABEL = 'Carosello editoriale';

/**
 * Ensures the carousel widget CSS is fetched once before decoration.
 *
 * @returns {Promise<void>} resolves when the stylesheet is loaded
 */
async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const widgetCssPath = `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`;
  await Promise.all([loadCSS(widgetCssPath)]);
  stylesLoaded = true;
}

/**
 * Initializes a Swiper instance configured for the editorial carousel.
 *
 * @param {typeof Swiper} SwiperLib - Swiper constructor pulled from CDN
 * @param {HTMLElement} carousel - The carousel container element
 * @param {HTMLElement} leftIconButton - Navigation element for previous slide
 * @param {HTMLElement} rightIconButton - Navigation element for next slide
 * @returns {import('swiper').Swiper} configured Swiper instance
 */
const initSwiperInstance = (
  SwiperLib,
  carousel,
  leftIconButton,
  rightIconButton,
) => new SwiperLib(carousel, {
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
    1200: { allowTouchMove: false },
  },
  resistanceRatio: 0.85,
  touchReleaseOnEdges: true,
  effect: 'slide',
  debugger: true,
});

/**
 * Checks whether a block already carries instrumentation data.
 *
 * @param {HTMLElement} block - The block root element
 * @returns {boolean} true when instrumentation attributes are present
 */
const hasInstrumentation = (block) => (
  block.hasAttribute('data-aue-resource')
  || block.querySelector('[data-aue-resource]')
  || block.querySelector('[data-richtext-prop]')
);

/**
 * Builds empty carousel scaffolding with container and track elements.
 *
 * @returns {{carousel: HTMLElement, track: HTMLElement}} wrapper elements for slides
 */
const createCarouselStructure = () => {
  const wrapper = document.createElement('div');
  wrapper.className = 'editorial-carousel-wrapper';

  const carousel = document.createElement('div');
  carousel.className = 'editorial-carousel-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', DEFAULT_ARIA_LABEL);
  carousel.setAttribute('tabindex', '0');

  const track = document.createElement('div');
  track.className = 'editorial-carousel swiper-wrapper';
  track.setAttribute('role', 'list');

  wrapper.appendChild(carousel);

  return { wrapper, carousel, track };
};

/**
 * Transforms a row of authored content into a swiper slide and decorates the card.
 *
 * @param {HTMLElement} row - Row containing the card authored content
 * @param {(cardBlock: HTMLElement) => Promise<void>} decorateCard - Async decorator for the card block
 * @returns {Promise<HTMLElement>} the populated slide element
 */
const createSlide = async (row, decorateCard) => {
  const slide = document.createElement('div');
  slide.className = 'editorial-carousel-card-wrapper swiper-slide reveal-in-up';
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

  const decoratedCard = slide.querySelector('.editorial-carousel-card-container, .card')
    || slide.firstElementChild;
  if (decoratedCard?.dataset.blockName) {
    await loadBlock(decoratedCard);
  }

  return slide;
};

/**
 * Appends slides to the track, respecting mobile truncation and instrumentation rules.
 *
 * @param {HTMLElement[]} slides - List of slide elements
 * @param {HTMLElement} track - Swiper track element
 * @param {boolean} instrumented - Whether Universal Editor instrumentation is present
 * @param {MediaQueryList} mqTablet - Media query determining tablet/desktop vs mobile
 */
const appendSlides = (slides, track, instrumented, mqTablet) => {
  slides.forEach((slide, index) => {
    const hasContent = slide?.innerText?.trim() || slide?.querySelector('img, picture');
    if (slide && !instrumented && hasContent) {
      if (index >= 4 && !mqTablet.matches) {
        slide.classList.add('hidden');
      }
      track.appendChild(slide);
    } else if (slide && instrumented) {
      track.appendChild(slide);
    }
  });
};

/**
 * Creates navigation UI based on viewport: scroll indicator on desktop/tablet,
 * or a "show more" button on mobile when needed.
 *
 * @param {HTMLElement[]} cardElements - Slides representing each card
 * @param {MediaQueryList} mqTablet - Media query for min-width: 768px
 * @param {MediaQueryList} mqDesktop - Media query for min-width: 1200px
 * @param {string} showMoreButtonLabel - Text for the mobile expansion button
 * @returns {Promise<{scrollIndicatorProps: Object, showMoreButton: HTMLElement | undefined}>}
 */
const createNavigation = async (cardElements, mqTablet, mqDesktop, showMoreButtonLabel) => {
  const scrollIndicatorProps = {};
  let showMoreButton;
  const totalCards = cardElements.length;

  const isDesktop = mqDesktop.matches;
  const isTablet = mqTablet.matches && !mqDesktop.matches;

  if ((isDesktop && totalCards > 4) || (isTablet && totalCards > 3)) {
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
  } else if (!mqTablet.matches && totalCards > 4) {
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

  return { scrollIndicatorProps, showMoreButton };
};

/**
 * Attaches "show more" behavior for mobile: reveals hidden slides and removes the trigger.
 *
 * @param {HTMLElement} showMoreButton - Button element used to expand the list
 * @param {HTMLElement[]} cardElements - Slide elements to unhide
 */
const bindShowMore = (showMoreButton, cardElements) => {
  if (!showMoreButton) return;
  showMoreButton.addEventListener('click', (event) => {
    event.preventDefault();
    cardElements.forEach((slide) => slide.classList.remove('hidden'));
    showMoreButton.remove();
  });
};

/**
 * Inserts core carousel structure and any navigation UI into the block container.
 *
 * @param {HTMLElement} carousel - Carousel wrapper
 * @param {HTMLElement} track - Slides track
 * @param {Object} scrollIndicatorProps - Optional scroll indicator elements
 * @param {HTMLElement} showMoreButton - Optional mobile "show more" button
 */
const assembleCarousel = (carousel, track, scrollIndicatorProps, showMoreButton) => {
  carousel.appendChild(track);
  if (scrollIndicatorProps.scrollIndicator) {
    carousel.appendChild(scrollIndicatorProps.scrollIndicator);
  } else if (showMoreButton) {
    carousel.appendChild(showMoreButton);
  }
};

/**
 * Initializes Swiper for desktop/tablet and wires the expanding dots state.
 *
 * @param {HTMLElement} carousel - Carousel wrapper
 * @param {Object} scrollIndicatorProps - Elements controlling navigation state
 * @returns {Promise<void>} resolves after Swiper is ready
 */
const initDesktopSwiper = async (carousel, scrollIndicatorProps) => {
  const SwiperLib = await loadSwiper();
  const swiperInstance = initSwiperInstance(
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
};

/**
 * Entry point that decorates the editorial carousel block: builds slides,
 * navigation, instrumentation, and desktop Swiper behavior.
 *
 * @param {HTMLElement} block - The carousel block container
 * @returns {Promise<void>} resolves when the carousel is fully decorated
 */
export default async function decorateEditorialCarousel(block) {
  if (!block) return;
  await ensureStylesLoaded();

  const instrumented = hasInstrumentation(block);
  const cardModule = await import('../editorial-carousel-card/editorial-carousel-card.js');
  const decorateEditorialProductCard = cardModule.default;

  const { wrapper, carousel, track } = createCarouselStructure();
  const rows = Array.from(block.children);
  const showMoreElement = rows.shift();
  const showMoreButtonLabel = showMoreElement?.textContent?.trim() || 'Mostra di più';
  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Editorial Carousel: No cards found');
    return;
  }

  const cardPromises = rows.map((row) => createSlide(row, decorateEditorialProductCard));
  const mqTablet = window.matchMedia('(min-width: 768px)');
  const mqDesktop = window.matchMedia('(min-width: 1200px)');
  const cardElements = await Promise.all(cardPromises);

  appendSlides(cardElements, track, instrumented, mqTablet);

  const { scrollIndicatorProps, showMoreButton } = await createNavigation(
    cardElements,
    mqTablet,
    mqDesktop,
    showMoreButtonLabel,
  );
  bindShowMore(showMoreButton, cardElements);

  assembleCarousel(carousel, track, scrollIndicatorProps, showMoreButton);
  initCarouselAnimations(carousel);
  showMoreElement?.remove();

  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  block.innerText = '';
  carousel.classList.add('block', 'editorial-carousel-block');
  wrapper.appendChild(carousel);
  block.appendChild(wrapper);

  const totalSlides = track.children.length;
  const isDesktop = mqDesktop.matches;
  const isTablet = mqTablet.matches && !mqDesktop.matches;

  if ((isDesktop && totalSlides > 4) || (isTablet && totalSlides > 3)) {
    await initDesktopSwiper(carousel, scrollIndicatorProps);
  }
}
