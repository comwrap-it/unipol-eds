import { html } from 'lit';

import { createProductHighlightsCarousel } from '@blocks/product-highlights-carousel/product-highlights-carousel.js';
import { PHOTO_CARD_SIZES } from '@blocks/photo-card/photo-card.js';

const DIMENSIONS_BY_SIZE = {
  [PHOTO_CARD_SIZES.S]: { width: 380, height: 285 },
  [PHOTO_CARD_SIZES.M]: { width: 870, height: 489 },
};

const SIZE_MODES = {
  ALL_S: 'all-s',
  ALL_M: 'all-m',
  ALTERNATING: 'alternating',
};

function createPlaceholderImageDataUri({
  label,
  width,
  height,
  background = '#F2F4F8',
  foreground = '#0A1F44',
} = {}) {
  const safeLabel = String(label || 'Image Here');
  const w = Number.isFinite(width) ? width : DIMENSIONS_BY_SIZE[PHOTO_CARD_SIZES.S].width;
  const h = Number.isFinite(height) ? height : DIMENSIONS_BY_SIZE[PHOTO_CARD_SIZES.S].height;

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
        font-size="24"
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
  title: 'Blocks/Product Highlights Carousel',
  tags: ['autodocs'],
  render: (args) => {
    const cardCount = Math.max(1, Number(args.cardCount) || 1);
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

    const block = createProductHighlightsCarousel({ cards });

    const outer = document.createElement('div');
    outer.style.display = 'flex';
    outer.style.justifyContent = 'center';
    outer.appendChild(block);

    return html`${outer}`;
  },
  argTypes: {
    cardCount: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
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
  },
  args: {
    cardCount: 6,
    sizeMode: SIZE_MODES.ALL_S,
    titlePrefix: 'Text',
    imageAlt: 'Product highlight image',
  },
};

export const Default = {};

export const AlternatingSizes = {
  args: {
    sizeMode: SIZE_MODES.ALTERNATING,
    cardCount: 8,
  },
};

export const AllMedium = {
  args: {
    sizeMode: SIZE_MODES.ALL_M,
    cardCount: 3,
  },
};
