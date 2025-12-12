import createEditorialCarouselInstance from '@blocks/editorial-carousel/editorial-carousel-create.js';

const ARG_TYPES = {
  showMoreLabel: { control: 'text', description: 'Testo bottone Mostra di pi?' },
  cards: { control: 'object', description: 'Array di card da renderizzare' },
};

const DEFAULT_CARDS = [
  {
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
  },
  {
    title: 'Protezione Casa',
    description: 'Soluzioni assicurative su misura per la tua casa.',
    buttonLabel: "Scopri di piu'",
    buttonHref: '#',
    buttonOpenInNewTab: false,
    buttonLeftIcon: '',
    buttonRightIcon: 'un-icon-chevron-right',
    buttonLeftIconSize: 'small',
    buttonRightIconSize: 'small',
    note: '',
    tagLabel: '',
    tagCategory: 'neutral',
    tagType: 'primary',
    imageSrc: 'https://placehold.co/632x356?text=Casa',
    imageAlt: 'Immagine casa',
  },
];

const DEFAULT_ARGS = {
  showMoreLabel: "Mostra di piu'",
  cards: DEFAULT_CARDS,
};

export default {
  title: 'Widgets/Editorial Carousel',
  tags: ['autodocs'],
  argTypes: ARG_TYPES,
  args: DEFAULT_ARGS,
  render: (args) => {
    const host = document.createElement('div');
    createEditorialCarouselInstance(args).then((el) => host.replaceChildren(el));
    return host;
  },
};

export const Default = {};

export const SenzaShowMore = {
  args: { showMoreLabel: '' },
};

export const DueCard = {
  args: { cards: DEFAULT_CARDS.slice(0, 2) },
};
