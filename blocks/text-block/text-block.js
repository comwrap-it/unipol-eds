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

  // Create text block container
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block';

  // === Create main text content container ===
  const textContentContainer = document.createElement('div');
  textContentContainer.className = 'text-block-container';

  // ROW1 TITLE
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

  // ROW1 BOOLEAN
  const boolRow = rows[1];
  const boolValue = boolRow.querySelector('p')?.textContent.trim().toLowerCase() === 'true';

  // ROW2 SUBTITLE
  const textRow = rows[2];

  if (boolValue) {
    textBlock.classList.add('text-block-center');

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
  } else {
    textBlock.classList.add('text-block-left');

    if (textRow) {
      textRow.style.display = 'none';
    }
  }

  // ROW 3 BUTTON CONTAINER
  // Note: The button fields are nested inside a container in the model
  const buttonContainerRow = rows[3];

  if (buttonContainerRow && buttonContainerRow.textContent?.trim()) {
    // Check if block has instrumentation (Universal Editor)
    const hasInstrumentation = buttonContainerRow.hasAttribute('data-aue-resource')
      || buttonContainerRow.querySelector('[data-aue-resource]')
      || buttonContainerRow.querySelector('[data-aue-prop]');

    let buttonElement;
    if (hasInstrumentation) {
      // Universal Editor structures container fields as child rows
      // Get child rows from the button container
      let buttonRows = Array.from(buttonContainerRow.children);
      
      // If there's a wrapper, get rows from it
      const containerWrapper = buttonContainerRow.querySelector('.default-content-wrapper');
      if (containerWrapper) {
        buttonRows = Array.from(containerWrapper.children);
      }

      // Extract values from button rows
      // Following the standard-button model field order:
      // 0: standardButtonLabel (text)
      // 1: standardButtonVariant (select)
      // 2: standardButtonSize (select)
      // 3: standardButtonHref (aem-content)
      // 4: standardButtonLeftIcon (select)
      // 5: standardButtonRightIcon (select)
      const label = buttonRows[0]?.textContent?.trim() || 'Button';
      let variant = buttonRows[1]?.textContent?.trim()?.toLowerCase() || BUTTON_VARIANTS.PRIMARY;
      let size = buttonRows[2]?.textContent?.trim()?.toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
      
      // For href, check if there's a link element or just text
      let href = '';
      if (buttonRows[3]) {
        const link = buttonRows[3].querySelector('a');
        href = link?.getAttribute('href')?.replace('.html', '') || buttonRows[3].textContent?.trim() || '';
      }
      
      const leftIcon = buttonRows[4]?.textContent?.trim() || '';
      const rightIcon = buttonRows[5]?.textContent?.trim() || '';

      // Validate variant and size
      if (!Object.values(BUTTON_VARIANTS).includes(variant)) variant = BUTTON_VARIANTS.PRIMARY;
      if (!Object.values(BUTTON_ICON_SIZES).includes(size)) size = BUTTON_ICON_SIZES.MEDIUM;

      buttonElement = createButton(label, href, variant, size, leftIcon, rightIcon);
    } else {
      // Fallback for content without instrumentation
      const label = buttonContainerRow.textContent?.trim() || 'Button';
      const link = buttonContainerRow.querySelector('a');
      const href = link?.href || '';
      const variant = BUTTON_VARIANTS.PRIMARY;
      const size = BUTTON_ICON_SIZES.MEDIUM;
      buttonElement = createButton(label, href, variant, size, '', '');
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
