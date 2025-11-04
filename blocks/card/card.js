/**
 * Card Component - Molecule
 *
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within card-list.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createButton, BUTTON_VARIANTS, BUTTON_SIZES } from '../primary-button/primary-button.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates a card block element
 * @param {HTMLElement} block - The card block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Create card structure
  const card = document.createElement('div');
  card.className = 'card';

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Extract card data
  // Row 0: Image
  // Row 1: Title
  // Row 2: Subtitle (optional)
  // Row 3+: Buttons/CTA (optional)

  // Card Image
  const imageRow = rows[0];
  if (imageRow) {
    const cardImage = document.createElement('div');
    cardImage.className = 'card-image';

    const picture = imageRow.querySelector('picture');
    if (picture) {
      // Move existing picture (preserves instrumentation)
      cardImage.appendChild(picture);
    } else {
      const img = imageRow.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt || '',
          false,
          [{ width: '750' }],
        );
        // Preserve instrumentation from original img
        const newImg = optimizedPic.querySelector('img');
        if (newImg && img) {
          moveInstrumentation(img, newImg);
        }
        cardImage.appendChild(optimizedPic);
      } else {
        // Try to get image from link
        const link = imageRow.querySelector('a');
        if (link && link.href) {
          const optimizedPic = createOptimizedPicture(
            link.href,
            link.textContent?.trim() || '',
            false,
            [{ width: '750' }],
          );
          // Preserve instrumentation from link
          const newImg = optimizedPic.querySelector('img');
          if (newImg && link) {
            moveInstrumentation(link, newImg);
          }
          cardImage.appendChild(optimizedPic);
        }
      }
    }

    if (cardImage.children.length > 0) {
      card.appendChild(cardImage);
    }
  }

  // Card Content
  const cardContent = document.createElement('div');
  cardContent.className = 'card-content';

  // Card Title - preserve original element and instrumentation
  const titleRow = rows[1];
  if (titleRow) {
    // Try to preserve existing heading element
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      // Move existing heading and preserve instrumentation
      existingHeading.className = 'card-title';
      moveInstrumentation(titleRow, existingHeading);
      cardContent.appendChild(existingHeading);
    } else {
      // Create new heading but preserve instrumentation
      const title = document.createElement('h3');
      title.className = 'card-title';
      // Clone child nodes to preserve richtext instrumentation
      while (titleRow.firstChild) {
        title.appendChild(titleRow.firstChild);
      }
      // Move instrumentation from row to title
      moveInstrumentation(titleRow, title);
      if (title.textContent?.trim()) {
        cardContent.appendChild(title);
      }
    }
  }

  // Card Subtitle - preserve original element and instrumentation
  const subtitleRow = rows[2];
  if (subtitleRow && subtitleRow.textContent?.trim()) {
    // Try to preserve existing paragraph
    const existingPara = subtitleRow.querySelector('p');
    if (existingPara) {
      existingPara.className = 'card-subtitle';
      moveInstrumentation(subtitleRow, existingPara);
      cardContent.appendChild(existingPara);
    } else {
      // Create new paragraph but preserve instrumentation
      const subtitle = document.createElement('p');
      subtitle.className = 'card-subtitle';
      // Clone child nodes to preserve richtext instrumentation
      while (subtitleRow.firstChild) {
        subtitle.appendChild(subtitleRow.firstChild);
      }
      // Move instrumentation from row to subtitle
      moveInstrumentation(subtitleRow, subtitle);
      if (subtitle.textContent?.trim()) {
        cardContent.appendChild(subtitle);
      }
    }
  }

  // Card Buttons/CTA - preserve original elements and instrumentation
  const buttonRows = rows.slice(3);
  if (buttonRows && buttonRows.length > 0) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'card-buttons';

    buttonRows.forEach((buttonRow) => {
      if (!buttonRow) return;

      // Check if button row has instrumentation (Universal Editor)
      const hasInstrumentation = buttonRow.hasAttribute('data-aue-resource')
        || buttonRow.querySelector('[data-aue-resource]')
        || buttonRow.querySelector('[data-richtext-prop]');

      // If button row has instrumentation, preserve the original structure
      // Otherwise, create button using primary-button atom
      if (hasInstrumentation) {
        // Preserve original button structure for Universal Editor
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'card-button-wrapper';
        // Clone all children to preserve instrumentation
        while (buttonRow.firstChild) {
          buttonWrapper.appendChild(buttonRow.firstChild);
        }
        // Move instrumentation from row to wrapper
        moveInstrumentation(buttonRow, buttonWrapper);
        buttonsContainer.appendChild(buttonWrapper);
      } else {
        // Extract button data from row
        const buttonData = Array.from(buttonRow.children);
        const label = buttonData[0]?.textContent?.trim() || 'Button';

        // Try to get link from row
        const link = buttonRow.querySelector('a');
        const href = link?.href || buttonData[1]?.textContent?.trim() || '';

        // Get variant and size (defaults if not provided)
        const variant = buttonData[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
        const size = buttonData[2]?.textContent?.trim().toLowerCase() || BUTTON_SIZES.MEDIUM;

        // Create button using primary-button atom
        const button = createButton(label, href, variant, size);
        if (button) {
          buttonsContainer.appendChild(button);
        }
      }
    });

    if (buttonsContainer.children.length > 0) {
      cardContent.appendChild(buttonsContainer);
    }
  }

  // Append card content
  if (cardContent.children.length > 0) {
    card.appendChild(cardContent);
  }

  // Preserve block instrumentation before replacing content
  if (block.hasAttribute('data-aue-resource')) {
    card.setAttribute('data-aue-resource', block.getAttribute('data-aue-resource'));
    card.setAttribute('data-aue-behavior', block.getAttribute('data-aue-behavior') || 'component');
    card.setAttribute('data-aue-type', block.getAttribute('data-aue-type') || 'block');
    const aueLabel = block.getAttribute('data-aue-label');
    if (aueLabel) {
      card.setAttribute('data-aue-label', aueLabel);
    }
  }

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    card.dataset.blockName = block.dataset.blockName;
  }

  // Replace block content with card
  // Preserve block class and instrumentation
  card.classList.add('card-block');
  block.replaceWith(card);
}
