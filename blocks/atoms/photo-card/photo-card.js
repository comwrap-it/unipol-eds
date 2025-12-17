import { createOptimizedPicture } from '../../../scripts/aem.js';
import { moveInstrumentation } from '../../../scripts/scripts.js';

// #region CONSTANTS
export const PHOTO_CARD_SIZES = { S: 's', M: 'm' };

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
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/photo-card/photo-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

const resolvePhotoCardSize = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['m', 'md', 'medium'].includes(normalized)) return PHOTO_CARD_SIZES.M;
  return PHOTO_CARD_SIZES.S;
};

const getImageBreakpoints = (size) => IMAGE_BREAKPOINTS_BY_SIZE[resolvePhotoCardSize(size)]
  || IMAGE_BREAKPOINTS_BY_SIZE[PHOTO_CARD_SIZES.S];

function getRows(block) {
  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  return wrapper
    ? Array.from(wrapper.children)
    : Array.from(block.children);
}

function getTitleFragment(row) {
  const fragment = document.createDocumentFragment();
  if (!row) return fragment;
  while (row.firstChild) fragment.appendChild(row.firstChild);
  return fragment;
}

function getImageSource(row) {
  if (!row) return null;
  return row.querySelector('picture')
    || row.querySelector('img')
    || row.querySelector('a[href]');
}

function setImageAlt(mediaElement, imageAlt) {
  if (!mediaElement) return;
  const img = mediaElement.tagName === 'IMG'
    ? mediaElement
    : mediaElement.querySelector?.('img');
  if (img) img.setAttribute('alt', imageAlt || '');
}
// #endregion

// #region CREATE/RENDER
export function createPhotoCard(
  {
    size = PHOTO_CARD_SIZES.S,
    title = '',
    imageSrc = '',
    imageAlt = '',
    imageElement = null,
    instrumentation = {},
    eager = false,
    root = null,
  } = {},
) {
  /**
   * Normalize inputs
   * */
  const resolvedSize = resolvePhotoCardSize(size);
  const card = root || document.createElement('div');

  /*
   * Root element
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
      getImageBreakpoints(resolvedSize),
    );
  }
  setImageAlt(mediaElement, imageAlt);

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

// #region DECORATE
export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  if (block.querySelector(':scope > .photo-card-media')) return;

  const rows = getRows(block);
  const imageRow = rows[0] || null; // fallback
  const imageAltRow = rows[1] || null; // fallback
  const titleRow = rows[2] || null; // fallback
  const sizeRow = rows[3] || null; // fallback

  const size = resolvePhotoCardSize(sizeRow?.textContent);
  const imageAlt = imageAltRow?.textContent?.trim() || ''; // fallback

  const titleFragment = getTitleFragment(titleRow);
  const imageSource = getImageSource(imageRow);

  const usesExistingPicture = imageSource?.tagName === 'PICTURE'
    || imageSource?.tagName === 'IMG';
  const imageElement = usesExistingPicture
    ? imageSource
    : null;
  const imageSrc = !usesExistingPicture
    ? imageSource?.href || ''
    : '';

  createPhotoCard({
    root: block,
    size,
    title: titleFragment,
    imageAlt,
    imageElement,
    imageSrc,
  });

  const mediaElement = block.querySelector(':scope > .photo-card-media > picture')
    || block.querySelector(':scope > .photo-card-media > img');

  if (mediaElement) {
    if (imageRow) moveInstrumentation(imageRow, mediaElement);
    if (imageSource && imageSource !== mediaElement) moveInstrumentation(imageSource, mediaElement);
  }

  const titleElement = block.querySelector(':scope > .photo-card-title');
  if (titleElement && titleRow) moveInstrumentation(titleRow, titleElement);
}
// #endregion
