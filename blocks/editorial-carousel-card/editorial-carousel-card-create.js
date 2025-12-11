import decorateEditorialCarouselCard from './editorial-carousel-card.js';

const defaultCard = {
  title: 'Tecnologia Unibox',
  description: 'Con i nostri dispositivi satellitari Unibox, puoi ottenere sconti personalizzati sul premio in base al tuo stile di guida.',
  buttonLabel: 'Scopri di pi?',
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

const createTextRow = (text, tagName) => {
  const row = document.createElement('div');
  if (tagName) {
    const el = document.createElement(tagName);
    el.textContent = text || '';
    row.appendChild(el);
  } else {
    row.textContent = text || '';
  }
  return row;
};

const createHrefRow = (href) => {
  const row = document.createElement('div');
  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = href || '#';
  row.appendChild(link);
  return row;
};

const createImageRow = (src) => {
  const row = document.createElement('div');
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.src = src || '';
  img.alt = '';
  picture.appendChild(img);
  row.appendChild(picture);
  return row;
};

export const editorialCardDefaultArgs = defaultCard;

export const editorialCardArgTypes = {
  title: { control: 'text' },
  description: { control: 'text' },
  buttonLabel: { control: 'text' },
  buttonHref: { control: 'text' },
  buttonOpenInNewTab: { control: 'boolean' },
  buttonLeftIcon: { control: 'text' },
  buttonRightIcon: { control: 'text' },
  buttonLeftIconSize: { control: 'text' },
  buttonRightIconSize: { control: 'text' },
  note: { control: 'text' },
  tagLabel: { control: 'text' },
  tagCategory: { control: 'text' },
  tagType: { control: 'text' },
  imageSrc: { control: 'text' },
  imageAlt: { control: 'text' },
};

/**
 * Crea le righe attese da editorial-carousel-card a partire da argomenti Storybook.
 * L'ordine delle righe replica quello utilizzato dal decorator originale.
 */
export function buildEditorialCardRows(args = {}) {
  const cfg = { ...defaultCard, ...args };
  const rows = [];

  rows.push(createTextRow(cfg.title, 'h3')); // 0 - title
  rows.push(createTextRow(cfg.description, 'p')); // 1 - subtitle

  rows.push(createTextRow(cfg.buttonLabel)); // 2 - button label
  rows.push(createHrefRow(cfg.buttonHref)); // 3 - button href
  rows.push(createTextRow(cfg.buttonOpenInNewTab ? 'true' : 'false')); // 4 - new tab
  rows.push(createTextRow(cfg.buttonLeftIcon)); // 5 - left icon
  rows.push(createTextRow(cfg.buttonRightIcon)); // 6 - right icon
  rows.push(createTextRow(cfg.buttonLeftIconSize)); // 7 - left icon size
  rows.push(createTextRow(cfg.buttonRightIconSize)); // 8 - right icon size

  rows.push(createTextRow(cfg.note, 'p')); // 9 - note

  rows.push(createTextRow(cfg.tagLabel)); // 10 - tag label
  rows.push(createTextRow(cfg.tagCategory)); // 11 - tag category
  rows.push(createTextRow(cfg.tagType)); // 12 - tag type

  rows.push(createImageRow(cfg.imageSrc)); // 13 - image
  rows.push(createTextRow(cfg.imageAlt)); // 14 - alt text

  return rows;
}

/**
 * Restituisce un blocco grezzo (non decorato) con le righe della card.
 * Utile come contenuto per il carosello che poi decorer? ogni card.
 */
export function createEditorialCardBlock(args = {}) {
  const cardRows = buildEditorialCardRows(args);
  const cardBlock = document.createElement('div');
  cardRows.forEach((row) => cardBlock.appendChild(row));
  return cardBlock;
}

/**
 * Crea e decora una card singola utilizzando il decorator originale.
 * Restituisce l'elemento finale pronto per Storybook.
 */
export async function createEditorialCardInstance(args = {}) {
  const block = document.createElement('div');
  const cardRows = buildEditorialCardRows(args);
  cardRows.forEach((row) => block.appendChild(row));
  await decorateEditorialCarouselCard(block);
  return block.firstElementChild || block;
}
