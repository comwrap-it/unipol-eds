/**
 * Insurance Product Card - Molecule
 *
 * Uses standard-button as an atom component for call-to-action buttons.
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within insurance-product-carousel.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createButton } from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';
import { createTag } from '@unipol-ds/components/atoms/tag/tag.js';
import { create3Dicons } from '@unipol-ds/components/atoms/icons-3D/icons-3D.js';
import { createOptimizedPicture } from '@unipol-ds/scripts/aem.js';
import {
  extractInstrumentationAttributes,
  restoreInstrumentation,
} from '@unipol-ds/scripts/utils.js';
import { BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '@unipol-ds/constants/index.js';
import { createTextElementFromObj } from '@unipol-ds/scripts/domHelpers.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('@unipol-ds/scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/icons-3D/icons-3D.css`),
  ]);
  isStylesLoaded = true;
}

/**
 *
 * @param rows
 * @return {
 *          {
 *            title: { value: string, instrumentation: string[] },
 *            description: { value: string, instrumentation: string[] },
 *            button: {
 *              label: string,
 *              variant: string,
 *              href: string,
 *              openInNewTab: boolean,
 *              iconSize: string,
 *              leftIcon: string,
 *              rigthIcon: string,
 *              instrumentation: string[]
 *              },
 *            note: { value: string, instrumentation: string[]},
 *            tag: { label: string, category: string, variant: string, instrumentation: string[] }
 *            image: { src: string, instrumentation: string[], altText: string },
 *            vehicleShowIcon: boolean,
 *            propertyShowIcon: boolean,
 *            personalShowIcon: boolean
 *          }
 *        }
 */
const extractValuesFromRows = (rows) => {
  const title = {};
  title.value = rows[0]?.textContent?.trim() || '';
  title.instrumentation = extractInstrumentationAttributes(rows[0].firstChild);

  const description = {};
  description.value = rows[1]?.textContent?.trim() || '';
  description.instrumentation = extractInstrumentationAttributes(rows[1].firstChild);

  const button = {};
  button.label = rows[2]?.textContent?.trim() || '';
  button.variant = rows[3]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  button.href = rows[4]?.querySelector('a')?.href || rows[4]?.textContent?.trim() || '';
  button.openInNewTab = rows[5]?.textContent?.trim() === 'true';
  button.iconSize = rows[6]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  button.leftIcon = rows[7]?.textContent?.trim() || '';
  button.rightIcon = rows[8]?.textContent?.trim() || '';
  button.instrumentation = extractInstrumentationAttributes(rows[2].firstChild);

  const note = {};
  note.value = rows[9]?.textContent?.trim() || '';
  note.instrumentation = extractInstrumentationAttributes(rows[9].firstChild);

  const tag = {};
  tag.label = rows[10].textContent.trim();
  tag.category = rows[11].textContent.trim();
  tag.variant = rows[12].textContent.trim();
  tag.instrumentation = extractInstrumentationAttributes(rows[10]);

  const image = {};
  const img = rows[13]?.querySelector('img');
  image.src = img?.getAttribute('src') ?? '';
  image.instrumentation = extractInstrumentationAttributes(img);
  image.altText = rows[14]?.textContent?.trim() || '';

  const vehicleShowIcon = rows[15]?.textContent?.trim() === 'true';
  const propertyShowIcon = rows[16]?.textContent?.trim() === 'true';
  const personalShowIcon = rows[17]?.textContent?.trim() === 'true';

  return {
    title,
    description,
    button,
    note,
    tag,
    image,
    vehicleShowIcon,
    propertyShowIcon,
    personalShowIcon,
  };
};

/**
 *
 * @param image { { src: string, instrumentation: string[], altText: string } }
 * @param isFirstCard {boolean}
 * @param tag { { label: string, category: string, variant: string, instrumentation: string[] } }
 * @return {HTMLDivElement}
 */
