import { createButton } from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';
import { createIconButton } from '@unipol-ds/components/atoms/buttons/icon-button/icon-button.js';
import { loadCSS } from '../../scripts/aem.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../constants/index.js';

// #region CONSTANTS
const WIDGET_CLASS = 'product-highlights-widget';
const DECORATED_ATTR = 'data-product-highlights-widget';
const CAROUSEL_CLASS = 'product-highlights-carousel';
const PRODUCT_HIGHLIGHTS_SWIPER_SPEED = 10000;
const PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW = PRODUCT_HIGHLIGHTS_SWIPER_SPEED * 3; // 1/3
// #endregion

// #region HELPERS
let stylesLoaded = false;
let stylesLoadingPromise = null;

/**
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  if (!stylesLoadingPromise) {
    stylesLoadingPromise = (async () => {
      await Promise.all([
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/product-highlights-widget/product-highlights-widget.css`,
        ),
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/text-block/text-block.css`,
        ),
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
        ),
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`,
        ),
      ]);
      stylesLoaded = true;
    })();
  }
  await stylesLoadingPromise;
}

/**
 * @param {HTMLElement|null} section
 * @param {string} name
 * @returns {string}
 */
const getDatasetValue = (section, name) => {
  if (!section?.dataset) return '';
  const direct = section.dataset[name] || section.dataset[String(name || '').toLowerCase()] || '';
  if (direct) return direct;
  const target = String(name || '').toLowerCase();
  const match = Object.entries(section.dataset)
    .find(([key]) => key.toLowerCase() === target);
  return match ? match[1] : '';
};

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement|null} child
 */
const appendIfPresent = (parent, child) => {
  if (child) parent.appendChild(child);
};

/**
 * @param {string|undefined|null} value
 * @returns {string}
 */
const normalizeValue = (value) => String(value ?? '').trim();

/**
 * @param {string|undefined|null} value
 * @returns {boolean}
 */
const toBoolean = (value) => normalizeValue(value).toLowerCase() === 'true';

/**
 * @param {string} value
 * @param {string[]} options
 * @param {string} fallback
 * @returns {string}
 */
const resolveOption = (value, options, fallback) => (options.includes(value) ? value : fallback);

/**
 * @type {Record<string, string>}
 */
const WIDGET_DATA_MAP = {
  logoSrc: 'logo',
  logoAlt: 'logoAlt',
  standardButtonLabel: 'standardButtonLabel',
  standardButtonVariant: 'standardButtonVariant',
  standardButtonHref: 'standardButtonHref',
  standardButtonOpenInNewTab: 'standardButtonOpenInNewTab',
  standardButtonSize: 'standardButtonSize',
  standardButtonLeftIcon: 'standardButtonLeftIcon',
  standardButtonRightIcon: 'standardButtonRightIcon',
};

/**
 * @param {HTMLElement} section
 * @returns {Record<string, string>}
 */
const readWidgetData = (section) => Object.fromEntries(
  Object.entries(WIDGET_DATA_MAP).map(([key, datasetKey]) => [
    key,
    getDatasetValue(section, datasetKey),
  ]),
);

/**
 * @param {Object} swiperInstance
 * @param {number} speed
 */
const setProductHighlightsSwiperSpeed = (swiperInstance, speed) => {
  if (!swiperInstance) return;
  swiperInstance.params.speed = speed;

  if (swiperInstance.autoplay?.running) {
    swiperInstance.autoplay.stop();
    swiperInstance.autoplay.start();
  }
};

/**
 * @param {HTMLElement|null} target
 * @returns {HTMLElement|null}
 */
const resolveSection = (target) => {
  if (!target) return null;
  if (target.classList?.contains('section')) return target;
  return target.closest?.('.section') || null;
};
// #endregion

