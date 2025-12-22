import { moveInstrumentation } from '../../scripts/scripts.js';

function extractTooltipValues(rows) {
  const title = rows[0]?.textContent?.trim() || '';
  const description = rows[1]?.innerHTML?.trim() || '';

  return { title, description };
}

export async function createTooltip(title, description) {
  const container = document.createElement('div');
  container.className = 'tool-tip-cont';

  if (title) {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'tooltip-title';
    titleDiv.textContent = title;
    container.appendChild(titleDiv);
  }

  if (description) {
    const descP = document.createElement('p');
    descP.className = 'tooltip-description';
    descP.innerHTML = description;
    container.appendChild(descP);
  }

  return container;
}

export default async function decorate(block) {
  if (!block) return;

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  const { title, description } = extractTooltipValues(rows);
  const tooltipEl = await createTooltip(title, description);

  if (hasInstrumentation) {
    rows.forEach((row) => moveInstrumentation(row, tooltipEl));
  }

  block.innerHTML = '';
  block.appendChild(tooltipEl);
  block.classList.add('tooltip-block');
}
