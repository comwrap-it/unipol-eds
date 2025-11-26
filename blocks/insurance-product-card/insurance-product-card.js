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
  createButton,
  createButtonFromRows,
  extractInstrumentationAttributes,
  BUTTON_VARIANTS,
  BUTTON_ICON_SIZES,
} from '../atoms/buttons/standard-button/standard-button.js';
import { createTag, createTagFromRows } from '../atoms/tag/tag.js';
import { create3Dicons, create3DiconsFromRows } from '../atoms/icons-3D/icons-3D.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Export constants for external use
export { BUTTON_VARIANTS, BUTTON_ICON_SIZES };

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  
  // Check if we're in Storybook (CSS should be loaded globally)
  // In Storybook, window.hlx might not exist or codeBasePath might be empty
  const isStorybook = !window.hlx?.codeBasePath || 
    typeof window.STORYBOOK_ENV !== 'undefined' ||
    document.querySelector('link[href*="standard-button.css"]') !== null;
  
  if (isStorybook) {
    // In Storybook, CSS should already be loaded globally
    // Just mark as loaded to avoid unnecessary async operations
    isStylesLoaded = true;
    return;
  }
  
  // In AEM EDS, load CSS dynamically
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/icons-3D/icons-3D.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Create an insurance product card element programmatically
 *
 * This is the SINGLE SOURCE OF TRUTH for card creation.
 * Used by both the decorate() function (AEM EDS) and Storybook.
 *
 * @param {HTMLElement|string} titleContent - Title element or text
 * @param {HTMLElement|string} descriptionContent - Description element or text
 * @param {HTMLElement|Object} buttonElementOrConfig - Pre-created button element or button configuration
 * @param {string} buttonElementOrConfig.label - Button label (if config)
 * @param {string} buttonElementOrConfig.href - Button URL (if config)
 * @param {string} buttonElementOrConfig.variant - Button variant (if config)
 * @param {string} buttonElementOrConfig.iconSize - Button icon size (if config)
 * @param {string} buttonElementOrConfig.leftIcon - Button left icon (if config)
 * @param {string} buttonElementOrConfig.rightIcon - Button right icon (if config)
 * @param {boolean} buttonElementOrConfig.openInNewTab - Open in new tab (if config)
 * @param {HTMLElement|string} noteContent - Note element or text
 * @param {HTMLElement|Object} tagElementOrConfig - Pre-created tag element or tag configuration
 * @param {string} tagElementOrConfig.label - Tag label (if config)
 * @param {string} tagElementOrConfig.category - Tag category (if config)
 * @param {string} tagElementOrConfig.type - Tag type (if config)
 * @param {HTMLElement|string} imageContent - Image element or URL
 * @param {string} imageAlt - Image alt text (if imageContent is URL)
 * @param {HTMLElement|Object} icons3DElementOrConfig - Pre-created 3D icons element or configuration
 * @param {boolean} icons3DElementOrConfig.showVehicle - Show vehicle icon (if config)
 * @param {boolean} icons3DElementOrConfig.showProperty - Show property icon (if config)
 * @param {boolean} icons3DElementOrConfig.showWelfare - Show welfare icon (if config)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The insurance product card element
 */
