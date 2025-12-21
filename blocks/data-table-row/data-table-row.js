import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/data-table-row/data-table-row.css`);
  isStylesLoaded = true;
}

function createTooltipButton(title, fragmentPath, instrumentationCells) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = title;
  button.className = 'data-table-tooltip-btn';

  const tooltip = document.createElement('div');
  tooltip.className = 'data-table-tooltip';
  tooltip.hidden = true;

  button.addEventListener('click', async () => {
    if (!tooltip.hasChildNodes() && fragmentPath) {
      const fragment = await loadFragment(fragmentPath);
      if (fragment) tooltip.append(...fragment.children);
    }
    tooltip.hidden = !tooltip.hidden;
  });

  if (instrumentationCells) {
    moveInstrumentation(instrumentationCells.titleCell, button);
    moveInstrumentation(instrumentationCells.tooltipCell, tooltip);
  }

  const td = document.createElement('td');
  td.append(button, tooltip);
  return td;
}

function createTextCell(isTitle, title, text, benefit) {
  const td = document.createElement('td');
  if (isTitle && title) {
    td.innerHTML = `<strong>${title}</strong>`;
  } else {
    if (text) td.append(text);
    if (benefit) {
      const span = document.createElement('span');
      span.className = 'data-table-benefit';
      span.textContent = benefit;
      td.append(' ', span);
    }
  }
  return td;
}

/**
 * Crea una riga della tabella a partire dai valori del modello
 */
export default async function createDataTableRow(data, instrumentationCells = null) {
  await ensureStylesLoaded();

  const tr = document.createElement('tr');

  // Cella 1
  if (data.showButton && data.title1) {
    tr.appendChild(createTooltipButton(data.title1, data.tooltipLink, instrumentationCells));
  } else {
    const td = document.createElement('td');
    if (data.title1) td.textContent = data.title1;
    tr.appendChild(td);
  }

  // Cella 2
  tr.appendChild(createTextCell(data.isTitle2, data.title2, data.text2));

  // Cella 3
  tr.appendChild(createTextCell(data.isTitle3, data.title3, data.text3, data.benefit3));

  return tr;
}
