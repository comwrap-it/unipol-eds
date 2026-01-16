import { createTextElementFromObj } from '@unipol-ds/scripts/domHelpers.js';
import { extractInstrumentationAttributes } from '@unipol-ds/scripts/utils.js';
import { createIconButton } from '@unipol-ds/components/atoms/buttons/icon-button/icon-button.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '@unipol-ds/constants/index.js';
import { createDownloadTile } from '../download-tile-molecule/download-tile-molecule.js';

const closeDownloadAccordion = (icon, content) => {
  icon.classList.add('un-icon-plus');
  icon.classList.remove('un-icon-minus');
  content.querySelectorAll('.download-tile-molecule').forEach((tile) => {
    const icons = tile.querySelectorAll('.download-icon');
    icons.forEach((downloadIcon) => {
      downloadIcon.setAttribute('aria-hidden', 'true');
      downloadIcon.setAttribute('tabindex', '-1');
    });
  });
  content.setAttribute('aria-hidden', 'true');
  content.style.maxHeight = '0';
};

const openDownloadAccordion = (icon, content) => {
  icon.classList.remove('un-icon-plus');
  icon.classList.add('un-icon-minus');
  content.querySelectorAll('.download-tile-molecule').forEach((tile) => {
    const icons = tile.querySelectorAll('.download-icon');
    icons.forEach((downloadIcon) => {
      downloadIcon.setAttribute('aria-hidden', 'false');
      downloadIcon.setAttribute('tabindex', '0');
    });
  });

  content.setAttribute('aria-hidden', 'false');
  content.style.maxHeight = `${content.scrollHeight + 20}px`;
};

export async function createAccordionDownload(accordionLabel, downloadTiles) {
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion';

  const header = document.createElement('div');
  header.className = 'accordion-header';

  if (downloadTiles && downloadTiles.length > 1) {
    const labelEl = createTextElementFromObj(accordionLabel, 'accordion-label', 'span');

    const icon = document.createElement('span');
    icon.className = 'accordion-icon un-icon-plus';

    header.append(labelEl, icon);

    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.setAttribute('aria-hidden', 'true');

    while (downloadTiles.length > 0) {
      const downloadTile = downloadTiles.shift();
      const downloadTileEl = createDownloadTile(downloadTile);
      downloadTileEl.querySelector('.download-icon').setAttribute('tabindex', '-1');
      content.appendChild(downloadTileEl);
    }

    wrapper.append(header, content);

    header.addEventListener('click', () => {
      const isOpen = wrapper.classList.toggle('open');

      if (isOpen) {
        openDownloadAccordion(icon, content);
      } else {
        closeDownloadAccordion(icon, content);
      }
    });
  } else {
    header.classList.add('direct-download');
    const labelEl = createTextElementFromObj(downloadTiles[0], 'accordion-label', 'span');

    const downloadIcon = createIconButton(
      'un-icon-download-simple',
      BUTTON_VARIANTS.SECONDARY,
      BUTTON_ICON_SIZES.LARGE,
      downloadTiles[0].href,
      true,
    );
    downloadIcon.classList.add('download-icon');
    downloadIcon.setAttribute('aria-label', `Apri il file ${downloadTiles[0].value} in una nuova finestra`);

    header.append(labelEl, downloadIcon);

    wrapper.append(header);
  }

  return wrapper;
}

const extractValuesFromRows = (rows) => {
  const config = {};

  config.value = rows[0]?.textContent?.trim() || '';
  config.instrumentation = extractInstrumentationAttributes(rows[0].querySelector('p'));

  config.downloadTiles = [];

  rows.slice(1).forEach((row) => {
    const tileConfigs = row.firstElementChild.children;
    const downloadTile = {};
    downloadTile.icon = 'un-icon-file-text';
    downloadTile.href = tileConfigs[0]?.querySelector('a')?.getAttribute('href') || tileConfigs[0]?.textContent?.trim() || '';
    downloadTile.value = tileConfigs[1]?.textContent?.trim() || '';
    downloadTile.instrumentation = extractInstrumentationAttributes(row);
    config.downloadTiles.push(downloadTile);
  });

  return config;
};

export default async function decorateAccordionDownload(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const values = extractValuesFromRows(rows);
  const accordionElement = await createAccordionDownload(
    values,
    values.downloadTiles,
  );

  block.textContent = '';
  block.appendChild(accordionElement);

  block.classList.add('accordion-block');
}
