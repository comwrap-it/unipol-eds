/**
 * Text Block Component
 *
 * A content block component that displays a title, text content, and an optional button.
 * Uses primary-button as an atom component for call-to-action buttons.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createButton, BUTTON_VARIANTS, BUTTON_SIZES } from '../primary-button/primary-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates a text-block element
 * @param {HTMLElement} block - The text-block element
 */
export default async function decorate(block) {
  // eslint-disable-next-line no-console
  console.log('🚀 TEXT-BLOCK DECORATE CALLED', { block });

  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // eslint-disable-next-line no-console
  console.log('📦 Rows found:', rows.length, rows);

  // Extract text block data
  // Row 0: Title
  // Row 1: Text
  // Row 2: Button (optional)

  // Create text block container
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block';

  // Title - Row 0
  const titleRow = rows[0];
  if (titleRow) {
    // Try to preserve existing heading element
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      // Move existing heading and preserve instrumentation
      existingHeading.className = 'text-block-title';
      moveInstrumentation(titleRow, existingHeading);
      textBlock.appendChild(existingHeading);
    } else {
      // Create new heading but preserve instrumentation
      const title = document.createElement('h2');
      title.className = 'text-block-title';
      // Clone child nodes to preserve richtext instrumentation
      while (titleRow.firstChild) {
        title.appendChild(titleRow.firstChild);
      }
      // Move instrumentation from row to title
      moveInstrumentation(titleRow, title);
      if (title.textContent?.trim()) {
        textBlock.appendChild(title);
      }
    }
  }

  // Text Content - Row 1 (subtitle field)
  const textRow = rows[1];
  if (textRow) {
    // Always process row if it has instrumentation, even if empty
    const hasInstrumentation = textRow.hasAttribute('data-aue-resource')
      || textRow.hasAttribute('data-richtext-prop')
      || textRow.querySelector('[data-aue-resource]')
      || textRow.querySelector('[data-richtext-prop]');

    if (hasInstrumentation || textRow.textContent?.trim()) {
      // Try to preserve existing paragraph
      const existingPara = textRow.querySelector('p');
      if (existingPara) {
        existingPara.className = 'text-block-text';
        moveInstrumentation(textRow, existingPara);
        textBlock.appendChild(existingPara);
      } else {
        // Create new paragraph but preserve instrumentation
        const text = document.createElement('p');
        text.className = 'text-block-text';
        // Clone child nodes to preserve richtext instrumentation
        while (textRow.firstChild) {
          text.appendChild(textRow.firstChild);
        }
        // Move instrumentation from row to text
        moveInstrumentation(textRow, text);
        // Always append if it has instrumentation, even if empty
        if (hasInstrumentation || text.textContent?.trim()) {
          textBlock.appendChild(text);
        }
      }
    }
  }

  // Button - Row 2 (optional)
  // Button can be defined in two ways:
  // 1. As a container with instrumentation (Universal Editor) - Row 2 contains nested fields
  // 2. As simple text rows - Row 2 contains button text, variant, size, href
  const buttonRow = rows[2];
  // eslint-disable-next-line no-console
  console.log('🔘 Button Row:', { buttonRow, hasContent: buttonRow?.textContent?.trim() });

  if (buttonRow && buttonRow.textContent?.trim()) {
    // Check if button row has instrumentation (Universal Editor)
    // Universal Editor uses data-aue-prop on the fields
    const hasInstrumentation = buttonRow.hasAttribute('data-aue-resource')
      || buttonRow.querySelector('[data-aue-resource]')
      || buttonRow.querySelector('[data-richtext-prop]')
      || buttonRow.querySelector('[data-aue-prop]'); // Universal Editor field marker

    // eslint-disable-next-line no-console
    console.log('🎯 Button has instrumentation?', hasInstrumentation, {
      hasDataAueResource: buttonRow.hasAttribute('data-aue-resource'),
      hasChildWithDataAue: !!buttonRow.querySelector('[data-aue-resource]'),
      hasRichtextProp: !!buttonRow.querySelector('[data-richtext-prop]'),
      hasDataAueProp: !!buttonRow.querySelector('[data-aue-prop]'),
    });

    // eslint-disable-next-line no-console
    console.log('🔍 FULL ButtonRow HTML:\n', buttonRow.outerHTML);

      // If button row has instrumentation, preserve structure and apply button styles
      // Universal Editor will re-decorate the block when values change via editor-support.js
      // Otherwise, create button using primary-button atom
      if (hasInstrumentation) {
        // eslint-disable-next-line no-console
        console.log('✅ HAS INSTRUMENTATION - Preserving structure');

        // Universal Editor with container fields: only TEXT field is visible in DOM
        // variant, size, href are stored in backend but NOT rendered in HTML
        // We need to extract the text and use default values for other fields
        // or read from data attributes if available

        // Extract text from the visible field
        const textField = buttonRow.querySelector('[data-aue-prop="text"]');
        const label = textField?.textContent?.trim() || 'Button';

        // eslint-disable-next-line no-console
        console.log('🔍 Text field found:', {
          label,
          textFieldHTML: textField?.outerHTML,
        });

        // Try to find variant, size, href from data attributes or use defaults
        // Universal Editor stores these in the backend, not in DOM
        let variant = BUTTON_VARIANTS.PRIMARY;
        let size = BUTTON_SIZES.MEDIUM;
        let href = '';

        // Check if there are data attributes with the values
        const container = buttonRow.firstElementChild;
        if (container) {
          // eslint-disable-next-line no-console
          console.log('🔍 Container attributes:', Array.from(container.attributes).map((a) => ({ name: a.name, value: a.value })));

          // Try to read from data attributes if they exist
          variant = container.dataset.variant || BUTTON_VARIANTS.PRIMARY;
          size = container.dataset.size || BUTTON_SIZES.MEDIUM;
          href = container.dataset.href || '';
        }

        // eslint-disable-next-line no-console
        console.log('🎯 Button values (using defaults for variant/size/href):', { label, variant, size, href });

        // Create button with extracted values
        const buttonElement = createButton(label, href, variant, size);

        // Wrap button in container for styling
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-block-button';
        buttonContainer.appendChild(buttonElement);

        textBlock.appendChild(buttonContainer);
    } else {
      // eslint-disable-next-line no-console
      console.log('⚠️ NO INSTRUMENTATION - Using simple button creation');

      // Extract button data from row structure
      // Expected structure: Row 2 contains buttonText, buttonVariant, buttonSize, buttonHref
      const buttonData = Array.from(buttonRow.children);

      // eslint-disable-next-line no-console
      console.log('📋 Button Data (no instrumentation):', {
        dataLength: buttonData.length,
        data: buttonData.map((d) => ({ text: d.textContent, html: d.outerHTML })),
      });

      // eslint-disable-next-line no-console
      console.log('🔍 ButtonRow HTML:', buttonRow.outerHTML);

      // eslint-disable-next-line no-console
      if (buttonData[0]) {
        console.log('🔍 ButtonData[0] HTML:', buttonData[0].outerHTML);
        console.log('🔍 ButtonData[0] children:', Array.from(buttonData[0].children).map((c) => c.outerHTML));
      }

      // Extract button text from first child or row text
      let label = 'Button';
      if (buttonData.length > 0) {
        label = buttonData[0]?.textContent?.trim() || buttonRow.textContent?.trim() || 'Button';
      } else {
        label = buttonRow.textContent?.trim() || 'Button';
      }

      // Extract href from link or button data
      const link = buttonRow.querySelector('a');
      let href = '';
      if (link && link.href) {
        href = link.href;
      } else if (buttonData.length > 1) {
        // Check if second child is a link
        const secondChildLink = buttonData[1]?.querySelector('a');
        if (secondChildLink && secondChildLink.href) {
          href = secondChildLink.href;
        } else {
          href = buttonData[1]?.textContent?.trim() || '';
        }
      }

      // Extract variant and size from button data or defaults
      let variant = BUTTON_VARIANTS.PRIMARY;
      let size = BUTTON_SIZES.MEDIUM;

      // Try to find variant and size in button data
      for (let i = 0; i < buttonData.length; i += 1) {
        const text = buttonData[i]?.textContent?.trim().toLowerCase();
        if (text && Object.values(BUTTON_VARIANTS).includes(text)) {
          variant = text;
        } else if (text && Object.values(BUTTON_SIZES).includes(text)) {
          size = text;
        }
      }

      // Create button using primary-button atom
      const button = createButton(label, href, variant, size);
      if (button) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-block-button';
        buttonContainer.appendChild(button);
        textBlock.appendChild(buttonContainer);
      }
    }
  }

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
