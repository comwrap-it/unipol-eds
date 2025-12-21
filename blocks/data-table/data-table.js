import { createDataTableRow } from '../data-table-row/data-table-row.js';
import { createButton } from '../atoms/buttons/standard-button/standard-button.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/data-table/data-table.css`);
  isStylesLoaded = true;
}

/**
 * Crea l'elemento table a partire da un array di righe
 * @param {Array<Object>} rowsData - array di oggetti con i dati per ogni riga
 * @returns {HTMLElement} <table>
 */
export async function createDataTableFromRows(rowsData) {
  await ensureStylesLoaded();

  const table = document.createElement('table');
  table.className = 'data-table';

  const tbody = document.createElement('tbody');

  const rowPromises = rowsData.map((rowData) => createDataTableRow(rowData));
  const trElements = await Promise.all(rowPromises);

  trElements.forEach((tr) => {
    if (tr) tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
}

/**
 * Crea un wrapper con la tabella e un pulsante opzionale sotto
 * @param {Array<Object>} rowsData - array di dati per le righe
 * @param {Object} buttonData - dati per il pulsante standard (label, href, variant, ecc.)
 * @returns {HTMLElement} wrapper div
 */
export async function createDataTableBlock(rowsData, buttonData = null) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table-wrapper';

  const table = await createDataTableFromRows(rowsData);
  wrapper.appendChild(table);

  if (buttonData?.label) {
    const btn = createButton(
      buttonData.label,
      buttonData.href || '#',
      Boolean(buttonData.openInNewTab),
      buttonData.variant || 'primary',
      buttonData.iconSize || 'medium',
      buttonData.leftIcon || '',
      buttonData.rightIcon || '',
      buttonData.disabled || false,
    );

    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'data-table-button';
    btnWrapper.appendChild(btn);
    wrapper.appendChild(btnWrapper);
  }

  return wrapper;
}

/**
 * Decora un blocco esistente <div> con righe e pulsante
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const wrapper = document.createElement('div');
  wrapper.className = 'data-table-wrapper';

  // Recupera le righe: ogni child del block corrisponde a una riga
  const rowsData = Array.from(block.children).map((row) => ({
    showButton: row.children[0]?.textContent?.trim() === 'true',
    title1: row.children[1]?.textContent?.trim(),
    tooltipLink: row.children[2]?.querySelector('a')?.href,
    isTitle2: row.children[3]?.textContent?.trim() === 'true',
    title2: row.children[4]?.textContent?.trim(),
    text2: row.children[5]?.textContent?.trim(),
    isTitle3: row.children[6]?.textContent?.trim() === 'true',
    title3: row.children[7]?.textContent?.trim(),
    text3: row.children[8]?.textContent?.trim(),
    benefit3: row.children[9]?.textContent?.trim(),
  }));

  const table = await createDataTableFromRows(rowsData);
  wrapper.appendChild(table);

  // Pulsante opzionale: cerca l'ultimo elemento che non è una riga
  const buttonRow = Array.from(block.children).find(
    (child) => !child.dataset.blockName,
  );

  if (buttonRow) {
    const btnData = {
      label: buttonRow.textContent?.trim() || '',
      href: buttonRow.querySelector('a')?.href || '#',
    };
    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'data-table-button';
    const btn = createButton(btnData.label, btnData.href);
    btnWrapper.appendChild(btn);
    wrapper.appendChild(btnWrapper);
  }

  block.replaceWith(wrapper);
}
