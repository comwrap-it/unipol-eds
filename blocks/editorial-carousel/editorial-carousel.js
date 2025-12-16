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

const CLASS_NAMES = {
  carousel: 'editorial-carousel-container',
  track: 'editorial-carousel',
  slide: 'editorial-carousel-card-wrapper',
  cardBlock: 'editorial-carousel-card',
};

const SELECTORS = {
  decoratedCard: '.editorial-carousel-card-container, .card',
  navPrev: '.swiper-button-prev',
  navNext: '.swiper-button-next',
};

const THRESHOLDS = {
  mobileVisibleCards: 4,
  tabletNavCards: 3,
  desktopSmallNavCards: 4,
  desktopNavCards: 4,
};
// #endregion

// #region DEPENDENCIES

/** @type {boolean} */
let isStylesLoaded = false;

/**
 * Loads CSS dependencies used by the carousel UI.
 *
 * - `editorial-carousel.css`: layout + breakpoints.
 * - `standard-button.css`: mobile "show more" button styling.
 * - `icon-button.css` + `scroll-indicator.css`: navigation UI styling.
 *
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;

  const { loadCSS } = await import('../../scripts/aem.js');

  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/editorial-carousel/editorial-carousel.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/scroll-indicator/scroll-indicator.css`,
    ),
  ]);

  isStylesLoaded = true;
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
  const carousel = document.createElement('div');
  carousel.className = `${CLASS_NAMES.carousel} swiper`;
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', ariaLabel);
  carousel.setAttribute('tabindex', '0');

  const track = document.createElement('div');
  track.className = `${CLASS_NAMES.track} swiper-wrapper`;
  track.setAttribute('role', 'list');

  carousel.appendChild(track);

  return { carousel, track };
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

  return slide;
}

/**
 * Creates the navigation controls based on the viewport and slide count.
 *
 * @param {{ totalSlides: number, viewport: ViewportFlags, showMoreLabel: string }} params
 * @returns {Promise<CarouselNavigation>}
 */
async function createNavigationFromState({ totalSlides, showMoreLabel }) {
  const needsScrollShow = (
    (totalSlides > THRESHOLDS.desktopNavCards)
    || (totalSlides > THRESHOLDS.desktopSmallNavCards)
    || (totalSlides > THRESHOLDS.tabletNavCards)
  );

  if (needsScrollShow) {
    const {
      leftIconButton,
      scrollIndicator,
      rightIconButton,
      setExpandedDot,
    } = await createScrollIndicator();

    const showMoreButton = createButton(
      showMoreLabel,
      '',
      false,
      BUTTON_VARIANTS.SECONDARY,
      BUTTON_ICON_SIZES.MEDIUM,
      '',
      '',
    );
    showMoreButton.classList.add('showMore');

    return {
      mode: 'scroll-show',
      showMoreButton,
      leftIconButton,
      rightIconButton,
      scrollIndicator,
      setExpandedDot,
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

  /** @type {Record<string, any>} */
  const config = {
    a11y: { enabled: false },
    speed: 700,
    slidesPerView: 'auto',
    allowTouchMove: true,
    breakpoints: {
      1200: { allowTouchMove: false },
    },
    resistanceRatio: 0.85,
    touchReleaseOnEdges: true,
    effect: 'slide',
  };

  config.navigation = {
    prevEl: navigation.leftIconButton || carousel.querySelector(SELECTORS.navPrev),
    nextEl: navigation.rightIconButton || carousel.querySelector(SELECTORS.navNext),
    addIcons: false,
  };

  return new SwiperLib(carousel, config);
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
   * CREATE: static skeleton (wrapper, container, track).
   */
  const { carousel, track } = createCarouselSkeletonFromConfig();

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

  slides.forEach((slide) => {
    if (!slide) return;

    const hasContent = Boolean(
      slide.innerText?.trim() || slide.querySelector('img, picture'),
    );

    if (!model.instrumented && !hasContent) return;

    track.appendChild(slide);
    appendedSlides.push(slide);
  });

  /**
   * Keep only the first four slides on mobile (<768px) and restore all slides otherwise.
   */
  const applyMobileSlideLimit = () => {
    const isMobile = window.innerWidth < 768;

    appendedSlides.forEach((slide, index) => {
      const isAppended = slide.parentElement === track;
      if (isMobile && index >= THRESHOLDS.mobileVisibleCards && isAppended) {
        slide.classList.remove('hidden');
      } else if (!isMobile && !isAppended) {
        slide.classList.ad('hidden');
      }
    });
  };

  applyMobileSlideLimit();
  window.addEventListener('resize', applyMobileSlideLimit);

  /**
   * CREATE: navigation UI (scroll indicator for tablet/desktop, show-more on mobile).
   */
  const navigation = await createNavigationFromState({
    totalSlides: appendedSlides.length,
    showMoreLabel: model.showMoreLabel,
  });

  /**
   * ASSEMBLE: mount navigation and wire show-more behavior.
   */
  carousel.appendChild(navigation.scrollIndicator);

  navigation.showMoreButton.addEventListener('click', (event) => {
    event.preventDefault();
    appendedSlides.forEach((slide) => slide.classList.remove('hidden'));
    navigation.showMoreButton?.remove();
  });

  carousel.appendChild(navigation.showMoreButton);

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
  block.appendChild(carousel);

  /**
   * INIT: reveal animations.
   */
  initCarouselAnimations(carousel);

  /**
   * INIT: section widget (theme + section-level styles).
   */
  const decorateWidget = (await import('../editorial-carousel-widget/editorial-carousel-widget.js')).default;
  await decorateWidget(block);

  /**
   * INIT: Swiper (tablet/desktop only).
   */
  const swiperInstance = await createSwiperFromCarousel(carousel, navigation);

  /**
   * INIT: scroll indicator behavior (when present).
   */
  if (navigation.mode !== 'scroll-indicator' || !navigation.setExpandedDot) return;

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
  if (!model.cardRows.length) return;

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
