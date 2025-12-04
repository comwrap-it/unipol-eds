import { createOptimizedPicture, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

let stylesLoaded = false;

export async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  await loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`);
  stylesLoaded = true;
}

export const getTextContent = (cell) => cell?.textContent?.trim() || '';

export const getBooleanContent = (cell) => getTextContent(cell).toLowerCase() === 'true';

export function createMedia(cell, alt) {
  if (!cell) return null;
  const picture = cell.querySelector('picture');
  if (picture) {
    const clonedPicture = picture.cloneNode(true);
    moveInstrumentation(cell, clonedPicture);
    const img = clonedPicture.querySelector('img');
    if (img && alt) img.alt = alt;
    return clonedPicture;
  }
  const img = cell.querySelector('img');
  if (img && img.src) {
    const optimizedPic = createOptimizedPicture(
      img.src,
      alt || img.alt || '',
      false,
      [{ media: '(min-width: 768px)', width: '316' }, { width: '240' }],
    );
    const newImg = optimizedPic.querySelector('img');
    if (newImg) moveInstrumentation(img, newImg);
    return optimizedPic;
  }
  const link = cell.querySelector('a');
  if (link && link.href) {
    const optimizedPic = createOptimizedPicture(
      link.href,
      alt || '',
      false,
      [{ media: '(min-width: 768px)', width: '316' }, { width: '240' }],
    );
    return optimizedPic;
  }
  return null;
}
