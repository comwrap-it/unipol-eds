import decorateEditorialCarouselCard from './editorial-carousel-card.js';

/**
 * Crea una riga di testo (con eventuale tag semantico).
 * @param {string} text
 * @param {keyof HTMLElementTagNameMap} [tagName]
 * @returns {HTMLDivElement}
 */
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

/**
 * Crea una riga contenente un link.
 * @param {string} href
 * @returns {HTMLDivElement}
 */
const createHrefRow = (href) => {
  const row = document.createElement('div');
  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = href || '#';
  row.appendChild(link);
  return row;
};

/**
 * Crea una riga immagine compatibile con il decorator.
 * @param {string} src
 * @returns {HTMLDivElement}
 */
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

/**
 * Costruisce le righe attese da editorial-carousel-card a partire dagli argomenti.
 * @param {Object} args
 * @returns {HTMLElement[]}
 */
export function buildEditorialCardRows(args = {}) {
  const {
    title = '',
    description = '',
    buttonLabel = '',
    buttonHref = '#',
    buttonOpenInNewTab = false,
    buttonLeftIcon = '',
    buttonRightIcon = '',
    buttonLeftIconSize = 'small',
    buttonRightIconSize = 'small',
    note = '',
    tagLabel = '',
    tagCategory = '',
    tagType = '',
    imageSrc = '',
    imageAlt = '',
  } = args;

  const rows = [];
  rows.push(createTextRow(title, 'h3'));
  rows.push(createTextRow(description, 'p'));

  rows.push(createTextRow(buttonLabel));
  rows.push(createHrefRow(buttonHref));
  rows.push(createTextRow(buttonOpenInNewTab ? 'true' : 'false'));
  rows.push(createTextRow(buttonLeftIcon));
  rows.push(createTextRow(buttonRightIcon));
  rows.push(createTextRow(buttonLeftIconSize));
  rows.push(createTextRow(buttonRightIconSize));

  rows.push(createTextRow(note, 'p'));

  rows.push(createTextRow(tagLabel));
  rows.push(createTextRow(tagCategory));
  rows.push(createTextRow(tagType));

  rows.push(createImageRow(imageSrc));
  rows.push(createTextRow(imageAlt));

  return rows;
}

/**
 * Restituisce un blocco grezzo (non decorato) con le righe della card.
 * @param {Object} args
 * @returns {HTMLDivElement}
 */
export function createEditorialCardBlock(args = {}) {
  const cardRows = buildEditorialCardRows(args);
  const cardBlock = document.createElement('div');
  cardRows.forEach((row) => cardBlock.appendChild(row));
  return cardBlock;
}

/**
 * Crea e decora una card singola utilizzando il decorator originale.
 * @param {Object} args
 * @returns {Promise<HTMLElement>}
 */
export default async function createEditorialCardInstance(args = {}) {
  const block = document.createElement('div');
  const cardRows = buildEditorialCardRows(args);
  cardRows.forEach((row) => block.appendChild(row));
  await decorateEditorialCarouselCard(block);
  return block.firstElementChild || block;
}
