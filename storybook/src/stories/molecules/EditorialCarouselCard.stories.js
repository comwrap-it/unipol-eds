import { html } from 'lit';
import createEditorialCardInstance from '@blocks/editorial-carousel-card/editorial-carousel-card-create.js';

const ARG_TYPES = {
  title: { control: 'text', description: 'Titolo della card' },
  description: { control: 'text', description: 'Descrizione della card' },
  buttonLabel: { control: 'text', description: 'Testo del bottone' },
  buttonHref: { control: 'text', description: 'Link del bottone' },
  buttonOpenInNewTab: { control: 'boolean', description: 'Apre il link in nuova scheda' },
  buttonLeftIcon: { control: 'text', description: 'Classe icona sinistra' },
  buttonRightIcon: { control: 'text', description: 'Classe icona destra' },
  buttonLeftIconSize: { control: 'text', description: 'Dimensione icona sinistra' },
  buttonRightIconSize: { control: 'text', description: 'Dimensione icona destra' },
  note: { control: 'text', description: 'Nota sotto il bottone' },
  tagLabel: { control: 'text', description: 'Testo tag' },
  tagCategory: { control: 'text', description: 'Categoria tag' },
  tagType: { control: 'text', description: 'Tipo tag' },
  imageSrc: { control: 'text', description: 'URL immagine' },
  imageAlt: { control: 'text', description: 'Testo alternativo immagine' },
};

const DEFAULT_ARGS = {
  title: 'Tecnologia Unibox',
  description: 'Con i nostri dispositivi satellitari Unibox, puoi ottenere sconti personalizzati sul premio in base al tuo stile di guida.',
  buttonLabel: "Scopri di piu'",
  buttonHref: '#',
  buttonOpenInNewTab: false,
  buttonLeftIcon: '',
  buttonRightIcon: 'un-icon-chevron-right',
  buttonLeftIconSize: 'small',
  buttonRightIconSize: 'small',
  note: '',
  tagLabel: 'Promo',
  tagCategory: 'neutral',
  tagType: 'primary',
  imageSrc: 'https://placehold.co/632x356',
  imageAlt: 'Immagine prodotto',
};

export default {
  title: 'Molecules/Editorial Carousel Card',
  tags: ['autodocs'],
  argTypes: ARG_TYPES,
  args: DEFAULT_ARGS,
  render: (args) => {
    const host = document.createElement('div');
    createEditorialCardInstance(args).then((el) => host.replaceChildren(el));
    return html`${host}`;
  },
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
