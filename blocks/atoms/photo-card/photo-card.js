import { moveInstrumentation } from '../../../scripts/scripts.js';

function getRows(block) {
  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  return wrapper ? Array.from(wrapper.children) : Array.from(block.children);
}

export default function decorate(block) {
  if (!block) return;
  if (block.querySelector(':scope > .photo-card-media')) return;

  const rows = getRows(block);
  const imageRow = rows[0] || null;
  const imageAltRow = rows[1] || null;
  const titleRow = rows[2] || null;

  const mediaEl = imageRow?.querySelector('picture') || imageRow?.querySelector('img');
  const imageAlt = imageAltRow?.textContent?.trim() || '';

  const imgEl = mediaEl?.tagName === 'IMG' ? mediaEl : mediaEl?.querySelector?.('img');
  if (imgEl && imageAlt) imgEl.setAttribute('alt', imageAlt);

  block.classList.add('photo-card');

  const media = document.createElement('div');
  media.className = 'photo-card-media';
  if (mediaEl) {
    moveInstrumentation(imageRow, mediaEl);
    media.appendChild(mediaEl);
  }

  const titleEl = document.createElement('div');
  titleEl.className = 'photo-card-title';
  if (titleRow) {
    while (titleRow.firstChild) titleEl.appendChild(titleRow.firstChild);
    moveInstrumentation(titleRow, titleEl);
  }

  block.textContent = '';
  block.append(media, titleEl);
}
