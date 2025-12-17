import { moveInstrumentation } from '../../scripts/scripts.js';

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

  // Create card grid container
  const cardGrid = document.createElement('div');
  cardGrid.className = 'card-grid';

  // Process each row as a warranty card
  const cardPromises = rows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const {
      createWarrantyCardFromRows,
    } = await import('../warranty-card/warranty-card.js');
    const card = await createWarrantyCardFromRows(childrenRows);
    moveInstrumentation(row, card);
    cardGrid.appendChild(card);
  });
  await Promise.all(cardPromises);

  block.replaceChildren(cardGrid);
}
