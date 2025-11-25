/**
 * Text Link / Text List Component — AEM EDS Compatible
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

    /**
     * === YOUR LOGIC (confirmed correct) ===
     * hideTitle = true  → show title
     * hideTitle = false → show link
     */

    // TITLE (shown only if hideTitle = true)
    if (item.hideTitle && item.title) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'text-link-title';
      titleDiv.textContent = item.title;

      // Move instrumentation from original row to new node
      moveInstrumentation(item.titleRow, titleDiv);

      row.appendChild(titleDiv);
    }

    // LINK (shown only if hideTitle = false)
    if (!item.hideTitle && item.linkText && item.linkHref) {
      const link = document.createElement('a');
      link.className = 'text-link';
      link.href = item.linkHref;
      link.textContent = item.linkText;

      // Both textRow (p) and hrefRow (a) can contain instrumentation
      moveInstrumentation(item.textRow, link);
      moveInstrumentation(item.hrefRow, link);

      row.appendChild(link);
    }

    container.appendChild(row);
  });

  return container;
}

/**
 * Decorate the block — applies instrumentation + replaces original
 *
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  if (!block) return;

  // STEP 1 — Extract rows from block
  const rows = Array.from(block.children);

  // STEP 2 — Extract usable items with raw instrumentation references
  const items = extractTextLinkItems(rows);

  // STEP 3 — Create final component using the standardized creator
  const component = createTextLinkComponent(items);

  // STEP 4 — Preserve block-level instrumentation and metadata
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      component.setAttribute(attr.name, attr.value);
    }
  });

  if (block.dataset.blockName) {
    component.dataset.blockName = block.dataset.blockName;
  }

  if (block.id) {
    component.id = block.id;
  }

  // STEP 5 — Replace original block
  block.replaceWith(component);
}
