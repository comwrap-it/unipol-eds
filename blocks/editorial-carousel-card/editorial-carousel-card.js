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

export const EDITORIAL_CAROUSEL_CARD_SIZES = {
  S: 's',
  M: 'm',
};

const resolveEditorialCarouselCardSize = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['m', 'md', 'medium'].includes(normalized)) return EDITORIAL_CAROUSEL_CARD_SIZES.M;
  return EDITORIAL_CAROUSEL_CARD_SIZES.S;
};

const IMAGE_BREAKPOINTS_BY_SIZE = {
  [EDITORIAL_CAROUSEL_CARD_SIZES.S]: [
    { media: '(min-width: 1200px)', width: '316' },
    { media: '(min-width: 1024px)', width: '276' },
    { media: '(min-width: 768px)', width: '302' },
    { media: '(max-width: 767px)', width: '343' },
  ],
  [EDITORIAL_CAROUSEL_CARD_SIZES.M]: [
    { media: '(min-width: 1200px)', width: '426' },
    { media: '(min-width: 1024px)', width: '373' },
    { media: '(min-width: 768px)', width: '302' },
    { media: '(max-width: 767px)', width: '343' },
  ],
};

const getImageBreakpoints = (size) => IMAGE_BREAKPOINTS_BY_SIZE[
  resolveEditorialCarouselCardSize(size)
] || IMAGE_BREAKPOINTS_BY_SIZE[EDITORIAL_CAROUSEL_CARD_SIZES.S];

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

export function createEditorialCarouselCard(
  {
    title = '',
    description = '',
    size = 'm',
    imageSrc = '',
    imageAlt = '',
    imageElement = null,
    buttonElement = null,
    buttonConfig = null,
    note = '',
    instrumentation = {},
    blockName = 'editorial-carousel-card',
    isFirstCard = false,
  } = {},
) {
  const card = document.createElement('div');
  card.className = 'editorial-carousel-card-container card-block';

  const resolvedSize = resolveEditorialCarouselCardSize(size);
  card.dataset.editorialCardSize = resolvedSize;
  card.style.setProperty(
    '--editorial-card-size',
    resolvedSize === EDITORIAL_CAROUSEL_CARD_SIZES.M ? '1' : '0',
  );

  if (blockName) {
    card.dataset.blockName = blockName;
  }

  Object.entries(instrumentation).forEach(([name, value]) => {
    card.setAttribute(name, value);
  });

  let mediaElement = imageElement;
  if (!mediaElement && imageSrc) {
    mediaElement = createOptimizedPicture(
      imageSrc,
      imageAlt,
      isFirstCard,
      getImageBreakpoints(resolvedSize),
    );
  }

  if (mediaElement) {
    const cardImage = document.createElement('div');
    cardImage.className = 'editorial-carousel-card-image';

    const img = mediaElement.querySelector?.('img')
      || (mediaElement.tagName === 'IMG' ? mediaElement : null);
    if (img) {
      img.setAttribute('alt', imageAlt);
      if (isFirstCard) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      }
    }

    cardImage.appendChild(mediaElement);
    card.appendChild(cardImage);
  }

  const cardContent = document.createElement('div');
  cardContent.className = 'editorial-carousel-card-content';

  const cardTextContent = document.createElement('div');
  cardTextContent.className = 'editorial-carousel-card-text';

  if (title) {
    const titleElement = title instanceof HTMLElement ? title : document.createElement('h3');
    if (!(title instanceof HTMLElement)) titleElement.textContent = title;
    titleElement.className = 'title';
    if (title instanceof HTMLElement || titleElement.textContent?.trim()) {
      cardTextContent.appendChild(titleElement);
    }
  }

  if (description) {
    const descriptionElement = description instanceof HTMLElement ? description : document.createElement('p');
    if (!(description instanceof HTMLElement)) descriptionElement.textContent = description;
    descriptionElement.className = 'description';
    if (description instanceof HTMLElement || descriptionElement.textContent?.trim()) {
      cardTextContent.appendChild(descriptionElement);
    }
  }

  if (cardTextContent.children.length > 0) {
    cardContent.appendChild(cardTextContent);
  }

  let finalButtonElement = buttonElement;
  if (!finalButtonElement && buttonConfig?.label) {
    finalButtonElement = createLinkButton(
      buttonConfig.label,
      buttonConfig.href || '#',
      Boolean(buttonConfig.openInNewTab),
      buttonConfig.leftIcon || '',
      buttonConfig.rightIcon || '',
      buttonConfig.iconSize || DEFAULT_ICON_SIZE,
      Boolean(buttonConfig.disabled),
    );
  }

  if (finalButtonElement) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'button-subdescription';
    buttonsContainer.appendChild(finalButtonElement);

    if (note) {
      const noteElement = note instanceof HTMLElement ? note : document.createElement('p');
      if (!(note instanceof HTMLElement)) noteElement.textContent = note;
      noteElement.className = 'subdescription';
      if (note instanceof HTMLElement || noteElement.textContent?.trim()) {
        buttonsContainer.appendChild(noteElement);
      }
    }

    if (buttonsContainer.children.length > 0) {
      cardContent.appendChild(buttonsContainer);
    }
  }

  if (cardContent.children.length > 0) {
    card.appendChild(cardContent);
  }

  return card;
}

