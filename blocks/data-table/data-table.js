import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';
import { createButton } from '../atoms/buttons/standard-button/standard-button.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`);
  isStylesLoaded = true;
}

function textAt(cell) {
  return cell?.textContent?.trim() || '';
}

function linkAt(cell) {
  return cell?.querySelector('a')?.getAttribute('href');
}

/**
 * Trasforma una riga esistente in <tr> pronto
 */
export async function decorateDataTableRow(row) {
  const cells = Array.from(row.children);

  // Se la riga è vuota, la ignoriamo
  if (!cells.some((c) => textAt(c) || c.querySelector('a'))) return null;

  const tr = document.createElement('tr');

  // --- Cella 1 ---
  const showButton = textAt(cells[0]) === 'true';
  const title = textAt(cells[1]);
  const tooltipLink = linkAt(cells[2]);
  const td1 = document.createElement('td');

  if (showButton && title) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = title;
    button.className = 'data-table-tooltip-btn';

    const tooltip = document.createElement('div');
    tooltip.className = 'data-table-tooltip';
    tooltip.hidden = true;

    button.addEventListener('click', async () => {
      if (!tooltip.hasChildNodes() && tooltipLink) {
        const fragment = await loadFragment(tooltipLink);
        if (fragment) tooltip.append(...fragment.children);
      }
      tooltip.hidden = !tooltip.hidden;
    });

    moveInstrumentation(cells[1], button);
    moveInstrumentation(cells[2], tooltip);

    td1.append(button, tooltip);
  } else if (title) {
    td1.textContent = title;
  }

  tr.appendChild(td1);

  // --- Cella 2 ---
  const isTitle2 = textAt(cells[3]) === 'true';
  const title2 = textAt(cells[4]);
  const text2 = textAt(cells[5]);
  const td2 = document.createElement('td');
  if (isTitle2 && title2) td2.innerHTML = `<strong>${title2}</strong>`;
  else if (text2) td2.textContent = text2;
  tr.appendChild(td2);

  // --- Cella 3 ---
  const isTitle3 = textAt(cells[6]) === 'true';
  const title3 = textAt(cells[7]);
  const text3 = textAt(cells[8]);
  const benefit3 = textAt(cells[9]);
  const td3 = document.createElement('td');
  if (isTitle3 && title3) td3.innerHTML = `<strong>${title3}</strong>`;
  else {
    if (text3) td3.append(text3);
    if (benefit3) {
      const span = document.createElement('span');
      span.className = 'data-table-benefit';
      span.textContent = benefit3;
      td3.append(' ', span);
    }
  }
  tr.appendChild(td3);

  return tr;
}

export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  const table = document.createElement('table');
  table.className = 'data-table';
  const tbody = document.createElement('tbody');

  const rows = Array.from(block.children);
  const trPromises = rows.map((row) => decorateDataTableRow(row));
  const trElements = await Promise.all(trPromises);
  trElements.forEach((tr) => {
    if (tr) tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  block.innerHTML = '';
  block.appendChild(table);

  const buttonRow = rows.find((r) => r.dataset.blockName === undefined && textAt(r));
  if (buttonRow) {
    const btn = createButton(
      textAt(buttonRow),
      linkAt(buttonRow) || '#',
    );
    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'data-table-button';
    btnWrapper.appendChild(btn);
    block.appendChild(btnWrapper);
  }
}
