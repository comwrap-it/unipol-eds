import { createDynamicGalleryRow } from '../../scripts/libs/ds/components/organism/dynamic-gallery-row/dynamic-gallery-row.js';

export default async function decorate(block) {
  if (!block) return;
  await createDynamicGalleryRow([], block);
}
