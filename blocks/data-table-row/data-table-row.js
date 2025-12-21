import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${window.hlx.codeBasePath}/blocks/data-table-row/data-table-row.css`);
  isStylesLoaded = true;
}

function textAt(cell) {
  return cell?.textContent?.trim() || '';
}

function linkAt(cell) {
  return cell?.querySelector('a')?.getAttribute('href');
}

export async function createDataTableRowFromCells(cells) {
  const tr = document.createElement('tr');
  {
    const td = document.createElement('td');
    const showButton = textAt(cells[0]) === 'true';
    const title = textAt(cells[1]);
    const fragmentPath = linkAt(cells[2]);
    if (title) {
      if (!showButton) {
        td.textContent = title;
      } else {
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
        moveInstrumentation(cells[1], button);
        moveInstrumentation(cells[2], tooltip);
        td.append(button, tooltip);
      }
    }

    tr.appendChild(td);
  }

  {
    const td = document.createElement('td');
    const isTitle = textAt(cells[3]) === 'true';
    const title = textAt(cells[4]);
    const text = textAt(cells[5]);
    if (isTitle && title) {
      td.innerHTML = `<strong>${title}</strong>`;
    } else if (!isTitle && text) {
      td.textContent = text;
    }
    tr.appendChild(td);
  }

  {
    const td = document.createElement('td');
    const isTitle = textAt(cells[6]) === 'true';
    const title = textAt(cells[7]);
    const text = textAt(cells[8]);
    const benefit = textAt(cells[9]);

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
    tr.appendChild(td);
  }

  return tr;
}

/* ---------- DECORATE ---------- */
export default async function decorate(block) {
  await ensureStylesLoaded();
  const cells = Array.from(block.children);
  const tr = await createDataTableRowFromCells(cells);
  block.replaceWith(tr);
}
