import { moveInstrumentation } from '../../scripts/scripts.js';
import { createDataTableRowFromRows } from '../data-table-row/data-table-row.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/data-table-row/data-table-row.css`);
  isStylesLoaded = true;
}

function extractShowMoreButtonValue(row) {
  const cells = Array.from(row.children);
  const label = cells[0]?.textContent?.trim() || 'Mostra di più';
  return { label };
}

function createShowMoreButton({ label }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table-button-wrapper';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'data-table-show-more btn btn-primary';
  button.textContent = label;
  button.setAttribute('aria-label', label);

  wrapper.appendChild(button);
  return wrapper;
}

export async function createDataTable({ rows = [] } = {}) {
  if (!rows.length) return null;

  await ensureStylesLoaded();
  const showMoreValues = extractShowMoreButtonValue(rows[0]);
  const showMoreButtonWrapper = createShowMoreButton(showMoreValues);

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'data-table-container block data-table-block';

  const table = document.createElement('table');
  table.className = 'data-table';
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  tableWrapper.appendChild(table);

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

  // Nascondi dalla sesta riga in poi
  trElements.filter(Boolean).forEach((tr, i) => {
    if (i >= 5) {
      tr.classList.add('hidden');
      tr.style.display = 'none';
    }
    tbody.appendChild(tr);
  });

  const block = document.createElement('div');
  block.className = 'data-table block data-table--decorated';
  block.appendChild(tableWrapper);
  block.appendChild(showMoreButtonWrapper);

  // Mostra righe nascoste al click
  showMoreButtonWrapper.querySelector('button').addEventListener('click', () => {
    const hiddenRows = tbody.querySelectorAll('tr.hidden');
    hiddenRows.forEach((r) => {
      r.classList.remove('hidden');
      r.style.display = '';
    });

    const btn = showMoreButtonWrapper.querySelector('button');
    btn.textContent = 'Tutte le righe visibili';
    btn.setAttribute('aria-label', 'Tutte le righe visibili');
    btn.disabled = true;
  });

  return block;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();
  if (block.classList.contains('data-table--decorated')) return;
  block.classList.add('data-table--decorated');

  const rows = Array.from(block.children).filter(Boolean);
  if (!rows.length) return;

  const showMoreValues = extractShowMoreButtonValue(rows[0]);
  const showMoreButtonWrapper = createShowMoreButton(showMoreValues);

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'data-table-container block data-table-block';

  const table = document.createElement('table');
  table.className = 'data-table';
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  tableWrapper.appendChild(table);

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

  // Nascondi dalla sesta riga in poi
  trElements.filter(Boolean).forEach((tr, i) => {
    if (i >= 5) {
      tr.classList.add('hidden');
      tr.style.display = 'none';
    }
    tbody.appendChild(tr);
  });

  block.innerHTML = '';
  block.appendChild(tableWrapper);
  block.appendChild(showMoreButtonWrapper);

  // Pulsante mostra tutto
  showMoreButtonWrapper.querySelector('button').addEventListener('click', () => {
    const hiddenRows = tbody.querySelectorAll('tr.hidden');
    hiddenRows.forEach((r) => {
      r.classList.remove('hidden');
      r.style.display = '';
    });

    const btn = showMoreButtonWrapper.querySelector('button');
    btn.textContent = 'Tutte le righe visibili';
    btn.setAttribute('aria-label', 'Tutte le righe visibili');
    btn.disabled = true;
  });
}
