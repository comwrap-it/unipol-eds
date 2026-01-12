import { loadCSS } from '../../scripts/aem.js';

// #region CONSTANTS
const WIDGET_CLASS = 'info-pillars-widget';
const DECORATED_ATTR = 'data-info-pillars-widget';
const CARD_CLASS = 'text-card';
// #endregion

// #region HELPERS
let stylesLoaded = false;
let stylesLoadingPromise = null;

async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  if (!stylesLoadingPromise) {
    stylesLoadingPromise = (async () => {
      await Promise.all([
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/info-pillars/info-pillars.css`,
        ),
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/text-block/text-block.css`,
        ),
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/text-card/text-card.css`,
        ),
      ]);
      stylesLoaded = true;
    })();
  }
  await stylesLoadingPromise;
}

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement|null} child
 */
const appendIfPresent = (parent, child) => {
  if (child) parent.appendChild(child);
};

/**
 * @param {HTMLElement} block
 * @returns {Object}
 */
const resolveCardCandidates = (block) => {
  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const container = wrapper || block;
  const candidates = Array.from(container.children);
  const cardBlocks = candidates
    .map((child) => {
      if (child.classList?.contains(CARD_CLASS)) return child;
      return child.querySelector?.(`:scope > .${CARD_CLASS}`) || null;
    })
    .filter(Boolean);
  return {
    wrapper,
    candidates,
    cardBlocks,
  };
};
// #endregion

// #region CREATE
/**
 * @param {Object} [options]
 * @param {HTMLElement|null} [options.root]
 * @param {HTMLElement|null} [options.textBlockWrapper]
 * @param {HTMLElement|null} [options.textBlock]
 * @param {HTMLElement[]} [options.cards]
 * @returns {HTMLElement}
 */
export function createInfoPillarsWidget({
  root = null,
  textBlockWrapper = null,
  textBlock = null,
  cards = [],
} = {}) {
  const panel = root || document.createElement('div');
  panel.classList.add('info-pillars-widget-panel');
  panel.textContent = '';

  const header = document.createElement('div');
  header.className = 'info-pillars-widget-header';
  appendIfPresent(header, textBlockWrapper || textBlock);
  if (header.childElementCount) panel.appendChild(header);

  const cardsWrap = document.createElement('div');
  cardsWrap.className = 'info-pillars-widget-cards';
  cards.forEach((card) => appendIfPresent(cardsWrap, card));
  panel.appendChild(cardsWrap);

  return panel;
}
// #endregion

// #region DECORATE
/**
 * @param {HTMLElement} block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  if (!block) return;

  const section = block.closest('.section');
  if (!section || section.getAttribute(DECORATED_ATTR) === 'true') return;

  await ensureStylesLoaded();

  const textBlock = section.querySelector('.text-block');
  const textBlockWrapper = textBlock ? textBlock.closest('.text-block-wrapper') : null;

  const { wrapper, candidates, cardBlocks } = resolveCardCandidates(block);
  const items = cardBlocks.length ? cardBlocks : candidates;

  const { default: decorateTextCard } = await import('../text-card/text-card.js');
  const cards = (await Promise.all(items.map(async (item) => {
    if (!item) return null;
    const card = item.classList?.contains(CARD_CLASS)
      ? item
      : item.querySelector?.(`:scope > .${CARD_CLASS}`) || item;
    if (!card.classList.contains(CARD_CLASS)) card.classList.add(CARD_CLASS);
    await decorateTextCard(card);
    card.classList.add('reveal-in-up');
    return card;
  }))).filter(Boolean);

  const panel = createInfoPillarsWidget({
    root: block,
    textBlockWrapper,
    textBlock,
    cards,
  });

  if (!panel.parentElement) section.appendChild(panel);
  if (wrapper && wrapper.isConnected) wrapper.remove();

  section.classList.add(WIDGET_CLASS);
  section.setAttribute(DECORATED_ATTR, 'true');
}
// #endregion
