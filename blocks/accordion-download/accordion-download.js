import { createTextElementFromObj } from '@unipol-ds/scripts/domHelpers.js';
import { extractInstrumentationAttributes, restoreInstrumentation } from '@unipol-ds/scripts/utils.js';
import { isAuthorMode } from '../../scripts/utils.js';

export function createAccordion(accordionLabel, accordionDescription) {
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion';

  const header = document.createElement('div');
  header.className = 'accordion-header';

  const labelEl = createTextElementFromObj(accordionLabel, 'accordion-label', 'span');

  const icon = document.createElement('span');
  icon.className = 'accordion-icon un-icon-plus';

  header.append(labelEl, icon);

  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.append(...(accordionDescription?.value ?? []));
  if (isAuthorMode(content)) {
    wrapper.classList.add('open');
  }
  if (accordionDescription?.instrumentation) {
    restoreInstrumentation(content, accordionDescription.instrumentation);
  }

  wrapper.append(header, content);

  header.addEventListener('click', () => {
    const isOpen = wrapper.classList.toggle('open');

    if (isOpen) {
      icon.classList.remove('un-icon-plus');
      icon.classList.add('un-icon-minus');
      content.style.maxHeight = `${content.scrollHeight + 20}px`;
      content.style.paddingTop = '16px';
      content.style.paddingBottom = '16px';
    } else {
      icon.classList.add('un-icon-plus');
      icon.classList.remove('un-icon-minus');
      content.style.maxHeight = '0';
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
    }
  });

  return wrapper;
}

const extractValuesFromRows = (row) => {
  const config = {};

  config.value = row[0]?.textContent?.trim() || '';
  config.instrumentation = extractInstrumentationAttributes(row[0]);

  config.downloadTiles = [];

  row[1]?.forEach((item) => {
    const downloadTile = {};
    downloadTile.icon = 'un-icon-file-text';
    downloadTile.value = item[0]?.textContent?.trim() || '';
    downloadTile.href = item[1]?.querySelector('a')?.getAttribute('href') || row[1]?.textContent?.trim() || '';
    config.downloadTiles.push(downloadTile);
  });

  return config;
};

export default async function decorateAccordionDownload(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const values = extractValuesFromRows(rows);
  // eslint-disable-next-line max-len
  const accordionElement = createAccordion(
    values,
    values.downloadTiles,
  );

  block.textContent = '';
  block.appendChild(accordionElement);

  block.classList.add('accordion-block');
}
