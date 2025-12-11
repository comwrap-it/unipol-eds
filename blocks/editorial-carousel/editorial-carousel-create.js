import decorateEditorialCarousel from './editorial-carousel.js';
import { createEditorialCardBlock } from '../editorial-carousel-card/editorial-carousel-card-create.js';

/**
 * Crea un blocco editorial-carousel popolato con card configurabili.
 * Restituisce il blocco decorato e pronto per il DOM.
 * @param {Object} args
 * @param {string} [args.showMoreLabel]
 * @param {Array<Object>} [args.cards]
 * @returns {Promise<HTMLElement>}
 */
export default async function createEditorialCarouselInstance(args = {}) {
  const showMoreLabel = args.showMoreLabel || "Mostra di piu'";
  const cards = Array.isArray(args.cards) && args.cards.length ? args.cards : [{}];

  const block = document.createElement('div');

  const showMoreRow = document.createElement('div');
  showMoreRow.textContent = showMoreLabel;
  block.appendChild(showMoreRow);

  cards.forEach((cardArgs) => {
    const cardRow = createEditorialCardBlock(cardArgs);
    block.appendChild(cardRow);
  });

  await decorateEditorialCarousel(block);
  return block;
}
