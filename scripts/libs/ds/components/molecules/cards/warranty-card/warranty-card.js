import { loadCSS } from '../../../../scripts/aem.js';
import { createTextElementFromRow } from '../../../../scripts/domHelpers.js';
import { loadFragment } from '../../../../scripts/fragment.js';
import { createTag } from '../../../atoms/tag/tag.js';

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
    await loadCSS('../../../atoms/tag/tag.css');
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

const createCardLinkButton = async (label, href) => {
  await loadCSS(
    '../../../atoms/buttons/link-button/link-button.css',
  );
  const linkButton = document.createElement('a');
  linkButton.className = 'link-btn';
  linkButton.href = href;
  linkButton.textContent = label;
  linkButton.onclick = (event) => handleLinkClick(event);

  return linkButton;
};

/**
 * @param {string} category (required)
 * @param {string} title (required)
 * @param {string} description (required)
 * @param {string} icon the icon class (required)
 * @param {Pick<LinkButtonConf, "label" | "href">} linkButtonConfig config for button (optional)
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

  const textContent = await createTextContent(
    title,
    titleRow,
    description,
    descriptionRow,
  );
  card.appendChild(textContent);

  if (linkButtonConfig?.label && linkButtonConfig?.href) {
    const linkButton = await createCardLinkButton(
      linkButtonConfig.label,
      linkButtonConfig.href,
    );
    if (linkButton) {
      card.appendChild(linkButton);
    }
  }

  return card;
};
