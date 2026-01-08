import { createButton } from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';
import { createIconButton } from '@unipol-ds/components/atoms/buttons/icon-button/icon-button.js';
import { loadCSS } from '../../scripts/aem.js';
import decorateProductHighlightsCarousel, {
  PRODUCT_HIGHLIGHTS_SWIPER_SPEED,
  PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW,
  setProductHighlightsSwiperSpeed,
} from '../product-highlights-carousel/product-highlights-carousel.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../constants/index.js';
import { isAuthorMode } from '../../scripts/utils.js';

// #region CONSTANTS
const WIDGET_CLASS = 'product-highlights-widget';
const PANEL_CLASS = 'product-highlights-widget-panel';
const DECORATED_ATTR = 'data-product-highlights-widget';
const OBSERVER_KEY = '__productHighlightsObserver';
const UPDATING_ATTR = 'data-product-highlights-updating';
// #endregion

// #region HELPERS
let stylesLoaded = false;
let stylesLoadingPromise = null;
/**
 * Ensures widget-related styles are loaded once.
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
 * Reads a dataset value with case-insensitive fallback.
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
 * Appends a child to a parent when it exists.
 * @param {HTMLElement} parent
 * @param {HTMLElement|null} child
 */
const appendIfPresent = (parent, child) => {
  if (child) parent.appendChild(child);
};

const waitForProductHighlightsSwiper = (carousel, timeoutMs = 2000) => new Promise((resolve) => {
  if (!carousel) {
    resolve(null);
    return;
  }
  if (carousel.swiper) {
    resolve(carousel.swiper);
    return;
  }

  const start = window.performance?.now?.() || Date.now();
  let resolved = false;
  let rafId = 0;

  const settle = (value) => {
    if (resolved) return;
    resolved = true;
    if (rafId) cancelAnimationFrame(rafId);
    resolve(value);
  };

  const tick = () => {
    if (carousel.swiper) {
      settle(carousel.swiper);
      return;
    }
    const now = window.performance?.now?.() || Date.now();
    if (now - start >= timeoutMs) {
      settle(null);
      return;
    }
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
});
// #endregion

// #region CREATE
/**
 * Creates a product highlights widget panel.
 * @param {Object} [options]
 * @param {HTMLElement|null} [options.root]
 * @param {HTMLElement|null} [options.carousel]
 * @param {HTMLElement|null} [options.textBlockWrapper]
 * @param {HTMLElement|null} [options.textBlock]
 * @param {string} [options.logoSrc]
 * @param {string} [options.logoAlt]
 * @param {string} [options.logoSecondarySrc]
 * @param {string} [options.logoSecondaryAlt]
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
  logoSecondarySrc = '',
  logoSecondaryAlt = '',
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

  if (logoSrc || logoSecondarySrc) {
    const logo = document.createElement('div');
    logo.className = 'product-highlights-widget-logo';
    if (logoSrc) {
      const img = document.createElement('img');
      img.src = logoSrc;
      img.alt = logoAlt || '';
      logo.appendChild(img);
    }
    if (logoSecondarySrc) {
      const subLogo = document.createElement('div');
      subLogo.className = 'product-highlights-widget-logo-secondary';
      const subImg = document.createElement('img');
      subImg.src = logoSecondarySrc;
      subImg.alt = logoSecondaryAlt || '';
      subLogo.appendChild(subImg);
      logo.appendChild(subLogo);
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
 * Parses a product highlights widget section.
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
  const logoSrc = getDatasetValue(section, 'logo');
  const logoAlt = getDatasetValue(section, 'logoAlt');
  const logoSecondarySrc = getDatasetValue(section, 'logoSecondary');
  const logoSecondaryAlt = getDatasetValue(section, 'logoSecondaryAlt');

  const standardButtonLabel = getDatasetValue(section, 'standardButtonLabel');
  const buttonLabel = standardButtonLabel;

  const standardButtonVariant = getDatasetValue(section, 'standardButtonVariant');
  const rawVariant = String(
    standardButtonVariant || BUTTON_VARIANTS.SECONDARY,
  ).trim().toLowerCase();
  const resolvedVariant = Object.values(BUTTON_VARIANTS).includes(rawVariant)
    ? rawVariant
    : BUTTON_VARIANTS.SECONDARY;

  const standardButtonHref = getDatasetValue(section, 'standardButtonHref');
  const buttonHref = standardButtonHref;

  const standardButtonOpenInNewTab = getDatasetValue(section, 'standardButtonOpenInNewTab');
  const buttonOpenInNewTab = String(
    standardButtonOpenInNewTab || '',
  ).trim().toLowerCase() === 'true';

  const standardButtonSize = getDatasetValue(section, 'standardButtonSize');
  const rawIconSize = String(standardButtonSize || BUTTON_ICON_SIZES.MEDIUM)
    .trim()
    .toLowerCase();
  const resolvedIconSize = Object.values(BUTTON_ICON_SIZES).includes(rawIconSize)
    ? rawIconSize
    : BUTTON_ICON_SIZES.MEDIUM;

  const buttonLeftIcon = getDatasetValue(section, 'standardButtonLeftIcon');
  const buttonRightIcon = getDatasetValue(section, 'standardButtonRightIcon');

  const buttonConfig = buttonLabel && buttonLabel.trim()
    ? {
      label: buttonLabel.trim(),
      href: buttonHref,
      openInNewTab: buttonOpenInNewTab,
      variant: resolvedVariant,
      iconSize: resolvedIconSize,
      leftIcon: buttonLeftIcon,
      rightIcon: buttonRightIcon,
    }
    : null;

  /*
   * Root & wrapper
   */
  const panelRoot = block?.classList?.contains(PANEL_CLASS)
    ? block
    : (block && block !== section && block.classList?.contains(WIDGET_CLASS) ? block : null)
      || section.querySelector(`:scope > .${PANEL_CLASS}`);
  const sectionWrapper = section.querySelector(':scope > .default-content-wrapper');
  const panelWrapper = panelRoot && panelRoot !== section
    ? panelRoot.querySelector(':scope > .default-content-wrapper')
    : null;
  const wrappers = [sectionWrapper, panelWrapper].filter(Boolean);

  /*
   * Return
   */
  return {
    carousel,
    textBlock,
    textBlockWrapper,
    logoSrc,
    logoAlt,
    logoSecondarySrc,
    logoSecondaryAlt,
    buttonConfig,
    panelRoot,
    wrappers,
  };
}
// #endregion

