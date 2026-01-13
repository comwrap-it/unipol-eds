import { createTextElementFromObj } from '@unipol-ds/scripts/domHelpers.js';
import { createIconButton } from '@unipol-ds/components/atoms/buttons/icon-button/icon-button.js';
import { extractInstrumentationAttributes, restoreInstrumentation } from '@unipol-ds/scripts/utils.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '@unipol-ds/constants/index.js';

const extractValuesFromRows = (row) => {
  const config = {};

  config.icon = row[0]?.textContent?.trim() || '';
  config.value = row[1]?.textContent?.trim() || '';
  config.href = row[2]?.querySelector('a')?.getAttribute('href') || row[2]?.textContent?.trim() || '';
  config.instrumentation = extractInstrumentationAttributes(row[1]);

  return config;
};

const createTextWrapper = (downloadTile) => {
  const textWrapper = document.createElement('div');
  textWrapper.className = 'text-wrapper';

  const fileIcon = createIconButton(
    downloadTile.icon,
    BUTTON_VARIANTS.SECONDARY,
    BUTTON_ICON_SIZES.LARGE,
  );
  textWrapper.appendChild(fileIcon);

  const label = createTextElementFromObj(downloadTile, 'label', 'p');
  textWrapper.appendChild(label);

  return textWrapper;
};

export function createDownloadTile(downloadTile) {
  const downloadTileEl = document.createElement('div');
  downloadTileEl.className = 'download-tile-molecule';

  const textWrapper = createTextWrapper(downloadTile);
  downloadTileEl.appendChild(textWrapper);

  const downloadIcon = createIconButton(
    'un-icon-download-simple',
    BUTTON_VARIANTS.SECONDARY,
    BUTTON_ICON_SIZES.LARGE,
    downloadTile.href,
    true,
  );
  downloadIcon.classList.add('download-icon');

  downloadTileEl.appendChild(downloadIcon);

  return downloadTileEl;
}

export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const downloadTile = extractValuesFromRows(rows[0].children);
  const downloadTileEl = createDownloadTile(downloadTile);

  if (block.dataset.blockName) {
    downloadTileEl.dataset.blockName = block.dataset.blockName;
  }

  restoreInstrumentation(block, downloadTile.instrumentation);

  downloadTileEl.classList.add('download-tile-molecule-block');
  block.innerHTML = '';
  block.appendChild(downloadTileEl);
}
