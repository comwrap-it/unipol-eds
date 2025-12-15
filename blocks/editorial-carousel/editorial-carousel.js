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

const DEBUG_FEATURE = 'editorial-carousel';
const DEBUG_SNAPSHOT_STORE = '__EDS_DEBUG_SNAPSHOTS__';
const DEBUG_MAX_SNAPSHOTS = 50;

const DEFAULT_ARIA_LABEL = 'Carosello editoriale';
const DEFAULT_SHOW_MORE_LABEL = 'Mostra di più';

const MEDIA_QUERIES = {
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1200px)',
};

const THRESHOLDS = {
  mobileVisibleCards: 4,
  tabletNavCards: 3,
  desktopNavCards: 4,
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

let dependenciesLoaded = false;
let debugEnabledMemo;

async function loadDependenciesOnce() {
  if (dependenciesLoaded) return;

  const { loadCSS } = await import('../../scripts/aem.js');
  const widgetCssPath = `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`;
  await loadCSS(widgetCssPath);

  dependenciesLoaded = true;
}

function parseDebugSelector(value) {
  const normalized = (value || '').trim().toLowerCase();
  if (!normalized) return false;

  if (['1', 'true', 'on', 'yes', '*', 'all'].includes(normalized)) return true;

  const parts = normalized
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.includes(DEBUG_FEATURE);
}

function computeDebugEnabled() {
  try {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.has('debug-editorial-carousel');
    if (explicit) return true;

    const fromQuery = params.get('eds-debug') || params.get('debug');
    if (parseDebugSelector(fromQuery)) return true;
  } catch (e) {
    // ignore
  }

  try {
    const perComponent = window.localStorage?.getItem(
      'eds-debug-editorial-carousel',
    );
    if (parseDebugSelector(perComponent)) return true;

    const globalFlag = window.localStorage?.getItem('eds-debug');
    if (parseDebugSelector(globalFlag)) return true;
  } catch (e) {
    // ignore
  }

  const global = window.EDS_DEBUG;
  if (global === true) return true;
  if (typeof global === 'string' && parseDebugSelector(global)) return true;
  if (Array.isArray(global)) {
    const normalized = global.map((value) => String(value).toLowerCase());
    if (normalized.includes(DEBUG_FEATURE)) return true;
  }

  return false;
}

function isDebugEnabled() {
  if (typeof debugEnabledMemo === 'boolean') return debugEnabledMemo;
  debugEnabledMemo = computeDebugEnabled();
  return debugEnabledMemo;
}

function getDebugBlockId(block) {
  return (
    block?.getAttribute('data-aue-resource')
    || block?.dataset?.blockName
    || block?.id
    || 'unknown'
  );
}

function persistDebugSnapshot(snapshot) {
  if (!snapshot) return;

  const store = window[DEBUG_SNAPSHOT_STORE] || (window[DEBUG_SNAPSHOT_STORE] = {});
  const list = store[DEBUG_FEATURE] || (store[DEBUG_FEATURE] = []);

  list.push(snapshot);
  if (list.length > DEBUG_MAX_SNAPSHOTS) {
    list.splice(0, list.length - DEBUG_MAX_SNAPSHOTS);
  }
}

/* eslint-disable no-console */
function printDebugSnapshot(snapshot) {
  if (!snapshot) return;

  const stage = snapshot.stage ? ` ${snapshot.stage}` : '';
  const label = `[EDS][${DEBUG_FEATURE}] ${snapshot.id}${stage}`;

  if (console.groupCollapsed) {
    console.groupCollapsed(label);
    console.debug(snapshot);
    console.groupEnd();
  } else {
    console.debug(label, snapshot);
  }
}
/* eslint-enable no-console */

function debugSnapshot(block, payload) {
  if (!isDebugEnabled()) return;

  const snapshot = {
    id: getDebugBlockId(block),
    ...payload,
  };

  persistDebugSnapshot(snapshot);
  printDebugSnapshot(snapshot);
}

function trimText(value, maxLen = 120) {
  const str = (value || '').toString().trim();
  if (str.length <= maxLen) return str;

  const suffix = '...';
  return `${str.slice(0, Math.max(0, maxLen - suffix.length))}${suffix}`;
}

function hasUniversalEditorInstrumentation(block) {
  return Boolean(
    block.hasAttribute('data-aue-resource')
      || block.querySelector('[data-aue-resource]')
      || block.querySelector('[data-richtext-prop]'),
  );
}

function getViewportFlags() {
  const mqTablet = window.matchMedia(MEDIA_QUERIES.tablet);
  const mqDesktop = window.matchMedia(MEDIA_QUERIES.desktop);

  return {
    mqTablet,
    mqDesktop,
    isDesktop: mqDesktop.matches,
    isTablet: mqTablet.matches && !mqDesktop.matches,
    isMobile: !mqTablet.matches,
  };
}

function parseCarouselBlock(block) {
  const rows = Array.from(block.children);
  const rowCount = rows.length;

  const showMoreRow = rows.shift();
  const showMoreLabel = showMoreRow?.textContent?.trim() || DEFAULT_SHOW_MORE_LABEL;

  return {
    showMoreRow,
    showMoreLabel,
    cardRows: rows,
    rowCount,
  };
}

function renderCarouselSkeleton({ ariaLabel = DEFAULT_ARIA_LABEL } = {}) {
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

function copyAueAttributes(source, target) {
  if (!source?.hasAttribute('data-aue-resource')) return;

  const attributes = [
    'data-aue-resource',
    'data-aue-behavior',
    'data-aue-type',
    'data-aue-label',
  ];

  attributes.forEach((name) => {
    const value = source.getAttribute(name);
    if (value) target.setAttribute(name, value);
  });
}

async function buildSlideFromRow(row, decorateCard) {
  const slide = document.createElement('div');
  slide.className = `${CLASS_NAMES.slide} swiper-slide reveal-in-up`;
  slide.setAttribute('role', 'listitem');
  moveInstrumentation(row, slide);

  const cardBlock = document.createElement('div');
  cardBlock.className = CLASS_NAMES.cardBlock;
  cardBlock.dataset.blockName = 'editorial-carousel-card';
  copyAueAttributes(row, cardBlock);

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

async function buildSlides(cardRows, decorateCard) {
  return Promise.all(cardRows.map((row) => buildSlideFromRow(row, decorateCard)));
}

function slideHasContent(slide) {
  return Boolean(slide?.innerText?.trim() || slide?.querySelector('img, picture'));
}

function isHiddenSlide(slide) {
  return slide?.classList?.contains(CLASS_NAMES.hidden);
}

function appendSlidesToTrack({
  slides,
  track,
  instrumented,
  viewport,
}) {
  const appended = [];
  let appendedIndex = 0;

  slides.forEach((slide) => {
    if (!slide) return;

    if (!instrumented && !slideHasContent(slide)) return;

    if (!instrumented && viewport.isMobile && appendedIndex >= THRESHOLDS.mobileVisibleCards) {
      slide.classList.add(CLASS_NAMES.hidden);
    }

    track.appendChild(slide);
    appended.push(slide);
    appendedIndex += 1;
  });

  return appended;
}

function shouldShowScrollIndicator(totalSlides, viewport) {
  if (viewport.isDesktop) return totalSlides > THRESHOLDS.desktopNavCards;
  if (viewport.isTablet) return totalSlides > THRESHOLDS.tabletNavCards;
  return false;
}

function shouldShowMobileExpansion(totalSlides, viewport) {
  return viewport.isMobile && totalSlides > THRESHOLDS.mobileVisibleCards;
}

async function buildNavigation({ totalSlides, viewport, showMoreLabel }) {
  if (shouldShowScrollIndicator(totalSlides, viewport)) {
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

  if (shouldShowMobileExpansion(totalSlides, viewport)) {
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

function bindShowMoreButton(showMoreButton, slides) {
  if (!showMoreButton) return;

  showMoreButton.addEventListener('click', (event) => {
    event.preventDefault();
    slides.forEach((slide) => slide.classList.remove(CLASS_NAMES.hidden));
    showMoreButton.remove();
  });
}

function renderNavigation(carousel, navigation) {
  if (navigation.scrollIndicator) {
    carousel.appendChild(navigation.scrollIndicator);
  } else if (navigation.showMoreButton) {
    carousel.appendChild(navigation.showMoreButton);
  }
}

function initDesktopSwiperInstance(SwiperLib, carousel, navigation) {
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
    debugger: true,
  });
}

async function initDesktopSwiper(carousel, navigation) {
  const SwiperLib = await loadSwiper();
  const swiperInstance = initDesktopSwiperInstance(SwiperLib, carousel, navigation);

  if (!navigation.setExpandedDot) return;

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

function mountCarousel(block, wrapper, carousel) {
  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  block.textContent = '';
  carousel.classList.add('block', 'editorial-carousel-block');
  block.appendChild(wrapper);
}

export default async function decorateEditorialCarousel(block) {
  if (!block) return;

  await loadDependenciesOnce();

  const instrumented = hasUniversalEditorInstrumentation(block);
  const viewport = getViewportFlags();
  const parsed = parseCarouselBlock(block);

  if (!parsed.cardRows.length) {
    debugSnapshot(block, {
      stage: 'empty',
      instrumented,
      rows: parsed.rowCount,
    });

    /* eslint-disable no-console */
    console.warn('Editorial Carousel: No cards found');
    /* eslint-enable no-console */

    return;
  }

  debugSnapshot(block, {
    stage: 'parse',
    instrumented,
    rows: parsed.rowCount,
    cards: parsed.cardRows.length,
    showMoreLabel: trimText(parsed.showMoreLabel),
    viewport: {
      isMobile: viewport.isMobile,
      isTablet: viewport.isTablet,
      isDesktop: viewport.isDesktop,
    },
  });

  const cardModule = await import('../editorial-carousel-card/editorial-carousel-card.js');
  const decorateCard = cardModule.default;

  const { wrapper, carousel, track } = renderCarouselSkeleton();

  const slides = await buildSlides(parsed.cardRows, decorateCard);
  const appendedSlides = appendSlidesToTrack({
    slides,
    track,
    instrumented,
    viewport,
  });

  const navigation = await buildNavigation({
    totalSlides: appendedSlides.length,
    viewport,
    showMoreLabel: parsed.showMoreLabel,
  });

  renderNavigation(carousel, navigation);
  bindShowMoreButton(navigation.showMoreButton, appendedSlides);

  parsed.showMoreRow?.remove();

  mountCarousel(block, wrapper, carousel);
  initCarouselAnimations(carousel);

  debugSnapshot(block, {
    stage: 'render',
    instrumented,
    slides: {
      built: slides.length,
      appended: appendedSlides.length,
      hiddenOnMobile: appendedSlides.filter(isHiddenSlide).length,
    },
    navigation: {
      mode: navigation.mode,
      hasScrollIndicator: Boolean(navigation.scrollIndicator),
      hasShowMoreButton: Boolean(navigation.showMoreButton),
    },
  });

  if (navigation.mode === 'scroll-indicator') {
    await initDesktopSwiper(carousel, navigation);
    debugSnapshot(block, { stage: 'swiper-ready' });
  }
}
