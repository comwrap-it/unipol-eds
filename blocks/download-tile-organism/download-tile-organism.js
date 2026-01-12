import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { isAuthorMode } from "../../scripts/utils.js";

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

async function initMobileTabletView(downloadTileElements, block) {
  downloadTileElements.forEach((tile) => {
    const downloadTile = tile.querySelector('.download-tile-molecule');
    moveInstrumentation(tile, downloadTile);
    block.appendChild(tile);
  });
}

async function initDesktopView(downloadTileElements, block) {
  let prevTile;

  downloadTileElements.forEach((tile, index) => {
    if (index % 2 === 0) {
      prevTile = tile;
      if (isAuthorMode(block)) {
        const prevDownloadTile = prevTile.querySelector('.download-tile-molecule');
        moveInstrumentation(prevTile, prevDownloadTile);
        block.appendChild(prevTile);
      }
    } else {
      const nextDownloadTile = tile.querySelector('.download-tile-molecule');
      moveInstrumentation(tile, nextDownloadTile);
      prevTile.appendChild(nextDownloadTile);
      block.appendChild(prevTile);
    }
  });
}

async function initDownloadTileOrganism(e, downloadTileElements, block) {
  if (e.matches) {
    await initMobileTabletView(downloadTileElements, block);
  } else {
    await initDesktopView(downloadTileElements, block);
  }
}

async function changeMobileTabletView(block) {
  block.querySelectorAll('.download-tile-molecule').forEach((tile) => {
    block.appendChild(tile);
  });
}

async function changeDesktopView(block) {
  let prevTile;
  let rowIndex = 0;
  const rows = block.querySelectorAll('.download-tile-row');
  block.querySelectorAll('.download-tile-molecule').forEach((tile, index) => {
    if (index % 2 === 0) {
      prevTile = tile;
      moveInstrumentation(tile, prevTile);
    } else {
      rows[rowIndex].appendChild(prevTile);
      rows[rowIndex].appendChild(tile);
      block.appendChild(rows[rowIndex]);
      rowIndex += 1;
    }
  });
}

async function handleResize(e, block) {
  if (e.matches) {
    await changeMobileTabletView(block);
  } else {
    await changeDesktopView(block);
  }
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

  const tabletMobileMQ = window.matchMedia(
    '(min-width: 0px) and (max-width: 1200px)',
  );

  // Wait for all download tiles to be processed
  if (!dialogActive) {
    block.innerText = '';
    block.classList.add('reveal-in-up');
    const downloadTileElements = await Promise.all(downloadTileMoleculePromises);
    await initDownloadTileOrganism(tabletMobileMQ, downloadTileElements, block);
    tabletMobileMQ.addEventListener('change', (e) => handleResize(e, block));
  }
}
