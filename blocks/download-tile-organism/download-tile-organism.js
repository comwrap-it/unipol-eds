import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/download-tile-molecule/download-tile-molecule.css`,
    ),
  ]);
  isStylesLoaded = true;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const downloadTileMoleculeModule = await import(
    '../download-tile-molecule/download-tile-molecule.js',
  );
  const decorateDownloadTileMolecule = downloadTileMoleculeModule.default;

  // Get all rows (each row will be a card)
  const rows = Array.from(block.children);

  const dialogActive = (rows[0].textContent?.trim() || 'false') === 'true';
  rows.shift();

  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('No download tile elements found');
    return;
  }

  // Process each row as a download tile molecule
  const downloadTileMoleculePromises = rows.map(async (row) => {
    const downloadTileMoleculeBlock = document.createElement('div');
    downloadTileMoleculeBlock.className = 'download-tile-row';

    // Preserve row instrumentation on card block if present
    if (row.hasAttribute('data-aue-resource')) {
      downloadTileMoleculeBlock.setAttribute(
        'data-aue-resource',
        row.getAttribute('data-aue-resource'),
      );
      const aueBehavior = row.getAttribute('data-aue-behavior');
      if (aueBehavior) downloadTileMoleculeBlock.setAttribute('data-aue-behavior', aueBehavior);
      const aueType = row.getAttribute('data-aue-type');
      if (aueType) downloadTileMoleculeBlock.setAttribute('data-aue-type', aueType);
      const aueLabel = row.getAttribute('data-aue-label');
      if (aueLabel) downloadTileMoleculeBlock.setAttribute('data-aue-label', aueLabel);
    }

    // Move all children from row to download tile molecule block (preserves their instrumentation)
    while (row.firstElementChild) {
      downloadTileMoleculeBlock.appendChild(row.firstElementChild);
    }

    // Decorate the card using card component
    await decorateDownloadTileMolecule(downloadTileMoleculeBlock);

    // Load card styles
    const decoratedTile = downloadTileMoleculeBlock.querySelector('.download-tile-molecule-wrapper')
      || downloadTileMoleculeBlock.firstElementChild;
    if (decoratedTile && decoratedTile.dataset.blockName) {
      await loadBlock(decoratedTile);
    }

    moveInstrumentation(row, downloadTileMoleculeBlock);

    return downloadTileMoleculeBlock;
  });

  // Wait for all download tiles to be processed
  if (!dialogActive) {
    const downloadTileElements = await Promise.all(downloadTileMoleculePromises);
    block.innerText = '';
    let prevTile;
    downloadTileElements.forEach((tile, index) => {
      if (index % 2 === 0) {
        prevTile = tile;
      } else {
        prevTile.appendChild(tile.querySelector('.download-tile-molecule'));
        block.appendChild(prevTile);
      }
    });
  }
}
