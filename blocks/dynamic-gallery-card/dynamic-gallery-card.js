import { extractMediaElementFromRow } from '../../scripts/domHelpers.js';
import { createButton } from '../../scripts/libs/ds/components/atoms/buttons/standard-button/standard-button.js';
import { createTag } from '../../scripts/libs/ds/components/atoms/tag/tag.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Handles the link click to load the respective fragment
 * @param {Event} event
 */
const handleLinkClick = async (event) => {
  event.stopPropagation();
  event.preventDefault();
  const link = event.currentTarget;
  const href = link.getAttribute('href');
  if (href) {
    const fragment = await loadFragment(href);
    if (fragment) {
      const fragmentSection = fragment.querySelector(':scope .section');
      if (fragmentSection) {
        fragmentSection.classList.remove('section');
        document.body.appendChild(fragmentSection);
      }
    }
  }
};

/**
 * Create Dynamic Gallery Card element
 * @param {HTMLElement} picture The picture element
 * @param {string} imgAltText The alt text for the image
 * @param {string} tagLabel The tag label
 * @param {string} tagCategory The tag category
 * @param {string} tagType The tag type
 * @param {string} btnLabel The button label
 * @param {string} btnLink The button link URL
 * @returns {Promise<HTMLElement>} The Dynamic Gallery Card element
 */
export const createDynamicGalleryCard = async (
  picture,
  imgAltText,
  tagLabel,
  tagCategory,
  tagType,
  btnLabel,
  btnLink,
) => {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'dynamic-gallery-card';

  if (picture) {
    // Set alt text for image
    const imgElement = picture.querySelector('img');
    if (imgElement) {
      imgElement.alt = imgAltText || '';
    }
    picture.className = 'dynamic-gallery-card-image';
    cardContainer.appendChild(picture);
  }

  if (tagLabel) {
    const tag = createTag(tagLabel, tagCategory, tagType);
    cardContainer.appendChild(tag);
  }

  const overlay = document.createElement('div');
  overlay.className = 'dynamic-gallery-card-overlay theme-dark';

  if (btnLabel && btnLink) {
    const button = createButton(btnLabel, btnLink, false, 'primary');
    button.onclick = handleLinkClick;
    overlay.appendChild(button);
  }
  cardContainer.appendChild(overlay);

  return cardContainer;
};

export const extractDynamicGalleryCardValuesFromRows = (rows) => {
  const pictureElement = extractMediaElementFromRow(rows[0]);
  const imgAltText = rows[1]?.textContent?.trim() || '';
  const tagLabel = rows[2]?.textContent?.trim() || '';
  const tagCategory = rows[3]?.textContent?.trim() || '';
  const tagType = rows[4]?.textContent?.trim() || '';
  const btnLabel = rows[5]?.textContent?.trim() || '';
  const btnLink = rows[6]?.querySelector('a')?.getAttribute('href') || '';
  return {
    pictureElement,
    imgAltText,
    tagLabel,
    tagCategory,
    tagType,
    btnLabel,
    btnLink,
  };
};

export const createDynamicGalleryCardFromRows = async (rows) => {
  const {
    pictureElement,
    imgAltText,
    tagLabel,
    tagCategory,
    tagType,
    btnLabel,
    btnLink,
  } = extractDynamicGalleryCardValuesFromRows(rows);
  const card = await createDynamicGalleryCard(
    pictureElement,
    imgAltText,
    tagLabel,
    tagCategory,
    tagType,
    btnLabel,
    btnLink,
  );

  return card;
};