// #region CREATE
/**
 * @param {Object} [options]
 * @param {HTMLElement|null} [options.root]
 * @param {HTMLElement|null} [options.carousel]
 * @param {HTMLElement|null} [options.textBlockWrapper]
 * @param {HTMLElement|null} [options.textBlock]
 * @param {string} [options.logoSrc]
 * @param {string} [options.logoAlt]
 * @param {Object|null} [options.buttonConfig]
 * @param {string} [options.buttonConfig.label]
 * @param {string} [options.buttonConfig.href]
 * @param {boolean} [options.buttonConfig.openInNewTab]
 * @param {string} [options.buttonConfig.variant]
 * @param {string} [options.buttonConfig.iconSize]
 * @param {string} [options.buttonConfig.leftIcon]
 * @param {string} [options.buttonConfig.rightIcon]
 * @param {Object} [options.buttonConfig.instrumentation]
 * @returns {HTMLElement}
 */
export function createProductHighlightsWidget({
  root = null,
  carousel = null,
  textBlockWrapper = null,
  textBlock = null,
  logoSrc = '',
  logoAlt = '',
  buttonConfig = null,
} = {}) {
  /*
   * Root
   */
  const panel = root || document.createElement('div');
  panel.classList.add('product-highlights-widget-panel');
  panel.textContent = '';

  /*
   * Header
   */
  const header = document.createElement('div');
  header.className = 'product-highlights-widget-header';

  let ctaElement = null;
  if (buttonConfig?.label) {
    ctaElement = createButton(
      buttonConfig.label,
      buttonConfig.href,
      buttonConfig.openInNewTab,
      buttonConfig.variant || BUTTON_VARIANTS.PRIMARY,
      buttonConfig.iconSize || BUTTON_ICON_SIZES.MEDIUM,
      buttonConfig.leftIcon || '',
      buttonConfig.rightIcon || '',
      buttonConfig.instrumentation || {},
    );
    if (ctaElement.tagName === 'BUTTON') ctaElement.type = 'button';
  }

  if (logoSrc) {
    const logo = document.createElement('div');
    logo.className = 'product-highlights-widget-logo';
    if (logoSrc) {
      const img = document.createElement('img');
      img.src = logoSrc;
      img.alt = logoAlt || '';
      logo.appendChild(img);
    }
    header.appendChild(logo);
  }

  const headerText = textBlockWrapper || textBlock;

  if (headerText && ctaElement) {
    const textBlockButton = headerText.querySelector('.text-block-button');
    if (textBlockButton) textBlockButton.remove();
  }

  appendIfPresent(header, headerText);
  if (header.childElementCount) panel.appendChild(header);

  /*
   * Carousel
   */
  const carouselWrap = document.createElement('div');
  carouselWrap.className = 'product-highlights-widget-carousel';
  appendIfPresent(carouselWrap, carousel);
  panel.appendChild(carouselWrap);

  /*
   * CTA
   */
  if (ctaElement) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'product-highlights-widget-cta';
    ctaWrap.appendChild(ctaElement);
    panel.appendChild(ctaWrap);
  }

  /*
   * Pause
   */
  const pauseButton = createIconButton(
    'un-icon-pause-circle',
    BUTTON_VARIANTS.PRIMARY,
    BUTTON_ICON_SIZES.SMALL,
  );
  pauseButton.classList.add('product-highlights-widget-pause');
  if (pauseButton.tagName === 'BUTTON') pauseButton.type = 'button';
  pauseButton.setAttribute('aria-label', 'Pausa animazione');
  panel.appendChild(pauseButton);

  return panel;
}
// #endregion

// #region PARSE
/**
 * @param {HTMLElement} section
 * @param {HTMLElement|null} [block]
 * @returns {Object|null}
 */
