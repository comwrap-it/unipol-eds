/**
 * Card Molecule - Atomic Design System
 * Single card component with image, title, subtitle, and button atom
 */

import { createOptimizedPicture } from '../../../scripts/aem.js';
import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * Create image element for card
 * @param {HTMLElement} imageRow - Row containing image
 * @returns {HTMLElement} Image container
 */
function createImageElement(imageRow) {
  const imageContainer = document.createElement('div');
  imageContainer.className = 'card-image';

  const picture = imageRow.querySelector('picture');
  const img = imageRow.querySelector('img');

  if (img) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    imageContainer.appendChild(optimizedPic);
  } else if (picture) {
    imageContainer.appendChild(picture.cloneNode(true));
  }

  return imageContainer;
}

/**
 * Create title element for card
 * @param {HTMLElement} titleRow - Row containing title
 * @returns {HTMLElement} Title element
 */
function createTitleElement(titleRow) {
  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = titleRow.textContent.trim();
  return title;
}

/**
 * Create subtitle element for card
 * @param {HTMLElement} subtitleRow - Row containing subtitle
 * @returns {HTMLElement} Subtitle element
 */
function createSubtitleElement(subtitleRow) {
  const subtitle = document.createElement('p');
  subtitle.className = 'card-subtitle';
  subtitle.textContent = subtitleRow.textContent.trim();
  return subtitle;
}

/**
 * Create button element for card using button atom
 * @param {HTMLElement} buttonRow - Row containing button data
 * @returns {HTMLElement} Button element
 */
function createButtonElement(buttonRow) {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'card-button';

  // Create a button block structure for the button atom
  const buttonBlock = document.createElement('div');
  buttonBlock.className = 'btn';

  // Copy the button row content to the button block
  buttonBlock.innerHTML = buttonRow.innerHTML;

  // Import and decorate the button atom
  import('../../atoms/buttons/primary-button/primary-button.js').then((buttonModule) => {
    buttonModule.default(buttonBlock);
  });

  buttonContainer.appendChild(buttonBlock);
  return buttonContainer;
}

/**
 * Create a single card element
 * @param {Object} config - Card configuration
 * @returns {HTMLElement} Card element
 */
export function createCard(config = {}) {
  const {
    image = '',
    imageAlt = '',
    title = '',
    subtitle = '',
    buttonText = 'Scopri di più',
    buttonLink = '#',
    className = '',
  } = config;

  // Create card container
  const card = document.createElement('article');
  card.className = `card ${className}`.trim();

  // Create image section (top)
  if (image) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'card-image';

    const img = document.createElement('img');
    img.src = image;
    img.alt = imageAlt || title;
    img.className = 'card-image-img';
    imageContainer.appendChild(img);

    card.appendChild(imageContainer);
  }

  // Create content container
  const content = document.createElement('div');
  content.className = 'card-content';

  // Add title
  if (title) {
    const titleElement = document.createElement('h3');
    titleElement.className = 'card-title';
    titleElement.textContent = title;
    content.appendChild(titleElement);
  }

  // Add subtitle
  if (subtitle) {
    const subtitleElement = document.createElement('p');
    subtitleElement.className = 'card-subtitle';
    subtitleElement.textContent = subtitle;
    content.appendChild(subtitleElement);
  }

  // Add button (using atom)
  if (buttonText) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'card-button';

    const buttonBlock = document.createElement('div');
    buttonBlock.className = 'btn';

    // Create button content structure
    const buttonContent = document.createElement('div');
    if (buttonLink && buttonLink !== '#') {
      const link = document.createElement('a');
      link.href = buttonLink;
      link.textContent = buttonText;
      buttonContent.appendChild(link);
    } else {
      buttonContent.textContent = buttonText;
    }
    buttonBlock.appendChild(buttonContent);

    // Import and decorate the button atom
    import('../../atoms/buttons/primary-button/primary-button.js').then((buttonModule) => {
      buttonModule.default(buttonBlock);
    });

    buttonContainer.appendChild(buttonBlock);
    content.appendChild(buttonContainer);
  }

  card.appendChild(content);
  return card;
}

/**
 * Initialize card interactions
 * @param {HTMLElement} card - Card element
 */
function initializeCardInteractions(card) {
  if (!card) return;

  // Add hover effects to the entire card
  card.addEventListener('mouseenter', () => {
    card.classList.add('card-hover');
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('card-hover');
  });

  // Make the entire card clickable if it has a button
  const button = card.querySelector('.card-button');
  if (button) {
    card.addEventListener('click', (e) => {
      // Only trigger if not clicking directly on the button
      if (e.target !== button && !button.contains(e.target)) {
        button.click();
      }
    });

    // Add cursor pointer to indicate clickability
    card.style.cursor = 'pointer';
  }
}

/**
 * Main decoration function for EDS
 * @param {HTMLElement} block - The card block element
 */
export default function decorate(block) {
  if (!block) return;

  const [imageRow, titleRow, subtitleRow, buttonRow] = block.children;

  // Create card structure
  const card = document.createElement('article');
  card.className = 'card';

  // Image (top)
  if (imageRow) {
    const image = createImageElement(imageRow);
    card.appendChild(image);
  }

  // Content container
  const content = document.createElement('div');
  content.className = 'card-content';

  // Title
  if (titleRow) {
    const title = createTitleElement(titleRow);
    content.appendChild(title);
  }

  // Subtitle
  if (subtitleRow) {
    const subtitle = createSubtitleElement(subtitleRow);
    content.appendChild(subtitle);
  }

  // Button (using atom)
  if (buttonRow) {
    const button = createButtonElement(buttonRow);
    content.appendChild(button);
  }

  card.appendChild(content);

  // Initialize interactions
  initializeCardInteractions(card);

  block.replaceWith(card);
}
