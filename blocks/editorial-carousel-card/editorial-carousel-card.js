/**
 * Editorial Carousel Card
 *
 * Renders a card from Universal Editor-authored rows.
 *
 * The Universal Editor serializes each field as a row element. Over time, the
 * underlying content model changed, which shifted the row indices of the image
 * and its alternative text. This module supports both the current and a legacy
 * layout by selecting the first matching entry in `IMAGE_ROW_CANDIDATES`.
 */

import { createLinkButtonFromRows } from '../atoms/buttons/link-button/link-button.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * @typedef {Object} ImageBreakpoint
 * @property {string} media CSS media query passed to `createOptimizedPicture`.
 * @property {string} width Target width (in pixels, as a string).
 */

/**
 * @typedef {Object} CardClasses
 * @property {string} container
 * @property {string} image
 * @property {string} content
 * @property {string} text
 * @property {string} cta
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} RowIndexConfig
 * @property {number} title
 * @property {number} description
 * @property {number} ctaStart Inclusive.
 * @property {number} ctaEnd Exclusive.
 */

/**
 * @typedef {Object} ImageRowCandidate
 * @property {string} id Human readable layout identifier.
 * @property {number} imageIndex Row index containing the image/picture/link.
 * @property {number} altIndex Row index containing the alt text.
 */

/**
 * @typedef {'standard-button' | 'link-button'} CtaLayout
 */

/**
 * @typedef {Object} EditorialCarouselCardModel
 * @property {HTMLElement | null} titleRow
 * @property {HTMLElement | null} descriptionRow
 * @property {HTMLElement[]} ctaRows Normalized rows for `createLinkButtonFromRows`.
 * @property {CtaLayout} ctaLayout Detected layout used for normalization.
 * @property {number} ctaRawCount
 * @property {number} ctaNormalizedCount
 * @property {HTMLElement | null} imageRow
 * @property {HTMLElement | null} imageAltRow
 * @property {string | null} imageLayoutId Selected `IMAGE_ROW_CANDIDATES` id.
 * @property {number | null} imageIndex Selected image row index.
 * @property {number | null} imageAltIndex Selected alt row index.
 * @property {number} rowCount Total rows detected.
 */

/**
 * @typedef {Object} CreateTextFromRowOptions
 * @property {string} [existingSelector]
 *   Selector used to preserve an authored semantic element (e.g. a heading).
 * @property {keyof HTMLElementTagNameMap} fallbackTag
 *   Tag name used when no existing element is found.
 * @property {string} className Class applied to the returned element.
 * @property {boolean} [requireText=true]
 *   When true, returns null if the resulting element has no visible text.
 */

// #region CONFIGS

/** @type {ImageBreakpoint[]} */
const IMAGE_BREAKPOINTS = [
  { media: '(min-width: 769)', width: '316' },
  { media: '(max-width: 768)', width: '240' },
  { media: '(max-width: 392)', width: '343' },
];

/** @type {Readonly<CardClasses>} */
const CARD_CLASSES = {
  container: 'editorial-carousel-card-container',
  image: 'editorial-carousel-card-image',
  content: 'editorial-carousel-card-content',
  text: 'editorial-carousel-card-text',
  cta: 'button-subdescription',
  title: 'title',
  description: 'description',
};

/**
 * Indices for the current content model.
 *
 * - `title`: title row
 * - `description`: description row
 * - `ctaStart..ctaEnd`: CTA configuration rows (from the standard-button model)
 *
 * Image indices are handled via `IMAGE_ROW_CANDIDATES`.
 *
 * @type {Readonly<RowIndexConfig>}
 */
const ROW_INDEX = {
  title: 0,
  description: 1,
  ctaStart: 2,
  ctaEnd: 9, // exclusive
};

/**
 * Candidate mappings used to locate the image and alt-text rows.
 *
 * Universal Editor stores fields as sequential row elements. When the model
 * changes, later fields can shift indices in the resulting DOM.
 *
 * `parseCardRows()` iterates this list and selects the first candidate whose
 * `imageIndex` row contains image-like content (`picture`, `img`, or an `a`
 * pointing to an asset).
 *
 * Current layout:
 * - image: `rows[10]`
 * - alt:   `rows[11]`
 *
 * Legacy layout:
 * - image: `rows[13]`
 * - alt:   `rows[14]`
 *
 * @type {ReadonlyArray<ImageRowCandidate>}
 */
const IMAGE_ROW_CANDIDATES = [
  { id: 'current', imageIndex: 10, altIndex: 11 },
  { id: 'legacy', imageIndex: 13, altIndex: 14 },
];

/**
 * Allowed standard-button variants.
 * Used to infer if CTA rows are authored using the standard-button model.
 *
 * @type {Set<'primary' | 'secondary' | 'accent'>}
 */
const STANDARD_BUTTON_VARIANTS = new Set(['primary', 'secondary', 'accent']);

