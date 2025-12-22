/**
 * Text Block Component – Updated for dual titles (center/left)
 */

import {
  createButton,
} from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';
import {
  createButtonFromRows,
} from '../atoms/buttons/standard-button/standard-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../constants/index.js';

let isPrimaryBtnStyleLoaded = false;
async function ensureBtnStylesLoaded() {
  if (isPrimaryBtnStyleLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');

  await loadCSS(
    'scripts/libs/ds/components/atoms/buttons/standard-button/standard-button.css',
  );
  isPrimaryBtnStyleLoaded = true;
}

/* -----------------------------
   TITLE EXTRACTOR
------------------------------*/
function extractTitleElement(titleRow) {
  if (!titleRow) return null;

  // Check if there's already a heading element
  const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
  if (existingHeading) {
    moveInstrumentation(titleRow, existingHeading);
    return existingHeading;
  }

  // Check for element with instrumentation (text field from Universal Editor)
  const instrumentedElement = titleRow.querySelector('[data-aue-prop], [data-aue-resource]');
  if (instrumentedElement) {
    const title = document.createElement('h2');
    title.textContent = instrumentedElement.textContent?.trim() || '';
    // Move instrumentation from the instrumented element
    moveInstrumentation(instrumentedElement, title);
    return title.textContent ? title : null;
  }

  // Fallback: extract text content from any nested structure
  const textContent = titleRow.textContent?.trim();
  if (!textContent) return null;

  const title = document.createElement('h2');
  title.textContent = textContent;
  moveInstrumentation(titleRow, title);

  return title;
}

/* -----------------------------
  TEXT EXTRACTOR (richtext support)
------------------------------*/
function extractTextElement(textRow) {
  if (!textRow) return null;

  const hasInstrumentation = textRow.hasAttribute('data-aue-resource')
    || textRow.hasAttribute('data-richtext-prop')
    || textRow.querySelector('[data-aue-resource]')
    || textRow.querySelector('[data-richtext-prop]');

  if (!hasInstrumentation && !textRow.textContent?.trim()) {
    return null;
  }

  // Check for richtext wrapper created by editor-support-rte.js
  const richtextWrapper = textRow.querySelector('div[data-aue-type="richtext"]');
  if (richtextWrapper) {
    // Extract content from richtext wrapper
    const text = document.createElement('p');
    text.innerHTML = richtextWrapper.innerHTML;
    // Move instrumentation from wrapper to new element
    moveInstrumentation(richtextWrapper, text);
    return text;
  }

  // Check for standalone paragraph
  const existingPara = textRow.querySelector('p');
  if (existingPara && !existingPara.parentElement.hasAttribute('data-aue-type')) {
    moveInstrumentation(textRow, existingPara);
    return existingPara;
  }

  // Fallback: extract text content from any nested structure
  const textContent = textRow.textContent?.trim();
  if (!textContent && !hasInstrumentation) {
    return null;
  }

  const text = document.createElement('p');
  text.textContent = textContent;
  moveInstrumentation(textRow, text);

  return text;
}

/* ------------------------------------------
   PRESERVE BLOCK ATTRIBUTES (unchanged)
------------------------------------------- */
function preserveBlockAttributes(sourceBlock, targetBlock) {
  [...sourceBlock.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      targetBlock.setAttribute(attr.name, attr.value);
    }
  });

  if (sourceBlock.dataset.blockName) {
    targetBlock.dataset.blockName = sourceBlock.dataset.blockName;
  }

  if (sourceBlock.classList.length > 0) {
    sourceBlock.classList.forEach((cls) => {
      if (cls !== 'block' && !targetBlock.classList.contains(cls)) {
        targetBlock.classList.add(cls);
      }
    });
  }
}

/* ------------------------------------------
   MAIN CREATOR FUNCTION (unchanged)
------------------------------------------- */
export function createTextBlock(
  titleContent,
  centered = true,
  textContent = '',
  buttonElement = null,
  buttonConfig = null,
) {
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block block reveal-in-up';
  textBlock.classList.add(centered ? 'text-block-center' : 'text-block-left');

  const textContentContainer = document.createElement('div');
  textContentContainer.className = 'text-block-cont';

  if (!centered) {
    textContentContainer.classList.add('text-block-left');
  }

  if (titleContent) {
    let titleElement;

    if (titleContent instanceof HTMLElement) {
      titleElement = titleContent;
      titleElement.className = 'text-block-title';
    } else {
      titleElement = document.createElement('h2');
      titleElement.className = 'text-block-title';
      titleElement.textContent = titleContent;
    }

    textContentContainer.appendChild(titleElement);
  }

  if (centered && textContent) {
    let textElement;

    if (textContent instanceof HTMLElement) {
      textElement = textContent;
      textElement.className = 'text-block-text';
    } else {
      textElement = document.createElement('p');
      textElement.className = 'text-block-text';
      textElement.textContent = textContent;
    }

    textContentContainer.appendChild(textElement);
  }

  let finalButtonElement = buttonElement;

  if (!finalButtonElement && buttonConfig && buttonConfig.label) {
    finalButtonElement = createButton(
      buttonConfig.label || 'Button',
      buttonConfig.href || '',
      buttonConfig.openInNewTab || false,
      buttonConfig.variant || BUTTON_VARIANTS.PRIMARY,
      buttonConfig.iconSize || BUTTON_ICON_SIZES.MEDIUM,
      buttonConfig.leftIcon || '',
      buttonConfig.rightIcon || '',
      buttonConfig.instrumentation || {},
    );
  }

  if (finalButtonElement) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'text-block-button';
    buttonContainer.appendChild(finalButtonElement);
    textContentContainer.appendChild(buttonContainer);
  }

  textBlock.appendChild(textContentContainer);
  return textBlock;
}

/* ------------------------------------------
   DECORATE() UPDATED FOR NEW JSON STRUCTURE
------------------------------------------- */
export default async function decorate(block) {
  if (!block) return;
  ensureBtnStylesLoaded();

  // Extract rows
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // 0: contentAlignment
  const alignmentRow = rows[0];
  const centered = alignmentRow?.querySelector('p')?.textContent
    .trim().toLowerCase() === 'true';

  // 1: center title (shown only if centered)
  const centerTitleRow = rows[1];

  // 2: subtitle (shown only if centered)
  const subtitleRow = rows[2];

  // 3: left title (shown only if NOT centered)
  const leftTitleRow = rows[3];

  // Pick correct title depending on alignment
  const titleElement = centered
    ? extractTitleElement(centerTitleRow)
    : extractTitleElement(leftTitleRow);

  // Extract subtitle ONLY if centered
  const textElement = centered ? extractTextElement(subtitleRow) : null;

  // Rows after titles/subtitle/left-title → buttons
  const buttonRows = rows.slice(4, 10);
  const buttonElement = createButtonFromRows(buttonRows);

  // Create component
  const textBlock = createTextBlock(
    titleElement,
    centered,
    textElement,
    buttonElement,
  );

  // Keep attributes
  preserveBlockAttributes(block, textBlock);

  // Replace
  block.replaceWith(textBlock);
}
