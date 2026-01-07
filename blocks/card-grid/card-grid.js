import { moveInstrumentation } from '../../scripts/scripts.js';
import { createButtonFromRows } from '../atoms/buttons/standard-button/standard-button.js';

/**
 * ensures styles are loaded only once
 */
let isStylesAlreadyLoaded = false;
const ensureStylesLoaded = async () => {
  if (isStylesAlreadyLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const cssPromises = [
    `${window.hlx.codeBasePath}/blocks/warranty-card/warranty-card.css`,
  ].map((cssPath) => loadCSS(cssPath));
  await Promise.all(cssPromises);
  isStylesAlreadyLoaded = true;
};

export default async function decorate(block) {
  if (!block) return;
  ensureStylesLoaded();

  // Get rows from block
  const rows = Array.from(block.children);
  console.log('🚀 ~ decorate ~ rows:', rows);

  const buttonConfigRows = rows.slice(0, 6);
  const contentRows = rows.slice(6);

  // Create card grid container
  const cardGrid = document.createElement('div');
  cardGrid.className = 'card-grid reveal-in-up';

  // Process each row as a warranty card
  const cardPromises = contentRows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const {
      createWarrantyCardFromRows,
    } = await import('../warranty-card/warranty-card.js');
    const card = await createWarrantyCardFromRows(childrenRows);
    moveInstrumentation(row, card);
    cardGrid.appendChild(card);
  });
  await Promise.all(cardPromises);

  const parentSection = block.closest('.section');
  if (parentSection) {
    const button = await createButtonFromRows(buttonConfigRows);
    parentSection.appendChild(button);
  }

  block.replaceChildren(cardGrid);
}
