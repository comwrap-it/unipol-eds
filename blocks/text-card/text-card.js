import { loadCSS } from '../../scripts/aem.js';
import { createIconElementFromCssClass } from '../../scripts/domHelpers.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { BUTTON_ICON_SIZES } from '../../constants/index.js';

// #region CONSTANTS
const CARD_CLASS = 'text-card';
const DECORATED_ATTR = 'data-text-card';
// #endregion

// #region HELPERS
let stylesLoaded = false;
let stylesLoadingPromise = null;

async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  if (!stylesLoadingPromise) {
    stylesLoadingPromise = (async () => {
      await loadCSS(
        `${window.hlx.codeBasePath}/blocks/text-card/text-card.css`,
      );
      stylesLoaded = true;
    })();
  }
  await stylesLoadingPromise;
}

/**
 * @param {HTMLElement[]|null} rows
 * @param {string} propName
 * @returns {HTMLElement|null}
 */
const findRowByProp = (rows, propName) => {
  if (!rows?.length) return null;
  return rows.find((row) => row?.getAttribute?.('data-aue-prop') === propName
    || row?.getAttribute?.('data-richtext-prop') === propName
    || row?.querySelector?.(`[data-aue-prop="${propName}"], [data-richtext-prop="${propName}"]`))
    || null;
};

/**
 * @param {HTMLElement|null} row
 * @returns {HTMLElement|null}
 */
const getRowValueElement = (row) => {
  if (!row) return null;
  const cells = row.children;
  if (cells?.length === 2) return cells[1];
  return row;
};

/**
 * @param {HTMLElement|null} element
 * @returns {boolean}
 */
const hasInstrumentation = (element) => Boolean(
  element?.hasAttribute?.('data-aue-resource')
  || element?.hasAttribute?.('data-richtext-prop')
  || element?.querySelector?.('[data-aue-resource], [data-richtext-prop]'),
);

/**
 * @param {HTMLElement|null} source
 * @returns {HTMLElement|null}
 */
const buildTitleElement = (source) => {
  if (!source) return null;

  const directElement = source.tagName === 'P' || source.tagName === 'H3'
    ? source
    : null;
  const existingParagraph = directElement || source.querySelector('p');

  if (existingParagraph) {
    existingParagraph.classList.add('text-card-title');
    moveInstrumentation(source, existingParagraph);
    return existingParagraph;
  }

  const text = source.textContent?.trim() || '';
  if (!text && !hasInstrumentation(source)) return null;

  const title = document.createElement('p');
  title.className = 'text-card-title';

  while (source.firstChild) title.appendChild(source.firstChild);

  if (!title.textContent.trim()) title.textContent = text;

  moveInstrumentation(source, title);
  return title;
};
// #endregion

// #region CREATE
/**
 * @param {Object} [options]
 * @param {HTMLElement|null} [options.root]
 * @param {string} [options.icon]
 * @param {HTMLElement|null} [options.iconElement]
 * @param {HTMLElement|null} [options.titleElement]
 * @returns {HTMLElement}
 */
export function createTextCard({
  root = null,
  icon = '',
  iconElement = null,
  titleElement = null,
} = {}) {
  const card = root || document.createElement('div');
  card.classList.add(CARD_CLASS);

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'text-card-icon';

  const resolvedIcon = iconElement
    || (icon ? createIconElementFromCssClass(icon, BUTTON_ICON_SIZES.SMALL) : null);
  if (resolvedIcon) iconWrapper.appendChild(resolvedIcon);

  const content = document.createElement('div');
  content.className = 'text-card-content';
  if (titleElement) content.appendChild(titleElement);

  card.textContent = '';
  card.append(iconWrapper, content);

  return card;
}
// #endregion

// #region PARSE
/**
 * @param {HTMLElement} block
 * @returns {Object}
 */
export function parse(block) {
  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const rows = wrapper ? Array.from(wrapper.children) : Array.from(block.children);
  const hasProps = rows.some((row) => row?.getAttribute?.('data-aue-prop')
    || row?.getAttribute?.('data-richtext-prop')
    || row?.querySelector?.('[data-aue-prop], [data-richtext-prop]'));

  let iconSource = null;
  let titleSource = null;

  if (!hasProps && rows.length === 1 && rows[0]?.children?.length >= 2) {
    [iconSource, titleSource] = rows[0].children;
  } else {
    const iconRow = findRowByProp(rows, 'icon') || rows[0] || null;
    const titleRow = findRowByProp(rows, 'title')
      || findRowByProp(rows, 'text')
      || rows[1]
      || null;
    iconSource = getRowValueElement(iconRow);
    titleSource = getRowValueElement(titleRow);
  }

  const icon = iconSource?.textContent?.trim() || '';
  const titleElement = buildTitleElement(titleSource);

  return {
    icon,
    iconSource,
    titleElement,
  };
}
// #endregion

// #region DECORATE
/**
 * @param {HTMLElement} block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  if (block.getAttribute(DECORATED_ATTR) === 'true') return;
  if (block.querySelector(':scope > .text-card-icon')) {
    block.setAttribute(DECORATED_ATTR, 'true');
    return;
  }

  const parsed = parse(block);
  const iconElement = parsed.icon
    ? createIconElementFromCssClass(parsed.icon, BUTTON_ICON_SIZES.SMALL)
    : null;

  if (iconElement && parsed.iconSource) {
    moveInstrumentation(parsed.iconSource, iconElement);
  }

  createTextCard({
    root: block,
    iconElement,
    titleElement: parsed.titleElement,
  });

  block.setAttribute(DECORATED_ATTR, 'true');
}
// #endregion