// #endregion

// #region UTILS

/** @type {boolean} */
let isStylesLoaded = false;

/**
 * Loads any CSS dependencies needed by the card.
 *
 * The decoration function can run multiple times (e.g. Universal Editor
 * re-renders after edits), so this function memoizes the request.
 *
 * @returns {Promise<void>} Resolves when styles are loaded.
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/insurance-product-card/insurance-product-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

/**
 * Best-effort check for URL-like strings.
 *
 * This is used to infer the CTA layout when the authored rows can be in
 * different shapes (e.g. link vs variant).
 *
 * @param {string} value
 * @returns {boolean}
 */
function looksLikeUrl(value) {
  const v = (value || '').trim().toLowerCase();
  if (!v) return false;
  return (
    v === '#'
    || v.startsWith('/')
    || v.startsWith('http://')
    || v.startsWith('https://')
    || v.startsWith('mailto:')
    || v.startsWith('tel:')
  );
}

// #endregion

// #region DOM

/**
 * Creates (or reuses) a semantic element from an authored row.
 *
 * - If `existingSelector` matches, the existing element is reused (preserving
 *   semantics like `h2`, `p`, etc.).
 * - Otherwise, a new element is created using `fallbackTag` and the row
 *   children are moved into it.
 * - Universal Editor instrumentation is moved from the row container to the
 *   returned element.
 *
 * @param {HTMLElement | null | undefined} row Row element.
 * @param {CreateTextFromRowOptions} options
 * @returns {HTMLElement | null} The created element, or null if empty/missing.
 */
function createTextFromRow(
  row,
  {
    existingSelector,
    fallbackTag,
    className,
    requireText = true,
  },
) {
  if (!row) return null;

  const existing = existingSelector
    ? row.querySelector(existingSelector)
    : null;
  const element = existing || document.createElement(fallbackTag);
  element.className = className;

  if (!existing) {
    while (row?.firstChild) {
      element.appendChild(row.firstChild);
    }
  }

  moveInstrumentation(row, element);

  if (requireText && !element.textContent?.trim()) return null;
  return element;
}

/**
 * Renders the final card DOM from the parsed model.
 *
 * @param {EditorialCarouselCardModel} model Parsed card model.
 * @param {HTMLElement} sourceBlock Original block used to preserve instrumentation.
 * @returns {HTMLElement} Card container.
 */
function renderCard(model, sourceBlock) {
  /**
   * CREATE: card root and preserve instrumentation.
   */
  const card = document.createElement('div');
  card.className = CARD_CLASSES.container;

  moveInstrumentation(sourceBlock, card);

  if (sourceBlock.dataset.blockName) {
    card.dataset.blockName = sourceBlock.dataset.blockName;
  }

  card.classList.add('card-block');

  /**
   * CREATE: image section.
   * - Preserve an authored <picture> when present.
   * - Otherwise build an optimized picture from an <img> or <a>.
   */
  let imageSection = null;

  if (model.imageRow) {
    const imageSectionContainer = document.createElement('div');
    imageSectionContainer.className = CARD_CLASSES.image;

    const altText = model.imageAltRow?.textContent?.trim() || '';
    const picture = model.imageRow.querySelector('picture');

    if (picture) {
      picture.querySelector('img')?.setAttribute('alt', altText);
      imageSectionContainer.appendChild(picture);
      imageSection = imageSectionContainer;
    } else {
      const img = model.imageRow.querySelector('img');
      const link = model.imageRow.querySelector('a');
      const src = img?.src || link?.href;

      if (src) {
        const optimized = createOptimizedPicture(
          src,
          altText,
          false,
          IMAGE_BREAKPOINTS,
        );

        const optimizedImg = optimized.querySelector('img');
        if (optimizedImg && img) moveInstrumentation(img, optimizedImg);
        if (optimizedImg && link) moveInstrumentation(link, optimizedImg);

        imageSectionContainer.appendChild(optimized);
        imageSection = imageSectionContainer;
      }
    }
  }

  /**
   * CREATE: text section (title + description).
   */
  const textContainer = document.createElement('div');
  textContainer.className = CARD_CLASSES.text;

  const title = createTextFromRow(model.titleRow, {
    existingSelector: 'h1, h2, h3, h4, h5, h6',
    fallbackTag: 'h3',
    className: CARD_CLASSES.title,
    requireText: true,
  });

  const description = createTextFromRow(model.descriptionRow, {
    existingSelector: 'p',
    fallbackTag: 'p',
    className: CARD_CLASSES.description,
    requireText: true,
  });

  if (title) textContainer.appendChild(title);
  if (description) textContainer.appendChild(description);

  const textSection = textContainer.children.length ? textContainer : null;

  /**
   * CREATE: CTA section (link button + optional note).
   */
  let ctaSection = null;

  const linkButton = createLinkButtonFromRows(model.ctaRows);
  if (linkButton) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = CARD_CLASSES.cta;
    ctaContainer.appendChild(linkButton);

    const note = createTextFromRow(model.noteRow, {
      existingSelector: 'p',
      fallbackTag: 'p',
      className: CARD_CLASSES.note,
      requireText: true,
    });

    if (note) ctaContainer.appendChild(note);

    ctaSection = ctaContainer;
  }

  /**
   * ASSEMBLE: card sections.
   */
  if (imageSection) card.appendChild(imageSection);

  const content = document.createElement('div');
  content.className = CARD_CLASSES.content;

  if (textSection) content.appendChild(textSection);
  if (ctaSection) content.appendChild(ctaSection);

  if (content.children.length) {
    card.appendChild(content);
  }

  return card;
}