export async function createInsuranceProductCard(
  titleContent = '',
  descriptionContent = '',
  buttonElementOrConfig = null,
  noteContent = '',
  tagElementOrConfig = null,
  imageContent = '',
  imageAlt = '',
  icons3DElementOrConfig = null,
  instrumentation = {},
) {
  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Create card structure
  const card = document.createElement('div');
  card.className = 'insurance-product-card-container';

  // Card Image Section
  if (imageContent || tagElementOrConfig) {
    const cardImage = document.createElement('div');
    cardImage.className = 'insurance-product-card-image';

    // Add tag if provided
    let tagElement = null;
    if (tagElementOrConfig) {
      if (tagElementOrConfig instanceof HTMLElement) {
        tagElement = tagElementOrConfig;
      } else {
        tagElement = createTag(
          tagElementOrConfig.label || '',
          tagElementOrConfig.category || '',
          tagElementOrConfig.type || '',
          tagElementOrConfig.instrumentation || {},
        );
      }
      if (tagElement) {
        tagElement.classList.add('insurance-product-card-tag');
        cardImage.appendChild(tagElement);
      }
    }

    // Add image if provided
    if (imageContent) {
      let picture = null;
      if (imageContent instanceof HTMLElement) {
        // Use existing picture element
        picture = imageContent;
      } else if (typeof imageContent === 'string') {
        // Create optimized picture from URL
        picture = createOptimizedPicture(
          imageContent,
          imageAlt || '',
          false,
          [{ media: '(min-width: 769)', width: '316' }, { media: '(max-width: 768)', width: '240' }, { media: '(max-width: 392)', width: '343' }],
        );
      }
      if (picture) {
        cardImage.appendChild(picture);
      }
    }

    if (cardImage.children.length > 0) {
      card.appendChild(cardImage);
    }
  }

  // Card Text Content
  const cardTextContent = document.createElement('div');
  cardTextContent.className = 'insurance-product-card-text';

  // Add title
  if (titleContent) {
    let titleElement;
    if (titleContent instanceof HTMLElement) {
      titleElement = titleContent;
      titleElement.className = 'title';
    } else {
      titleElement = document.createElement('h3');
      titleElement.className = 'title';
      titleElement.textContent = titleContent;
    }
    if (titleElement.textContent?.trim()) {
      cardTextContent.appendChild(titleElement);
    }
  }

  // Add description
  if (descriptionContent) {
    let descriptionElement;
    if (descriptionContent instanceof HTMLElement) {
      descriptionElement = descriptionContent;
      descriptionElement.className = 'description';
    } else {
      descriptionElement = document.createElement('p');
      descriptionElement.className = 'description';
      descriptionElement.textContent = descriptionContent;
    }
    if (descriptionElement.textContent?.trim()) {
      cardTextContent.appendChild(descriptionElement);
    }
  }

  // Card Content Container
  const cardContent = document.createElement('div');
  cardContent.className = 'insurance-product-card-content';
  cardContent.appendChild(cardTextContent);

  // Card Button and Note Section
  let buttonElement = null;
  if (buttonElementOrConfig) {
    if (buttonElementOrConfig instanceof HTMLElement) {
      buttonElement = buttonElementOrConfig;
    } else {
      // Create button from config
      buttonElement = createButton(
        buttonElementOrConfig.label || '',
        buttonElementOrConfig.href || '',
        buttonElementOrConfig.openInNewTab || false,
        buttonElementOrConfig.variant || BUTTON_VARIANTS.PRIMARY,
        buttonElementOrConfig.iconSize || BUTTON_ICON_SIZES.MEDIUM,
        buttonElementOrConfig.leftIcon || '',
        buttonElementOrConfig.rightIcon || '',
        buttonElementOrConfig.instrumentation || {},
      );
    }
  }

  if (buttonElement && buttonElement.children.length > 0) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'button-subdescription';
    buttonsContainer.appendChild(buttonElement);

    // Add note if provided
    if (noteContent) {
      let noteElement;
      if (noteContent instanceof HTMLElement) {
        noteElement = noteContent;
        noteElement.className = 'subdescription';
      } else {
        noteElement = document.createElement('p');
        noteElement.className = 'subdescription';
        noteElement.textContent = noteContent;
      }
      if (noteElement.textContent?.trim()) {
        buttonsContainer.appendChild(noteElement);
      }
    }

    if (buttonsContainer.children.length > 0) {
      cardContent.appendChild(buttonsContainer);
    }
  }

  // Card 3D Icons
  let iconsElement = null;
  if (icons3DElementOrConfig) {
    if (icons3DElementOrConfig instanceof HTMLElement) {
      iconsElement = icons3DElementOrConfig;
    } else {
      iconsElement = create3Dicons(
        icons3DElementOrConfig.showVehicle || false,
        icons3DElementOrConfig.showProperty || false,
        icons3DElementOrConfig.showWelfare || false,
      );
    }
  }

  if (iconsElement && iconsElement.children.length > 0) {
    const imgVector = document.createElement('div');
    imgVector.className = 'img-vector';
    imgVector.appendChild(iconsElement);
    cardContent.appendChild(imgVector);
  }

  // Append card content
  if (cardContent.children.length > 0) {
    card.appendChild(cardContent);
  }

  // Restore instrumentation
  Object.entries(instrumentation).forEach(([name, value]) => {
    card.setAttribute(name, value);
  });

  // Add card-block class
  card.classList.add('card-block');

  return card;
}

