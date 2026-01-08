import { createDynamicGalleryCardFromRows } from '../dynamic-gallery-card/dynamic-gallery-card.js';

export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const galleryRow = document.createElement('div');
  galleryRow.className = 'dynamic-gallery-row';

  // if (rows.length === 0) return;

  rows.forEach(async (row) => {
    const childrenRows = Array.from(row.children);
    const card = await createDynamicGalleryCardFromRows(childrenRows);
    if (card) {
      galleryRow.appendChild(card);
    }
  });

  block.replaceChildren(galleryRow);
}

export const createDynamicGalleryRowFromRows = async (rows) => {
  const galleryRow = document.createElement('div');
  galleryRow.className = 'dynamic-gallery-row';

  if (rows.length === 0) return null;

  rows.forEach(async (row) => {
    const childrenRows = Array.from(row.children);
    const card = await createDynamicGalleryCardFromRows(childrenRows);
    if (card) {
      galleryRow.appendChild(card);
    }
  });

  return galleryRow;
};
