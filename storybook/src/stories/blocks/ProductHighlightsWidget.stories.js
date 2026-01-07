import { html } from 'lit';

import decorateProductHighlightsWidget from '@blocks/product-highlights-widget/product-highlights-widget.js';
import { createProductHighlightsCarousel } from '@blocks/product-highlights-carousel/product-highlights-carousel.js';
import { createTextBlock } from '@blocks/text-block/text-block.js';
import { PHOTO_CARD_SIZES } from '@blocks/photo-card/photo-card.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../../../constants/index.js';

const DIMENSIONS_BY_SIZE = {
  [PHOTO_CARD_SIZES.S]: { width: 380, height: 285 },
  [PHOTO_CARD_SIZES.M]: { width: 870, height: 489 },
};

const SIZE_MODES = {
  ALL_S: 'all-s',
  ALL_M: 'all-m',
  ALTERNATING: 'alternating',
};

const ICON_OPTIONS = [
  '',
  'un-icon-chevron-left',
  'un-icon-chevron-right',
  'un-icon-search',
];

function createPlaceholderImageDataUri({
  label,
  width,
  height,
  background = '#F2F4F8',
  foreground = '#0A1F44',
} = {}) {
  const safeLabel = String(label || 'Image');
  const w = Number.isFinite(width) ? width : 200;
  const h = Number.isFinite(height) ? height : 120;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="100%" height="100%" fill="${background}" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="${foreground}"
        font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="20"
      >
        ${safeLabel}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function resolveSizeForIndex(sizeMode, index) {
  if (sizeMode === SIZE_MODES.ALL_M) return PHOTO_CARD_SIZES.M;
  if (sizeMode === SIZE_MODES.ALTERNATING) return index % 2 ? PHOTO_CARD_SIZES.M : PHOTO_CARD_SIZES.S;
  return PHOTO_CARD_SIZES.S;
}

export default {
  title: 'Blocks/Product Highlights Widget',
  tags: ['autodocs'],
  render: (args) => {
    const section = document.createElement('div');
    section.className = 'section';

    section.dataset.logo = args.logoSrc;
    section.dataset.logoAlt = args.logoAlt;
    if (args.logoSecondarySrc) section.dataset.logoSecondary = args.logoSecondarySrc;
    if (args.logoSecondaryAlt) section.dataset.logoSecondaryAlt = args.logoSecondaryAlt;

    if (args.buttonLabel) {
      section.dataset.standardButtonLabel = args.buttonLabel;
      section.dataset.standardButtonHref = args.buttonHref;
      section.dataset.standardButtonVariant = args.buttonVariant;
      section.dataset.standardButtonOpenInNewTab = String(!!args.openInNewTab);
      section.dataset.standardButtonSize = args.buttonIconSize;
      section.dataset.standardButtonLeftIcon = args.buttonLeftIcon;
      section.dataset.standardButtonRightIcon = args.buttonRightIcon;
    }

    const textBlock = createTextBlock(args.title, true, args.subtitle);
    section.appendChild(textBlock);

    const cardCount = Math.min(8, Math.max(5, Number(args.cardCount) || 5));
    const cards = [];

    for (let index = 0; index < cardCount; index += 1) {
      const size = resolveSizeForIndex(args.sizeMode, index);
      const dims = DIMENSIONS_BY_SIZE[size] || DIMENSIONS_BY_SIZE[PHOTO_CARD_SIZES.S];
      const imageSrc = createPlaceholderImageDataUri({
        label: `Card ${index + 1} (${size.toUpperCase()})`,
        width: dims.width,
        height: dims.height,
        background: index % 2 ? '#D9E2FF' : '#E7F6F2',
        foreground: index % 2 ? '#0A1F44' : '#003D2B',
      });

      cards.push({
        size,
        title: `${args.titlePrefix} ${index + 1}`,
        imageSrc,
        imageAlt: args.imageAlt,
      });
    }

    createProductHighlightsCarousel({ cards }).then((carousel) => {
      section.appendChild(carousel);
      decorateProductHighlightsWidget(section);
    });

    return html`${section}`;
  },
  argTypes: {
    cardCount: {
      control: { type: 'range', min: 5, max: 8, step: 1 },
      table: { category: 'Carousel' },
    },
    sizeMode: {
      control: { type: 'select' },
      options: Object.values(SIZE_MODES),
      table: { category: 'Cards' },
    },
    titlePrefix: {
      control: 'text',
      table: { category: 'Cards' },
    },
    imageAlt: {
      control: 'text',
      table: { category: 'Cards' },
    },
    title: {
      control: 'text',
      table: { category: 'Header' },
    },
    subtitle: {
      control: 'text',
      table: { category: 'Header' },
    },
    logoSrc: {
      control: 'text',
      table: { category: 'Header' },
    },
    logoAlt: {
      control: 'text',
      table: { category: 'Header' },
    },
    logoSecondarySrc: {
      control: 'text',
      table: { category: 'Header' },
    },
    logoSecondaryAlt: {
      control: 'text',
      table: { category: 'Header' },
    },
    buttonLabel: {
      control: 'text',
      table: { category: 'CTA' },
    },
    buttonHref: {
      control: 'text',
      table: { category: 'CTA' },
    },
    openInNewTab: {
      control: 'boolean',
      table: { category: 'CTA' },
    },
    buttonVariant: {
      control: { type: 'select' },
      options: Object.values(BUTTON_VARIANTS),
      table: { category: 'CTA' },
    },
    buttonIconSize: {
      control: { type: 'select' },
      options: Object.values(BUTTON_ICON_SIZES),
      table: { category: 'CTA' },
    },
    buttonLeftIcon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      table: { category: 'CTA' },
    },
    buttonRightIcon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      table: { category: 'CTA' },
    },
  },
  args: {
    cardCount: 6,
    sizeMode: SIZE_MODES.ALTERNATING,
    titlePrefix: 'Text',
    imageAlt: 'Product highlight image',
    title: 'Featured products',
    subtitle: 'A selection of highlights with continuous carousel motion.',
    logoSrc: createPlaceholderImageDataUri({
      label: 'LOGO',
      width: 160,
      height: 80,
      background: '#FFFFFF',
      foreground: '#001C35',
    }),
    logoAlt: 'Brand logo',
    logoSecondarySrc: '',
    logoSecondaryAlt: '',
    buttonLabel: 'Discover more',
    buttonHref: 'https://example.com',
    openInNewTab: false,
    buttonVariant: BUTTON_VARIANTS.SECONDARY,
    buttonIconSize: BUTTON_ICON_SIZES.MEDIUM,
    buttonLeftIcon: '',
    buttonRightIcon: 'un-icon-chevron-right',
  },
};

export const Default = {};

export const WithSecondaryLogo = {
  args: {
    logoSecondarySrc: createPlaceholderImageDataUri({
      label: 'SUB LOGO',
      width: 120,
      height: 60,
      background: '#FFFFFF',
      foreground: '#001C35',
    }),
    logoSecondaryAlt: 'Secondary logo',
  },
};

export const AllMediumCards = {
  args: {
    sizeMode: SIZE_MODES.ALL_M,
  },
};

export const NoCta = {
  args: {
    buttonLabel: '',
  },
};
