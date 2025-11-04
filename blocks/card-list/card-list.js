/**
 * Card List Component - Organism
 *
 * Uses card component as a molecule to display a list of cards.
 * Each card uses primary-button as an atom for call-to-action buttons.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates a card-list block element
 * @param {HTMLElement} block - The card-list block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Import card component dynamically
  const cardModule = await import('../card/card.js');
  const decorateCard = cardModule.default;

  // Create ul container
  const ul = document.createElement('ul');
  ul.className = 'card-list-items';

  // Process each row as a card
  const rows = Array.from(block.children);

  // Process all cards in parallel to avoid await in loop
  const cardPromises = rows.map(async (row) => {
    const li = document.createElement('li');
    li.className = 'card-list-item';

    // Preserve instrumentation from row to li
    moveInstrumentation(row, li);

    // Create a card block element to decorate
    // This mimics the structure that Universal Editor expects
    const cardBlock = document.createElement('div');
    cardBlock.className = 'card';
    cardBlock.dataset.blockName = 'card';

    // Preserve row instrumentation on card block if present
    if (row.hasAttribute('data-aue-resource')) {
      cardBlock.setAttribute('data-aue-resource', row.getAttribute('data-aue-resource'));
      const aueBehavior = row.getAttribute('data-aue-behavior');
      if (aueBehavior) {
        cardBlock.setAttribute('data-aue-behavior', aueBehavior);
      }
      const aueType = row.getAttribute('data-aue-type');
      if (aueType) {
        cardBlock.setAttribute('data-aue-type', aueType);
      }
      const aueLabel = row.getAttribute('data-aue-label');
      if (aueLabel) {
        cardBlock.setAttribute('data-aue-label', aueLabel);
      }
      const aueProp = row.getAttribute('data-aue-prop');
      if (aueProp) {
        cardBlock.setAttribute('data-aue-prop', aueProp);
      }
    }

    // Move all children from row to card block (preserves their instrumentation)
    while (row.firstElementChild) {
      cardBlock.append(row.firstElementChild);
    }

    // Temporarily append cardBlock to li so it's in the DOM
    // This is needed for replaceWith to work correctly
    li.appendChild(cardBlock);

    // Decorate the card block using the card component (molecule)
    // This will preserve instrumentation within the card
    // Note: decorateCard uses replaceWith, so cardBlock will be replaced
    await decorateCard(cardBlock);

    // After replaceWith, cardBlock is replaced with the card element
    // The card element should now be the first child of li
    const decoratedCard = li.querySelector('.card-block, .card') || li.firstElementChild;
    if (decoratedCard) {
      // Ensure card has proper block class for Universal Editor
      if (!decoratedCard.classList.contains('block')) {
        decoratedCard.classList.add('block');
      }
    }

    // Load block CSS to ensure styles are applied
    // This also ensures the block is properly registered for Universal Editor
    // Use the decorated card element if available
    if (decoratedCard && decoratedCard.dataset.blockName) {
      await loadBlock(decoratedCard);
    }

    return li;
  });

  // Wait for all cards to be processed
  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach((li) => {
    ul.append(li);
  });

  // Preserve block instrumentation
  if (block.hasAttribute('data-aue-resource')) {
    ul.setAttribute('data-aue-resource', block.getAttribute('data-aue-resource'));
    ul.setAttribute('data-aue-behavior', block.getAttribute('data-aue-behavior') || 'component');
    ul.setAttribute('data-aue-type', block.getAttribute('data-aue-type') || 'block');
    const aueLabel = block.getAttribute('data-aue-label');
    if (aueLabel) {
      ul.setAttribute('data-aue-label', aueLabel);
    }
  }

  // Replace block content with ul
  // Preserve block class and instrumentation
  ul.classList.add('card-list-block');
  block.replaceWith(ul);
}