// #region DECORATE
const shouldRebuildFromMutation = (mutation) => {
  if (mutation.type === 'attributes') {
    const { attributeName } = mutation;
    if (!attributeName) return false;
    if (attributeName === DECORATED_ATTR || attributeName === UPDATING_ATTR) return false;
    return attributeName.startsWith('data-');
  }
  return mutation.type === 'childList';
};

const attachAuthoringObserver = (section) => {
  if (!section || section[OBSERVER_KEY]) return;
  let scheduled = false;

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (section.getAttribute(UPDATING_ATTR) === 'true') return;
      decorateWidgetSection(section, section.querySelector(`.${PANEL_CLASS}`), { force: true });
    });
  };

  const observer = new MutationObserver((mutations) => {
    if (section.getAttribute(UPDATING_ATTR) === 'true') return;
    if (!mutations.some(shouldRebuildFromMutation)) return;
    schedule();
  });

  observer.observe(section, {
    attributes: true,
    childList: true,
    subtree: false,
  });

  section[OBSERVER_KEY] = observer;
};

/**
 * Decorates a widget section by composing the panel.
 * @param {HTMLElement} section
 * @param {HTMLElement|null} block
 * @param {Object} [options]
 * @param {boolean} [options.force=false]
 * @returns {Promise<void>}
 */
async function decorateWidgetSection(section, block, { force = false } = {}) {
  if (!section) return;
  const isAuthoring = isAuthorMode(section);
  if (!force && !isAuthoring && section.getAttribute(DECORATED_ATTR) === 'true') return;
  if (isAuthoring) section.setAttribute(UPDATING_ATTR, 'true');

  try {
    await ensureStylesLoaded();

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
      logoSecondarySrc,
      logoSecondaryAlt,
      buttonConfig,
      panelRoot,
      wrappers,
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
      logoSecondarySrc,
      logoSecondaryAlt,
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
    wrappers.forEach((wrapper) => {
      if (wrapper && wrapper.isConnected) wrapper.remove();
    });
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

    await decorateProductHighlightsCarousel(carousel);
    const swiperInstance = await waitForProductHighlightsSwiper(carousel);

    /*
     * Pause
     */
    const pauseButton = panel.querySelector('.product-highlights-widget-pause');
    const pauseIcon = pauseButton?.querySelector('.icon');

    const bindPauseControls = (instance) => {
      if (!pauseButton || pauseButton.dataset.productHighlightsPauseBound === 'true') return;
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
        instance.autoplay.start();
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

    if (pauseButton) {
      if (swiperInstance) {
        bindPauseControls(swiperInstance);
      } else {
        carousel.addEventListener('product-highlights-swiper-ready', (event) => {
          bindPauseControls(event.detail);
        }, { once: true });
        const fallbackInstance = await waitForProductHighlightsSwiper(carousel, 6000);
        if (fallbackInstance) bindPauseControls(fallbackInstance);
      }
    }
  } finally {
    if (isAuthoring) {
      setTimeout(() => section.removeAttribute(UPDATING_ATTR), 0);
      attachAuthoringObserver(section);
    }
  }
}

/**
 * Decorates product highlights widget sections in the given scope.
 * @param {HTMLElement|Document} block
 * @returns {Promise<void>}
 */
export default async function decorateProductHighlightsWidget(block) {
  await ensureStylesLoaded();

  /*
   * Scope
   */
  const scope = block instanceof Element ? block : document;
  const sections = [];

  if (block instanceof Element) {
    if (block.classList.contains('product-highlights-carousel')) {
      const section = block.closest('.section');
      if (section) sections.push(section);
    } else if (block.classList.contains('section') || block.classList.contains(WIDGET_CLASS)) {
      const section = block.classList.contains('section') ? block : block.closest('.section');
      if (section) sections.push(section);
    }
  }

  /*
   * Sections
   */
  if (!sections.length) {
    sections.push(...Array.from(scope.querySelectorAll(`.section.${WIDGET_CLASS}`)));
  }

  if (!sections.length) {
    sections.push(
      ...Array.from(scope.querySelectorAll('.section'))
        .filter((section) => section.querySelector('.product-highlights-carousel')),
    );
  }

  /*
   * Decorate
   */
  const sectionList = sections.filter((section, index, array) => array.indexOf(section) === index);
  (await Promise.all(sectionList)).forEach(async (section) => {
    await decorateWidgetSection(section, section.querySelector(`.${PANEL_CLASS}`));
  });
}
// #endregion
