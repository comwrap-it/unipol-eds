import { createOptimizedPicture } from "../../../../scripts/aem.js";
import { createIconElementFromCssClass } from "../../../../scripts/domHelpers.js";
import { createTag } from "../../../atoms/tag/tag.js";

/**
 *
 * @param {string} imagePath
 * @param {string} title
 * @param {string} durationIcon the css class for duration icon
 * @param {string} durationText
 * @param {string} label - Tag label (optional)
 * @param {string} category - Category name (optional)
 * @param {string} type - Tag type (optional)
 * @param {boolean} isSlide - Whether the card is used in a slide context
 */
export const createBlogCard = (
  imagePath,
  title,
  durationIcon,
  durationText,
  label,
  category,
  type,
  isSlide = false,
  animationClass = '',
) => {
  const card = document.createElement('div');
  card.className = `blog-card ${isSlide ? 'swiper-slide' : ''} ${animationClass}`;

  const picture = createOptimizedPicture(imagePath, `Blog image: ${title}`);
  picture.classList.add('blog-card-image');
  card.appendChild(picture);
  const tag = createTag(label, category, type);
  tag.classList.add('blog-card-tag');
  picture.appendChild(tag);

  const cardContent = document.createElement('div');
  cardContent.className = 'blog-card-content';

  const titleEl = document.createElement('h3');
  titleEl.className = 'blog-card-title';
  titleEl.textContent = title;
  cardContent.appendChild(titleEl);

  const durationEl = document.createElement('div');
  durationEl.className = 'blog-card-duration';

  const icon = createIconElementFromCssClass(durationIcon, 'large');
  durationEl.appendChild(icon);
  const durationTextEl = document.createElement('p');
  durationTextEl.className = 'blog-card-duration-text';
  durationTextEl.textContent = durationText;
  durationEl.appendChild(durationTextEl);
  cardContent.appendChild(durationEl);

  card.appendChild(cardContent);

  return card;
};