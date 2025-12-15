/**
 * @typedef {import('../../types/types.js').TagConf} TagConf
 * @typedef {import('../../types/types.js').LinkButtonConf} LinkButtonConf
 */

import { createIconElementFromCssClass } from '../../scripts/domHelpers.js';
import { BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';

/**
 * @param {string} category (required)
 * @param {string} title (required)
 * @param {string} description (required)
 * @param {string} icon the icon class (required)
 * @param {LinkButtonConf} linkButtonConfig config for link button (optional)
 * @param {TagConf} tagConfig config for tag (optional)
 */
export const createWarrantyCard = async (
  category,
  title,
  description,
  icon,
  linkButtonConfig = {},
  tagConfig = {},
) => {
  const card = document.createElement('div');
  card.className = `warranty-card${category ? ` ${category}` : ''}`;

  const iconAndTagContainer = document.createElement('div');
  iconAndTagContainer.className = 'icon-tag-wrapper';

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'icon-wrapper';
  iconAndTagContainer.appendChild(iconWrapper);
  const iconElement = createIconElementFromCssClass(icon, 'extra-large');
  iconWrapper.appendChild(iconElement);

  if (tagConfig?.label) {
    const { createTag } = await import('../atoms/tag/tag.js');
    const tagElement = createTag(
      tagConfig.label,
      tagConfig.category,
      tagConfig.type,
    );
    iconAndTagContainer.appendChild(tagElement);
  }

  card.appendChild(iconAndTagContainer);

  const textContent = document.createElement('div');
  textContent.className = 'text-content';
  const titleElement = document.createElement('h3');
  titleElement.className = 'title';
  titleElement.textContent = title;
  textContent.appendChild(titleElement);
  const descriptionElement = document.createElement('p');
  descriptionElement.className = 'description';
  descriptionElement.textContent = description;
  textContent.appendChild(descriptionElement);
  card.appendChild(textContent);

  if (linkButtonConfig?.label && linkButtonConfig?.href) {
    const { createLinkButton } = await import(
      '../atoms/buttons/link-button/link-button.js'
    );
    const linkButtonElement = createLinkButton(
      linkButtonConfig.label,
      linkButtonConfig.href,
      linkButtonConfig.openInNewTab,
      linkButtonConfig.leftIcon,
      linkButtonConfig.rightIcon,
      linkButtonConfig.leftIconSize,
      linkButtonConfig.rightIconSize,
      linkButtonConfig.disabled,
    );
    card.appendChild(linkButtonElement);
  }

  return card;
};

export const extractWarrantyCardValuesFromRows = (rows) => {
  const category = rows[0]?.textContent?.trim() || '';
  const title = rows[1]?.textContent?.trim() || '';
  const description = rows[2]?.textContent?.trim() || '';
  const icon = rows[3]?.textContent?.trim() || '';
  const linkButtonConfig = {};
  const tagConfig = {};
  if (rows[4]?.textContent?.trim()) {
    linkButtonConfig.label = rows[4]?.textContent?.trim() || 'Link';
    linkButtonConfig.href = rows[5]?.querySelector('a')?.href || rows[5]?.textContent?.trim() || '#';
    linkButtonConfig.openInNewTab = rows[6]?.textContent?.trim() === 'true';
    linkButtonConfig.leftIcon = rows[7]?.textContent?.trim() || '';
    linkButtonConfig.rightIcon = rows[8]?.textContent?.trim() || '';
    linkButtonConfig.leftIconSize = (
      rows[9]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM
    ).toLowerCase();
    linkButtonConfig.rightIconSize = (
      rows[10]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM
    ).toLowerCase();
    linkButtonConfig.disabled = rows[11]?.textContent?.trim() === 'true';
  }
  if (rows[12]?.textContent?.trim()) {
    tagConfig.label = rows[12]?.textContent?.trim() || '';
    tagConfig.category = rows[13]?.textContent?.trim() || '';
    tagConfig.type = rows[14]?.textContent?.trim() || '';
  }
  return {
    category,
    title,
    description,
    icon,
    linkButtonConfig,
    tagConfig,
  };
};

export const createWarrantyCardFromRows = async (rows) => {
  const {
    category, title, description, icon, linkButtonConfig, tagConfig,
  } = extractWarrantyCardValuesFromRows(rows);
  const warrantyCard = await createWarrantyCard(
    category,
    title,
    description,
    icon,
    linkButtonConfig,
    tagConfig,
  );
  return warrantyCard;
};
