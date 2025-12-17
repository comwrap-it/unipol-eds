let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/product-highlights-carousel/product-highlights-carousel.css`,
    ),
  ]);
  isStylesLoaded = true;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const items = wrapper ? Array.from(wrapper.children) : Array.from(block.children);

  const track = document.createElement('div');
  track.className = 'product-highlights-carousel-track';

  const { default: decoratePhotoCard } = await import('../atoms/photo-card/photo-card.js');

  await Promise.all(items.map(async (item) => {
    await decoratePhotoCard(item);
  }));

  items.forEach((item) => track.appendChild(item));

  block.textContent = '';
  block.appendChild(track);

  const handleProductHighlightsWidget = await import(
    '../product-highlights-widget/product-highlights-widget.js'
  );

  await handleProductHighlightsWidget.default();
}
