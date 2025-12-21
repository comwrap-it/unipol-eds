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

  // Preserve instrumentation
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
 * Crea una riga della tabella a partire dai dati
 * @param {Object} data - Dati per le celle
 * @param {boolean} data.showButton
 * @param {string} data.title1
 * @param {string} data.tooltipLink
 * @param {boolean} data.isTitle2
 * @param {string} data.title2
 * @param {string} data.text2
 * @param {boolean} data.isTitle3
 * @param {string} data.title3
 * @param {string} data.text3
 * @param {string} data.benefit3
 * @param {Object} instrumentationCells - opzionale, celle originali per strumentazione
 * @returns {HTMLElement} <tr>
 */
export async function createDataTableRow({
  showButton, title1, tooltipLink,
  isTitle2, title2, text2,
  isTitle3, title3, text3, benefit3,
}, instrumentationCells = null) {
  await ensureStylesLoaded();

  const tr = document.createElement('tr');

  // Cell 1
  if (showButton && title1) {
    tr.appendChild(createTooltipButton(title1, tooltipLink, instrumentationCells));
  } else {
    const td = document.createElement('td');
    if (title1) td.textContent = title1;
    tr.appendChild(td);
  }

  // Cell 2
  tr.appendChild(createTextCell(isTitle2, title2, text2));

  // Cell 3
  tr.appendChild(createTextCell(isTitle3, title3, text3, benefit3));

  return tr;
}

/**
 * Decora un blocco esistente <div> con celle come figli
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  const cells = Array.from(block.children);
  const data = {
    showButton: cells[0]?.textContent?.trim() === 'true',
    title1: cells[1]?.textContent?.trim(),
    tooltipLink: cells[2]?.querySelector('a')?.getAttribute('href'),
    isTitle2: cells[3]?.textContent?.trim() === 'true',
    title2: cells[4]?.textContent?.trim(),
    text2: cells[5]?.textContent?.trim(),
    isTitle3: cells[6]?.textContent?.trim() === 'true',
    title3: cells[7]?.textContent?.trim(),
    text3: cells[8]?.textContent?.trim(),
    benefit3: cells[9]?.textContent?.trim(),
  };

  const instrumentationCells = {
    titleCell: cells[1],
    tooltipCell: cells[2],
  };

  const tr = await createDataTableRow(data, instrumentationCells);
  block.replaceWith(tr);
}
