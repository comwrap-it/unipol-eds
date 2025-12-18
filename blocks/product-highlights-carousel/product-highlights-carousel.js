let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/product-highlights-carousel/product-highlights-carousel.css`,
      `${window.hlx.codeBasePath}/blocks/photo-card/photo-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

export async function createProductHighlightsCarousel({
  cards = [],
  root = null,
  track = null,
} = {}) {
  const carousel = root || document.createElement('div');
  carousel.classList.add('product-highlights-carousel');

  const trackElement = track
    || carousel.querySelector(':scope > .product-highlights-carousel-track')
    || document.createElement('div');
  trackElement.classList.add('product-highlights-carousel-track');
  if (trackElement.parentElement !== carousel) carousel.appendChild(trackElement);

  const { default: decoratePhotoCard, createPhotoCard } = await import('../photo-card/photo-card.js');
  await Promise.all((cards || []).forEach((card) => {
    const cardElement = card instanceof HTMLElement
      ? decoratePhotoCard(card)
      : createPhotoCard(card);
    if (cardElement && cardElement.parentElement !== trackElement) {
      trackElement.appendChild(cardElement);
    }
  }));

  return carousel;
}

function parse(block) {
  const existingTrack = block.querySelector(':scope > .product-highlights-carousel-track');
  if (existingTrack) {
    return { track: existingTrack, cards: Array.from(existingTrack.children) };
  }

  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const cards = wrapper ? Array.from(wrapper.children) : Array.from(block.children);

  return { track: wrapper, cards };
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const props = parse(block);
  createProductHighlightsCarousel({ root: block, ...props });
}
