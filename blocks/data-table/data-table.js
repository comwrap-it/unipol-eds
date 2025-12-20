import { createButtonFromRows } from '../atoms/buttons/standard-button/standard-button.js';
import { createDataTableRowFromCells } from '../data-table-row/data-table-row.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/data-table/data-table.css`);
  isStylesLoaded = true;
}

function hasContent(cells) {
  return cells.some((c) => c?.textContent?.trim());
}

function createCellElementsFromData(cells = []) {
  return cells.map((val) => {
    const div = document.createElement('div');
    if (val !== undefined && val !== null) {
      if (val instanceof HTMLElement) {
        div.appendChild(val);
      } else {
        const p = document.createElement('p');
        p.textContent = val;
        div.appendChild(p);
      }
    }
    return div;
  });
}

export async function createDataTableFromRows(rawRows) {
  await ensureStylesLoaded();

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  await Promise.all(
    rawRows.map(async (rowData) => {
      const cells = createCellElementsFromData(rowData);
      if (!hasContent(cells)) return;
      const tr = await createDataTableRowFromCells(cells);
      tbody.appendChild(tr);
    }),
  );

  table.appendChild(tbody);
  return table;
}

export function createDataTableParentButton(buttonRows) {
  const buttonElement = createButtonFromRows(buttonRows || []);
  if (!buttonElement) return null;

  const btnWrapper = document.createElement('div');
  btnWrapper.className = 'data-table-button';
  btnWrapper.appendChild(buttonElement);

  return btnWrapper;
}

export async function createDataTableBlockStory(rawRows, buttonRows) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table-wrapper';

  const table = await createDataTableFromRows(rawRows);
  wrapper.appendChild(table);

  const buttonWrapper = createDataTableParentButton(buttonRows);
  if (buttonWrapper) wrapper.appendChild(buttonWrapper);

  return wrapper;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const wrapper = document.createElement('div');
  wrapper.className = 'data-table-wrapper';

  const rawRows = Array.from(block.children).map((row) => Array.from(row.children));

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  await Promise.all(
    rawRows.map(async (cells) => {
      if (!hasContent(cells)) return;
      const tr = await createDataTableRowFromCells(cells);
      tbody.appendChild(tr);
    }),
  );

  table.appendChild(tbody);
  wrapper.appendChild(table);

  const buttonRows = Array.from(block.children).filter((row) => !row.dataset.blockName);
  const buttonWrapper = createDataTableParentButton(buttonRows);
  if (buttonWrapper) wrapper.appendChild(buttonWrapper);

  block.replaceWith(wrapper);
}
