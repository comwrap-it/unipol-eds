// region Imports
import { createOptimizedPicture, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  createButton,
  BUTTON_VARIANTS,
  BUTTON_ICON_SIZES,
  extractInstrumentationAttributes,
} from '../atoms/buttons/standard-button/standard-button.js';
// endregion

// region Styles loader
let stylesLoaded = false;

async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  await loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`);
  stylesLoaded = true;
}
// endregion

// region Helpers
const getTextContent = (cell) => cell?.textContent?.trim() || '';

const getBooleanContent = (cell) => getTextContent(cell).toLowerCase() === 'true';

function createMedia(cell, alt) {
  if (!cell) return null;
  const picture = cell.querySelector('picture');
  if (picture) {
    const clonedPicture = picture.cloneNode(true);
    moveInstrumentation(cell, clonedPicture);
    const img = clonedPicture.querySelector('img');
    if (img && alt) img.alt = alt;
    return clonedPicture;
  }
  const img = cell.querySelector('img');
  if (img && img.src) {
    const optimizedPic = createOptimizedPicture(
      img.src,
      alt || img.alt || '',
      false,
      [{ media: '(min-width: 768px)', width: '316' }, { width: '240' }],
    );
    const newImg = optimizedPic.querySelector('img');
    if (newImg) moveInstrumentation(img, newImg);
    return optimizedPic;
  }
  const link = cell.querySelector('a');
  if (link && link.href) {
    const optimizedPic = createOptimizedPicture(
      link.href,
      alt || '',
      false,
      [{ media: '(min-width: 768px)', width: '316' }, { width: '240' }],
    );
    return optimizedPic;
  }
  return null;
}
// endregion

// region Card factory
function createCard(row) {
  const cells = Array.from(row.children);
  if (!cells.length) return null;

  const [
    imageCell,
    titleCell,
    descriptionCell,
    buttonLabelCell,
    buttonHrefCell,
    buttonVariantCell,
    buttonTargetCell,
    buttonLeftIconCell,
    buttonRightIconCell,
    noteCell,
  ] = cells;

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'cta-card-text';

  if (titleCell) {
    const existingHeading = titleCell.querySelector('h1, h2, h3, h4, h5, h6');
    const heading = existingHeading ? existingHeading.cloneNode(true) : document.createElement('h3');
    if (!existingHeading) heading.textContent = getTextContent(titleCell);
    heading.classList.add('cta-card-title');
    moveInstrumentation(titleCell, heading);
    titleWrapper.appendChild(heading);
  }

  if (descriptionCell && descriptionCell.textContent.trim()) {
    const description = document.createElement('p');
    description.className = 'cta-card-description';
    while (descriptionCell.firstChild) {
      description.appendChild(descriptionCell.firstChild);
    }
    moveInstrumentation(descriptionCell, description);
    titleWrapper.appendChild(description);
  }

  const buttonLabel = getTextContent(buttonLabelCell);
  const buttonHref = buttonHrefCell?.querySelector('a')?.href || getTextContent(buttonHrefCell);
  const buttonVariant = getTextContent(buttonVariantCell).toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const buttonOpenInNewTab = getBooleanContent(buttonTargetCell);
  const buttonLeftIcon = getTextContent(buttonLeftIconCell);
  const buttonRightIcon = getTextContent(buttonRightIconCell);
  const instrumentation = extractInstrumentationAttributes(buttonLabelCell);

  const card = document.createElement('div');
  card.className = 'cta-card';

  const media = createMedia(imageCell, getTextContent(titleCell));
  if (media) {
    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'cta-card-image';
    mediaWrapper.appendChild(media);
    card.appendChild(mediaWrapper);
  }

  const content = document.createElement('div');
  content.className = 'cta-card-content';

  if (titleWrapper.childElementCount) {
    content.appendChild(titleWrapper);
  }

  if (buttonLabel) {
    const button = createButton(
      buttonLabel,
      buttonHref,
      buttonOpenInNewTab,
      buttonVariant,
      BUTTON_ICON_SIZES.MEDIUM,
      buttonLeftIcon,
      buttonRightIcon,
      instrumentation,
    );
    button.classList.add('cta-card-button');

    const actions = document.createElement('div');
    actions.className = 'cta-card-actions';
    actions.appendChild(button);

    if (noteCell && noteCell.textContent.trim()) {
      const note = document.createElement('p');
      note.className = 'cta-card-note';
      while (noteCell.firstChild) {
        note.appendChild(noteCell.firstChild);
      }
      moveInstrumentation(noteCell, note);
      actions.appendChild(note);
    }

    content.appendChild(actions);
  }

  if (content.childElementCount) {
    card.appendChild(content);
  }

  moveInstrumentation(row, card);
  return card;
}
// endregion

// region Decorator
export default async function decorate(block) {
  await ensureStylesLoaded();

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  const grid = document.createElement('div');
  grid.className = 'cta-card-grid';

  rows.forEach((row) => {
    const card = createCard(row);
    if (card) grid.appendChild(card);
  });

  block.textContent = '';
  block.appendChild(grid);
}
// endregion
