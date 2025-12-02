import {
  createIconElementFromCssClass,
  createTextElementFromRow,
  extractMediaElementFromRow,
} from '../../scripts/domHelpers.js';
import { createTag } from '../atoms/tag/tag.js';

export const extractBlogCardDataFromRows = (rows) => {
  const imageEl = extractMediaElementFromRow(rows[0]);
  const titleRow = rows[1];
  const durationIcon = rows[2]?.textContent.trim();
  const durationTextRow = rows[3];
  const label = rows[4]?.textContent.trim();
  const category = rows[5]?.textContent.trim();
  const type = rows[6]?.textContent.trim();
  return {
    imageEl,
    titleRow,
    durationIcon,
    durationTextRow,
    label,
    category,
    type,
  };
};

/**
 *
 * @param {HTMLPictureElement} imageEl
 * @param {HTMLElement} titleRow
 * @param {string} durationIcon the css class for duration icon
 * @param {HTMLElement} durationTextRow
 * @param {string} label - Tag label (optional)
 * @param {string} category - Category name (optional)
 * @param {string} type - Tag type (optional)
 * @param {boolean} isSlide - Whether the card is used in a slide context
 */
export const createBlogCard = (
  imageEl,
  titleRow,
  durationIcon,
  durationTextRow,
  label,
  category,
  type,
  isSlide = false,
) => {
  const card = document.createElement('div');
  card.className = `blog-card ${isSlide ? 'swiper-slide' : ''}`;

  imageEl.classList.add('blog-card-image');
  card.appendChild(imageEl);

  const tag = createTag(label, category, type);
  tag.classList.add('blog-card-tag');
  imageEl.appendChild(tag);

  const cardContent = document.createElement('div');
  cardContent.className = 'blog-card-content';

  const titleEl = createTextElementFromRow(titleRow, 'blog-card-title', 'h3');
  cardContent.appendChild(titleEl);

  const durationEl = document.createElement('div');
  durationEl.className = 'blog-card-duration';

  const icon = createIconElementFromCssClass(durationIcon, 'large');
  durationEl.appendChild(icon);
  const durationTextEl = createTextElementFromRow(
    durationTextRow,
    'blog-card-duration-text',
    'p',
  );
  durationEl.appendChild(durationTextEl);
  cardContent.appendChild(durationEl);
};
