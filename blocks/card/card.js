/**
 * Card Component - Molecule
 *
 * Uses primary-button as an atom component for call-to-action buttons.
 * This component can be used as a molecule within card-list.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createButton, BUTTON_VARIANTS, BUTTON_SIZES } from '../atoms/buttons/primary-button/primary-button.js';
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

  // eslint-disable-next-line no-console
  console.log('🃏 Card Rows:', {
    totalRows: rows.length,
    rows: rows.map((r, i) => ({
      index: i,
      html: r.outerHTML.substring(0, 100),
      text: r.textContent?.trim().substring(0, 50),
    })),
  });

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
  // eslint-disable-next-line no-console
  console.log('📝 Card Subtitle Row:', {
    exists: !!subtitleRow,
    hasContent: subtitleRow?.textContent?.trim(),
    html: subtitleRow?.outerHTML?.substring(0, 150),
  });
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

  // Card Button - Rows 3-6 (optional)
  // Universal Editor creates separate rows for each button field:
  // Row 3 = text, Row 4 = variant, Row 5 = size, Row 6 = href
  const buttonTextRow = rows[3];
  const buttonVariantRow = rows[4];
  const buttonSizeRow = rows[5];
  const buttonHrefRow = rows[6];

  // eslint-disable-next-line no-console
  console.log('🔘 Card Button Rows:', {
    totalRows: rows.length,
    buttonTextRow,
    buttonVariantRow,
    buttonSizeRow,
    buttonHrefRow,
    hasContent: buttonTextRow?.textContent?.trim(),
  });

  if (buttonTextRow && buttonTextRow.textContent?.trim()) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'card-buttons';

    // Check if button row has instrumentation (Universal Editor)
    // Universal Editor uses data-aue-prop on the fields
    const hasInstrumentation = buttonTextRow.hasAttribute('data-aue-resource')
      || buttonTextRow.querySelector('[data-aue-resource]')
      || buttonTextRow.querySelector('[data-richtext-prop]')
      || buttonTextRow.querySelector('[data-aue-prop]'); // Universal Editor field marker

    // eslint-disable-next-line no-console
    console.log('🎯 Button has instrumentation?', hasInstrumentation);

    if (hasInstrumentation) {
      // Universal Editor creates separate rows for each button field
      // Read values from each row's data-aue-prop element
      const textField = buttonTextRow.querySelector('[data-aue-prop="text"]');
      const variantField = buttonVariantRow?.querySelector('[data-aue-prop="variant"]');
      const sizeField = buttonSizeRow?.querySelector('[data-aue-prop="size"]');
      const hrefField = buttonHrefRow?.querySelector('a');

      const label = textField?.textContent?.trim() || 'Button';
      let variant = variantField?.textContent?.trim()?.toLowerCase() || BUTTON_VARIANTS.PRIMARY;
      let size = sizeField?.textContent?.trim()?.toLowerCase() || BUTTON_SIZES.MEDIUM;
      const href = hrefField?.getAttribute('href')?.replace('.html', '') || '';

      // eslint-disable-next-line no-console
      console.log('🎯 Button values extracted:', {
        label,
        variant,
        size,
        href,
      });

      // Validate variant and size
      if (!Object.values(BUTTON_VARIANTS).includes(variant)) {
        variant = BUTTON_VARIANTS.PRIMARY;
      }
      if (!Object.values(BUTTON_SIZES).includes(size)) {
        size = BUTTON_SIZES.MEDIUM;
      }

      // Create button with extracted values
      const button = createButton(label, href, variant, size);
      // eslint-disable-next-line no-console
      console.log('✅ Button created:', button);
      if (button) {
        buttonsContainer.appendChild(button);
      }
    } else {
      // No instrumentation - simple button creation
      const label = buttonTextRow.textContent?.trim() || 'Button';
      const button = createButton(label, '', BUTTON_VARIANTS.PRIMARY, BUTTON_SIZES.MEDIUM);
      if (button) {
        buttonsContainer.appendChild(button);
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
