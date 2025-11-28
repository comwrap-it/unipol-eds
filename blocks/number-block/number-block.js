import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Creates the DOM for a single Number Item
 */
const createNumberItem = (item) => {
  const itemWrapper = document.createElement('div');
  itemWrapper.classList.add('number-item');

  // --- 1. Title (Number) ---
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('number-item-title');

  if (item.title instanceof HTMLElement) {
    moveInstrumentation(item.title, titleDiv);
    // Move all children (including p, strong, etc.)
    while (item.title.firstChild) {
      titleDiv.appendChild(item.title.firstChild);
    }
  } else {
    titleDiv.textContent = item.title || '';
  }
  itemWrapper.appendChild(titleDiv);

  // --- 2. Description ---
  const descDiv = document.createElement('div');
  descDiv.classList.add('number-item-description');

  if (item.description instanceof HTMLElement) {
    moveInstrumentation(item.description, descDiv);
    while (item.description.firstChild) {
      descDiv.appendChild(item.description.firstChild);
    }
  } else {
    const p = document.createElement('p');
    p.textContent = item.description || '';
    descDiv.appendChild(p);
  }
  itemWrapper.appendChild(descDiv);

  return itemWrapper;
};

export function createNumberBlock(items = []) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('number-block-wrapper');

  items.forEach((item) => {
    if (!item.title && !item.description) return;
    const itemEl = createNumberItem(item);
    wrapper.appendChild(itemEl);
  });

  return wrapper;
}

export default function decorate(block) {
  const rows = [...block.children];
  const items = [];

  // --- KEY MODIFICATION ---
  // Iterate by 2 because in AEM/UE flat DOM:
  // Row i   = Number
  // Row i+1 = Description
  for (let i = 0; i < rows.length; i += 2) {
    const titleRow = rows[i];
    const descRow = rows[i + 1]; // Can be undefined if odd

    // Extract the first child of the row (which contains the value and instrumentation)
    // If the row is a simple div wrapper, we take that.
    items.push({
      title: titleRow ? titleRow.firstElementChild || titleRow : null,
      description: descRow ? descRow.firstElementChild || descRow : null,
    });
  }

  const numberBlockDOM = createNumberBlock(items);

  block.textContent = '';
  block.appendChild(numberBlockDOM);
}
