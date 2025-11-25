/**
 * Text Link / Text List Component — AEM EDS Compatible (FIXED)
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Extracts data + instrumentation references from the Universal Editor rows
 *
 * @param {HTMLElement[]} rows
 * @returns {Array<Object>}
 */
function extractTextLinkItems(rows) {
  return rows.map((row) => {
    const hideTitleRow = row.children[0];
    const titleRow = row.children[1];
    const textRow = row.children[2];
    const hrefRow = row.children[3];

    const hideTitle = hideTitleRow?.textContent.trim() === 'true';
    const title = titleRow?.textContent.trim() || '';
    const linkText = textRow?.querySelector('p')?.textContent.trim() || '';
    const linkHref = hrefRow?.querySelector('a')?.href || '';

    return {
      hideTitle,
      title,
      linkText,
      linkHref,

      // Keep raw rows to move instrumentation later
      hideTitleRow,
      titleRow,
      textRow,
      hrefRow,
    };
  });
}

/**
 * Create the final Text Link/List component (SINGLE SOURCE OF TRUTH)
 *
 * @param {Array<Object>} items
 * @returns HTMLElement
 */
export function createTextLinkComponent(items = []) {
  const container = document.createElement('div');
  container.className = 'text-link-list';

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'text-link-row';

    // TITLE (visible only if hideTitle = true)
    if (item.hideTitle && item.title) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'text-link-title';
      titleDiv.textContent = item.title;

      moveInstrumentation(item.titleRow, titleDiv);

      row.appendChild(titleDiv);
    }

    // LINK (visible only if hideTitle = false)
    if (!item.hideTitle && item.linkText && item.linkHref) {
      const link = document.createElement('a');
      link.className = 'text-link';
      link.href = item.linkHref;
      link.textContent = item.linkText;

      moveInstrumentation(item.textRow, link);
      moveInstrumentation(item.hrefRow, link);

      row.appendChild(link);
    }

    container.appendChild(row);
  });

  return container;
}

/**
 * Decorate the block — AEM Universal Editor safe / idempotent
 *
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);

  const items = extractTextLinkItems(rows);

  rows.forEach((row, index) => {
    const item = items[index];

    row.innerHTML = '';

    if (item.hideTitle && item.title) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'text-link-title';
      titleDiv.textContent = item.title;
      moveInstrumentation(item.titleRow, titleDiv);
      row.appendChild(titleDiv);
    }

    if (!item.hideTitle && item.linkText && item.linkHref) {
      const link = document.createElement('a');
      link.className = 'text-link';
      link.href = item.linkHref;
      link.textContent = item.linkText;
      moveInstrumentation(item.textRow, link);
      moveInstrumentation(item.hrefRow, link);
      row.appendChild(link);
    }
  });
}
