import { moveInstrumentation } from '../../scripts/scripts.js';
import { createDataTableRowFromRows } from '../data-table-row/data-table-row.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/data-table-row/data-table-row.css`);
  isStylesLoaded = true;
}

function extractShowMoreButtonValues(rows) {
  const label = rows[0]?.textContent?.trim() || 'Mostra di più';
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
  await ensureStylesLoaded();

  if (block.classList.contains('data-table--decorated')) return;
  block.classList.add('data-table--decorated');

  const rows = Array.from(block.children);

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'data-table-container block data-table-block';
  const table = document.createElement('table');
  table.className = 'data-table';
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  tableWrapper.appendChild(table);

  const trElements = await Promise.all(
    rows
      .filter(Boolean)
      .map((row) => createDataTableRowFromRows(Array.from(row.children))
        .then((tr) => {
          if (tr) {
            moveInstrumentation(row, tr);
            return tr;
          }
          return null;
        })),
  );
  trElements.filter(Boolean).forEach((tr) => tbody.appendChild(tr));

  block.innerHTML = '';
  block.appendChild(tableWrapper);

  if (!block.querySelector('.data-table-show-more')) {
    const showMoreValues = extractShowMoreButtonValues(rows);
    const button = createShowMoreButton(showMoreValues);
    block.appendChild(button);
  }

  moveInstrumentation(block, tableWrapper);
}
