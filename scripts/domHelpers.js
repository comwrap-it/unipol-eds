import { BUTTON_ICON_SIZES } from '../blocks/atoms/buttons/standard-button/standard-button.js';
import { moveInstrumentation } from './scripts.js';
import { restoreInstrumentation } from './utils.js';

/**
Allowed text tags for authored content.
@typedef {'p'|'span'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'li'} AvailableTag
*/
const AUTHORIZED_TEXT_TAGS = [
  'p',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
];
/**
Creates a text element from an authored row, preserving UE instrumentation.
@param {HTMLElement | null} originalRow
@param {string | string[]} classesToApply
@param {AvailableTag} elementTag
@returns {HTMLElement}
*/
export const createTextElementFromRow = (
  originalRow,
  classesToApply = [],
  elementTag = 'span',
) => {
  const tag = AUTHORIZED_TEXT_TAGS.includes(elementTag) ? elementTag : 'span';
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

/**
Creates a text element from an authored obj, preserving UE instrumentation.
@param {{value, instrumentation} | null} originalObj
@param {string | string[]} classesToApply
@param {AvailableTag} elementTag
@returns {HTMLElement}
*/
export const createTextElementFromObj = (
  originalObj,
  classesToApply = [],
  elementTag = 'span',
) => {
  const tag = AUTHORIZED_TEXT_TAGS.includes(elementTag) ? elementTag : 'span';
  const el = document.createElement(tag);

  if (Array.isArray(classesToApply)) {
    const cls = classesToApply.filter(Boolean);
    if (cls.length) el.classList.add(...cls);
  } else if (classesToApply) {
    el.classList.add(classesToApply);
  }

  if (originalObj && originalObj.value) {
    el.textContent = originalObj.value;
  }

  if (originalObj && originalObj.instrumentation) {
    restoreInstrumentation(el, originalObj.instrumentation);
  }

  return el;
};

/**
 * Creates an icon element from a CSS class.
@param {string} iconClass the CSS class for the icon
@param {'small'|'medium'|'large'|'extra-large'} iconSize the size of the icon
@returns {HTMLElement}
*/
export const createIconElementFromCssClass = (
  iconClass,
  iconSize = BUTTON_ICON_SIZES.MEDIUM,
) => {
  const iconEl = document.createElement('span');
  iconEl.className = `icon icon-${iconSize} ${iconClass}`;
  return iconEl;
};

/**
 * Extracts media element (picture or video link) from a row.
 * @param {HTMLElement | null} row
 * @returns {HTMLPictureElement | HTMLAnchorElement | null}
 */
export const extractMediaElementFromRow = (row) => {
  if (!row) return null;
  const pictureElement = row.querySelector('picture') || row.querySelector('img');
  if (pictureElement) {
    moveInstrumentation(row, pictureElement);
    return pictureElement;
  }
  const videoElement = row.querySelector('video') || row.querySelector('a');
  moveInstrumentation(row, videoElement);
  if (videoElement) return videoElement;
  return null;
};

/**
Extracts a boolean value from the text content of a row.
@param {HTMLElement | null} row
@returns {boolean}
*/
export const extractBooleanValueFromRow = (row) => {
  if (!row) return false;
  const text = row.textContent.trim().toLowerCase();
  return text === 'true';
};
