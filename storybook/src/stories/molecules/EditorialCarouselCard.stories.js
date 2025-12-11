import { html } from 'lit';
import {
  createEditorialCardInstance,
  editorialCardArgTypes,
  editorialCardDefaultArgs,
} from '@blocks/editorial-carousel-card/editorial-carousel-card-create.js';

export default {
  title: 'Molecules/Editorial Carousel Card',
  tags: ['autodocs'],
  argTypes: editorialCardArgTypes,
  args: editorialCardDefaultArgs,
  render: async (args) => html`${await createEditorialCardInstance(args)}`,
};

export const Default = {};

export const ConTagENota = {
  args: {
    tagLabel: 'Nuovo',
    tagCategory: 'primary',
    tagType: 'filled',
    note: 'Nota di supporto sotto il bottone.',
  },
};