export function parseProductHighlightsWidget(section, block = null) {
  if (!section) return null;

  /*
   * Scope & carousel
   */
  const scope = block?.classList?.contains(WIDGET_CLASS) ? block : section;
  let carousel = scope?.querySelector('.product-highlights-carousel');
  if (!carousel && scope !== section) {
    carousel = section.querySelector('.product-highlights-carousel');
  }
  if (!carousel) return null;

  /*
   * Child blocks
   */
  const textBlock = section.querySelector('.text-block');
  const textBlockWrapper = textBlock ? textBlock.closest('.text-block-wrapper') : null;

  /*
   * Dataset values
   */
  const data = readWidgetData(section);
  const buttonLabel = normalizeValue(data.standardButtonLabel);
  const buttonVariant = resolveOption(
    normalizeValue(data.standardButtonVariant).toLowerCase(),
    Object.values(BUTTON_VARIANTS),
    BUTTON_VARIANTS.SECONDARY,
  );
  const buttonIconSize = resolveOption(
    normalizeValue(data.standardButtonSize).toLowerCase(),
    Object.values(BUTTON_ICON_SIZES),
    BUTTON_ICON_SIZES.MEDIUM,
  );
  const buttonConfig = buttonLabel
    ? {
      label: buttonLabel,
      href: data.standardButtonHref,
      openInNewTab: toBoolean(data.standardButtonOpenInNewTab),
      variant: buttonVariant,
      iconSize: buttonIconSize,
      leftIcon: data.standardButtonLeftIcon,
      rightIcon: data.standardButtonRightIcon,
    }
    : null;

  /*
   * Root & wrapper
   */
  const panelRoot = block?.classList?.contains(WIDGET_CLASS)
    ? block
    : section.querySelector(`.${WIDGET_CLASS}`);
  const wrapper = panelRoot?.querySelector(':scope > .default-content-wrapper') || null;

  /*
   * Return
   */
  return {
    carousel,
    textBlock,
    textBlockWrapper,
    logoSrc: data.logoSrc,
    logoAlt: data.logoAlt,
    buttonConfig,
    panelRoot,
    wrapper,
  };
}
// #endregion

// #region DECORATE
/**
 * @param {HTMLElement} section
 * @param {HTMLElement|null} block
 * @returns {Promise<void>}
 */