const createCardImage = (image, isFirstCard, tag) => {
  const cardImage = document.createElement('div');
  cardImage.className = 'insurance-product-card-image';

  if (image) {
    const tagElement = createTag(tag.label, tag.category, tag.variant, tag.instrumentation);

    if (tagElement && tagElement.classList) {
      tagElement.classList.add('insurance-product-card-tag');
    }

    if (cardImage && tagElement && tag) {
      cardImage.appendChild(tagElement);
    }

    const optimizedPic = createOptimizedPicture(
      image.src,
      image.altText,
      isFirstCard,
      [{ media: '(max-width: 768)', width: '343' }, { media: '(max-width: 1200)', width: '302' }, { media: '(max-width: 1440)', width: '276' }, { media: '(min-width: 1441)', width: '316' }],
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
 * @param title { { value: string, instrumentation: string[] } }
 * @param description { { value: string, instrumentation: string[] } }
 * @param button { {
 *          label: string,
 *          variant: string,
 *          href: string,
 *          openInNewTab: boolean,
 *          iconSize: string,
 *          leftIcon: string,
 *          rigthIcon: string,
 *          instrumentation: string[]
 *        } }
 * @param note { { value: string, instrumentation: string[] } }
 * @param vehicleShowIcon {boolean}
 * @param propertyShowIcon {boolean}
 * @param welfareShowIcon {boolean}
 * @return {HTMLDivElement} Card Content
 */
const createCardContent = (
  title,
  description,
  button,
  note,
  vehicleShowIcon,
  propertyShowIcon,
  welfareShowIcon,
) => {
  const cardTextContent = document.createElement('div');
  cardTextContent.className = 'insurance-product-card-text';

  const titleEl = createTextElementFromObj(title, 'title', 'h3');
  cardTextContent.appendChild(titleEl);
  const descriptionEl = createTextElementFromObj(description, 'description', 'p');
  cardTextContent.appendChild(descriptionEl);

  const cardContent = document.createElement('div');
  cardContent.className = 'insurance-product-card-content';

  cardContent.appendChild(cardTextContent);

  const buttonElement = createButton(
    button.label,
    button.href,
    button.openInNewTab,
    button.variant,
    button.iconSize,
    button.leftIcon,
    button.rigthIcon,
    button.instrumentation,
  );

  if (buttonElement && buttonElement.children.length > 0) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'button-subdescription';
    buttonsContainer.appendChild(buttonElement);

    if (note) {
      const noteEl = createTextElementFromObj(note, 'subdescription', 'p');
      buttonsContainer.appendChild(noteEl);
    }

    if (buttonsContainer.children.length > 0) {
      cardContent.appendChild(buttonsContainer);
    }
  }

  const iconsElement = create3Dicons(vehicleShowIcon, propertyShowIcon, welfareShowIcon);

  if (iconsElement && iconsElement.children.length > 0) {
    const imgVector = document.createElement('div');
    imgVector.className = 'img-vector';
    imgVector.appendChild(iconsElement);
    cardContent.appendChild(imgVector);
  }

  return cardContent;
};

/**
 *
 * @param title { { value: string, instrumentation: string[] } }
 * @param description { { value: string, instrumentation: string[] } }
 * @param button { {
 *          label: string,
 *          variant: string,
 *          href: string,
 *          openInNewTab: boolean,
 *          iconSize: string,
 *          leftIcon: string,
 *          rigthIcon: string,
 *          instrumentation: string[]
 *        } }
 * @param note { { value: string, instrumentation: string[] } }
 * @param image { { src: string, instrumentation: string[], altText: string } }
 * @param isFirstCard {boolean}
 * @param tag { { label: string, category: string, variant: string, instrumentation: string[] } }
 * @param vehicleShowIcon {boolean}
 * @param propertyShowIcon {boolean}
 * @param personalShowIcon {boolean}
 * @return {HTMLDivElement}
 */
const createInsuranceProductCard = (
  title,
  description,
  button,
  note,
  image,
  isFirstCard,
  tag,
  vehicleShowIcon,
  propertyShowIcon,
  personalShowIcon,
) => {
  const card = document.createElement('div');
  card.className = 'insurance-product-card-container';

  const cardImage = createCardImage(image, isFirstCard, tag);
  card.appendChild(cardImage);

  const cardContent = createCardContent(
    title,
    description,
    button,
    note,
    vehicleShowIcon,
    propertyShowIcon,
    personalShowIcon,
  );

  if (cardContent.children.length > 0) {
    card.appendChild(cardContent);
  }

  return card;
};

/**
 * Decorates a card block element
 * @param {HTMLElement} block - The card block element
 * @param {boolean} [isFirstCard=false] - Whether this is the first card (LCP candidate)
 */
export default async function decorateInsuranceProductCard(block, isFirstCard = false) {
  if (!block) return;

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
    button,
    note,
    tag,
    image,
    vehicleShowIcon,
    propertyShowIcon,
    personalShowIcon,
  } = extractValuesFromRows(rows);

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  const card = createInsuranceProductCard(
    title,
    description,
    button,
    note,
    image,
    isFirstCard,
    tag,
    vehicleShowIcon,
    propertyShowIcon,
    personalShowIcon,
  );

  Object.entries(instrumentation).forEach(([name, value]) => {
    card.setAttribute(name, value);
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    card.dataset.blockName = block.dataset.blockName;
  }

  card.classList.add('card-block');
  block.replaceWith(card);
}
