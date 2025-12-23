import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

const text = (el) => el?.textContent?.trim() || '';
const isTrue = (el) => text(el) === 'true';
const linkHref = (el) => el?.querySelector('a')?.getAttribute('href') || '';

export async function createDataTableRowFromRows(rows) {
  if (!rows || !rows.length) return null;

  const safe = (i) => rows[i] || null;

  const col1IsTitle = safe(0);
  const col1Text = safe(1);
  const col1Tooltip = safe(2);

  const col2IsTitle = safe(3);
  const col2Title = safe(4);
  const col2Text = safe(5);

  const col3IsTitle = safe(6);
  const col3Title = safe(7);
  const col3Text = safe(8);
  const col3Benefit = safe(9);

  const tr = document.createElement('tr');

  // --- COLONNA 1 ---
  {
    const th = document.createElement('th');
    th.scope = 'row';
    const cellText = text(col1Text);
    const showButton = isTrue(col1IsTitle);
    const tooltipPath = linkHref(col1Tooltip);

    if (cellText) {
      if (showButton && tooltipPath) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'data-table-tooltip-btn';
        button.textContent = cellText;

        const tooltip = document.createElement('div');
        tooltip.className = 'data-table-tooltip';
        tooltip.hidden = true;

        const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 11)}`;
        tooltip.id = tooltipId;
        button.setAttribute('aria-describedby', tooltipId);
        button.setAttribute('aria-expanded', 'false');

        button.addEventListener('click', async () => {
          if (!tooltip.hasChildNodes() && tooltipPath) {
            const fragment = await loadFragment(tooltipPath);
            if (fragment) tooltip.append(...fragment.children);
          }
          const expanded = tooltip.hidden;
          tooltip.hidden = !tooltip.hidden;
          button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });

        moveInstrumentation(col1Text, button);
        moveInstrumentation(col1Tooltip, tooltip);
        th.append(button, tooltip);
      } else {
        th.textContent = cellText;
        moveInstrumentation(col1Text, th);
      }
    } else {
      th.setAttribute('role', 'rowheader');
      th.setAttribute('aria-label', 'Nessun contenuto');
    }

    tr.appendChild(th);
  }

  // --- COLONNA 2 ---
  {
    const isTitleCell = isTrue(col2IsTitle);
    const contentRow = isTitleCell ? col2Title : col2Text;
    const contentText = text(contentRow);
    const cell = document.createElement(isTitleCell ? 'th' : 'td');
    if (isTitleCell) cell.scope = 'col';

    if (contentText) {
      if (isTitleCell) {
        const strong = document.createElement('strong');
        strong.textContent = contentText;
        moveInstrumentation(contentRow, strong);
        cell.appendChild(strong);
      } else {
        cell.textContent = contentText;
        moveInstrumentation(contentRow, cell);
      }
    } else {
      cell.setAttribute('role', isTitleCell ? 'columnheader' : 'cell');
      cell.setAttribute('aria-label', 'Nessun contenuto');
    }

    tr.appendChild(cell);
  }

  // --- COLONNA 3 ---
  {
    const isTitleCell = isTrue(col3IsTitle);
    const contentRow = isTitleCell ? col3Title : col3Text;
    const benefitRow = col3Benefit;
    const contentText = text(contentRow);
    const cell = document.createElement(isTitleCell ? 'th' : 'td');
    if (isTitleCell) cell.scope = 'col';

    let hasContent = false;

    if (contentText) {
      hasContent = true;
      if (isTitleCell) {
        const strong = document.createElement('strong');
        strong.textContent = contentText;
        moveInstrumentation(contentRow, strong);
        cell.appendChild(strong);
      } else {
        const spanText = document.createElement('span');
        spanText.textContent = contentText;
        moveInstrumentation(contentRow, spanText);
        cell.appendChild(spanText);
      }
    }

    if (benefitRow && text(benefitRow)) {
      hasContent = true;

      const container = document.createElement('span');
      container.className = 'benefit-container color-mobility color-welfare color-property';

      const icon = document.createElement('span');
      icon.className = 'un-icon-check-circle';

      const spanBenefit = document.createElement('span');
      spanBenefit.className = 'data-table-benefit';
      spanBenefit.textContent = text(benefitRow);
      moveInstrumentation(benefitRow, spanBenefit);

      container.append(icon, ' ', spanBenefit);

      if (cell.hasChildNodes()) cell.append(' ');
      cell.appendChild(container);
    }

    if (!hasContent) {
      cell.setAttribute('role', isTitleCell ? 'columnheader' : 'cell');
      cell.setAttribute('aria-label', 'Nessun contenuto');
    }

    tr.appendChild(cell);
  }

  return tr;
}

export default async function decorate(block) {
  if (!block) return;
  if (block.classList.contains('data-table-row--decorated')) return;
  block.classList.add('data-table-row--decorated');

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  await createDataTableRowFromRows(rows);
}