/**
 * Parses the authored block DOM into a normalized model.
 *
 * Current row layout (after wrapper extraction):
 * - 0: Title
 * - 1: Description
 * - 2..8: CTA configuration (standard-button fields)
 * - 9: Note
 * - 10: Image
 * - 11: Image alt text
 *
 * Legacy layouts may shift image indices; see `IMAGE_ROW_CANDIDATES`.
 *
 * @param {HTMLElement} block Editorial card block.
 * @returns {EditorialCarouselCardModel}
 */
function parseCardRows(block) {
  const wrapper = block.querySelector('.default-content-wrapper');
  const rows = wrapper ? Array.from(wrapper.children) : Array.from(block.children);

  const match = IMAGE_ROW_CANDIDATES.find(({ imageIndex }) => Boolean(
    rows[imageIndex]
      && (
        rows[imageIndex].querySelector('picture')
        || rows[imageIndex].querySelector('img')
        || rows[imageIndex].querySelector('a')
      ),
  ));

  const imageRow = match ? rows[match.imageIndex] : null;
  const altRow = match ? rows[match.altIndex] : null;
  const layoutId = match?.id || null;
  const imageIndex = match?.imageIndex ?? null;
  const altIndex = match?.altIndex ?? null;

  const rawCtaRows = rows.slice(ROW_INDEX.ctaStart, ROW_INDEX.ctaEnd);

  /** @type {CtaLayout} */
  let ctaLayout = 'standard-button';

  const second = rawCtaRows[1]?.textContent?.trim()?.toLowerCase() || '';
  if (STANDARD_BUTTON_VARIANTS.has(second)) ctaLayout = 'standard-button';

  const hasLinkInSecond = Boolean(rawCtaRows[1]?.querySelector('a')) || looksLikeUrl(second);
  const thirdText = rawCtaRows[2]?.textContent?.trim() || '';
  const hasLinkInThird = Boolean(rawCtaRows[2]?.querySelector('a')) || looksLikeUrl(thirdText);

  if (hasLinkInSecond && !hasLinkInThird) ctaLayout = 'link-button';
  if (!hasLinkInSecond && hasLinkInThird) ctaLayout = 'standard-button';

  let normalizedCtaRows = rawCtaRows.filter(Boolean);
  if (ctaLayout === 'standard-button') {
    const labelRow = rawCtaRows[0];
    const hrefRow = rawCtaRows[2];
    const openInNewTabRow = rawCtaRows[3];
    const sizeRow = rawCtaRows[4];
    const leftIconRow = rawCtaRows[5];
    const rightIconRow = rawCtaRows[6];

    normalizedCtaRows = [
      labelRow,
      hrefRow,
      openInNewTabRow,
      leftIconRow,
      rightIconRow,
      sizeRow,
      sizeRow,
    ].filter(Boolean);
  }

  return {
    titleRow: rows[ROW_INDEX.title] || null,
    descriptionRow: rows[ROW_INDEX.description] || null,
    ctaRows: normalizedCtaRows,
    ctaLayout,
    ctaRawCount: rawCtaRows.length,
    ctaNormalizedCount: normalizedCtaRows.length,
    imageRow,
    imageAltRow: altRow,
    imageLayoutId: layoutId,
    imageIndex,
    imageAltIndex: altIndex,
    rowCount: rows.length,
  };
}

// #endregion

// #region DECORATE

/**
 * Decorates an Editorial Carousel Card block.
 *
 * - Avoids re-decoration when Universal Editor re-renders.
 * - Loads required CSS only once.
 * - Preserves instrumentation by moving it from authored rows onto the
 *   generated semantic elements.
 *
 * @param {HTMLElement} block Block instance to decorate.
 * @returns {Promise<void>}
 */
export default async function decorateEditorialCarouselCard(block) {
  if (!block) return;
  if (block.classList.contains('card-block')) return;

  const existingCard = block.querySelector(
    `:scope > .${CARD_CLASSES.container}.card-block`,
  );
  if (existingCard) return;

  await ensureStylesLoaded();

  const model = parseCardRows(block);
  const card = renderCard(model, block);

  block.replaceChildren(card);
}

// #endregion
