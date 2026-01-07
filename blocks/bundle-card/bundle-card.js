/**
 * Bundle Card - Molecule
 *
 * Uses standard-button as an atom component for call-to-action buttons.
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within bundle-carousel.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createButtonFromRows } from '../atoms/buttons/standard-button/standard-button.js';
import { createCategoryStripFromRows } from '../category-strip/category-strip.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { extractInstrumentationAttributes } from '../../scripts/utils.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Decorates a card block element
 * @param {HTMLElement} block - The card block element
 * @param {boolean} [isFirstCard=false] - Whether this is the first card (LCP candidate)
 */
export default async function decorateBundleCard(block, isFirstCard = false) {
  if (!block) return;

  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Check if card is already decorated (has card-block class)
  // This happens when Universal Editor re-renders after an edit
  if (block.classList.contains('card-block')) {
    return;
  }

  // Create card structure
  const card = document.createElement('div');
  card.className = 'bundle-card-container';

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  // Extract card data
  // Row 0:  Title
  // Row 1:  Description
  // Row 2:  Button 1 label
  // Row 3:  Button 1 variant
  // Row 4:  Button 1 link
  // Row 5:  Button 1 target
  // Row 6:  Button 1 size
  // Row 7:  Button 1 left icon
  // Row 8:  Button 1 right icon

  // Row 9:  Button 2 label
  // Row 10:  Button 2 variant
  // Row 11:  Button 2 link
  // Row 12:  Button 2 target
  // Row 13:  Button 2 size
  // Row 14:  Button 2 left icon
  // Row 15:  Button 2 right icon
  // Row 16: Note
  // Row 17: Image
  // Row 18: Image Alternative Text

  // Row 19: 1 Category Strip Background Color
  // Row 20: 1 Category Strip Icon
  // Row 21: 1 Category Strip Desc
  // Row 22: 1 Category Strip tag 1 label
  // Row 23: 1 Category Strip tag 1 variant
  // Row 24: 1 Category Strip tag 2 label
  // Row 25: 1 Category Strip tag 2 variant

  // Card Image
  const imageRow = rows[17];
  if (imageRow) {
    const cardImage = document.createElement('div');
    cardImage.className = 'bundle-card-image';

    const altText = rows[18].textContent?.trim() || '';
    const picture = imageRow.querySelector('picture');
    if (picture) {
      // Move existing picture (preserves instrumentation)
      const existingImg = picture.querySelector('img');
      if (existingImg) {
        existingImg.setAttribute('alt', altText);
        // Optimize for LCP if this is the first card
        if (isFirstCard) {
          existingImg.setAttribute('loading', 'eager');
          existingImg.setAttribute('fetchpriority', 'high');
        }
      }
      cardImage.appendChild(picture);
    } else {
      const img = imageRow.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          altText,
          isFirstCard, // Use eager loading for first card (LCP candidate)
          [{ media: '(min-width: 769)', width: '316' }, { media: '(max-width: 768)', width: '240' }, { media: '(max-width: 392)', width: '343' }],
        );
        // Preserve instrumentation from original img
        const newImg = optimizedPic.querySelector('img');
        if (newImg && img) {
          moveInstrumentation(img, newImg);
          // Add fetchpriority for LCP optimization
          if (isFirstCard) {
            newImg.setAttribute('fetchpriority', 'high');
          }
        }
        cardImage.appendChild(optimizedPic);
      } else {
        // Try to get image from link
        const link = imageRow.querySelector('a');
        if (link && link.href) {
          const optimizedPic = createOptimizedPicture(
            link.href,
            altText,
            isFirstCard, // Use eager loading for first card (LCP candidate)
            [{ media: '(min-width: 769)', width: '316' }, { media: '(max-width: 768)', width: '240' }, { media: '(max-width: 392)', width: '343' }],
          );
          // Preserve instrumentation from link
          const newImg = optimizedPic.querySelector('img');
          if (newImg && link) {
            moveInstrumentation(link, newImg);
            // Add fetchpriority for LCP optimization
            if (isFirstCard) {
              newImg.setAttribute('fetchpriority', 'high');
            }
          }
          cardImage.appendChild(optimizedPic);
        }
      }
    }

    if (cardImage.children.length > 0) {
      card.appendChild(cardImage);
    }
  }

  // Card Text Content
  const cardTextContent = document.createElement('div');
  cardTextContent.className = 'bundle-card-text';

  // Card Title - preserve original element and instrumentation
  const titleRow = rows[0];
  if (titleRow) {
    // Try to preserve existing heading element
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      // Move existing heading and preserve instrumentation
      existingHeading.className = 'title';
      moveInstrumentation(titleRow, existingHeading);
      cardTextContent.appendChild(existingHeading);
    } else {
      // Create new heading but preserve instrumentation
      const title = document.createElement('h3');
      title.className = 'title';
      // Clone child nodes to preserve richtext instrumentation
      while (titleRow.firstChild) {
        title.appendChild(titleRow.firstChild);
      }
      // Move instrumentation from row to title
      moveInstrumentation(titleRow, title);
      if (title.textContent?.trim()) {
        cardTextContent.appendChild(title);
      }
    }
  }

  // Card Subtitle - preserve original element and instrumentation
  const subtitleRow = rows[1];

  // ALWAYS create subtitle element (even if row doesn't exist or is empty)
  // This ensures subtitle is always visible in the DOM for editing
  if (subtitleRow) {
    // Try to preserve existing paragraph
    const existingPara = subtitleRow.querySelector('p');
    if (existingPara) {
      existingPara.className = 'description';
      moveInstrumentation(subtitleRow, existingPara);
      cardTextContent.appendChild(existingPara);
    } else if (subtitleRow.textContent?.trim()) {
      // Create new paragraph but preserve instrumentation
      const subtitle = document.createElement('p');
      subtitle.className = 'description';
      // Clone child nodes to preserve richtext instrumentation
      while (subtitleRow.firstChild) {
        subtitle.appendChild(subtitleRow.firstChild);
      }
      // Move instrumentation from row to subtitle
      moveInstrumentation(subtitleRow, subtitle);
      cardTextContent.appendChild(subtitle);
    }
  }

  // Card Content
  const cardContent = document.createElement('div');
  cardContent.className = 'bundle-card-content';

  cardContent.appendChild(cardTextContent);

  // BUTTON 1 (rows 2 → 8)
  const button1Rows = rows.slice(2, 9);
  const button1 = createButtonFromRows(button1Rows);

  // BUTTON 2 (rows 9 → 15)
  const button2Rows = rows.slice(9, 16);
  const button2 = createButtonFromRows(button2Rows);

  // NOTE
  const noteRow = rows[16];

  if (button1 || button2 || noteRow) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'button-subdescription';

    if (button1 && button1.children.length > 0) {
      buttonsContainer.appendChild(button1);
    }

    if (button2 && button2.children.length > 0) {
      buttonsContainer.appendChild(button2);
    }

    if (noteRow) {
      const existingPara = noteRow.querySelector('p');
      if (existingPara) {
        existingPara.className = 'subdescription';
        moveInstrumentation(noteRow, existingPara);
        buttonsContainer.appendChild(existingPara);
      } else if (noteRow.textContent?.trim()) {
        const noteFromHTML = document.createElement('p');
        noteFromHTML.className = 'subdescription';
        while (noteRow.firstChild) {
          noteFromHTML.appendChild(noteRow.firstChild);
        }
        moveInstrumentation(noteRow, noteFromHTML);
        buttonsContainer.appendChild(noteFromHTML);
      }
    }

    if (buttonsContainer.children.length > 0) {
      cardContent.appendChild(buttonsContainer);
    }
  }

  // CATEGORY STRIP (rows 19–25)
  const categoryStripRows = rows.slice(19, 26);
  const strip = createCategoryStripFromRows(categoryStripRows);
  if (strip) card.appendChild(strip);

  // Append card content
  if (cardContent.children.length > 0) {
    card.appendChild(cardContent);
  }

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    card.setAttribute(name, value);
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    card.dataset.blockName = block.dataset.blockName;
  }

  // Replace block content with card
  // Preserve block class and instrumentation
  card.classList.add('card-block');
  block.replaceWith(card);
}
