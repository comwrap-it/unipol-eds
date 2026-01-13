/**
 * Bundle Card
 *
 */

import { createCategoryStripFromRows } from '../category-strip/category-strip.js';
import {
  createButtonGroup,
  extractButtonValuesFromRows,
} from '../button-group/button-group.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { extractInstrumentationAttributes } from '../../scripts/utils.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/category-strip/category-strip.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/button-group/button-group.css`),
  ]);
  isStylesLoaded = true;
}

function createCategoryStripFromOffsets(rows, offsets) {
  const stripRows = offsets.map((i) => rows[i] || document.createElement('div'));
  return createCategoryStripFromRows(stripRows);
}

/** Extract structured data from rows */
export function extractValuesFromRows(rows) {
  return {
    titleRow: rows[0] || document.createElement('div'),
    subtitleRow: rows[1] || document.createElement('div'),
    noteRow: rows[17] || document.createElement('div'),
    imageRow: rows[18] || document.createElement('div'),
    imageAlt: rows[19]?.textContent?.trim() || '',
    button1Rows: rows.slice(2, 10),
    button2Rows: rows.slice(10, 17),
    categoryStripOffsets: [
      [20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, 31],
      [32, 33, 34, 35, 36, 37],
    ],
    instrumentation: extractInstrumentationAttributes(rows[0]),
  };
}

/** Create Image DOM */
export function createCardImage(imageRow, altText = '', isFirstCard = false) {
  if (!imageRow) return null;

  const cardImage = document.createElement('div');
  cardImage.className = 'bundle-card-image';

  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      img.setAttribute('alt', altText);
      if (isFirstCard) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      }
    }
    cardImage.appendChild(picture);
  } else {
    const img = imageRow.querySelector('img') || imageRow.querySelector('a');
    if (img) {
      const src = img.src || img.href;
      const optimizedPic = createOptimizedPicture(
        src,
        altText,
        isFirstCard,
        [
          { media: '(min-width: 769)', width: '316' },
          { media: '(max-width: 768)', width: '240' },
          { media: '(max-width: 392)', width: '343' },
        ],
      );
      const newImg = optimizedPic.querySelector('img');
      if (newImg) moveInstrumentation(img, newImg);
      if (isFirstCard && newImg) newImg.setAttribute('fetchpriority', 'high');
      cardImage.appendChild(optimizedPic);
    }
  }

  return cardImage;
}

/** Create Card Content DOM */
export function createCardContent({
  titleRow,
  subtitleRow,
  noteRow,
  button1Rows,
  button2Rows,
  rows,
}) {
  const cardContent = document.createElement('div');
  cardContent.className = 'bundle-card-content';
  const textContainer = document.createElement('div');
  textContainer.className = 'card-bundle-text-cont';

  // Title
  if (titleRow) {
    const existingHeading = titleRow.querySelector('h1,h2,h3,h4,h5,h6');
    const titleEl = existingHeading || document.createElement('h3');
    titleEl.className = 'title';
    if (!existingHeading) while (titleRow.firstChild) titleEl.appendChild(titleRow.firstChild);
    moveInstrumentation(titleRow, titleEl);
    if (titleEl.textContent?.trim()) textContainer.appendChild(titleEl);
  }

  // Subtitle
  if (subtitleRow) {
    const existingPara = subtitleRow.querySelector('p');
    const desc = existingPara || document.createElement('p');
    desc.className = 'description';
    if (!existingPara) while (subtitleRow.firstChild) desc.appendChild(subtitleRow.firstChild);
    moveInstrumentation(subtitleRow, desc);
    textContainer.appendChild(desc);
  }
  if (textContainer.children.length) {
    cardContent.appendChild(textContainer);
  }

  // Category strips
  const categoryStripOffsets = [
    [20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31],
    [32, 33, 34, 35, 36, 37],
  ];
  const categoryStripWrapper = document.createElement('div');
  categoryStripWrapper.className = 'bundle-card-category-strip';

  categoryStripOffsets.forEach((offsets) => {
    const stripEl = createCategoryStripFromOffsets(rows, offsets);
    if (stripEl) categoryStripWrapper.appendChild(stripEl);
  });

  if (categoryStripWrapper.children.length) {
    cardContent.appendChild(categoryStripWrapper);
  }

  // Note
  if (noteRow) {
    const existingPara = noteRow.querySelector('p');
    const noteEl = existingPara || document.createElement('p');
    noteEl.className = 'subdescription';
    if (!existingPara) while (noteRow.firstChild) noteEl.appendChild(noteRow.firstChild);
    moveInstrumentation(noteRow, noteEl);
    cardContent.appendChild(noteEl);
  }

  // Buttons
  if (button1Rows?.length || button2Rows?.length) {
    const firstButton = button1Rows?.length
      ? extractButtonValuesFromRows(button1Rows)
      : {};

    const secondButton = button2Rows?.length
      ? extractButtonValuesFromRows(button2Rows)
      : {};

    const buttonGroupEl = createButtonGroup({
      editorialVariant: firstButton.variant || 'primary',
      direction: 'horizontal',
      firstButton,
      secondButton,
    });

    cardContent.appendChild(buttonGroupEl);
  }

  return cardContent;
}

/** Create the full bundle card DOM */
export function createBundleCard(rows, isFirstCard = false) {
  const {
    titleRow, subtitleRow, noteRow, imageRow, imageAlt, button1Rows, button2Rows, instrumentation,
  } = extractValuesFromRows(rows);

  const card = document.createElement('div');
  card.className = 'bundle-card-container';

  const cardImage = createCardImage(imageRow, imageAlt, isFirstCard);
  if (cardImage) card.appendChild(cardImage);

  const cardContent = createCardContent({
    titleRow, subtitleRow, noteRow, button1Rows, button2Rows, rows,
  });
  if (cardContent && cardContent.children.length) card.appendChild(cardContent);

  Object.entries(instrumentation).forEach(([name, value]) => card.setAttribute(name, value));
  card.classList.add('card-block');

  return card;
}

/** Original decorate function for page usage */
export default async function decorateBundleCard(block, isFirstCard = false) {
  if (!block) return;

  await ensureStylesLoaded();

  if (block.classList.contains('card-block')) return;

  const rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows.push(...Array.from(wrapper.children));

  const card = createBundleCard(rows, isFirstCard);

  if (block.dataset.blockName) card.dataset.blockName = block.dataset.blockName;
  block.replaceWith(card);
}
