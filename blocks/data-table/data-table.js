import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  createDataTableRowFromRows,
} from '../data-table-row/data-table-row.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/data-table-row/data-table-row.css`,
  );
  isStylesLoaded = true;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  // Evita doppia decorazione
  if (block.classList.contains('data-table--decorated')) return;
  block.classList.add('data-table--decorated');

  // Recupera tutte le righe (children)
  const rows = Array.from(block.children);
  if (!rows.length) return;

  // Primo row è la label per il bottone
  const showMoreLabelRow = rows.shift();
  const showMoreButtonLabel = showMoreLabelRow.textContent?.trim() || 'Mostra di più';
  showMoreLabelRow.remove();

  // Crea struttura tabella
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'data-table-container block data-table-block';

  const table = document.createElement('table');
  table.className = 'data-table';

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  tableWrapper.appendChild(table);

  // Processa tutte le data-table-row
  const trElements = await Promise.all(
    rows.map((row) => createDataTableRowFromRows(Array.from(row.children))),
  );

  trElements.forEach((tr) => tbody.appendChild(tr));

  // Aggiungi bottone sotto la tabella
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'data-table-show-more';
  button.textContent = showMoreButtonLabel;
  button.setAttribute('aria-label', showMoreButtonLabel);

  // Eventuale logica del bottone (es. mostra altre righe nascoste)
  button.addEventListener('click', () => {
    const hiddenRows = tbody.querySelectorAll('tr.hidden');
    hiddenRows.forEach((r) => r.classList.remove('hidden'));
    button.remove();
  });

  block.innerHTML = '';
  block.appendChild(tableWrapper);
  block.appendChild(button);
  moveInstrumentation(block, tableWrapper);
}
