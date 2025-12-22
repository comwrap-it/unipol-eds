/**
 * Data Table - Block
 *
 * Parent block that renders a <table> and manages "show more".
 * Fully Universal Editor compliant.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

/* =========================================================
   HELPERS
========================================================= */

const text = (el) => el?.textContent?.trim() || '';

/* =========================================================
   CREATE TABLE
========================================================= */

function createDataTable({
  tableRows = [],
  showMoreButtonLabel = 'Mostra di più',
}) {
  const container = document.createElement('div');
  container.className = 'data-table-container';

  const table = document.createElement('table');
  table.className = 'data-table';

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  const mq = window.matchMedia('(min-width: 768px)');
  const renderedRows = [];

  tableRows.forEach((tr, index) => {
    if (!mq.matches && index >= 4) {
      tr.classList.add('hidden');
    }
    renderedRows.push(tr);
    tbody.appendChild(tr);
  });

  container.appendChild(table);

  /* ==========================
     SHOW MORE BUTTON
  ========================== */

  if (!mq.matches && renderedRows.length > 4) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'data-table-show-more';
    button.textContent = showMoreButtonLabel;
    button.setAttribute('aria-label', showMoreButtonLabel);

    button.addEventListener('click', (e) => {
      e.preventDefault();
      renderedRows.forEach((tr) => tr.classList.remove('hidden'));
      button.remove();
    });

    container.appendChild(button);
  }

  return container;
}

export const create = createDataTable;

/* =========================================================
   DECORATE
========================================================= */

export default function decorate(block) {
  if (!block) return;

  // Prevent double decoration (UE re-render)
  if (block.classList.contains('data-table--decorated')) return;
  block.classList.add('data-table--decorated');

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  if (rows.length === 0) return;

  /* ==========================
     ROW 0 → BUTTON LABEL
  ========================== */

  const showMoreRow = rows.shift();
  const showMoreButtonLabel = text(showMoreRow) || 'Mostra di più';

  /* ==========================
     DATA-TABLE-ROW ITEMS
  ========================== */

  const tableRows = rows.filter((row) => row.tagName === 'TR');

  if (tableRows.length === 0) return;

  const table = createDataTable({
    tableRows,
    showMoreButtonLabel,
  });

  // Move instrumentation from block to container
  moveInstrumentation(block, table);

  // Preserve blockName if present
  if (block.dataset.blockName) {
    table.dataset.blockName = block.dataset.blockName;
  }

  block.innerText = '';
  table.classList.add('block', 'data-table-block');
  block.appendChild(table);
}