export const create = createEditorialCarouselCard;

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

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const instrumentation = {
    ...extractInstrumentationAttributes(block),
    ...extractInstrumentationAttributes(rows[0]),
  };

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

  const imageRowIndex = findImageRowIndex(rows);
  const imageRow = imageRowIndex >= 0 ? rows[imageRowIndex] : null;
  const imageAlt = imageRowIndex >= 0
    ? rows[imageRowIndex + 1]?.textContent?.trim() || ''
    : '';
  const resolvedSize = resolveEditorialCarouselCardSize(block.dataset.editorialCardSize);

  let imageElement = null;
  if (imageRow) {
    const picture = imageRow.querySelector('picture');
    if (picture) {
      imageElement = picture;
    } else {
      const img = imageRow.querySelector('img');
      if (img?.src) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          imageAlt,
          isFirstCard,
          getImageBreakpoints(resolvedSize),
        );
        const newImg = optimizedPic.querySelector('img');
        if (newImg) moveInstrumentation(img, newImg);
        imageElement = optimizedPic;
      } else {
        const link = imageRow.querySelector('a[href]');
        if (link?.href) {
          const optimizedPic = createOptimizedPicture(
            link.href,
            imageAlt,
            isFirstCard,
            getImageBreakpoints(resolvedSize),
          );
          const newImg = optimizedPic.querySelector('img');
          if (newImg) moveInstrumentation(link, newImg);
          imageElement = optimizedPic;
        }
      }
    }
  }

  // Card Title - preserve original element and instrumentation
  const titleRow = rows[0];
  let titleElement = null;
  if (titleRow) {
    // Try to preserve existing heading element
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      // Move existing heading and preserve instrumentation
      moveInstrumentation(titleRow, existingHeading);
      titleElement = existingHeading;
    } else {
      // Create new heading but preserve instrumentation
      const title = document.createElement('h3');
      // Clone child nodes to preserve richtext instrumentation
      while (titleRow.firstChild) {
        title.appendChild(titleRow.firstChild);
      }
      // Move instrumentation from row to title
      moveInstrumentation(titleRow, title);
      titleElement = title.textContent?.trim() ? title : null;
    }
  }

  // Card Subtitle - preserve original element and instrumentation
  const subtitleRow = rows[1];
  let descriptionElement = null;

  // ALWAYS create subtitle element (even if row doesn't exist or is empty)
  // This ensures subtitle is always visible in the DOM for editing
  if (subtitleRow) {
    // Try to preserve existing paragraph
    const existingPara = subtitleRow.querySelector('p');
    if (existingPara) {
      moveInstrumentation(subtitleRow, existingPara);
      descriptionElement = existingPara;
    } else if (subtitleRow.textContent?.trim()) {
      // Create new paragraph but preserve instrumentation
      const subtitle = document.createElement('p');
      // Clone child nodes to preserve richtext instrumentation
      while (subtitleRow.firstChild) {
        subtitle.appendChild(subtitleRow.firstChild);
      }
      // Move instrumentation from row to subtitle
      moveInstrumentation(subtitleRow, subtitle);
      descriptionElement = subtitle;
    }
  }

  // Card Button - Rows 2-9 (optional)
  // Universal Editor creates separate rows for each button field
  const buttonRows = rows.slice(2, 9);
  const buttonElement = createLinkButtonFromStandardButtonRows(buttonRows);
  let noteElement = null;

  if (buttonElement) {
    const note = imageRowIndex === 9 ? null : rows[9];
    if (note) {
      // Try to preserve existing paragraph
      const existingPara = note.querySelector('p');
      if (existingPara) {
        moveInstrumentation(note, existingPara);
        noteElement = existingPara;
      } else if (note.textContent?.trim()) {
        // Create new paragraph but preserve instrumentation
        const noteFromHTML = document.createElement('p');
        // Clone child nodes to preserve richtext instrumentation
        while (note.firstChild) {
          noteFromHTML.appendChild(note.firstChild);
        }
        // Move instrumentation from row to note
        moveInstrumentation(note, noteFromHTML);
        noteElement = noteFromHTML;
      }
    }
  }

  const blockName = block.dataset.blockName || 'editorial-carousel-card';
  const card = createEditorialCarouselCard({
    title: titleElement,
    description: descriptionElement,
    size: resolvedSize,
    imageElement,
    imageAlt,
    buttonElement,
    note: noteElement,
    instrumentation,
    blockName,
    isFirstCard,
  });

  // Replace block content with card
  block.replaceWith(card);
}
