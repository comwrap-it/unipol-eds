import { loadCSS } from '../../scripts/aem.js';
import decoratePhotoCard from '../atoms/photo-card/photo-card.js';
import decorateProductHighlightsWidget from '../product-highlights-widget/product-highlights-widget.js';

let stylesLoaded = false;
async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  await loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/photo-card/photo-card.css`);
  stylesLoaded = true;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();
  await decorateProductHighlightsWidget();

  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const items = wrapper ? Array.from(wrapper.children) : Array.from(block.children);

  const track = document.createElement('div');
  track.className = 'product-highlights-carousel-track';

  items.forEach((item) => {
    decoratePhotoCard(item);
    track.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(track);
}
