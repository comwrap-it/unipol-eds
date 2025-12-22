import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

const text = (el) => el?.textContent?.trim() || '';
const isTrue = (el) => text(el) === 'true';
const linkHref = (el) => el?.querySelector('a')?.getAttribute('href') || '';

export async function createDataTableRowFromRows(rows) {
  const tr = document.createElement('tr');

  // COLUMN 1
  {
    const td = document.createElement('td');
    const showButton = isTrue(rows[0]);
    const titleRow = rows[1];
    const tooltipRow = rows[2];
    const title = text(titleRow);
    const fragmentPath = linkHref(tooltipRow);

    if (title) {
      if (!showButton) {
        td.textContent = title;
        moveInstrumentation(titleRow, td);
      } else {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'data-table-tooltip-btn';
        button.textContent = title;

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

        moveInstrumentation(titleRow, button);
        moveInstrumentation(tooltipRow, tooltip);

        td.append(button, tooltip);
      }
    }
    tr.appendChild(td);
  }

  // COLUMN 2
  {
    const td = document.createElement('td');
    const isTitleCell = isTrue(rows[3]);
    const titleRow = rows[4];
    const textRow = rows[5];

    if (isTitleCell && text(titleRow)) {
      const strong = document.createElement('strong');
      strong.textContent = text(titleRow);
      moveInstrumentation(titleRow, strong);
      td.appendChild(strong);
    } else if (!isTitleCell && text(textRow)) {
      td.textContent = text(textRow);
      moveInstrumentation(textRow, td);
    }
    tr.appendChild(td);
  }

  // COLUMN 3
  {
    const td = document.createElement('td');
    const isTitleCell = isTrue(rows[6]);
    const titleRow = rows[7];
    const textRow = rows[8];
    const benefitRow = rows[9];

    if (isTitleCell && text(titleRow)) {
      const strong = document.createElement('strong');
      strong.textContent = text(titleRow);
      moveInstrumentation(titleRow, strong);
      td.appendChild(strong);
    } else {
      if (text(textRow)) {
        const spanText = document.createElement('span');
        spanText.textContent = text(textRow);
        moveInstrumentation(textRow, spanText);
        td.appendChild(spanText);
      }
      if (text(benefitRow)) {
        const benefit = document.createElement('span');
        benefit.className = 'data-table-benefit';
        benefit.textContent = text(benefitRow);
        moveInstrumentation(benefitRow, benefit);
        td.append(' ', benefit);
      }
    }
    tr.appendChild(td);
  }

  return tr;
}

// NON USARE più replaceWith
export default async function decorate(block) {
  if (!block) return;
  if (block.classList.contains('data-table-row--decorated')) return;
  block.classList.add('data-table-row--decorated');
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);
  await createDataTableRowFromRows(rows);
}
