import { moveInstrumentation } from '../../scripts/scripts.js';
import { createDataTableRowFromRows } from '../data-table-row/data-table-row.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/data-table-row/data-table-row.css`);
  isStylesLoaded = true;
}

function extractShowMoreButtonValue(block) {
  // Recupera il testo configurato del bottone, separato dalle row
  const btnField = block.querySelector('[data-field-show-more-button]');
  const label = btnField?.textContent?.trim() || 'Mostra di più';
  return { label };
}

function createShowMoreButton({ label }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'data-table-show-more';
  button.textContent = label;
  button.setAttribute('aria-label', label);
  return button;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  // Evita doppia decorazione
  if (block.classList.contains('data-table--decorated')) return;
  block.classList.add('data-table--decorated');

  // Recupera tutte le row come children diretti
  const rows = Array.from(block.children).filter(Boolean);

  if (!rows.length) return;

  // Se esiste un field separato per "Mostra di più"
  const showMoreValues = extractShowMoreButtonValue(block);
  const showMoreButton = createShowMoreButton(showMoreValues);

  // Crea struttura tabella
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'data-table-container block data-table-block';

  const table = document.createElement('table');
  table.className = 'data-table';

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  tableWrapper.appendChild(table);

  // Crea tutte le righe tramite createDataTableRowFromRows
  const trElements = await Promise.all(
    rows.map((row) => createDataTableRowFromRows(Array.from(row.children))
      .then((tr) => {
        if (tr) {
          moveInstrumentation(row, tr);
          return tr;
        }
        return null;
      })),
  );

  trElements.filter(Boolean).forEach((tr) => tbody.appendChild(tr));

  // Pulisce il block e inserisce tabella + bottone
  block.innerHTML = '';
  block.appendChild(tableWrapper);
  block.appendChild(showMoreButton);

  moveInstrumentation(block, tableWrapper);

  // Eventuale logica del bottone
  showMoreButton.addEventListener('click', () => {
    const hiddenRows = tbody.querySelectorAll('tr.hidden');
    hiddenRows.forEach((r) => r.classList.remove('hidden'));
    showMoreButton.remove();
  });
}
