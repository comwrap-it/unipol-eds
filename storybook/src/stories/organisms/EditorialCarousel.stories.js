import { html } from 'lit';

import decorateEditorialCarousel from '@blocks/editorial-carousel/editorial-carousel.js';
import {
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
} from '@blocks/atoms/buttons/standard-button/standard-button.js';

// CSS is loaded globally in preview-head.html

const ICON_OPTIONS = [
  '',
  'un-icon-chevron-left',
  'un-icon-chevron-right',
  'un-icon-search',
];

function createPlaceholderImageDataUri({
  label,
  width = 632,
  height = 400,
  background = '#E7F6F2',
  foreground = '#003D2B',
} = {}) {
  const safeLabel = String(label || 'Editorial');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${background}" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="${foreground}"
        font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="32"
      >
        ${safeLabel}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function createRowWithElement(element) {
  const row = document.createElement('div');
  row.appendChild(element);
  return row;
}

function createTextRow(tagName, text) {
  const element = document.createElement(tagName);
  element.textContent = text;
  return createRowWithElement(element);
}

function createPlainRow(text) {
  const row = document.createElement('div');
  row.textContent = text;
  return row;
}

function createLinkRow(href, label) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label || href;
  return createRowWithElement(link);
}

function createImageRow(src) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  return createRowWithElement(img);
}

function createCardItemRows({
  title,
  description,
  buttonLabel,
  buttonVariant,
  buttonHref,
  openInNewTab,
  buttonIconSize,
  leftIcon,
  rightIcon,
  note,
  imageSrc,
  imageAlt,
}) {
  return [
    // 0: Title
    createTextRow('h3', title),

    // 1: Description
    createTextRow('p', description),

    // 2..8: CTA (standard-button authoring model)
    createPlainRow(buttonLabel),
    createPlainRow(buttonVariant),
    createLinkRow(buttonHref, buttonHref),
    createPlainRow(String(Boolean(openInNewTab))),
    createPlainRow(buttonIconSize),
    createPlainRow(leftIcon),
    createPlainRow(rightIcon),

    // 9: Note
    createTextRow('p', note || ''),

    // 10: Image
    createImageRow(imageSrc),

    // 11: Alt
    createPlainRow(imageAlt),
  ];
}

function createEditorialCarouselBlock(args) {
  const block = document.createElement('div');
  block.className = 'editorial-carousel';
  block.dataset.blockName = 'editorial-carousel';

  // Row 0: "Show more" label.
  block.appendChild(createPlainRow(args.showMoreLabel));

  // Row 1..n: card item rows.
  for (let i = 0; i < args.cardCount; i += 1) {
    const imageSrc = createPlaceholderImageDataUri({
      label: `Card ${i + 1}`,
      background: i % 2 ? '#D9E2FF' : '#E7F6F2',
      foreground: i % 2 ? '#0A1F44' : '#003D2B',
    });

    const item = document.createElement('div');
    const rows = createCardItemRows({
      title: `${args.titlePrefix} ${i + 1}`,
      description: args.description,
      buttonLabel: args.buttonLabel,
      buttonVariant: args.buttonVariant,
      buttonHref: args.buttonHref,
      openInNewTab: args.openInNewTab,
      buttonIconSize: args.buttonIconSize,
      leftIcon: args.leftIcon,
      rightIcon: args.rightIcon,
      note: args.note,
      imageSrc,
      imageAlt: args.imageAlt,
    });

    rows.forEach((row) => item.appendChild(row));
    block.appendChild(item);
  }

  return block;
}

export default {
  title: 'Organisms/Editorial Carousel',
  tags: ['autodocs'],
  render: (args) => {
    const container = document.createElement('div');

    const block = createEditorialCarouselBlock(args);
    container.appendChild(block);

    // Decorate after insertion.
    requestAnimationFrame(() => {
      decorateEditorialCarousel(block);
    });

    return html`${container}`;
  },
  argTypes: {
    showMoreLabel: {
      control: 'text',
      description: 'Mobile-only label for the "show more" CTA (row 0).',
      table: { category: 'Carousel' },
    },
    cardCount: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      description: 'Number of cards (min 1, max 8).',
      table: { category: 'Carousel' },
    },
    titlePrefix: {
      control: 'text',
      description: 'Prefix used to generate card titles.',
      table: { category: 'Card Content' },
    },
    description: {
      control: 'text',
      description: 'Shared description for all cards.',
      table: { category: 'Card Content' },
    },
    note: {
      control: 'text',
      description: 'Optional note below the CTA for all cards.',
      table: { category: 'Card Content' },
    },
    buttonLabel: {
      control: 'text',
      description: 'CTA label for all cards.',
      table: { category: 'CTA' },
    },
    buttonVariant: {
      control: { type: 'select' },
      options: Object.values(BUTTON_VARIANTS),
      description: 'CTA variant for all cards.',
      table: { category: 'CTA' },
    },
    buttonHref: {
      control: 'text',
      description: 'CTA href for all cards.',
      table: { category: 'CTA' },
    },
    openInNewTab: {
      control: 'boolean',
      description: 'Open CTA in a new tab.',
      table: { category: 'CTA' },
    },
    buttonIconSize: {
      control: { type: 'select' },
      options: Object.values(BUTTON_ICON_SIZES),
      description: 'Icon size for all cards.',
      table: { category: 'CTA' },
    },
    leftIcon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      description: 'Left icon class for all cards.',
      table: { category: 'CTA' },
    },
    rightIcon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      description: 'Right icon class for all cards.',
      table: { category: 'CTA' },
    },
    imageAlt: {
      control: 'text',
      description: 'Image alt text for all cards.',
      table: { category: 'Image' },
    },
  },
  args: {
    showMoreLabel: 'Mostra di pi?',
    cardCount: 6,
    titlePrefix: 'Editorial Card',
    description: 'Esempio di descrizione: contenuto editoriale per il carosello, con testo coerente e leggibile.',
    note: '',
    buttonLabel: 'Scopri di pi?',
    buttonVariant: BUTTON_VARIANTS.PRIMARY,
    buttonHref: 'https://example.com',
    openInNewTab: false,
    buttonIconSize: BUTTON_ICON_SIZES.MEDIUM,
    leftIcon: '',
    rightIcon: 'un-icon-chevron-right',
    imageAlt: 'Editorial carousel image',
  },
};

export const Default = {};

export const FewCardsNoNavigation = {
  args: {
    cardCount: 3,
  },
};

export const WithNote = {
  args: {
    note: 'Condizioni applicabili. Maggiori dettagli nella pagina dedicata.',
  },
};
