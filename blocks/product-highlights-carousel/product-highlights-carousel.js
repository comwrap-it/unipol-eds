let isStylesLoaded = false;
let stylesLoadingPromise = null;
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
  await createProductHighlightsCarousel({ root: block, ...props });
}