async function decorateWidgetSection(section, block) {
  if (!section || section.getAttribute(DECORATED_ATTR) === 'true') return;

  /*
   * Parse
   */
  const parsed = parseProductHighlightsWidget(section, block);
  if (!parsed) return;

  const {
    carousel,
    textBlockWrapper,
    textBlock,
    logoSrc,
    logoAlt,
    buttonConfig,
    panelRoot,
    wrapper,
  } = parsed;

  /*
   * Create
   */
  const originalCarouselWrapper = carousel.parentElement;

  const panel = createProductHighlightsWidget({
    root: panelRoot,
    carousel,
    textBlockWrapper,
    textBlock,
    logoSrc,
    logoAlt,
    buttonConfig,
  });

  /*
   * Mount
   */
  if (!panel.parentElement) {
    if (panelRoot && panelRoot.parentElement) {
      panelRoot.replaceWith(panel);
    } else {
      section.appendChild(panel);
    }
  }

  /*
   * Cleanup
   */
  if (wrapper && wrapper.isConnected) wrapper.remove();
  if (panelRoot && panelRoot !== panel && panelRoot.isConnected) panelRoot.remove();

  if (
    originalCarouselWrapper
    && originalCarouselWrapper !== carousel.parentElement
    && originalCarouselWrapper.classList.contains('product-highlights-carousel-wrapper')
  ) {
    originalCarouselWrapper.remove();
  }

  /*
   * Finalize
   */
  section.classList.add(WIDGET_CLASS);
  section.classList.add('theme-dark');
  section.setAttribute(DECORATED_ATTR, 'true');

  /*
   * Pause
   */
  const pauseButton = panel.querySelector('.product-highlights-widget-pause');
  if (!pauseButton) return;
  const pauseIcon = pauseButton.querySelector('.icon');

  const bindPauseControls = (instance) => {
    if (pauseButton.dataset.productHighlightsPauseBound === 'true') return;
    if (!instance?.autoplay || !instance?.params?.autoplay) {
      pauseButton.disabled = true;
      pauseButton.setAttribute('aria-disabled', 'true');
      return;
    }

    pauseButton.dataset.productHighlightsPauseBound = 'true';
    pauseButton.setAttribute('aria-pressed', 'false');

    const setPausedState = (paused) => {
      carousel.dataset.productHighlightsPaused = paused ? 'true' : 'false';

      if (paused) {
        instance.autoplay.stop();
        if (typeof instance.getTranslate === 'function' && typeof instance.setTranslate === 'function') {
          const currentTranslate = instance.getTranslate();
          if (typeof instance.setTransition === 'function') instance.setTransition(0);
          instance.setTranslate(currentTranslate);
          if (typeof instance.updateActiveIndex === 'function') instance.updateActiveIndex();
          if (typeof instance.updateSlidesClasses === 'function') instance.updateSlidesClasses();
        }
        if (pauseIcon) {
          pauseIcon.classList.remove('un-icon-pause-circle');
          pauseIcon.classList.add('un-icon-play-circle');
        }
        pauseButton.setAttribute('aria-label', 'Riprendi animazione');
        pauseButton.setAttribute('aria-pressed', 'true');
        return;
      }

      const isHovering = carousel.dataset.productHighlightsHoverState === 'true';
      const nextSpeed = isHovering
        ? PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW
        : PRODUCT_HIGHLIGHTS_SWIPER_SPEED;
      setProductHighlightsSwiperSpeed(instance, nextSpeed);
      if (instance.params?.loop && typeof instance.slideToLoop === 'function') {
        const targetIndex = Number.isFinite(instance.realIndex) ? instance.realIndex : 0;
        instance.slideToLoop(targetIndex, 0, false);
      } else if (typeof instance.slideTo === 'function') {
        const targetIndex = instance.isEnd ? 0 : instance.activeIndex || 0;
        instance.slideTo(targetIndex, 0, false);
      }

      if (typeof instance.setTransition === 'function') instance.setTransition(nextSpeed);
      if (typeof instance.update === 'function') instance.update();
      if (instance.autoplay?.stop) instance.autoplay.stop();
      if (instance.autoplay?.start) instance.autoplay.start();
      if (pauseIcon) {
        pauseIcon.classList.remove('un-icon-play-circle');
        pauseIcon.classList.add('un-icon-pause-circle');
      }
      pauseButton.setAttribute('aria-label', 'Pausa animazione');
      pauseButton.setAttribute('aria-pressed', 'false');
    };

    pauseButton.addEventListener('click', () => {
      const isPaused = carousel.dataset.productHighlightsPaused === 'true';
      setPausedState(!isPaused);
    });

    setPausedState(carousel.dataset.productHighlightsPaused === 'true');
  };

  if (carousel.swiper) {
    bindPauseControls(carousel.swiper);
  } else {
    carousel.addEventListener('product-highlights-swiper-ready', (event) => {
      bindPauseControls(event.detail);
    }, { once: true });
  }
}

/**
 * @param {HTMLElement} target
 * @returns {Promise<void>}
 */
export default async function decorateProductHighlightsWidget(target) {
  const section = resolveSection(target);
  if (!section) return;

  const status = section.getAttribute(DECORATED_ATTR);
  if (status === 'true' || status === 'pending') return;

  section.setAttribute(DECORATED_ATTR, 'pending');
  await ensureStylesLoaded();

  try {
    await decorateWidgetSection(section, section.querySelector(`.${WIDGET_CLASS}`));
  } finally {
    if (section.getAttribute(DECORATED_ATTR) === 'pending') {
      section.removeAttribute(DECORATED_ATTR);
    }
  }
}

/**
 * @param {HTMLElement} block
 * @returns {Promise<boolean>}
 */
export async function maybeDecorateProductHighlightsWidgetFromCarousel(block) {
  if (!block?.classList?.contains(CAROUSEL_CLASS)) return false;

  const section = resolveSection(block);
  if (!section) return false;

  const status = section.getAttribute(DECORATED_ATTR);
  if (status === 'true') return true;
  if (status === 'pending') return false;

  const hasTextBlock = !!section.querySelector('.text-block');
  const hasWidgetMeta = Boolean(
    getDatasetValue(section, 'logo')
    || getDatasetValue(section, 'standardButtonLabel'),
  );

  if (!hasTextBlock && !hasWidgetMeta && !section.classList.contains(WIDGET_CLASS)) return false;

  await decorateProductHighlightsWidget(section);
  return false;
}
// #endregion
