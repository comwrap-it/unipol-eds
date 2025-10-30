/**
 * Cards Organism - Atomic Design System
 * Collection of Card molecules arranged in a grid layout
 */

import { moveInstrumentation } from '../../../scripts/scripts.js';
import { createCard } from '../../molecules/card/card.js';

/**
 * Extract card data from DOM structure
 * @param {HTMLElement} row - Row element containing card data
 * @returns {Object} Card configuration object
 */
function extractCardData(row) {
  const cells = [...row.children];
  const cardData = {
    image: '',
    imageAlt: '',
    title: '',
    description: '',
    buttonText: 'Scopri di più',
    buttonLink: '#'
  };

  cells.forEach((cell) => {
    if (cell.querySelector('picture')) {
      // Extract image data
      const img = cell.querySelector('img');
      if (img) {
        cardData.image = img.src;
        cardData.imageAlt = img.alt;
      }
    } else {
      // Extract text content
      const headings = cell.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = cell.querySelectorAll('p');
      const links = cell.querySelectorAll('a');

      // Get title from first heading
      if (headings.length > 0) {
        cardData.title = headings[0].textContent.trim();
      }

      // Get description from paragraphs (excluding those with links)
      const textParagraphs = [...paragraphs].filter(p => !p.querySelector('a'));
      if (textParagraphs.length > 0) {
        cardData.description = textParagraphs.map(p => p.textContent.trim()).join(' ');
      }

      // Get button data from first link
      if (links.length > 0) {
        cardData.buttonText = links[0].textContent.trim();
        cardData.buttonLink = links[0].href;
      }
    }
  });

  return cardData;
}

/**
 * Main decoration function for Cards organism
 * @param {HTMLElement} block - The cards block element
 */
export default function decorate(block) {
  if (!block) return;

  // Create container for cards
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';

  // Create grid for cards
  const cardsGrid = document.createElement('ul');
  cardsGrid.className = 'cards-grid';

  // Process each row as a card
  [...block.children].forEach((row) => {
    const cardData = extractCardData(row);
    
    // Create card using the Card molecule
    const card = createCard(cardData);
    
    // Wrap card in list item
    const li = document.createElement('li');
    li.className = 'cards-item';
    moveInstrumentation(row, li);
    li.appendChild(card);
    
    cardsGrid.appendChild(li);
  });

  // Replace block content
  block.textContent = '';
  cardsContainer.appendChild(cardsGrid);
  block.appendChild(cardsContainer);
}
