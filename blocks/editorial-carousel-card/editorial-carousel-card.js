/**
 * Editorial Carousel Card - Molecule
 *
 * Uses link-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within editorial-carousel.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createLinkButton } from '../atoms/buttons/link-button/link-button.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const extractInstrumentationAttributes = (element) => {
  const instrumentation = {};

  if (!element) return instrumentation;

  [...element.attributes].forEach((attr) => {
    if (
      attr.name.startsWith('data-aue-')
      || attr.name.startsWith('data-richtext-')
    ) {
      instrumentation[attr.name] = attr.value;
    }
  });

  return instrumentation;
};

const DEFAULT_ICON_SIZE = 'medium';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/link-button/link-button.css`),
  ]);
  isStylesLoaded = true;
}

const createLinkButtonFromStandardButtonRows = (rows) => {
  if (!rows || rows.length === 0) return null;

  const label = rows[0]?.textContent?.trim() || '';
  if (!label) return null;

  const href = rows[2]?.querySelector('a')?.href || rows[2]?.textContent?.trim() || '';
  const openInNewTab = rows[3]?.textContent?.trim() === 'true';
  const iconSize = (rows[4]?.textContent || '').trim().toLowerCase() || DEFAULT_ICON_SIZE;
  const leftIcon = rows[5]?.textContent?.trim() || '';
  const rightIcon = rows[6]?.textContent?.trim() || '';
  const disabled = !href;

  const linkButton = createLinkButton(
    label,
    href || '#',
    openInNewTab,
    leftIcon,
    rightIcon,
    iconSize,
    iconSize,
    disabled,
  );

  const instrumentation = extractInstrumentationAttributes(rows[0]);
  Object.entries(instrumentation).forEach(([name, value]) => {
    linkButton.setAttribute(name, value);
  });

  return linkButton;
};

const findImageRowIndex = (rows) => {
  if (!rows || rows.length === 0) return -1;

  for (let index = rows.length - 1; index >= 0; index -= 1) {
    const row = rows[index];
    if (row?.querySelector('picture, img')) return index;
  }

  for (let index = rows.length - 1; index >= 9; index -= 1) {
    const row = rows[index];
    if (row?.querySelector('a[href]')) return index;
  }

  return -1;
};

/**
 * Decorates a card block element
 * @param {HTMLElement} block - The card block element
 * @param {boolean} [isFirstCard=false] - Whether this is the first card (LCP candidate)
 */
export default async function decorateEditorialCarouselCard(block, isFirstCard = false) {
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
  // Row 3:  Button variant (unused by link-button)
  // Row 4:  Button link
  // Row 5:  Button target
  // Row 6:  Button size
  // Row 7:  Button left icon
  // Row 8:  Button right icon
  // Row 9:  Note
  // Row 13: Image
  // Row 14: Image Alternative Text

  // Card Image
  const imageRowIndex = findImageRowIndex(rows);
  const imageRow = imageRowIndex >= 0 ? rows[imageRowIndex] : null;
  if (imageRow) {
    const cardImage = document.createElement('div');
    cardImage.className = 'editorial-carousel-card-image';

    const altText = rows[imageRowIndex + 1]?.textContent?.trim() || '';
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
  const buttonElement = createLinkButtonFromStandardButtonRows(buttonRows);

  if (buttonElement) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'button-subdescription';

    buttonsContainer.appendChild(buttonElement);

    const note = imageRowIndex === 9 ? null : rows[9];
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
  block.replaceWith(card);
}
