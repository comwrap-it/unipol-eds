/**
 * Category Card - Molecule
 *
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within category-carousel organism.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { create3Dicons } from '@unipol-ds/components/atoms/icons-3D/icons-3D.js';
import { createCategoryChip } from '@unipol-ds/components/atoms/category-chip/category-chip.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { createTextElementFromObj } from '../../scripts/domHelpers.js';
import { extractInstrumentationAttributes, restoreInstrumentation } from '../../scripts/utils.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/icons-3D/icons-3D.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/category-chip/category-chip.css`),
  ]);
  isStylesLoaded = true;
}

/**
 *
 * @param image { { src, instrumentation, altText } }
 * @return {HTMLDivElement} cardImage
 */
const createImageCard = (image) => {
  const cardImage = document.createElement('div');
  cardImage.className = 'category-card-image';

  if (image) {
    const optimizedPic = createOptimizedPicture(
      image.src,
      image.altText,
      false,
      [{ media: '(max-width: 768)', width: '343' }, { media: '(max-width: 1200)', width: '302' }, { media: '(max-width: 1440)', width: '373' }, { media: '(min-width: 1441)', width: '426' }],
    );

    if (image.instrumentation) {
      restoreInstrumentation(optimizedPic, image.instrumentation);
    }

    cardImage.appendChild(optimizedPic);
  }

  return cardImage;
};

/**
 *
 * @param category {string}
 * @param categoryChips {{icon, text, textInstrumentation}}
 * @return {HTMLDivElement}
 */
const createCategoryChips = (category, categoryChips) => {
  const chips = document.createElement('div');
  chips.className = 'category-chips';

  categoryChips.forEach((chip) => {
    if (chip.icon !== undefined && chip.text !== undefined) {
      // eslint-disable-next-line max-len
      chips.appendChild(createCategoryChip(category, chip.icon, chip.text, chip.textInstrumentation));
    }
  });

  return chips;
};

/**
 *
 * @param title {{value, instrumentation}}
 * @param subTitle {{value, instrumentation}}
 * @param note {{value, instrumentation}}
 * @param category {string}
 * @param categoryChips {{icon, text, textInstrumentation}[]}
 * @return {HTMLDivElement} Card Content Element
 */
const createCardContent = (title, subTitle, note, category, categoryChips) => {
  const cardContent = document.createElement('div');
  cardContent.className = 'category-card-inner-content';

  const titleElement = createTextElementFromObj(title, 'title', 'h3');
  const subTitleElement = createTextElementFromObj(subTitle, 'subtitle', 'p');

  const textElement = document.createElement('div');
  textElement.className = 'category-card-text';

  textElement.appendChild(titleElement);
  textElement.appendChild(subTitleElement);

  const noteElement = createTextElementFromObj(note, 'note', 'p');

  const categoryChipsElement = createCategoryChips(category, categoryChips);

  cardContent.appendChild(textElement);
  cardContent.appendChild(categoryChipsElement);
  cardContent.appendChild(noteElement);
  return cardContent;
};

/**
 *
 * @param category {string}
 * @return {*}
 */
const create3DcategoryIcons = (category) => {
  const vehiclesShowIcon = category === 'mobility';
  const homeShowIcon = category === 'property';
  const personalShowIcon = category === 'welfare';
  return create3Dicons(vehiclesShowIcon, homeShowIcon, personalShowIcon);
};

// eslint-disable-next-line max-len
/**
 *   Category Card Data Rows
 *
 *   rows[0] --> title
 *   rows[1] --> subtitle
 *   rows[2] --> note
 *   rows[3] --> image
 *   rows[4] --> imageSR
 *   rows[5] --> category
 *   rows[6] --> firstCategoryChip icon and text
 *   rows[7] --> secondCategoryChip icon and text
 *   rows[8] --> thirdCategoryChip icon and text
 *   rows[9] --> fourthCategoryChip icon and text
 *
 * @param rows
 * @return {
 *          {
 *            title: {value, instrumentation},
 *            description: {value, instrumentation},
 *            note: {value, instrumentation},
 *            image: {src, instrumentation, altText},
 *            category: {string},
 *            categoryChips: {icon, text, textInstrumentation}[]
 *          }
 *         }
 */
const extractValuesFromRows = (rows) => {
  const title = {};
  title.value = rows[0]?.textContent?.trim() || '';
  title.instrumentation = extractInstrumentationAttributes(rows[0].firstChild);

  const description = {};
  description.value = rows[1]?.textContent?.trim() || '';
  description.instrumentation = extractInstrumentationAttributes(rows[1].firstChild);

  const note = {};
  note.value = rows[2]?.textContent?.trim() || '';
  note.instrumentation = extractInstrumentationAttributes(rows[2].firstChild);

  const image = {};
  const img = rows[3]?.querySelector('img');
  image.src = img?.getAttribute('src') ?? '';
  image.instrumentation = extractInstrumentationAttributes(img);
  image.altText = rows[4]?.textContent?.trim() || '';

  const category = rows[5]?.textContent?.trim() || '';

  const categoryChips = [];
  rows.slice(6).forEach((chip) => {
    const categoryChip = {};
    categoryChip.icon = chip.children[0]?.textContent?.trim();
    categoryChip.text = chip.children[1]?.textContent?.trim();

    if (categoryChip.text) {
      categoryChip.textInstrumentation = extractInstrumentationAttributes(chip.children[1]);
    }

    categoryChips.push(categoryChip);
  });

  return {
    title,
    description,
    note,
    image,
    category,
    categoryChips,
  };
};

/**
 *
 * @param title {{ value, instrumentation }}
 * @param description {{value, instrumentation}}
 * @param note {{value, instrumentation}}
 * @param image {{src, instrumentation, altText}}
 * @param category {string}
 * @param categoryChips {{icon, text, textInstrumentation}[]}
 * @return {HTMLDivElement} Category Card Element
 */
const createCategoryCard = (title, description, note, image, category, categoryChips) => {
  // Create card structure
  const card = document.createElement('div');
  card.className = 'category-card-content';

  const imageEl = createImageCard(image);
  card.appendChild(imageEl);

  const cardContent = createCardContent(title, description, note, category, categoryChips);
  card.appendChild(cardContent);

  const iconsElement = create3DcategoryIcons(category);
  card.appendChild(iconsElement);

  // Append card content
  if (cardContent.children.length > 0) {
    card.appendChild(cardContent);
  }

  return card;
};

/**
 * Decorates a card block element
 * @param {HTMLElement} block - The card block element
 */
export default async function decorateCategoryCard(block) {
  if (!block) return;

  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Check if card is already decorated (has card-block class)
  // This happens when Universal Editor re-renders after an edit
  if (block.classList.contains('card-block')) {
    return;
  }

  const rows = Array.from(block.children);
  const {
    title,
    description,
    note,
    image, category,
    categoryChips,
  } = extractValuesFromRows(rows);

  const card = createCategoryCard(title, description, note, image, category, categoryChips);

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    card.dataset.blockName = block.dataset.blockName;
  }

  // Replace block content with card
  // Preserve block class and instrumentation
  card.classList.add('card-block');
  block.replaceWith(card);
}
