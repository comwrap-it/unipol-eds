/**
 * Mini Banner Component
 *
 * A molecule that displays a title and a button-group
 * The button-group contains 2 buttons with configurable variants
 */

import { createButtonGroup } from '../../button-group/button-group.js';
import { moveInstrumentation } from '../../../../scripts/scripts.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/molecules/button-group/button-group.css`),
  ]);
  isStylesLoaded = true;
}

/**
 * Decorator function for Mini Banner
 *
 * @param {HTMLElement} block - The mini-banner block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Ensure CSS is loaded
  await ensureStylesLoaded();

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Create mini banner container
  const miniBanner = document.createElement('div');
  miniBanner.className = 'mini-banner';

  // ROW 0: TITLE
  const titleRow = rows[0];
  if (titleRow) {
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      existingHeading.className = 'title';
      moveInstrumentation(titleRow, existingHeading);
      miniBanner.appendChild(existingHeading);
    } else {
      const title = document.createElement('h3');
      title.className = 'title';
      while (titleRow.firstChild) {
        title.appendChild(titleRow.firstChild);
      }
      moveInstrumentation(titleRow, title);
      if (title.textContent?.trim()) {
        miniBanner.appendChild(title);
      }
    }
  }

  // ROWS 1-13: BUTTON GROUP
  // Row 1: buttonGroupVariant
  // Rows 2-7: button 1 (label, variant, href, size, leftIcon, rightIcon)
  // Rows 8-13: button 2 (label, variant, href, size, leftIcon, rightIcon)
  const buttonGroupRows = rows.slice(1, 14);

  if (buttonGroupRows.length > 0 && buttonGroupRows[0]?.textContent?.trim()) {
    const buttonGroupElement = createButtonGroup(buttonGroupRows);
    if (buttonGroupElement) {
      miniBanner.appendChild(buttonGroupElement);
    }
  }

  // Preserve ALL block instrumentation attributes
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      miniBanner.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present
  if (block.dataset.blockName) {
    miniBanner.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  miniBanner.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block' && cls !== 'mini-banner') {
        miniBanner.classList.add(cls);
      }
    });
  }

  // Replace block content with mini banner
  block.replaceWith(miniBanner);
}
