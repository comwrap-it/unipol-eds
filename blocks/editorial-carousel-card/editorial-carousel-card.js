/**
 * edictorial Carousel Card - Molecule
 *
 * Uses standard-button as an atom component for call-to-action buttons.
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within edictorial-carousel.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import {
  createButtonFromRows,
  extractInstrumentationAttributes,
} from '../atoms/buttons/standard-button/standard-button.js';
import { createTagFromRows } from '../atoms/tag/tag.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    // eslint-disable-next-line max-len
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    ),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/icons-3D/icons-3D.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Decorates a card block element
 * @param {HTMLElement} block - The card block element
 */
export default async function decorateEdictorialCarouselCard(block) {
  // eslint-disable-next-line no-useless-return
  if (!block) return;

  // eslint-disable-next-line no-console
  console.log('editorial-carousel-card block', block);

  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Check if card is already decorated (has card-block class)
  // This happens when Universal Editor re-renders after an edit
  if (block.classList.contains('card-block')) {
    return;
  }

  // Create card structure
  const card = document.createElement('div');
  card.className = 'editorial-carousel-card-container';

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
  // Row 2:  Button label
  // Row 3:  Button variant
  // Row 4:  Button link
  // Row 5:  Button target
  // Row 6:  Button size
  // Row 7:  Button left icon
  // Row 8:  Button right icon
  // Row 9:  Note
  // Row 10:  Tag Label
  // Row 11: Tag Category
  // Row 12: Tag Variant
  // Row 13: Image
  // Row 14: Image Alternative Text
  // Row 15: 3D Icon showVehicle
  // Row 16: 3D Icon showProperty
  // Row 17: 3D Icon showWelfare

  // Card Image
  const imageRow = rows[13];
  if (imageRow) {
    const cardImage = document.createElement('div');
    cardImage.className = 'editorial-carousel-card-image';

    const tagRows = rows.slice(10, 13);
    const tagElement = createTagFromRows(tagRows);

    if (tagElement && tagElement.classList) {
      tagElement.classList.add('editorial-carousel-card-tag');
    }

    if (cardImage && tagElement && tagRows && tagRows.length > 0) {
      cardImage.appendChild(tagElement);
    }

    const altText = rows[14]?.textContent?.trim() || '';
    const picture = imageRow.querySelector('picture');
    if (picture) {
      //     // Move existing picture (preserves instrumentation)

      picture.querySelector('img').setAttribute('alt', altText);
      cardImage.appendChild(picture);
    } else {
      const img = imageRow.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          altText,
          false,
          // eslint-disable-next-line max-len
          [
            { media: '(min-width: 769)', width: '316' },
            { media: '(max-width: 768)', width: '240' },
            { media: '(max-width: 392)', width: '343' },
          ],
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
            altText,
            false,
            // eslint-disable-next-line max-len
            [
              { media: '(min-width: 769)', width: '316' },
              { media: '(max-width: 768)', width: '240' },
              { media: '(max-width: 392)', width: '343' },
            ],
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

  // Card Text Content
  const cardTextContent = document.createElement('div');
  cardTextContent.className = 'editorial-carousel-card-text';

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
  cardContent.className = 'editorial-carousel-card-content';

  cardContent.appendChild(cardTextContent);

  // Card Button - Rows 2-9 (optional)
  // Universal Editor creates separate rows for each button field
  const buttonRows = rows.slice(2, 9);
  const buttonElement = createButtonFromRows(buttonRows);

  if (buttonElement && buttonElement.children.length > 0) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'button-subdescription';

    buttonsContainer.appendChild(buttonElement);

    const note = rows[9];
    if (note) {
      // Try to preserve existing paragraph
      const existingPara = note.querySelector('p');
      if (existingPara) {
        existingPara.className = 'subdescription';
        moveInstrumentation(note, existingPara);
        buttonsContainer.appendChild(existingPara);
      } else if (note.textContent?.trim()) {
        // Create new paragraph but preserve instrumentation
        const noteFromHTML = document.createElement('p');
        noteFromHTML.className = 'subdescription';
        // Clone child nodes to preserve richtext instrumentation
        while (note.firstChild) {
          noteFromHTML.appendChild(note.firstChild);
        }
        // Move instrumentation from row to note
        moveInstrumentation(note, noteFromHTML);
        buttonsContainer.appendChild(noteFromHTML);
      }
    }

    if (buttonsContainer.children.length > 0) {
      cardContent.appendChild(buttonsContainer);
    }
  }

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
  block.replaceChildren(card);
}
