import { moveInstrumentation } from './scripts.js';

/**
Allowed text tags for authored content.
@typedef {'p'|'span'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} TextTag
*/
/**
Creates a text element from an authored row, preserving UE instrumentation.
@param {HTMLElement | null} originalRow
@param {string | string[]} classesToApply
@param {TextTag} elementTag
@returns {HTMLElement}
*/
export const createTextElementFromRow = (
  originalRow,
  classesToApply = [],
  elementTag = 'span',
) => {
  const allowed = new Set(['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const tag = allowed.has(elementTag) ? elementTag : 'span';
  const el = document.createElement(tag);

  if (Array.isArray(classesToApply)) {
    const cls = classesToApply.filter(Boolean);
    if (cls.length) el.classList.add(...cls);
  } else if (classesToApply) {
    el.classList.add(classesToApply);
  }

  if (originalRow) {
    while (originalRow.firstChild) {
      el.appendChild(originalRow.firstChild);
    }
    moveInstrumentation(originalRow, el);
  }
  return el;
};

export const extractBooleanValueFromRow = (row) => {
  if (!row) return false;
  const text = row.textContent.trim().toLowerCase();
  return text === 'true';
};
