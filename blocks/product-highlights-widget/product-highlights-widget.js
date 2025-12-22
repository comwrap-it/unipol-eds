import { loadCSS } from '../../scripts/aem.js';
import decorateProductHighlightsCarousel from '../product-highlights-carousel/product-highlights-carousel.js';
import { createTextBlock } from '../text-block/text-block.js';
import {
  createButton,
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
} from '../atoms/buttons/standard-button/standard-button.js';
import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';

// #region CONSTANTS
const WIDGET_CLASS = 'product-highlights-widget';
const DECORATED_ATTR = 'data-product-highlights-widget';
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
  return section.dataset[name] || section.dataset[String(name || '').toLowerCase()] || '';
};

/**
 * Appends a child to a parent when it exists.
 * @param {HTMLElement} parent
 * @param {HTMLElement|null} child
 */
const appendIfPresent = (parent, child) => {
  if (child) parent.appendChild(child);
};
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
 * @param {string} [options.title]
 * @param {string} [options.description]
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
  title = '',
  description = '',
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
      buttonConfig.variant || BUTTON_VARIANTS.SECONDARY,
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
    const img = document.createElement('img');
    img.src = logoSrc;
    img.alt = logoAlt || '';
    logo.appendChild(img);
    header.appendChild(logo);
  }

  let headerText = textBlockWrapper || textBlock;
  if (!headerText && (title || description)) {
    const titleElement = title ? document.createElement('h2') : null;
    if (titleElement) titleElement.textContent = title;
    const descriptionElement = description ? document.createElement('p') : null;
    if (descriptionElement) descriptionElement.textContent = description;
    const textBlockElement = createTextBlock(titleElement, true, descriptionElement);
    const wrapper = document.createElement('div');
    wrapper.className = 'text-block-wrapper';
    wrapper.appendChild(textBlockElement);
    headerText = wrapper;
  }

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
  const logoAlt = getDatasetValue(section, 'logoAlt') || getDatasetValue(section, 'logoalt');

  const title = getDatasetValue(section, 'title');
  const description = getDatasetValue(section, 'description');

  const standardButtonLabel = getDatasetValue(section, 'standardButtonLabel');
  const legacyButtonLabel = getDatasetValue(section, 'buttonLabel');
  const buttonLabel = standardButtonLabel || legacyButtonLabel;

  const standardButtonVariant = getDatasetValue(section, 'standardButtonVariant');
  const legacyButtonVariant = getDatasetValue(section, 'buttonVariant');
  const rawVariant = String(
    standardButtonVariant || legacyButtonVariant || BUTTON_VARIANTS.SECONDARY,
  ).trim().toLowerCase();
  const resolvedVariant = Object.values(BUTTON_VARIANTS).includes(rawVariant)
    ? rawVariant
    : BUTTON_VARIANTS.SECONDARY;

  const standardButtonHref = getDatasetValue(section, 'standardButtonHref');
  const legacyButtonHref = getDatasetValue(section, 'buttonLink')
    || getDatasetValue(section, 'buttonHref');
  const buttonHref = standardButtonHref || legacyButtonHref;

  const standardButtonOpenInNewTab = getDatasetValue(section, 'standardButtonOpenInNewTab');
  const legacyButtonOpenInNewTab = getDatasetValue(section, 'buttonOpenInNewTab');
  const buttonOpenInNewTab = String(
    standardButtonOpenInNewTab || legacyButtonOpenInNewTab || '',
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
  const panelRoot = block?.classList?.contains(WIDGET_CLASS)
    ? block
    : section.querySelector(`:scope > .${WIDGET_CLASS}`);
  const wrapper = panelRoot?.querySelector(':scope > .default-content-wrapper') || null;

  /*
   * Return
   */
  return {
    carousel,
    textBlock,
    textBlockWrapper,
    logoSrc,
    logoAlt,
    title,
    description,
    buttonConfig,
    panelRoot,
    wrapper,
  };
}
// #endregion

// #region DECORATE
/**
 * Decorates a widget section by composing the panel.
 * @param {HTMLElement} section
 * @param {HTMLElement|null} block
 * @returns {Promise<void>}
 */
async function decorateWidgetSection(section, block) {
  if (!section || section.getAttribute(DECORATED_ATTR) === 'true') return;

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
    title,
    description,
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
    title,
    description,
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
  section.setAttribute(DECORATED_ATTR, 'true');

  await decorateProductHighlightsCarousel(carousel);
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
    await decorateWidgetSection(section, section.querySelector(`.${WIDGET_CLASS}`));
  });
}
// #endregion
