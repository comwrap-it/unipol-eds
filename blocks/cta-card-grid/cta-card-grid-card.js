// region Imports
import {
  createButton,
  BUTTON_VARIANTS,
  BUTTON_ICON_SIZES,
  extractInstrumentationAttributes,
} from '../atoms/buttons/standard-button/standard-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  createMedia,
  getBooleanContent,
  getTextContent,
} from './cta-card-grid-helpers.js';
// endregion

// region Card factory
export default function createCard(row) {
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
