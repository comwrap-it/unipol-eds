/**
 * Editorial Carousel
 *
 * Builds a responsive carousel from Universal Editor-authored rows.
 *
 * Authoring format (block children):
 * - Row 0: "Show more" label (mobile only)
 * - Row 1..n: editorial-carousel-card rows
 *
 * Behavior:
 * - Mobile: renders up to `THRESHOLDS.mobileVisibleCards` cards and reveals the rest using
 *   a "show more" button.
 * - Tablet/Desktop: enables Swiper + scroll indicator when the amount of cards exceeds the
 *   visible threshold.
 *
 * Instrumentation:
 * - Preserves Universal Editor (AUE) instrumentation by moving/copying attributes from the
 *   authored rows into the rendered DOM.
 */

import { loadBlock, loadCSS } from '../../scripts/aem.js';
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

/**
 * @typedef {Object} ViewportFlags
 * @property {boolean} isMobile
 * @property {boolean} isTablet
 * @property {boolean} isDesktop
 */

/**
 * @typedef {Object} CarouselModel
 * @property {HTMLElement | undefined} showMoreRow
 * @property {string} showMoreLabel
 * @property {HTMLElement[]} cardRows
 * @property {number} rowCount
 * @property {boolean} instrumented
 */

/**
 * @typedef {Object} CarouselSkeleton
 * @property {HTMLDivElement} wrapper
 * @property {HTMLDivElement} carousel
 * @property {HTMLDivElement} track
 */

/**
 * @typedef {'scroll-indicator' | 'show-more' | 'none'} NavigationMode
 */

/**
 * @typedef {Object} CarouselNavigation
 * @property {NavigationMode} mode
 * @property {HTMLElement} [scrollIndicator]
 * @property {HTMLButtonElement} [leftIconButton]
 * @property {HTMLButtonElement} [rightIconButton]
 * @property {(state: { isBeginning: boolean, isEnd: boolean }) => void} [setExpandedDot]
 * @property {HTMLElement} [showMoreButton]
 */

/**
 * @typedef {(cardBlock: HTMLElement) => Promise<void>} DecorateCardFn
 */

// #region CONFIGS

const DEFAULT_ARIA_LABEL = 'Carosello editoriale';
const DEFAULT_SHOW_MORE_LABEL = 'Mostra di più';

const MEDIA_QUERIES = {
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1200px)',
};

const THRESHOLDS = {
  mobileVisibleCards: 4,
  tabletNavCards: 3,
  desktopNavCards: 5,
};

const CLASS_NAMES = {
  wrapper: 'editorial-carousel-wrapper',
  carousel: 'editorial-carousel-container',
  track: 'editorial-carousel',
  slide: 'editorial-carousel-card-wrapper',
  cardBlock: 'editorial-carousel-card',
  hidden: 'hidden',
};

const SELECTORS = {
  decoratedCard: '.editorial-carousel-card-container, .card',
  navPrev: '.swiper-button-prev',
  navNext: '.swiper-button-next',
};

// #endregion

// #region DEPENDENCIES

let stylesLoaded = false;

/**
 * Ensures widget CSS is loaded once.
 *
 * The carousel uses widget styling (navigation, dots, etc.).
 *
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (stylesLoaded) return;

  const widgetCssPath = `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`;
  await loadCSS(widgetCssPath);

  stylesLoaded = true;
}

// #endregion

// #region PARSE

/**
 * Parses authored rows into a normalized model.
 *
 * @param {HTMLElement} block
 * @returns {CarouselModel}
 */
function parseCarouselBlock(block) {
  const rows = Array.from(block.children);
  const rowCount = rows.length;

  const showMoreRow = rows.shift();
  const showMoreLabel = showMoreRow?.textContent?.trim() || DEFAULT_SHOW_MORE_LABEL;

  const instrumented = Boolean(
    block.hasAttribute('data-aue-resource')
      || block.querySelector('[data-aue-resource]')
      || block.querySelector('[data-richtext-prop]'),
  );

  return {
    showMoreRow,
    showMoreLabel,
    cardRows: rows,
    rowCount,
    instrumented,
  };
}

// #endregion

// #region CREATE

/**
 * Creates the base carousel DOM.
 *
 * @param {{ ariaLabel?: string }} [options]
 * @returns {CarouselSkeleton}
 */
