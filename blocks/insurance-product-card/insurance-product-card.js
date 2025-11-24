/**
 * Insurance Product Card - Molecule
 *
 * Uses standard-button as an atom component for call-to-action buttons.
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within insurance-product-carousel.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import {
  createButtonFromRows,
  // eslint-disable-next-line no-unused-vars
  extractInstrumentationAttributes,
}
  from '../atoms/buttons/standard-button/standard-button.js';
import { createTagFromRows } from '../atoms/tag/tag.js';
// eslint-disable-next-line no-unused-vars
import { create3Dicons } from '../atoms/icons-3D/icons-3D.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/icons-3D/icons-3D.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Decorates a card block element
 * @param {HTMLElement} block - The card block element
 */
export default async function decorateInsuranceProductCard(block) {
  if (!block) return;

  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Check if card is already decorated (has card-block class)
  // This happens when Universal Editor re-renders after an edit
  if (block.classList.contains('card-block')) {
    // eslint-disable-next-line no-console
    console.log('🔄 Card already decorated, skipping re-decoration');
    return;
  }

  // Create card structure
  const card = document.createElement('div');
  card.className = 'insurance-product-card-container';

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // eslint-disable-next-line no-console
  console.log('🃏 Card Rows:', {
    totalRows: rows.length,
    blockHTML: block.outerHTML,
    wrapperHTML: wrapper?.outerHTML || 'NO WRAPPER',
    blockChildren: Array.from(block.children).map((c) => c.className),
    rows: rows.map((r, i) => ({
      index: i,
      className: r.className,
      html: r.outerHTML,
      text: r.textContent?.trim(),
      hasAueProp: r.querySelector('[data-aue-prop]')?.getAttribute('data-aue-prop'),
    })),
  });

  // Extract card data
  // Row 0:  Title
  // Row 1:  Description
  // Row 2:  Button label
  // Row 3:  Button variant
  // Row 4:  Button link
  // Row 5:  Button size
  // Row 6:  Button left icon
  // Row 7:  Button right icon
  // Row 8:  Note
  // Row 9:  Tag Label
  // Row 10: Tag Category
  // Row 11: Tag Variant
  // Row 12: Image
  // Row 13: 3D Icon showVehicle
  // Row 14: 3D Icon showProperty
  // Row 15: 3D Icon showWelfare

  // Card Image
  const imageRow = rows[12];
  if (imageRow) {
    const cardImage = document.createElement('div');
    cardImage.className = 'insurance-product-card-image';

    const tagRows = rows.slice(9, 12);
    const tagElement = createTagFromRows(tagRows);
    tagElement.classList.add('insurance-product-card-tag');

    if (tagRows && tagRows.length > 0) {
      cardImage.appendChild(tagElement);
    }

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
          [{ media: '(min-width: 769)', width: '316' }, { media: '(max-width: 768)', width: '240' }, { media: '(max-width: 392)', width: '343' }],
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
            [{ media: '(min-width: 769)', width: '316' }, { media: '(max-width: 768)', width: '240' }, { media: '(max-width: 392)', width: '343' }],
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
  cardTextContent.className = 'insurance-product-card-text';

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
  // eslint-disable-next-line no-console
  console.log('📝 Card Subtitle Row:', {
    exists: !!subtitleRow,
    hasContent: subtitleRow?.textContent?.trim(),
    html: subtitleRow?.outerHTML?.substring(0, 150),
  });

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
  cardContent.className = 'insurance-product-card-content';

  cardContent.appendChild(cardTextContent);

  // Card Button - Rows 2-7 (optional)
  // Universal Editor creates separate rows for each button field
  const buttonRows = rows.slice(2, 8);
  const buttonElement = createButtonFromRows(buttonRows);

  if (buttonElement && buttonElement.children.length > 0) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'button-subdescription';

    buttonsContainer.appendChild(buttonElement);

    const note = rows[8];
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

  // eslint-disable-next-line no-console
  console.log('📦 Card Content Children:', {
    count: cardContent.children.length,
    children: Array.from(cardContent.children).map((c) => c.className),
  });

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
