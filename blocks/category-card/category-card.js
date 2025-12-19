/**
 * Category Card - Molecule
 *
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within insurance-product-carousel.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { create3DiconsFromRows } from '../atoms/icons-3D/icons-3D.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { getValuesFromBlock, restoreInstrumentation } from '../../scripts/utils.js';
import { createTextElementFromObj } from '../../scripts/domHelpers.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/icons-3D/icons-3D.css`),
  ]);
  isStylesLoaded = true;
}

/**
 *
 * @param { { value, instrumentation } || null } image
 * @param { { value, instrumentation } || null } altText
 * @return {HTMLDivElement}
 */
const createImageCard = (image, altText) => {
  const cardImage = document.createElement('div');
  cardImage.className = 'category-card-image';

  if (image && image.value) {
    const optimizedPic = createOptimizedPicture(
      image.value,
      altText?.value || '',
      false,
      [{ media: '(min-width: 769)', width: '316' }, { media: '(max-width: 768)', width: '240' }, { media: '(max-width: 392)', width: '343' }],
    );

    // Preserve instrumentation from link
    const newImg = optimizedPic.querySelector('img');
    if (newImg && image.instrumentation) {
      restoreInstrumentation(newImg, image.instrumentation);
    }

    cardImage.appendChild(optimizedPic);
  }

  return cardImage;
};

const createCardContent = (title, subTitle) => {
  const cardContent = document.createElement('div');
  cardContent.className = 'category-card-inner-content';

  const titleElement = createTextElementFromObj(title, 'title', 'h3');
  const subTitleElement = createTextElementFromObj(subTitle, 'subtitle', 'p');

  cardContent.appendChild(titleElement);
  cardContent.appendChild(subTitleElement);
  return cardContent;
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

  const properties = ['title', 'description', 'note', 'image', 'imageSR'];
  const valuesFromBlock = getValuesFromBlock(block, properties);

  const image = createImageCard(valuesFromBlock.image, valuesFromBlock.imageSR);
  card.appendChild(image);

  const cardContent = createCardContent(valuesFromBlock.title, valuesFromBlock.description);
  card.appendChild(cardContent);

  const rows = Array.from(block.children);
  const iconsRows = rows.slice(2, 6);
  const iconsElement = create3DiconsFromRows(iconsRows);

  if (iconsElement && iconsElement.children.length > 0) {
    const imgVector = document.createElement('div');
    imgVector.className = 'img-vector';
    imgVector.appendChild(iconsElement);
    card.appendChild(imgVector);
  }

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
  block.replaceChildren(card);
}
