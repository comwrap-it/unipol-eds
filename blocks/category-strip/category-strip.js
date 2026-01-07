import { extractInstrumentationAttributes } from '../../scripts/utils.js';

/**
 * Extract values from block rows (Universal Editor format)
 */
const extractValuesFromRows = (rows) => {
  const values = {
    bgColor: rows[0]?.textContent.trim() || '',
    icon: rows[1]?.textContent.trim() || '',
    desc: rows[2]?.textContent.trim() || '',
    tag1Label: rows[3]?.textContent.trim() || '',
    tag1Variant: rows[4]?.textContent.trim() || '',
    tag2Label: rows[5]?.textContent.trim() || '',
    tag2Variant: rows[6]?.textContent.trim() || '',
    instrumentation: extractInstrumentationAttributes(rows[0] || rows[1]),
  };

  return values;
};

/**
 * Create Category Strip DOM element
 * (used both by blocks and other components)
 */
export function createCategoryStripFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const {
    bgColor,
    icon,
    desc,
    tag1Label,
    tag1Variant,
    tag2Label,
    tag2Variant,
    instrumentation,
  } = extractValuesFromRows(rows);

  const container = document.createElement('div');
  container.className = 'category-strip-container';

  if (bgColor) container.classList.add(bgColor);

  Object.entries(instrumentation).forEach(([k, v]) => {
    container.setAttribute(k, v);
  });

  // Icon
  if (icon) {
    const iconEl = document.createElement('i');
    iconEl.className = icon;
    container.appendChild(iconEl);
  }

  // Description
  if (desc) {
    const span = document.createElement('span');
    span.textContent = desc;
    container.appendChild(span);
  }

  // Tag 1
  if (tag1Label) {
    const t1 = document.createElement('span');
    t1.className = `tag ${tag1Variant || ''}`.trim();
    t1.textContent = tag1Label;
    container.appendChild(t1);
  }

  // Tag 2
  if (tag2Label) {
    const t2 = document.createElement('span');
    t2.className = `tag ${tag2Variant || ''}`.trim();
    t2.textContent = tag2Label;
    container.appendChild(t2);
  }

  return container;
}

/**
 * Decorate Category Strip block (block rendering)
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
