import { extractInstrumentationAttributes } from '../../scripts/utils.js';

/**
 * Safely extract text from a row <div>
 * Supports multiple <p> inside the same row (Universal Editor)
 *
 * @param {HTMLElement} row
 * @param {number} index
 * @returns {string}
 */
const getRowText = (row, index = 0) => {
  if (!row) return '';
  const paragraphs = row.querySelectorAll('p');
  return paragraphs[index]?.textContent.trim() || '';
};

/**
 * Extract values from Category Strip block rows
 *
 * Expected rows structure:
 * 0 → background color
 * 1 → icon (p[0]) + description (p[1])
 * 2 → first tag label
 * 3 → first tag variant
 * 4 → second tag label
 * 5 → second tag variant
 *
 * @param {HTMLElement[]} rows
 * @returns {Object}
 */
const extractValuesFromRows = (rows) => {
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    bgColor: getRowText(rows[0]),
    icon: getRowText(rows[1], 0),
    desc: getRowText(rows[1], 1),
    tag1Label: getRowText(rows[2]),
    tag1Variant: getRowText(rows[3]),
    tag2Label: getRowText(rows[4]),
    tag2Variant: getRowText(rows[5]),
    instrumentation,
  };
};

/**
 * Create Category Strip DOM element
 * Used both by blocks and other components if needed
 *
 * @param {HTMLElement[]} rows
 * @returns {HTMLElement|null}
 */
export function createCategoryStripFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const {
    bgColor, icon, desc, tag1Label, tag1Variant, tag2Label, tag2Variant,
  } = extractValuesFromRows(rows);

  const container = document.createElement('div');
  container.classList.add('category-strip-container');

  const addSafeClass = (el, classString) => {
    if (!classString) return;
    classString.split(/\s+/).forEach((cls) => {
      if (cls) el.classList.add(cls);
    });
  };

  addSafeClass(container, bgColor);

  if (icon) {
    const iconEl = document.createElement('i');
    addSafeClass(iconEl, icon);
    container.appendChild(iconEl);
  }

  if (desc) {
    const labelEl = document.createElement('span');
    labelEl.textContent = desc;
    container.appendChild(labelEl);
  }

  // First tag
  if (tag1Label) {
    const t1 = document.createElement('span');
    t1.classList.add('tag');
    if (tag1Variant && ['default', 'secondary', 'neutral', 'custom'].includes(tag1Variant)) {
      t1.classList.add(tag1Variant);
    }
    t1.textContent = tag1Label;
    container.appendChild(t1);
  }

  // Second tag
  if (tag2Label) {
    const t2 = document.createElement('span');
    t2.classList.add('tag');
    if (tag2Variant && ['default', 'secondary', 'neutral', 'custom'].includes(tag2Variant)) {
      t2.classList.add(tag2Variant);
    }
    t2.textContent = tag2Label;
    container.appendChild(t2);
  }

  return container;
}

/**
 * Decorate Category Strip block
 *
 * @param {HTMLElement} block
 */
export default function decorateCategoryStrip(block) {
  if (!block) return;

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const strip = createCategoryStripFromRows(rows);
  if (!strip) return;

  block.textContent = '';
  block.appendChild(strip);
}
