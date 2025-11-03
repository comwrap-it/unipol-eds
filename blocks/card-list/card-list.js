/**
 * Cards Organism - Atomic Design System
 * Container for 1-4 Card molecules arranged in a responsive grid layout
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

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
  const cardModule = await import('../card/card.js');
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

  // Get all child elements (both traditional and Universal Editor children)
  const allChildren = [...block.children];

  // Separate traditional card data from Universal Editor card components
  const cardData = [];
  const cardComponents = [];

  allChildren.forEach((child) => {
    if (child.classList.contains('card')) {
      // This is already a decorated card component from Universal Editor
      cardComponents.push(child);
    } else {
      // This is traditional card data that needs to be processed
      cardData.push(child);
    }
  });

  // Limit to maximum 4 cards as per specification
  const maxCards = 4;
  let cardsToProcess = [];

  // Add Universal Editor card components first
  cardsToProcess = [...cardComponents];

  // Add traditional card data up to the limit
  const remainingSlots = maxCards - cardComponents.length;
  if (remainingSlots > 0) {
    cardsToProcess = [...cardsToProcess, ...cardData.slice(0, remainingSlots)];
  }

  // Create grid container
  const container = document.createElement('div');
  container.className = 'cards-container';

  // Set grid columns based on number of cards
  const numCards = cardsToProcess.length;
  container.dataset.cardCount = numCards;

  // Process each card
  const cardPromises = cardsToProcess.map(async (card, index) => {
    if (card.classList.contains('card')) {
      // Already a decorated card component, just wrap it
      const cardElement = document.createElement('div');
      cardElement.className = 'card-item';
      cardElement.dataset.index = index;
      cardElement.appendChild(card);
      return cardElement;
    }
    // Traditional card data that needs decoration
    const cardElement = await createCard(card, index);
    moveInstrumentation(card, cardElement);
    return cardElement;
  });

  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach((cardElement) => {
    container.appendChild(cardElement);
  });

  // Replace block with container
  block.replaceWith(container);
}
