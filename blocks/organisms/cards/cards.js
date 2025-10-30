/**
 * Cards Organism - Atomic Design System
 * Container for 1-4 Card molecules arranged in a responsive grid layout
 */

import { moveInstrumentation } from '../../../scripts/scripts.js';

/**
 * Create a single card element from row data
 * @param {HTMLElement} cardData - Card row data
 * @param {number} index - Card index
 * @returns {HTMLElement} Card element
 */
function createCard(cardData, index) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card-item';
  cardElement.dataset.index = index;

  // Move the card content directly - let card.js handle the decoration
  while (cardData.firstChild) {
    cardElement.appendChild(cardData.firstChild);
  }

  return cardElement;
}

/**
 * Main decoration function for Cards organism
 * @param {HTMLElement} block - The cards block element
 */
export default function decorate(block) {
  if (!block) return;

  const cards = [...block.children];

  // Limit to maximum 4 cards as per specification
  if (cards.length > 4) {
    cards.splice(4);
  }

  // Create grid container
  const container = document.createElement('div');
  container.className = 'cards-container';

  // Set grid columns based on number of cards
  const numCards = cards.length;
  container.dataset.cardCount = numCards;

  // Process each card
  cards.forEach((card, index) => {
    const cardElement = createCard(card, index);
    moveInstrumentation(card, cardElement);
    container.appendChild(cardElement);
  });

  // Replace block with container
  block.replaceWith(container);
}
