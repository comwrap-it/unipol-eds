import { html } from 'lit';

import decorateEditorialCarouselCard from '@blocks/editorial-carousel-card/editorial-carousel-card.js';
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

const IMAGE_LAYOUTS = {
  CURRENT: 'current',
  LEGACY: 'legacy',
};

function createPlaceholderImageDataUri({
  label,
  width = 632,
  height = 400,
  background = '#D9E2FF',
  foreground = '#0A1F44',
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

function createEditorialCarouselCardBlock(args) {
  const block = document.createElement('div');
  block.className = 'editorial-carousel-card';
  block.dataset.blockName = 'editorial-carousel-card';

  const imageSrc = args.imageSrc || createPlaceholderImageDataUri({ label: 'Card Image' });

  const rows = [
    // 0: Title
    createTextRow('h3', args.title),

    // 1: Description
    createTextRow('p', args.description),

    // 2..8: CTA (standard-button authoring model)
    createPlainRow(args.buttonLabel),
    createPlainRow(args.buttonVariant),
    createLinkRow(args.buttonHref, args.buttonHrefLabel),
    createPlainRow(String(Boolean(args.openInNewTab))),
    createPlainRow(args.buttonIconSize),
    createPlainRow(args.leftIcon),
    createPlainRow(args.rightIcon),

    // 9: Note
    createTextRow('p', args.note || ''),
  ];

  if (args.imageLayout === IMAGE_LAYOUTS.LEGACY) {
    rows.push(
      createPlainRow(''),
      createPlainRow(''),
      createPlainRow(''),
    );
  }

  // Image + Alt
  rows.push(createImageRow(imageSrc));
  rows.push(createPlainRow(args.imageAlt));

  rows.forEach((row) => block.appendChild(row));
  return block;
}

export default {
  title: 'Organisms/Editorial Carousel Card',
  tags: ['autodocs'],
  render: (args) => {
    const outer = document.createElement('div');
    outer.style.display = 'flex';
    outer.style.justifyContent = 'center';

    const wrapper = document.createElement('div');
    wrapper.className = 'editorial-carousel-card-wrapper';

    const block = createEditorialCarouselCardBlock(args);
    wrapper.appendChild(block);
    outer.appendChild(wrapper);

    // Decorate after insertion.
    requestAnimationFrame(() => {
      decorateEditorialCarouselCard(block);
    });

    return html`${outer}`;
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title (row 0).',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Card description (row 1).',
      table: { category: 'Content' },
    },
    note: {
      control: 'text',
      description: 'Optional note below the CTA (row 9).',
      table: { category: 'Content' },
    },
    buttonLabel: {
      control: 'text',
      description: 'CTA label (row 2).',
      table: { category: 'CTA (Standard Button Model)' },
    },
    buttonVariant: {
      control: { type: 'select' },
      options: Object.values(BUTTON_VARIANTS),
      description: 'CTA variant (row 3).',
      table: { category: 'CTA (Standard Button Model)' },
    },
    buttonHref: {
      control: 'text',
      description: 'CTA href (row 4).',
      table: { category: 'CTA (Standard Button Model)' },
    },
    buttonHrefLabel: {
      control: 'text',
      description: 'Anchor label text for the CTA href row.',
      table: { category: 'CTA (Standard Button Model)' },
    },
    openInNewTab: {
      control: 'boolean',
      description: 'Open CTA in a new tab (row 5).',
      table: { category: 'CTA (Standard Button Model)' },
    },
    buttonIconSize: {
      control: { type: 'select' },
      options: Object.values(BUTTON_ICON_SIZES),
      description: 'Icon size (row 6).',
      table: { category: 'CTA (Standard Button Model)' },
    },
    leftIcon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      description: 'Left icon class (row 7).',
      table: { category: 'CTA (Standard Button Model)' },
    },
    rightIcon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      description: 'Right icon class (row 8).',
      table: { category: 'CTA (Standard Button Model)' },
    },
    imageSrc: {
      control: 'text',
      description: 'Image source (row 10 or 13). Leave empty to use a placeholder.',
      table: { category: 'Image' },
    },
    imageAlt: {
      control: 'text',
      description: 'Image alt text (row 11 or 14).',
      table: { category: 'Image' },
    },
    imageLayout: {
      control: { type: 'select' },
      options: Object.values(IMAGE_LAYOUTS),
      description: 'Select current or legacy image row indices.',
      table: { category: 'Layout' },
    },
  },
  args: {
    title: 'Tecnologia Unibox',
    description: 'Con i nostri dispositivi satellitari Unibox, puoi ottenere sconti personalizzati sul premio in base al tuo stile di guida.',
    note: '',
    buttonLabel: 'Scopri di piu',
    buttonVariant: BUTTON_VARIANTS.PRIMARY,
    buttonHref: 'https://example.com',
    buttonHrefLabel: 'https://example.com',
    openInNewTab: false,
    buttonIconSize: BUTTON_ICON_SIZES.MEDIUM,
    leftIcon: '',
    rightIcon: 'un-icon-chevron-right',
    imageSrc: '',
    imageAlt: 'Editorial card image',
    imageLayout: IMAGE_LAYOUTS.CURRENT,
  },
};

export const Default = {};

export const WithNote = {
  args: {
    note: 'Condizioni applicabili. Maggiori dettagli nella pagina dedicata.',
  },
};

export const LegacyImageRows = {
  args: {
    imageLayout: IMAGE_LAYOUTS.LEGACY,
  },
};
