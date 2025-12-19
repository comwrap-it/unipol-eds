import { loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import decorateProductHighlightsCarousel from '../product-highlights-carousel/product-highlights-carousel.js';
import {
  createButton,
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
} from '../atoms/buttons/standard-button/standard-button.js';
import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';

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
  const normalizedProp = String(propName || '').trim().toLowerCase();
  return rows.find((row) => {
    const directProp = row?.getAttribute?.('data-aue-prop')
      || row?.getAttribute?.('data-richtext-prop');
    if (directProp === propName) return true;

    if (row?.querySelector?.(`[data-aue-prop="${propName}"], [data-richtext-prop="${propName}"]`)) {
      return true;
    }

    const labelCell = row?.children?.[0];
    const labelText = labelCell?.textContent?.trim()?.toLowerCase();
    return labelText === normalizedProp;
  }) || null;
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

const parseBooleanValue = (value) => String(value || '').trim().toLowerCase() === 'true';

const parseDatasetValue = (section, name) => {
  if (!section?.dataset) return '';
  return section.dataset[name] || section.dataset[String(name || '').toLowerCase()] || '';
};

const parseWidgetDataset = (section) => ({
  logoSrc: parseDatasetValue(section, 'logo'),
  logoAlt: parseDatasetValue(section, 'logoAlt') || parseDatasetValue(section, 'logoalt'),
  title: parseDatasetValue(section, 'title'),
  description: parseDatasetValue(section, 'description'),
  buttonLabel: parseDatasetValue(section, 'buttonLabel') || parseDatasetValue(section, 'buttonlabel'),
  buttonLink: parseDatasetValue(section, 'buttonLink') || parseDatasetValue(section, 'buttonlink'),
  buttonOpenInNewTab: parseDatasetValue(section, 'buttonOpenInNewTab')
    || parseDatasetValue(section, 'buttonopeninnewtab'),
});

const parseSectionMetadataRows = (section) => {
  if (!section) return [];
  const metadata = section.querySelector(':scope > .section-metadata');
  return metadata ? Array.from(metadata.children) : [];
};

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
  let rows = wrapper
    ? Array.from(wrapper.children)
    : container
      ? Array.from(container.children)
      : [];
  if (!rows.length && section) {
    rows = parseSectionMetadataRows(section);
  }
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

function createLogo(logoRow, logoAltRow, datasetConfig) {
  let mediaElement = parseMediaElement(logoRow);
  if (!mediaElement && datasetConfig?.logoSrc) {
    const img = document.createElement('img');
    img.src = datasetConfig.logoSrc;
    mediaElement = img;
  }
  if (!mediaElement) return null;

  const logo = document.createElement('div');
  logo.className = 'product-highlights-widget-logo';
  logo.appendChild(mediaElement);

  const altText = parseTextContent(logoAltRow) || datasetConfig?.logoAlt;
  if (altText) {
    const img = mediaElement.tagName === 'IMG'
      ? mediaElement
      : mediaElement.querySelector?.('img');
    if (img) img.alt = altText;
  }

  if (logoRow) moveInstrumentation(logoRow, logo);
  return logo;
}

function createTitle(titleRow, datasetConfig) {
  const titleText = parseTextContent(titleRow) || datasetConfig?.title;
  if (!titleText) return null;
  const title = document.createElement('h2');
  title.className = 'product-highlights-widget-title';
  title.textContent = titleText;
  if (titleRow) moveInstrumentation(titleRow, title);
  return title;
}

function createDescription(descriptionRow, datasetConfig) {
  if (!descriptionRow && !datasetConfig?.description) return null;
  const description = document.createElement('div');
  description.className = 'product-highlights-widget-description';

  const fragment = parseFragmentFromRow(descriptionRow);
  if (fragment && fragment.textContent?.trim()) {
    description.appendChild(fragment);
  } else {
    const descriptionText = parseTextContent(descriptionRow) || datasetConfig?.description;
    if (!descriptionText) return null;
    description.textContent = descriptionText;
  }

  if (descriptionRow) moveInstrumentation(descriptionRow, description);
  return description;
}

function createCta(buttonLabelRow, buttonLinkRow, buttonNewTabRow, datasetConfig) {
  const label = parseTextContent(buttonLabelRow) || datasetConfig?.buttonLabel;
  if (!label) return null;

  const linkElement = parseRowValueElement(buttonLinkRow)?.querySelector?.('a');
  const href = linkElement?.href
    || parseTextContent(buttonLinkRow)
    || datasetConfig?.buttonLink;
  const openInNewTab = buttonNewTabRow
    ? parseBoolean(buttonNewTabRow)
    : parseBooleanValue(datasetConfig?.buttonOpenInNewTab);

  const cta = createButton(
    label,
    href,
    openInNewTab,
    BUTTON_VARIANTS.SECONDARY,
    BUTTON_ICON_SIZES.MEDIUM,
  );
  cta.classList.add('product-highlights-widget-button');
  if (cta.tagName === 'BUTTON') cta.type = 'button';

  if (buttonLabelRow) moveInstrumentation(buttonLabelRow, cta);
  if (buttonLinkRow) moveInstrumentation(buttonLinkRow, cta);
  if (buttonNewTabRow) moveInstrumentation(buttonNewTabRow, cta);

  return cta;
}

function createPauseButton() {
  const pauseButton = createIconButton(
    'un-icon-pause-circle',
    BUTTON_VARIANTS.PRIMARY,
    BUTTON_ICON_SIZES.SMALL,
  );
  pauseButton.classList.add('product-highlights-widget-pause');
  if (pauseButton.tagName === 'BUTTON') pauseButton.type = 'button';
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
  const datasetConfig = parseWidgetDataset(section);
  const hasDatasetConfig = Object.values(datasetConfig)
    .some((value) => String(value || '').trim());
  if (!rows.length && !hasDatasetConfig) return;

  const {
    logoRow,
    logoAltRow,
    titleRow,
    descriptionRow,
    buttonLabelRow,
    buttonLinkRow,
    buttonNewTabRow,
  } = parseWidgetConfig(rows);

  const logo = createLogo(logoRow, logoAltRow, datasetConfig);
  const title = createTitle(titleRow, datasetConfig);
  const description = createDescription(descriptionRow, datasetConfig);
  const cta = createCta(buttonLabelRow, buttonLinkRow, buttonNewTabRow, datasetConfig);
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

  const scope = block instanceof Element ? block : document;
  const sections = [];

  if (block instanceof Element) {
    if (block.classList.contains('product-highlights-carousel')) {
      const section = block.closest('.section');
      if (section) sections.push(section);
    } else if (block.classList.contains('section') || block.classList.contains(WIDGET_CLASS)) {
      const section = block.classList.contains('section') ? block : block.closest('.section');
      if (section) sections.push(section);
    }
  }

  if (!sections.length) {
    sections.push(...Array.from(scope.querySelectorAll(`.section.${WIDGET_CLASS}`)));
  }

  if (!sections.length) {
    sections.push(
      ...Array.from(scope.querySelectorAll('.section'))
        .filter((section) => section.querySelector('.product-highlights-carousel')),
    );
  }

  (await Promise.all(sections)).forEach(async (section) => {
    await decorateWidgetSection(section, section.querySelector(`.${WIDGET_CLASS}`));
  });
}
