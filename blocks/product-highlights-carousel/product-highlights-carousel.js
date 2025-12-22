// #region CONSTANTS
const CAROUSEL_CLASS = 'product-highlights-carousel';
const TRACK_CLASS = 'product-highlights-carousel-track';
// #endregion

// #region HELPERS
let isStylesLoaded = false;
let stylesLoadingPromise = null;
/**
 * Ensures the carousel and card styles are loaded once.
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  if (!stylesLoadingPromise) {
    stylesLoadingPromise = (async () => {
      const { loadCSS } = await import('../../scripts/aem.js');
      await Promise.all([
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/product-highlights-carousel/product-highlights-carousel.css`,
        ),
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/photo-card/photo-card.css`,
        ),
      ]);
      isStylesLoaded = true;
    })();
  }
  await stylesLoadingPromise;
}
// #endregion

// #region CREATE
/**
 * Creates or decorates a product highlights carousel.
 * @param {Object} [options]
 * @param {Array<HTMLElement|Object>} [options.cards]
 * @param {HTMLElement|null} [options.root]
 * @param {HTMLElement|null} [options.track]
 * @returns {Promise<HTMLElement>}
 */
export async function createProductHighlightsCarousel({
  cards = [],
  root = null,
  track = null,
} = {}) {
  /*
   * Root
   */
  const carousel = root || document.createElement('div');
  carousel.classList.add(CAROUSEL_CLASS);

  /*
   * Track
   */
  const trackElement = track
    || carousel.querySelector(`:scope > .${TRACK_CLASS}`)
    || document.createElement('div');
  trackElement.classList.add(TRACK_CLASS);
  if (trackElement.parentElement !== carousel) carousel.appendChild(trackElement);

  /*
   * Cards
   */
  const { default: decoratePhotoCard, createPhotoCard } = await import('../photo-card/photo-card.js');
  const cardElements = await Promise.all((cards || []).map(async (card) => {
    if (card instanceof HTMLElement) {
      await decoratePhotoCard(card);
      return card;
    }
    return createPhotoCard(card);
  }));

  cardElements.forEach((cardElement) => {
    if (cardElement && cardElement.parentElement !== trackElement) {
      trackElement.appendChild(cardElement);
    }
  });

  return carousel;
}
// #endregion

// #region PARSE
/**
 * Parses the carousel block for cards and/or existing track.
 * @param {HTMLElement} block
 * @returns {{track: HTMLElement|null, cards: HTMLElement[]}}
 */
function parse(block) {
  /*
   * Existing track
   */
  const existingTrack = block.querySelector(`:scope > .${TRACK_CLASS}`);
  if (existingTrack) {
    return { track: existingTrack, cards: Array.from(existingTrack.children) };
  }

  /*
   * Rows
   */
  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const cards = wrapper ? Array.from(wrapper.children) : Array.from(block.children);

  return { track: wrapper, cards };
}
// #endregion

// #region DECORATE
/**
 * Decorates the product highlights carousel block.
 * @param {HTMLElement} block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const props = parse(block);
  await createProductHighlightsCarousel({ root: block, ...props });
}
// #endregion
