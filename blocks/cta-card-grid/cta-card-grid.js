import { ensureStylesLoaded } from './cta-card-grid-helpers.js';
import createCard from './cta-card-grid-card.js';

export default async function decorate(block) {
  await ensureStylesLoaded();

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  const grid = document.createElement('div');
  grid.className = 'cta-card-grid';

  rows.forEach((row) => {
    const card = createCard(row);
    if (card) grid.appendChild(card);
  });

  block.textContent = '';
  block.appendChild(grid);
}
