import decorateEditorialCarousel from './editorial-carousel.js';
import { createEditorialCardBlock, editorialCardDefaultArgs, editorialCardArgTypes } from '../editorial-carousel-card/editorial-carousel-card-create.js';

export const editorialCarouselDefaultArgs = {
  showMoreLabel: 'Mostra di pi?',
  cards: [
    editorialCardDefaultArgs,
    {
      ...editorialCardDefaultArgs,
      title: 'Protezione Casa',
      description: 'Soluzioni assicurative su misura per la tua casa.',
      tagLabel: '',
      imageSrc: 'https://placehold.co/632x356?text=Casa',
    },
  ],
};

export const editorialCarouselArgTypes = {
  showMoreLabel: { control: 'text' },
  cards: { control: 'object' },
  ...editorialCardArgTypes,
};

/**
 * Crea un blocco editorial-carousel popolato con card configurabili.
 * ? pensato per l'uso in Storybook: restituisce il blocco gi? decorato.
 */
export async function createEditorialCarouselInstance(args = {}) {
  const cfg = { ...editorialCarouselDefaultArgs, ...args };
  const block = document.createElement('div');

  const showMoreRow = document.createElement('div');
  showMoreRow.textContent = cfg.showMoreLabel || 'Mostra di pi?';
  block.appendChild(showMoreRow);

  (cfg.cards || []).forEach((cardArgs) => {
    const cardRow = createEditorialCardBlock({ ...editorialCardDefaultArgs, ...cardArgs });
    block.appendChild(cardRow);
  });

  await decorateEditorialCarousel(block);
  return block;
}
