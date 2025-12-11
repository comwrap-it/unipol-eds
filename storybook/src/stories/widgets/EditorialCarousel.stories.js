import { html } from 'lit';
import {
  createEditorialCarouselInstance,
  editorialCarouselArgTypes,
  editorialCarouselDefaultArgs,
} from '@blocks/editorial-carousel/editorial-carousel-create.js';

export default {
  title: 'Widgets/Editorial Carousel',
  tags: ['autodocs'],
  argTypes: editorialCarouselArgTypes,
  args: editorialCarouselDefaultArgs,
  render: async (args) => html`${await createEditorialCarouselInstance(args)}`,
};

export const Default = {};

export const SenzaShowMore = {
  args: {
    showMoreLabel: '',
  },
};

export const DueCard = {
  args: {
    cards: editorialCarouselDefaultArgs.cards.slice(0, 2),
  },
};
