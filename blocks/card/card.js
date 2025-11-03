/**
 * Card Molecule - Atomic Design System
 * Single card component with image, title, subtitle, and button atom
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

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
    import('../primary-button/primary-button.js').then((buttonModule) => {
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

  // Make the entire card clickable if it has buttons
  const buttons = card.querySelectorAll('.card-button, .card-buttons .primary-button');
  if (buttons.length > 0) {
    const primaryButton = buttons[0]; // Use the first button as primary

    card.addEventListener('click', (e) => {
      // Only trigger if not clicking directly on any button
      const clickedButton = e.target.closest('.card-button, .primary-button');
      if (!clickedButton) {
        // Find the first clickable element in the primary button
        const clickableElement = primaryButton.querySelector('a, button') || primaryButton;
        if (clickableElement.click) {
          clickableElement.click();
        }
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
export default async function decorate(block) {
  if (!block) return;

  // Handle Universal Editor structure
  let rows = Array.from(block.children);

  // Check if we have default-content-wrapper structure
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Extract data from rows based on Universal Editor structure
  const [imageRow, titleRow, subtitleRow, ...childItemRows] = rows;

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

  // Handle child components (Primary Buttons) added via Universal Editor
  if (childItemRows && childItemRows.length > 0) {
    // Create a container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'card-buttons';

    // Process child rows to create buttons
    // eslint-disable-next-line no-restricted-syntax
    for (const childRow of childItemRows) {
      // Check if this is a primary-button component
      const isPrimaryButton = childRow.classList.contains('primary-button')
                           || childRow.querySelector('.primary-button')
                           || childRow.textContent.trim(); // Any content could be a button

      if (isPrimaryButton) {
        // Create button block element
        const buttonBlock = document.createElement('div');
        buttonBlock.className = 'primary-button';

        // Copy content from the child row
        const cells = Array.from(childRow.querySelectorAll('td, div, p, a'));
        if (cells.length > 0) {
          // Use the first cell's content
          const cellContent = cells[0].cloneNode(true);
          buttonBlock.appendChild(cellContent);
        } else {
          // Fallback: use the entire row content
          buttonBlock.innerHTML = childRow.innerHTML;
        }

        // Apply the primary-button decorator
        import('../primary-button/primary-button.js')
          .then((buttonModule) => {
            if (buttonModule.default) {
              buttonModule.default(buttonBlock);
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.warn('Could not load primary-button module:', error);
          });

        // Add to button container
        buttonContainer.appendChild(buttonBlock);
      }
    }

    // Only add button container if it has buttons
    if (buttonContainer.children.length > 0) {
      content.appendChild(buttonContainer);
    }
  }

  card.appendChild(content);

  // Handle any additional child components (like primary-button) that might be added
  // These will be processed by their respective decorators when added via Universal Editor

  // Initialize interactions
  initializeCardInteractions(card);

  // Instead of replacing the block, clear it and append the card inside
  // This preserves Universal Editor attributes on the original block
  block.innerHTML = '';
  block.appendChild(card);

  // Copy card classes to the block for styling
  block.className = `${block.className} card-wrapper`.trim();
}
