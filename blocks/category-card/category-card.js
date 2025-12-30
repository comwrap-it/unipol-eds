/**
 * Category Card - Molecule
 *
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within category-carousel organism.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { create3Dicons } from '@unipol-ds/components/atoms/icons-3D/icons-3D.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { createTextElementFromRow } from '../../scripts/domHelpers.js';
import { extractInstrumentationAttributes, restoreInstrumentation } from '../../scripts/utils.js';
import { createCategoryChip } from '@unipol-ds/components/atoms/category-chip/category-chip.js';

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
 * @param image
 * @param altText
 * @return {HTMLDivElement} cardImage
 */
const createImageCard = (image, altText) => {
  const cardImage = document.createElement('div');
  cardImage.className = 'category-card-image';

  if (image) {
    const img = image.querySelector('img');
    const src = img?.getAttribute('src') ?? '';
    const optimizedPic = createOptimizedPicture(
      src,
      altText?.textContent?.trim() || '',
      false,
      [{ media: '(max-width: 768)', width: '343' }, { media: '(max-width: 1200)', width: '302' }, { media: '(max-width: 1440)', width: '373' }, { media: '(min-width: 1441)', width: '426' }],
    );

    const imgInstrumentation = extractInstrumentationAttributes(img);
    if (imgInstrumentation) {
      restoreInstrumentation(optimizedPic, imgInstrumentation);
    }

    cardImage.appendChild(optimizedPic);
  }

  return cardImage;
};

const createCategoryChips = (category, categoryChips) => {
  const chips = document.createElement('div');
  chips.className = 'category-chips';

  categoryChips.forEach((chip) => {
    const icon = chip.children[0]?.textContent?.trim();
    const text = chip.children[1]?.textContent?.trim();
    let textInstrumentation;
    if (text) {
      textInstrumentation = extractInstrumentationAttributes(chip.children[1]);
    }

    if (icon !== undefined && text !== undefined) {
      chips.appendChild(createCategoryChip(category, icon, text, textInstrumentation));
    }
  });

  return chips;
};

const createCardContent = (title, subTitle, note, category, categoryChips) => {
  const cardContent = document.createElement('div');
  cardContent.className = 'category-card-inner-content';

  const titleElement = createTextElementFromRow(title, 'title', 'h3');
  const subTitleElement = createTextElementFromRow(subTitle, 'subtitle', 'p');

  const textElement = document.createElement('div');
  textElement.className = 'category-card-text';

  textElement.appendChild(titleElement);
  textElement.appendChild(subTitleElement);

  const noteElement = createTextElementFromRow(note, 'note', 'p');

  const categoryChipsElement = createCategoryChips(category, categoryChips);

  cardContent.appendChild(textElement);
  cardContent.appendChild(categoryChipsElement);
  cardContent.appendChild(noteElement);
  return cardContent;
};

const create3DcategoryIcons = (category) => {
  const vehiclesShowIcon = category === 'mobility';
  const homeShowIcon = category === 'property';
  const personalShowIcon = category === 'welfare';
  return create3Dicons(vehiclesShowIcon, homeShowIcon, personalShowIcon);
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

  // Create card structure
  const card = document.createElement('div');
  card.className = 'category-card-content';

  /*
  Category Card Data Rows

  rows[0] --> title
  rows[1] --> subtitle
  rows[2] --> note
  rows[3] --> image
  rows[4] --> imageSR
  rows[5] --> category
  rows[6] --> firstCategoryChip icon and text
  rows[7] --> secondCategoryChip icon and text
  rows[8] --> thirdCategoryChip icon and text
  rows[9] --> fourthCategoryChip icon and text

   */
  const rows = Array.from(block.children);

  const image = createImageCard(rows[3], rows[4]);
  card.appendChild(image);

  const category = rows[5]?.textContent?.trim() || '';
  const cardContent = createCardContent(rows[0], rows[1], rows[2], category, rows.slice(6));
  card.appendChild(cardContent);

  const iconsElement = create3DcategoryIcons(category);
  card.appendChild(iconsElement);

  // Append card content
  if (cardContent.children.length > 0) {
    card.appendChild(cardContent);
  }

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    card.dataset.blockName = block.dataset.blockName;
  }

  // Replace block content with card
  // Preserve block class and instrumentation
  card.classList.add('card-block');
  block.replaceWith(card);
}