function createCarouselSkeletonFromConfig({ ariaLabel = DEFAULT_ARIA_LABEL } = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = CLASS_NAMES.wrapper;

  const carousel = document.createElement('div');
  carousel.className = `${CLASS_NAMES.carousel} swiper`;
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', ariaLabel);
  carousel.setAttribute('tabindex', '0');

  const track = document.createElement('div');
  track.className = `${CLASS_NAMES.track} swiper-wrapper`;
  track.setAttribute('role', 'list');

  carousel.appendChild(track);
  wrapper.appendChild(carousel);

  return { wrapper, carousel, track };
}

/**
 * Creates one slide from one authored row.
 *
 * @param {HTMLElement} row
 * @param {DecorateCardFn} decorateCard
 * @returns {Promise<HTMLDivElement>}
 */
async function createSlideFromRow(row, decorateCard) {
  const slide = document.createElement('div');
  slide.className = `${CLASS_NAMES.slide} swiper-slide reveal-in-up`;
  slide.setAttribute('role', 'listitem');

  moveInstrumentation(row, slide);

  const cardBlock = document.createElement('div');
  cardBlock.className = CLASS_NAMES.cardBlock;
  cardBlock.dataset.blockName = 'editorial-carousel-card';

  if (row.hasAttribute('data-aue-resource')) {
    const attrs = ['data-aue-resource', 'data-aue-behavior', 'data-aue-type', 'data-aue-label'];
    attrs.forEach((name) => {
      const value = row.getAttribute(name);
      if (value) cardBlock.setAttribute(name, value);
    });
  }

  while (row.firstElementChild) {
    cardBlock.appendChild(row.firstElementChild);
  }

  slide.appendChild(cardBlock);
  await decorateCard(cardBlock);

  const decoratedCard = slide.querySelector(SELECTORS.decoratedCard) || slide.firstElementChild;
  if (decoratedCard?.dataset?.blockName) {
    await loadBlock(decoratedCard);
  }

  return slide;
}

/**
 * Creates the navigation controls based on the viewport and slide count.
 *
 * @param {{ totalSlides: number, viewport: ViewportFlags, showMoreLabel: string }} params
 * @returns {Promise<CarouselNavigation>}
 */
async function createNavigationFromState({ totalSlides, viewport, showMoreLabel }) {
  const needsScrollIndicator = (
    (viewport.isDesktop && totalSlides > THRESHOLDS.desktopNavCards)
    || (viewport.isTablet && totalSlides > THRESHOLDS.tabletNavCards)
  );

  if (needsScrollIndicator) {
    const {
      leftIconButton,
      scrollIndicator,
      rightIconButton,
      setExpandedDot,
    } = await createScrollIndicator();

    return {
      mode: 'scroll-indicator',
      leftIconButton,
      rightIconButton,
      scrollIndicator,
      setExpandedDot,
    };
  }

  const needsShowMore = viewport.isMobile && totalSlides > THRESHOLDS.mobileVisibleCards;
  if (needsShowMore) {
    const showMoreButton = createButton(
      showMoreLabel,
      '',
      false,
      BUTTON_VARIANTS.SECONDARY,
      BUTTON_ICON_SIZES.MEDIUM,
      '',
      '',
    );

    return {
      mode: 'show-more',
      showMoreButton,
    };
  }

  return { mode: 'none' };
}

/**
 * Creates and configures the Swiper instance for desktop/tablet.
 *
 * @param {HTMLElement} carousel
 * @param {CarouselNavigation} navigation
 * @returns {Promise<Object>} Swiper instance.
 */
