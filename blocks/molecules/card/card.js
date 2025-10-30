/**
 * Card Molecule - Atomic Design System
 * Single card component that combines image, text, and button atom
 */

import { createOptimizedPicture } from '../../../scripts/aem.js';
import { moveInstrumentation } from '../../../scripts/scripts.js';
import { createButton, BUTTON_VARIANTS } from '../../atoms/buttons/button/button.js';

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
    description = '',
    buttonText = 'Scopri di più',
    buttonLink = '#',
    onClick = null,
    className = '',
  } = config;

  // Create card container
  const card = document.createElement('div');
  card.className = `card ${className}`.trim();

  // Create image section
  if (image) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'card-image';

    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = image;
    img.alt = imageAlt || title;
    picture.appendChild(img);
    imageContainer.appendChild(picture);

    card.appendChild(imageContainer);
  }

  // Create body section
  const body = document.createElement('div');
  body.className = 'card-body';

  // Add title
  if (title) {
    const titleElement = document.createElement('h3');
    titleElement.className = 'card-title';
    titleElement.textContent = title;
    body.appendChild(titleElement);
  }

  // Add description
  if (description) {
    const descElement = document.createElement('p');
    descElement.className = 'card-description';
    descElement.textContent = description;
    body.appendChild(descElement);
  }

  // Add button (always primary variant)
  if (buttonText) {
    const button = createButton({
      text: buttonText,
      variant: BUTTON_VARIANTS.PRIMARY,
      onClick: onClick || (() => {
        if (buttonLink && buttonLink !== '#') {
          window.location.href = buttonLink;
        }
      }),
    });
    button.className += ' card-button';
    body.appendChild(button);
  }

  card.appendChild(body);
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

  // Extract data from the block structure
  const rows = [...block.children];

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'card';
    moveInstrumentation(row, card);

    const cells = [...row.children];

    cells.forEach((cell) => {
      if (cell.querySelector('picture')) {
        // This is an image cell
        const imageContainer = document.createElement('div');
        imageContainer.className = 'card-image';

        const picture = cell.querySelector('picture');
        const img = picture.querySelector('img');

        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageContainer.appendChild(optimizedPic);
        }

        card.appendChild(imageContainer);
      } else {
        // This is a content cell
        const body = document.createElement('div');
        body.className = 'card-body';

        // Move all content to body
        while (cell.firstChild) {
          body.appendChild(cell.firstChild);
        }

        // Find and enhance any links as buttons
        const links = body.querySelectorAll('a');
        links.forEach((link) => {
          const buttonText = link.textContent;
          const buttonLink = link.href;

          const button = createButton({
            text: buttonText,
            variant: BUTTON_VARIANTS.PRIMARY,
            onClick: () => {
              if (buttonLink && buttonLink !== '#') {
                window.location.href = buttonLink;
              }
            },
          });
          button.className += ' card-button';

          link.replaceWith(button);
        });

        card.appendChild(body);
      }
    });

    // Initialize interactions
    initializeCardInteractions(card);

    // Replace the original row with the new card
    row.replaceWith(card);
  });
}
