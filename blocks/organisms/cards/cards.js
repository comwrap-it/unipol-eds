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
async function createCard(cardData, index) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card-item';
  cardElement.dataset.index = index;

  // Create card block structure for the card molecule
  const cardBlock = document.createElement('div');
  cardBlock.className = 'card';
  
  // Copy the card content to the card block
  cardBlock.innerHTML = cardData.innerHTML;
  
  // Import and decorate the card molecule
  const cardModule = await import('../../molecules/card/card.js');
  cardModule.default(cardBlock);
  
  cardElement.appendChild(cardBlock);
  return cardElement;
}

/**
 * Main decoration function for Cards organism
 * @param {HTMLElement} block - The cards block element
 */
export default async function decorate(block) {
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
  const cardPromises = cards.map(async (card, index) => {
    const cardElement = await createCard(card, index);
    moveInstrumentation(card, cardElement);
    return cardElement;
  });

  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach(cardElement => {
    container.appendChild(cardElement);
  });

  // Replace block with container
  block.replaceWith(container);
}
