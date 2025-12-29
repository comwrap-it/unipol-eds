import { moveInstrumentation } from '../../scripts/scripts.js';
import { createDataTableRowFromRows } from '../data-table-row/data-table-row.js';

let isStylesLoaded = false;
let resizeScheduled = false;

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

function handleResponsiveTable(table) {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  rows.forEach((tr) => {
    const cells = tr.children;
    if (cells.length < 3) return;

    const col1 = cells[0];
    const col2 = cells[1];
    const col3 = cells[2];

    if (isMobile && !col1.classList.contains('merged')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'data-table-mobile-merge';
      wrapper.append(...Array.from(col2.childNodes));

      col1.appendChild(wrapper);
      col1.classList.add('merged');

      col2.style.display = 'none';
      col2.setAttribute('aria-hidden', 'true');
    }

    if (!isMobile && col1.classList.contains('merged')) {
      const wrapper = col1.querySelector('.data-table-mobile-merge');
      if (!wrapper) return;

      col2.append(...Array.from(wrapper.childNodes));
      wrapper.remove();

      col1.classList.remove('merged');
      col2.style.display = '';
      col2.removeAttribute('aria-hidden');
    }

    col3.style.display = '';
    col3.removeAttribute('aria-hidden');
  });
}

function bindResponsiveResize(table) {
  const onResize = () => {
    if (resizeScheduled) return;
    resizeScheduled = true;
    window.requestAnimationFrame(() => {
      handleResponsiveTable(table);
      resizeScheduled = false;
    });
  };

  window.addEventListener('resize', onResize);
}

function setupShowMoreAccessibility({ tbody, button, disableLimit }) {
  if (disableLimit) {
    button.disabled = false;
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Mostra tutte le righe');
    return;
  }

  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', tbody.id);

  button.addEventListener('click', () => {
    const hiddenRows = tbody.querySelectorAll('tr.hidden');
    hiddenRows.forEach((row) => {
      row.classList.remove('hidden');
      row.style.display = '';
      row.setAttribute('aria-hidden', 'false');
    });

    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Tutte le righe visibili');
    button.disabled = true;
  });
}

function appendRowsWithLimit({
  rows, tbody, limit = 6, disableLimit,
}) {
  rows.filter(Boolean).forEach((tr, index) => {
    if (!disableLimit && index >= limit) {
      tr.classList.add('hidden');
      tr.style.display = 'none';
      tr.setAttribute('aria-hidden', 'true');
    } else {
      tr.setAttribute('aria-hidden', 'false');
    }
    tbody.appendChild(tr);
  });
}

async function buildTable({ rows, block, disableLimit }) {
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'data-table-container block data-table-block';
  tableWrapper.classList.add('reveal-in-up');

  const table = document.createElement('table');
  table.className = 'data-table';

  const tbody = document.createElement('tbody');
  tbody.id = `data-table-body-${Math.random().toString(36).slice(2, 8)}`;

  table.appendChild(tbody);
  tableWrapper.appendChild(table);
  block.appendChild(tableWrapper);

  const trElements = await Promise.all(
    rows.map((row) => createDataTableRowFromRows(Array.from(row.children)).then((tr) => {
      if (tr) {
        moveInstrumentation(row, tr);
        return tr;
      }
      return null;
    })),
  );

  appendRowsWithLimit({ rows: trElements, tbody, disableLimit });

  if (disableLimit || rows.length > 6) {
    const showMoreValues = extractShowMoreButtonValue(rows[0]);
    const showMoreButtonWrapper = createShowMoreButton(showMoreValues);
    block.appendChild(showMoreButtonWrapper);
    setupShowMoreAccessibility({
      tbody,
      button: showMoreButtonWrapper.querySelector('button'),
      disableLimit,
    });
  }

  handleResponsiveTable(table);
  bindResponsiveResize(table);
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();
  if (block.classList.contains('data-table--decorated')) return;
  block.classList.add('data-table--decorated');

  const rows = Array.from(block.children).filter(Boolean);
  if (!rows.length) return;

  const disableLimit = document.documentElement.classList.contains('adobe-ue-edit');

  block.innerHTML = '';
  await buildTable({ rows, block, disableLimit });
}
