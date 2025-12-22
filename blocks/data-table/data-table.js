import { moveInstrumentation } from '../../scripts/scripts.js';
import { createDataTableRowFromRows } from '../data-table-row/data-table-row.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/data-table-row/data-table-row.css`);
  isStylesLoaded = true;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  if (block.classList.contains('data-table--decorated')) return;
  block.classList.add('data-table--decorated');

  const rows = Array.from(block.children);
  if (!rows.length) return;

  // Primo row: testo per bottone "Mostra di più"
  const showMoreLabelRow = rows.shift();
  const showMoreButtonLabel = showMoreLabelRow.textContent?.trim() || 'Mostra di più';
  showMoreLabelRow.remove();

  // Struttura tabella
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'data-table-container block data-table-block';

  const table = document.createElement('table');
  table.className = 'data-table';

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  tableWrapper.appendChild(table);

  // Crea <tr> per ogni riga senza violare ESLint
  const trElements = await Promise.all(
    rows
      .filter(Boolean) // elimina eventuali row falsy
      .map((row) => createDataTableRowFromRows(Array.from(row.children))
        .then((tr) => {
          if (tr) {
            moveInstrumentation(row, tr);
            return tr;
          }
          return null;
        })),
  );

  // Append tr validi al tbody
  trElements.filter(Boolean).forEach((tr) => tbody.appendChild(tr));

  // Bottone sotto la tabella
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'data-table-show-more';
  button.textContent = showMoreButtonLabel;
  button.setAttribute('aria-label', showMoreButtonLabel);

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
