import { moveInstrumentation } from '../../scripts/scripts.js';
import { createDynamicGalleryCardFromRows } from '../dynamic-gallery-card/dynamic-gallery-card.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    ),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/dynamic-gallery-card/dynamic-gallery-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  const rows = Array.from(block.children);
  const galleryRow = document.createElement('div');
  galleryRow.className = 'dynamic-gallery-row';

  const promises = rows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const card = await createDynamicGalleryCardFromRows(childrenRows);
    if (card) {
      moveInstrumentation(row, card);
      galleryRow.appendChild(card);
    }
  });

  await Promise.all(promises);

  block.replaceChildren(galleryRow);
}

export const createDynamicGalleryRowFromRows = async (rows) => {
  const galleryRow = document.createElement('div');
  galleryRow.className = 'dynamic-gallery-row';

  if (rows.length === 0) return null;

  const promises = rows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const card = await createDynamicGalleryCardFromRows(childrenRows);
    if (card) {
      moveInstrumentation(row, card);
      galleryRow.appendChild(card);
    }
  });

  await Promise.all(promises);

  return galleryRow;
};