/**
 * Extract card data from rows
 * @param {HTMLElement[]} rows - Array of rows from block children
 * @returns {Object} Extracted card data
 */
function extractCardDataFromRows(rows) {
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  // Extract title
  const titleRow = rows[0];
  let titleElement = null;
  if (titleRow) {
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      titleElement = existingHeading;
      moveInstrumentation(titleRow, titleElement);
    } else {
      titleElement = document.createElement('h3');
      while (titleRow.firstChild) {
        titleElement.appendChild(titleRow.firstChild);
      }
      moveInstrumentation(titleRow, titleElement);
    }
  }

  // Extract description
  const subtitleRow = rows[1];
  let descriptionElement = null;
  if (subtitleRow) {
    const existingPara = subtitleRow.querySelector('p');
    if (existingPara) {
      descriptionElement = existingPara;
      moveInstrumentation(subtitleRow, descriptionElement);
    } else if (subtitleRow.textContent?.trim()) {
      descriptionElement = document.createElement('p');
      while (subtitleRow.firstChild) {
        descriptionElement.appendChild(subtitleRow.firstChild);
      }
      moveInstrumentation(subtitleRow, descriptionElement);
    }
  }

  // Extract button from rows 2-7
  const buttonRows = rows.slice(2, 8);
  const buttonElement = createButtonFromRows(buttonRows);

  // Extract note
  const noteRow = rows[8];
  let noteElement = null;
  if (noteRow) {
    const existingPara = noteRow.querySelector('p');
    if (existingPara) {
      noteElement = existingPara;
      moveInstrumentation(noteRow, noteElement);
    } else if (noteRow.textContent?.trim()) {
      noteElement = document.createElement('p');
      while (noteRow.firstChild) {
        noteElement.appendChild(noteRow.firstChild);
      }
      moveInstrumentation(noteRow, noteElement);
    }
  }

  // Extract tag from rows 9-11
  const tagRows = rows.slice(9, 12);
  const tagElement = createTagFromRows(tagRows);

  // Extract image from row 12
  const imageRow = rows[12];
  let imageElement = null;
  let imageAlt = '';
  if (imageRow) {
    const picture = imageRow.querySelector('picture');
    if (picture) {
      imageElement = picture;
      moveInstrumentation(imageRow, picture);
    } else {
      const img = imageRow.querySelector('img');
      if (img) {
        imageAlt = img.alt || '';
        const optimizedPic = createOptimizedPicture(
          img.src,
          imageAlt,
          false,
          [{ media: '(min-width: 769)', width: '316' }, { media: '(max-width: 768)', width: '240' }, { media: '(max-width: 392)', width: '343' }],
        );
        const newImg = optimizedPic.querySelector('img');
        if (newImg && img) {
          moveInstrumentation(img, newImg);
        }
        imageElement = optimizedPic;
      } else {
        const link = imageRow.querySelector('a');
        if (link && link.href) {
          imageAlt = link.textContent?.trim() || '';
          const optimizedPic = createOptimizedPicture(
            link.href,
            imageAlt,
            false,
            [{ media: '(min-width: 769)', width: '316' }, { media: '(max-width: 768)', width: '240' }, { media: '(max-width: 392)', width: '343' }],
          );
          const newImg = optimizedPic.querySelector('img');
          if (newImg && link) {
            moveInstrumentation(link, newImg);
          }
          imageElement = optimizedPic;
        }
      }
    }
  }

  // Extract 3D icons from rows 13-15
  const iconsRows = rows.slice(13, 16);
  const iconsElement = create3DiconsFromRows(iconsRows);

  return {
    titleElement,
    descriptionElement,
    buttonElement,
    noteElement,
    tagElement,
    imageElement,
    imageAlt,
    iconsElement,
    instrumentation,
  };
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

  // Extract card data from rows
  const cardData = extractCardDataFromRows(rows);

  // Create card using the centralized function
  const card = await createInsuranceProductCard(
    cardData.titleElement,
    cardData.descriptionElement,
    cardData.buttonElement,
    cardData.noteElement,
    cardData.tagElement,
    cardData.imageElement,
    cardData.imageAlt,
    cardData.iconsElement,
    cardData.instrumentation,
  );

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    card.dataset.blockName = block.dataset.blockName;
  }

  // Replace block with card
  block.replaceWith(card);
}
