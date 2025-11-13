/**
 * Text Block Component
 *
 * A content block component that displays a title, text content, and an optional button.
 * Uses primary-button as an atom component for call-to-action buttons.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

let isPrimaryBtnStyleLoaded = false;
async function ensureBtnStylesLoaded() {
  if (isPrimaryBtnStyleLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
  );
  isPrimaryBtnStyleLoaded = true;
}

/**
 * Decorates a text-block element
 * @param {HTMLElement} block - The text-block element
 */
export default async function decorate(block) {
  if (!block) return;
  ensureBtnStylesLoaded();

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Extract text block data

  // Create text block container
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block';

  // === Create main text content container ===
  const textContentContainer = document.createElement('div');
  textContentContainer.className = 'text-block-container';

  // Title
  const titleRow = rows[0];
  if (titleRow) {
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      existingHeading.className = 'text-block-title';
      moveInstrumentation(titleRow, existingHeading);
      textContentContainer.appendChild(existingHeading);
    } else {
      const title = document.createElement('h2');
      title.className = 'text-block-title';
      while (titleRow.firstChild) {
        title.appendChild(titleRow.firstChild);
      }
      moveInstrumentation(titleRow, title);
      if (title.textContent?.trim()) {
        textContentContainer.appendChild(title);
      }
    }
  }

  // Text Content - Row 1
  const textRow = rows[1];
  if (textRow) {
    const hasInstrumentation = textRow.hasAttribute('data-aue-resource')
      || textRow.hasAttribute('data-richtext-prop')
      || textRow.querySelector('[data-aue-resource]')
      || textRow.querySelector('[data-richtext-prop]');

    if (hasInstrumentation || textRow.textContent?.trim()) {
      const existingPara = textRow.querySelector('p');
      if (existingPara) {
        existingPara.className = 'text-block-text';
        moveInstrumentation(textRow, existingPara);
        textContentContainer.appendChild(existingPara);
      } else {
        const text = document.createElement('p');
        text.className = 'text-block-text';
        while (textRow.firstChild) {
          text.appendChild(textRow.firstChild);
        }
        moveInstrumentation(textRow, text);
        if (hasInstrumentation || text.textContent?.trim()) {
          textContentContainer.appendChild(text);
        }
      }
    }
  }

  // Content Alignment - Row 2
  const contentAlignmentRow = rows[2];
  let contentAlignment = contentAlignmentRow?.textContent?.trim();
  if (contentAlignmentRow) {
    const alignmentField = contentAlignmentRow.querySelector('p[data-aue-prop="contentAlignment"]');
    if (alignmentField && alignmentField.textContent?.trim()) {
      contentAlignment = alignmentField.textContent.trim();
    }
  }
  if (contentAlignment === 'text-block-center') {
    textBlock.classList.add('text-block-center');
  } else if (contentAlignment === 'text-block-left') {
    textBlock.classList.add('text-block-left');
  }

  // Button - Rows 3-6 (optional)
  const buttonTextRow = rows[3];
  const buttonVariantRow = rows[4];
  const buttonSizeRow = rows[5];
  const buttonHrefRow = rows[6];
  const leftIcon = rows[7]?.textContent?.trim() || '';
  const rightIcon = rows[8]?.textContent?.trim() || '';

  if (buttonTextRow && buttonTextRow.textContent?.trim()) {
    const hasInstrumentation = buttonTextRow.hasAttribute('data-aue-resource')
      || buttonTextRow.querySelector('[data-aue-resource]')
      || buttonTextRow.querySelector('[data-richtext-prop]')
      || buttonTextRow.querySelector('[data-aue-prop]');

    let buttonElement;
    if (hasInstrumentation) {
      const textField = buttonTextRow.querySelector('[data-aue-prop="text"]');
      const variantField = buttonVariantRow?.querySelector('[data-aue-prop="variant"]');
      const sizeField = buttonSizeRow?.querySelector('[data-aue-prop="size"]');
      const hrefField = buttonHrefRow?.querySelector('a');

      const label = textField?.textContent?.trim() || 'Button';
      let variant = variantField?.textContent?.trim()?.toLowerCase() || BUTTON_VARIANTS.PRIMARY;
      let size = sizeField?.textContent?.trim()?.toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
      const href = hrefField?.getAttribute('href')?.replace('.html', '') || '';

      if (!Object.values(BUTTON_VARIANTS).includes(variant)) variant = BUTTON_VARIANTS.PRIMARY;
      if (!Object.values(BUTTON_ICON_SIZES).includes(size)) size = BUTTON_ICON_SIZES.MEDIUM;

      buttonElement = createButton(label, href, variant, size, leftIcon, rightIcon);
    } else {
      const label = buttonTextRow.textContent?.trim() || 'Button';
      const link = buttonTextRow.querySelector('a');
      const href = link?.href || '';
      const variant = BUTTON_VARIANTS.PRIMARY;
      const size = BUTTON_ICON_SIZES.MEDIUM;
      buttonElement = createButton(label, href, variant, size, leftIcon, rightIcon);
    }

    if (buttonElement) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'text-block-button';
      buttonContainer.appendChild(buttonElement);
      textContentContainer.appendChild(buttonContainer);
    }
  }

  // Append the main text container to textBlock
  textBlock.appendChild(textContentContainer);

  // Preserve ALL block instrumentation attributes before replacing content
  // Copy all data-aue-* and other instrumentation attributes
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      textBlock.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    textBlock.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  textBlock.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block') {
        textBlock.classList.add(cls);
      }
    });
  }

  // Replace block content with text block
  block.replaceWith(textBlock);
}
