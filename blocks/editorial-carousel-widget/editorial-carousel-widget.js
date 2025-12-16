/**
 * Editorial Carousel Widget
 *
 * Section-level enhancer for Editorial Carousel.
 *
 * Responsibilities:
 * - Reads the section configuration authored in Universal Editor.
 * - Applies optional section theme (`theme-dark`).
 * - Loads widget CSS.
 *
 * Notes:
 * - Swiper initialization is handled by `blocks/editorial-carousel/editorial-carousel.js`.
 * - This widget must not initialize Swiper to avoid double-initialization and navigation bugs.
 */

/**
 * @typedef {Object} EditorialCarouselWidgetModel
 * @property {string | null} rawDarkTheme Raw string value of the toggle.
 * @property {boolean} darkTheme Whether the dark theme is enabled.
 */

// #region CONFIGS

const SELECTORS = {
  section: '.section.editorial-carousel-container',
  fallback: '.editorial-carousel-container',
};

// #endregion

// #region DEPENDENCIES

/** @type {boolean} */
let isStylesLoaded = false;

/**
 * Loads widget CSS once.
 *
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

// #endregion

// #region PARSE

/**
 * Parses the widget configuration from the host section.
 *
 * Universal Editor models the widget fields as sequential child nodes.
 * Current model:
 * - Row 0: widget name (string)
 * - Row 1: dark theme toggle (true/false)
 *
 * @param {HTMLElement} hostSection
 * @returns {EditorialCarouselWidgetModel}
 */
function parseWidgetModel(hostSection) {
  const rows = Array.from(hostSection.children);
  const rawDarkTheme = rows[1]?.textContent?.trim().toLowerCase() ?? null;

  return {
    rawDarkTheme,
    darkTheme: rawDarkTheme === 'true',
  };
}

// #endregion

// #region RENDER

/**
 * Applies the widget model to the section.
 *
 * @param {HTMLElement} hostSection
 * @param {EditorialCarouselWidgetModel} model
 */
function applyWidgetModel(hostSection, model) {
  const section = hostSection.closest('.section') || hostSection;
  section.classList.toggle('theme-dark', model.darkTheme);
}

// #endregion

// #region DECORATE

/**
 * Decorates the Editorial Carousel Widget.
 *
 * @param {HTMLElement} [block]
 * @returns {Promise<void>}
 */
export default async function decorateEditorialCarouselWidget(block) {
  if (block) {
    // no-op: parameter is accepted for block-loader compatibility
  }

  const hostSection = document.querySelector(SELECTORS.section)
    || document.querySelector(SELECTORS.fallback);

  if (!hostSection) return;

  await ensureStylesLoaded();

  const model = parseWidgetModel(hostSection);
  applyWidgetModel(hostSection, model);
}

// #endregion