async function createSwiperFromCarousel(carousel, navigation) {
  const SwiperLib = await loadSwiper();

  return new SwiperLib(carousel, {
    a11y: false,
    navigation: {
      prevEl: navigation.leftIconButton || carousel.querySelector(SELECTORS.navPrev),
      nextEl: navigation.rightIconButton || carousel.querySelector(SELECTORS.navNext),
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
  });
}

// #endregion

// #region RENDER

/**
 * Renders the carousel into the provided block.
 *
 * Assembly is kept monolithic (except for `create*From*` helpers).
 *
 * @param {HTMLElement} block
 * @param {CarouselModel} model
 * @param {DecorateCardFn} decorateCard
 * @returns {Promise<void>}
 */
async function renderCarousel(block, model, decorateCard) {
  /**
   * VIEWPORT: determine responsive behavior.
   */
  const mqTablet = window.matchMedia(MEDIA_QUERIES.tablet);
  const mqDesktop = window.matchMedia(MEDIA_QUERIES.desktop);

  /** @type {ViewportFlags} */
  const viewport = {
    isDesktop: mqDesktop.matches,
    isTablet: mqTablet.matches && !mqDesktop.matches,
    isMobile: !mqTablet.matches,
  };

  /**
   * CREATE: static skeleton (wrapper, container, track).
   */
  const { wrapper, carousel, track } = createCarouselSkeletonFromConfig();

  /**
   * CREATE: build slides by decorating nested `editorial-carousel-card` blocks.
   */
  const slides = await Promise.all(
    model.cardRows.map((row) => createSlideFromRow(row, decorateCard)),
  );

  /**
   * ASSEMBLE: append slides and apply mobile truncation when not instrumented.
   */
  const appendedSlides = [];
  let appendedIndex = 0;

  slides.forEach((slide) => {
    if (!slide) return;

    const hasContent = Boolean(
      slide.innerText?.trim() || slide.querySelector('img, picture'),
    );

    if (!model.instrumented && !hasContent) return;

    if (
      !model.instrumented
      && viewport.isMobile
      && appendedIndex >= THRESHOLDS.mobileVisibleCards
    ) {
      slide.classList.add(CLASS_NAMES.hidden);
    }

    track.appendChild(slide);
    appendedSlides.push(slide);
    appendedIndex += 1;
  });

  /**
   * CREATE: navigation UI (scroll indicator for tablet/desktop, show-more on mobile).
   */
  const navigation = await createNavigationFromState({
    totalSlides: appendedSlides.length,
    viewport,
    showMoreLabel: model.showMoreLabel,
  });

  /**
   * ASSEMBLE: mount navigation and wire show-more behavior.
   */
  if (navigation.scrollIndicator) {
    carousel.appendChild(navigation.scrollIndicator);
  } else if (navigation.showMoreButton) {
    navigation.showMoreButton.addEventListener('click', (event) => {
      event.preventDefault();
      appendedSlides.forEach((slide) => slide.classList.remove(CLASS_NAMES.hidden));
      navigation.showMoreButton?.remove();
    });

    carousel.appendChild(navigation.showMoreButton);
  }

  /**
   * CLEANUP: remove the authored show-more label row.
   */
  model.showMoreRow?.remove();

  /**
   * MOUNT: replace the block content with the built carousel.
   */
  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  block.textContent = '';
  carousel.classList.add('block', 'editorial-carousel-block');
  block.appendChild(wrapper);

  /**
   * INIT: reveal animations.
   */
  initCarouselAnimations(carousel);

  /**
   * INIT: Swiper + scroll indicator (tablet/desktop only).
   */
  if (navigation.mode !== 'scroll-indicator') return;

  const swiperInstance = await createSwiperFromCarousel(carousel, navigation);

  if (navigation.setExpandedDot) {
    handleSlideChange(
      swiperInstance,
      navigation.setExpandedDot,
      navigation.leftIconButton,
      navigation.rightIconButton,
    );

    navigation.setExpandedDot({
      isBeginning: swiperInstance.isBeginning,
      isEnd: swiperInstance.isEnd,
    });

    if (navigation.leftIconButton) {
      navigation.leftIconButton.disabled = swiperInstance.isBeginning;
    }

    if (navigation.rightIconButton) {
      navigation.rightIconButton.disabled = swiperInstance.isEnd;
    }
  }
}

// #endregion

// #region DECORATE

/**
 * Decorates the Editorial Carousel block.
 *
 * @param {HTMLElement} block
 * @returns {Promise<void>}
 */
export default async function decorateEditorialCarousel(block) {
  if (!block) return;

  await ensureStylesLoaded();

  /**
   * PARSE: build the model from authored rows.
   */
  const model = parseCarouselBlock(block);

  if (!model.cardRows.length) {
    /* eslint-disable no-console */
    console.warn('Editorial Carousel: No cards found');
    /* eslint-enable no-console */
    return;
  }

  /**
   * LOAD: card decorator.
   */
  const decorateCard = (await import('../editorial-carousel-card/editorial-carousel-card.js')).default;

  /**
   * RENDER: assemble the final carousel.
   */
  await renderCarousel(block, model, decorateCard);
}

// #endregion
