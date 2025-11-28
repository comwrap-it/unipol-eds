import { BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';

export const createCategoryStrip = (
  variant,
  icon,
  iconSize,
  categoryText,
  tags = [],
) => {
  const categoryStrip = document.createElement('div');
  categoryStrip.className = `category-strip category-strip-${variant}`;

  const textIconContainer = document.createElement('div');
  textIconContainer.className = 'text-icon-container';
  categoryStrip.appendChild(textIconContainer);

  const iconSpan = document.createElement('span');
  iconSpan.className = `icon icon-${iconSize} ${icon}`;
  textIconContainer.appendChild(iconSpan);

  const categoryTextSpan = document.createElement('span');
  categoryTextSpan.className = 'category-text';
  categoryTextSpan.textContent = categoryText;
  textIconContainer.appendChild(categoryTextSpan);

  tags.forEach((tag) => {
    console.log('Tag:', tag);
  });

  return categoryStrip;
};

export const extractCategoryStripPropsFromRows = (rows) => {
  const variant = rows[0]?.textContent?.trim() || '';
  const icon = rows[1]?.textContent?.trim() || '';
  const iconSize = rows[2]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const categoryText = rows[3]?.textContent?.trim() || '';
  //   const tagLabel = rows[4].textContent.trim();
  //   const tagCategory = rows[5].textContent.trim();
  //   const tagType = rows[6].textContent.trim();
  return {
    variant,
    icon,
    iconSize,
    categoryText,
    // tagLabel,
    // tagCategory,
    // tagType,
  };
};

export default async function decorateCategoryStrip(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const {
    variant,
    icon,
    iconSize,
    categoryText,
    // tagLabel,
    // tagCategory,
    // tagType,
  } = extractCategoryStripPropsFromRows(rows);

  const categoryStrip = createCategoryStrip(
    variant,
    icon,
    iconSize,
    categoryText,
    // tagLabel,
    // tagCategory,
    // tagType,
  );

  block.replaceWith(categoryStrip);
}
