import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// #region CONSTANTS
export const PHOTO_CARD_SIZES = { S: 's', M: 'm' };

/**
 * serve a createOptimizedPicture() per generare immagini
 * responsive/ottimizzate (qualità/performance)
 */
const IMAGE_BREAKPOINTS_BY_SIZE = {
  [PHOTO_CARD_SIZES.S]: [
    { media: '(min-width: 1200px)', width: '380' },
    { media: '(min-width: 768px)', width: '380' },
    { width: '343' },
  ],
  [PHOTO_CARD_SIZES.M]: [
    { media: '(min-width: 1200px)', width: '870' },
    { media: '(min-width: 768px)', width: '870' },
    { width: '343' },
  ],
};

// #endregion

// #region HELPERS
let isStylesLoaded = false;
let stylesLoadingPromise = null;
/**
 * Ensures the photo card styles are loaded once.
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  if (!stylesLoadingPromise) {
    stylesLoadingPromise = (async () => {
      const { loadCSS } = await import('../../scripts/aem.js');
      await loadCSS(
        `${window.hlx.codeBasePath}/blocks/photo-card/photo-card.css`,
      );
      isStylesLoaded = true;
    })();
  }
  await stylesLoadingPromise;
}

/**
 * Attempts to resolve the photo card size from a raw value.
 * @param {string} value
 * @returns {string|null}
 */
const tryResolvePhotoCardSize = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['m', 'md', 'medium'].includes(normalized)) return PHOTO_CARD_SIZES.M;
  if (['s', 'sm', 'small'].includes(normalized)) return PHOTO_CARD_SIZES.S;
  return null;
};

/**
 * Resolves the photo card size with a default fallback.
 * @param {string} value
 * @returns {string}
 */
const resolvePhotoCardSize = (value) => tryResolvePhotoCardSize(value) || PHOTO_CARD_SIZES.S;

/**
 * Finds the first row matching a property name.
 * @param {HTMLElement[]} rows
 * @param {string} propName
 * @returns {HTMLElement|null}
 */
const findRowByProp = (rows, propName) => {
  if (!rows?.length) return null;
  return rows.find((row) => row?.getAttribute?.('data-aue-prop') === propName
    || row?.getAttribute?.('data-richtext-prop') === propName
    || row?.querySelector?.(`[data-aue-prop="${propName}"], [data-richtext-prop="${propName}"]`))
    || null;
};

/**
 * Returns the value column for a row when present.
 * @param {HTMLElement|null} row
 * @returns {HTMLElement|null}
 */
const getRowValueElement = (row) => {
  if (!row) return null;

  /*
   * Franklin blocks authored as tables often render each "row" as:
   * <div><div>Label</div><div>Value</div></div>
   * In that case we want to parse/move only the "Value" column.
   */
  const cells = row.children;
  if (cells?.length === 2) return cells[1];

  return row;
};

/**
 * Extracts trimmed text content from a row.
 * @param {HTMLElement|null} row
 * @returns {string}
 */
const extractTextContent = (row) => getRowValueElement(row)?.textContent?.trim() || '';

/**
 * Extracts a title fragment from a row.
 * @param {HTMLElement|null} row
 * @returns {DocumentFragment|string}
 */
const extractTitleFromRow = (row) => {
  if (!row) return '';

  const valueElement = getRowValueElement(row);
  const fragment = document.createDocumentFragment();
  // Preserve any existing richtext markup/instrumentation by moving nodes
  while (valueElement?.firstChild) fragment.appendChild(valueElement.firstChild);

  // If there was no markup (or only whitespace), fall back to text
  if (!fragment.textContent?.trim()) return '';
  return fragment;
};
// #endregion

// #region CREATE
/**
 * Creates a photo card element.
 * @param {Object} [options]
 * @returns {HTMLElement}
 */
