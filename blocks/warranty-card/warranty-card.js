/**
 * @typedef {import('../../types/types.js').TagConf} TagConf
 * @typedef {import('../../types/types.js').LinkButtonConf} LinkButtonConf
 */

import { loadCSS } from '../../scripts/aem.js';
import {
  createIconElementFromCssClass,
  createTextElementFromRow,
} from '../../scripts/domHelpers.js';
import { BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';

/**
 * Create icon and tag container
 * @param {string} icon the icon class (required)
 * @param {TagConf} tagConfig config for tag (optional)
 * @returns {Promise<HTMLElement>} The icon and tag container element
 */
const createIconAndTagContainer = async (icon, tagConfig) => {
  const iconAndTagContainer = document.createElement('div');
  iconAndTagContainer.className = 'icon-tag-wrapper';

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'icon-wrapper';
  iconAndTagContainer.appendChild(iconWrapper);
  const iconElement = createIconElementFromCssClass(icon, 'extra-large');
  iconWrapper.appendChild(iconElement);

  if (tagConfig?.label) {
    const { createTag } = await import('../atoms/tag/tag.js');
    await loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`);
    const tagElement = createTag(
      tagConfig.label,
      tagConfig.category,
      tagConfig.type,
    );
    iconAndTagContainer.appendChild(tagElement);
  }

  return iconAndTagContainer;
};

/**
 *
 * @param {string} title
 * @param {HTMLElement|null} titleRow
 * @param {string} description
 * @param {HTMLElement|null} descriptionRow
 * @returns {Promise<HTMLElement>}
 */
const createTextContent = (title, titleRow, description, descriptionRow) => {
  const textContent = document.createElement('div');
  textContent.className = 'text-content';
  let titleEl;
  if (titleRow?.firstChild) {
    titleEl = createTextElementFromRow(titleRow, 'title', 'h3');
  } else {
    titleEl = document.createElement('h3');
    titleEl.className = 'title';
    titleEl.textContent = title;
  }
  textContent.appendChild(titleEl);
  let descriptionEl;
  if (descriptionRow?.firstChild) {
    descriptionEl = createTextElementFromRow(
      descriptionRow,
      'description',
      'p',
    );
  } else {
    descriptionEl = document.createElement('p');
    descriptionEl.className = 'description';
    descriptionEl.textContent = description;
  }
  textContent.appendChild(descriptionEl);

  return textContent;
};

/**
 *
 * @param {LinkButtonConf} linkButtonConfig
 * @returns {Promise<HTMLElement>}
 */
const createCardLinkButton = async (linkButtonConfig) => {
  const { createLinkButton } = await import(
    '../atoms/buttons/link-button/link-button.js'
  );
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/atoms/buttons/link-button/link-button.css`,
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

  return linkButtonElement;
};

/**
 * @param {string} category (required)
 * @param {string} title (required)
 * @param {string} description (required)
 * @param {string} icon the icon class (required)
 * @param {LinkButtonConf} linkButtonConfig config for link button (optional)
 * @param {TagConf} tagConfig config for tag (optional)
 * @param {HTMLElement} titleRow the title row element (optional)
 * @param {HTMLElement} descriptionRow the description row element (optional)
 * @returns {Promise<HTMLElement>} The warranty card element
 */
export const createWarrantyCard = async (
  category,
  title,
  description,
  icon,
  linkButtonConfig = {},
  tagConfig = {},
  titleRow = null,
  descriptionRow = null,
) => {
  const card = document.createElement('div');
  card.className = `warranty-card${category ? ` ${category}` : ''}`;

  const iconAndTagContainer = await createIconAndTagContainer(icon, tagConfig);
  card.appendChild(iconAndTagContainer);

  const textContent = await createTextContent(title, titleRow, description, descriptionRow);
  card.appendChild(textContent);

  if (linkButtonConfig?.label && linkButtonConfig?.href) {
    const linkButton = await createCardLinkButton(linkButtonConfig);
    card.appendChild(linkButton);
  }

  return card;
};

export const extractWarrantyCardValuesFromRows = (rows) => {
  const category = rows[0]?.textContent?.trim() || 'default-mobility';
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
    const isDefaultCategory = category.startsWith('default-');
    tagConfig.label = rows[12]?.textContent?.trim() || '';
    tagConfig.category = isDefaultCategory ? '' : category;
    tagConfig.type = isDefaultCategory ? 'custom' : 'secondary';
  }
  return {
    category,
    title,
    description,
    icon,
    linkButtonConfig,
    tagConfig,
    titleRow: rows[1],
    descriptionRow: rows[2],
  };
};

export const createWarrantyCardFromRows = async (rows) => {
  const {
    category,
    title,
    description,
    icon,
    linkButtonConfig,
    tagConfig,
    titleRow,
    descriptionRow,
  } = extractWarrantyCardValuesFromRows(rows);
  const warrantyCard = await createWarrantyCard(
    category,
    title,
    description,
    icon,
    linkButtonConfig,
    tagConfig,
    titleRow,
    descriptionRow,
  );
  return warrantyCard;
};
