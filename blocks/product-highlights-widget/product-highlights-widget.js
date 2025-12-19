import { loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import decorateProductHighlightsCarousel from '../product-highlights-carousel/product-highlights-carousel.js';

const WIDGET_CLASS = 'product-highlights-widget';
const DECORATED_ATTR = 'data-product-highlights-widget';

let stylesLoaded = false;
async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/product-highlights-widget/product-highlights-widget.css`,
  );
  stylesLoaded = true;
}

const parseRowByProp = (rows, propName) => {
  if (!rows?.length) return null;
  return rows.find((row) => row?.getAttribute?.('data-aue-prop') === propName
    || row?.getAttribute?.('data-richtext-prop') === propName
    || row?.querySelector?.(`[data-aue-prop="${propName}"], [data-richtext-prop="${propName}"]`))
    || null;
};

const parseRowValueElement = (row) => {
  if (!row) return null;
  const cells = row.children;
  if (cells?.length === 2) return cells[1];
  return row;
};

const parseTextContent = (row) => parseRowValueElement(row)?.textContent?.trim() || '';

const parseFragmentFromRow = (row) => {
  const valueElement = parseRowValueElement(row);
  if (!valueElement) return null;
  const fragment = document.createDocumentFragment();
  while (valueElement.firstChild) fragment.appendChild(valueElement.firstChild);
  return fragment;
};

const parseMediaElement = (row) => {
  const valueElement = parseRowValueElement(row);
  if (!valueElement) return null;
  return valueElement.querySelector('picture, img')
    || valueElement.querySelector('a[href]')
    || null;
};

const parseBoolean = (row) => parseTextContent(row).toLowerCase() === 'true';

const parseWidgetRows = (block, section) => {
  let container = null;
  let wrapper = null;

  if (block && block.classList.contains(WIDGET_CLASS)) {
    container = block;
    wrapper = container.querySelector(':scope > .default-content-wrapper');
  } else if (section) {
    container = section.querySelector(`:scope > .${WIDGET_CLASS}`);
    if (container) {
      wrapper = container.querySelector(':scope > .default-content-wrapper');
    } else {
      wrapper = section.querySelector(':scope > .default-content-wrapper');
      container = wrapper || null;
    }
  }

  // eslint-disable-next-line no-nested-ternary
  const rows = wrapper
    ? Array.from(wrapper.children)
    : container
      ? Array.from(container.children)
      : [];
  return { container, wrapper, rows };
};

const parseWidgetConfig = (rows = []) => {
  const logoRow = parseRowByProp(rows, 'logo') || rows[0] || null;
  const logoAltRow = parseRowByProp(rows, 'logoAlt') || rows[1] || null;
  const titleRow = parseRowByProp(rows, 'title') || rows[2] || null;
  const descriptionRow = parseRowByProp(rows, 'description') || rows[3] || null;
  const buttonLabelRow = parseRowByProp(rows, 'buttonLabel') || rows[4] || null;
  const buttonLinkRow = parseRowByProp(rows, 'buttonLink') || rows[5] || null;
  const buttonNewTabRow = parseRowByProp(rows, 'buttonOpenInNewTab') || rows[6] || null;

  return {
    logoRow,
    logoAltRow,
    titleRow,
    descriptionRow,
    buttonLabelRow,
    buttonLinkRow,
    buttonNewTabRow,
  };
};

function createLogo(logoRow, logoAltRow) {
  const mediaElement = parseMediaElement(logoRow);
  if (!mediaElement) return null;

  const logo = document.createElement('div');
  logo.className = 'product-highlights-widget-logo';
  logo.appendChild(mediaElement);

  const altText = parseTextContent(logoAltRow);
  if (altText) {
    const img = mediaElement.tagName === 'IMG'
      ? mediaElement
      : mediaElement.querySelector?.('img');
    if (img) img.alt = altText;
  }

  if (logoRow) moveInstrumentation(logoRow, logo);
  return logo;
}

function createTitle(titleRow) {
  const titleText = parseTextContent(titleRow);
  if (!titleText) return null;
  const title = document.createElement('h2');
  title.className = 'product-highlights-widget-title';
  title.textContent = titleText;
  if (titleRow) moveInstrumentation(titleRow, title);
  return title;
}

function createDescription(descriptionRow) {
  if (!descriptionRow) return null;
  const description = document.createElement('div');
  description.className = 'product-highlights-widget-description';

  const fragment = parseFragmentFromRow(descriptionRow);
  if (fragment && fragment.textContent?.trim()) {
    description.appendChild(fragment);
  } else {
    const descriptionText = parseTextContent(descriptionRow);
    if (!descriptionText) return null;
    description.textContent = descriptionText;
  }

  moveInstrumentation(descriptionRow, description);
  return description;
}

function createCta(buttonLabelRow, buttonLinkRow, buttonNewTabRow) {
  const label = parseTextContent(buttonLabelRow);
  if (!label) return null;

  const linkElement = parseRowValueElement(buttonLinkRow)?.querySelector?.('a');
  const href = linkElement?.href || parseTextContent(buttonLinkRow);
  const openInNewTab = parseBoolean(buttonNewTabRow);

  const cta = document.createElement(href ? 'a' : 'button');
  if (href) cta.href = href;
  if (!href) cta.type = 'button';
  if (openInNewTab) {
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
  }
  cta.className = 'product-highlights-widget-button';
  cta.textContent = label;

  if (buttonLabelRow) moveInstrumentation(buttonLabelRow, cta);
  if (buttonLinkRow) moveInstrumentation(buttonLinkRow, cta);

  return cta;
}

function createPauseButton() {
  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.className = 'product-highlights-widget-pause un-icon-pause-circle';
  pauseButton.setAttribute('aria-label', 'Pausa animazione');
  return pauseButton;
}

async function decorateWidgetSection(section, block) {
  if (!section || section.getAttribute(DECORATED_ATTR) === 'true') return;

  const scope = block?.classList?.contains(WIDGET_CLASS) ? block : section;
  let carousel = scope?.querySelector('.product-highlights-carousel');
  if (!carousel && section && scope !== section) {
    carousel = section.querySelector('.product-highlights-carousel');
  }
  if (!carousel) return;

  const { container, wrapper, rows } = parseWidgetRows(block, section);
  const {
    logoRow,
    logoAltRow,
    titleRow,
    descriptionRow,
    buttonLabelRow,
    buttonLinkRow,
    buttonNewTabRow,
  } = parseWidgetConfig(rows);

  const logo = createLogo(logoRow, logoAltRow);
  const title = createTitle(titleRow);
  const description = createDescription(descriptionRow);
  const cta = createCta(buttonLabelRow, buttonLinkRow, buttonNewTabRow);
  const pauseButton = createPauseButton();

  const panel = container && container.classList.contains(WIDGET_CLASS)
    ? container
    : document.createElement('div');
  panel.classList.add('product-highlights-widget-panel');

  const originalCarouselWrapper = carousel.parentElement;

  panel.textContent = '';

  const header = document.createElement('div');
  header.className = 'product-highlights-widget-header';
  if (logo) header.appendChild(logo);
  if (title) header.appendChild(title);
  if (description) header.appendChild(description);

  if (logo || title || description) {
    panel.appendChild(header);
  }

  const carouselWrap = document.createElement('div');
  carouselWrap.className = 'product-highlights-widget-carousel';
  carouselWrap.appendChild(carousel);
  panel.appendChild(carouselWrap);

  if (cta) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'product-highlights-widget-cta';
    ctaWrap.appendChild(cta);
    panel.appendChild(ctaWrap);
  }

  panel.appendChild(pauseButton);

  if (!panel.parentElement) {
    if (container && container.parentElement) {
      container.replaceWith(panel);
    } else {
      section.appendChild(panel);
    }
  }

  if (wrapper && wrapper.isConnected) wrapper.remove();
  if (container && container !== panel && container.isConnected) container.remove();

  if (
    originalCarouselWrapper
    && originalCarouselWrapper !== carouselWrap
    && originalCarouselWrapper.classList.contains('product-highlights-carousel-wrapper')
  ) {
    originalCarouselWrapper.remove();
  }

  section.classList.add(WIDGET_CLASS);
  section.setAttribute(DECORATED_ATTR, 'true');

  await decorateProductHighlightsCarousel(carousel);
}

export default async function decorateProductHighlightsWidget(block) {
  await ensureStylesLoaded();

  if (block instanceof Element) {
    const section = block.classList.contains('section') ? block : block.closest('.section');
    await decorateWidgetSection(section, block);
    return;
  }

  const sections = Array.from(document.querySelectorAll(`.section.${WIDGET_CLASS}`));
  (await Promise.all(sections)).forEach(async (section) => {
    await decorateWidgetSection(section, section.querySelector(`.${WIDGET_CLASS}`));
  });
}