export function createPhotoCard({
  size = PHOTO_CARD_SIZES.S,
  title = '',
  imageSrc = '',
  imageAlt = '',
  imageElement = null,
  instrumentation = {},
  eager = false,
  root = null,
} = {}) {
  /*
   * Normalize inputs
   */
  const resolvedSize = resolvePhotoCardSize(size);
  const imageBreakpoints = IMAGE_BREAKPOINTS_BY_SIZE[resolvedSize]
    || IMAGE_BREAKPOINTS_BY_SIZE[PHOTO_CARD_SIZES.S];
  const card = root || document.createElement('div');

  /*
   * Root
   */
  card.classList.add('photo-card');
  card.dataset.photoCardSize = resolvedSize;
  card.style.setProperty(
    '--photo-card-size',
    resolvedSize === PHOTO_CARD_SIZES.M ? '1' : '0',
  );

  Object.entries(instrumentation).forEach(([name, value]) => {
    card.setAttribute(name, value);
  });

  /*
   * Media
   */
  let mediaElement = imageElement;
  if (!mediaElement && imageSrc) {
    mediaElement = createOptimizedPicture(
      imageSrc,
      imageAlt,
      eager,
      imageBreakpoints,
    );
  }
  if (mediaElement) {
    const img = mediaElement.tagName === 'IMG'
      ? mediaElement
      : mediaElement.querySelector?.('img');
    if (img) img.setAttribute('alt', imageAlt || '');
  }

  const media = document.createElement('div');
  media.className = 'photo-card-media';
  if (mediaElement) media.appendChild(mediaElement);

  /*
   * Title
   */
  const titleElement = document.createElement('div');
  titleElement.className = 'photo-card-title';
  if (title instanceof Node) {
    titleElement.appendChild(title);
  } else if (typeof title === 'string' && title.trim()) {
    titleElement.textContent = title.trim();
  }

  /*
   * Assemble
   */
  card.textContent = '';
  card.append(media, titleElement);

  return card;
}
// #endregion

// #region PARSE
/**
 * Parses a photo card block.
 * @param {HTMLElement} block
 * @returns {Object}
 */
export function parse(block) {
  /*
   * Rows
   */
  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const rows = wrapper ? Array.from(wrapper.children) : Array.from(block.children);

  const imageRow = findRowByProp(rows, 'image')
    || rows.find((row) => row?.querySelector?.('picture, img, a[href]'))
    || rows[0]
    || null;

  const sizeRow = findRowByProp(rows, 'size')
    || rows.find((row) => tryResolvePhotoCardSize(extractTextContent(row)))
    || null;

  let imageAltRow = findRowByProp(rows, 'imageAlt') || null;
  let titleRow = findRowByProp(rows, 'title') || null;

  // Fallback to positional/heuristic mapping when props are missing
  const candidateTextRows = rows
    .filter((row) => row && row !== imageRow && row !== sizeRow)
    .filter((row) => extractTextContent(row));

  if (!imageAltRow && !titleRow) {
    if (candidateTextRows.length >= 2) {
      [imageAltRow, titleRow] = candidateTextRows;
    } else if (candidateTextRows.length === 1) {
      [titleRow] = candidateTextRows;
    }
  } else {
    if (!titleRow) titleRow = candidateTextRows.find((row) => row !== imageAltRow) || null;
    if (!imageAltRow) imageAltRow = candidateTextRows.find((row) => row !== titleRow) || null;
  }

  /*
   * Values
   */
  const size = resolvePhotoCardSize(extractTextContent(sizeRow));
  const imageAlt = extractTextContent(imageAltRow)
    || imageRow?.querySelector?.('img')?.getAttribute?.('alt')
    || ''; // fallback

  /*
   * Title
   */
  const title = extractTitleFromRow(titleRow);

  /*
   * Media
   */
  let imageSource = null;
  if (imageRow) {
    const valueElement = getRowValueElement(imageRow);
    imageSource = valueElement?.querySelector('picture')
      || valueElement?.querySelector('img')
      || valueElement?.querySelector('a[href]');
  }

  const usesExistingPicture = imageSource?.tagName === 'PICTURE'
    || imageSource?.tagName === 'IMG';

  return {
    size,
    title,
    imageAlt,
    imageElement: usesExistingPicture ? imageSource : null,
    imageSrc: !usesExistingPicture ? imageSource?.href || '' : '',
    refs: {
      imageRow,
      imageSource,
      titleRow,
    },
  };
}
// #endregion

// #region DECTORATE
/**
 * Decorates a photo card block.
 * @param {HTMLElement} block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  if (!block) return;

  /*
   * Styles
   */
  await ensureStylesLoaded();

  if (block.querySelector(':scope > .photo-card-media')) return;

  /*
   * Parse & Create
   */
  const parsed = parse(block);
  const { refs, ...props } = parsed;
  createPhotoCard({ root: block, ...props });

  /*
   * Instrumentation
   */
  const mediaElement = block.querySelector(':scope > .photo-card-media > picture')
    || block.querySelector(':scope > .photo-card-media > img');

  if (mediaElement) {
    if (refs.imageRow) moveInstrumentation(refs.imageRow, mediaElement);
    if (refs.imageSource && refs.imageSource !== mediaElement) {
      moveInstrumentation(refs.imageSource, mediaElement);
    }
  }

  const titleElement = block.querySelector(':scope > .photo-card-title');
  if (titleElement && refs.titleRow) moveInstrumentation(refs.titleRow, titleElement);
}
// #endregion
