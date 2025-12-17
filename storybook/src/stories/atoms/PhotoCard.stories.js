import { html } from 'lit';

import { createPhotoCard, PHOTO_CARD_SIZES } from '@blocks/atoms/photo-card/photo-card.js';

const DIMENSIONS_BY_SIZE = {
  [PHOTO_CARD_SIZES.S]: { width: 380, height: 240 },
  [PHOTO_CARD_SIZES.M]: { width: 870, height: 489 },
};

function createPlaceholderImageDataUri({
  label,
  width,
  height,
  background = '#F2F4F8',
  foreground = '#0A1F44',
} = {}) {
  const safeLabel = String(label || 'Image Here');
  const w = Number.isFinite(width) ? width : 380;
  const h = Number.isFinite(height) ? height : 240;

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

export default {
  title: 'Atoms/Photo Card',
  tags: ['autodocs'],
  render: (args) => {
    const size = args.size || PHOTO_CARD_SIZES.S;
    const dims = DIMENSIONS_BY_SIZE[size] || DIMENSIONS_BY_SIZE[PHOTO_CARD_SIZES.S];
    const imageSrc = args.imageSrc || createPlaceholderImageDataUri({
      label: 'Image Here',
      width: dims.width,
      height: dims.height,
    });

    const outer = document.createElement('div');
    outer.style.display = 'flex';
    outer.style.justifyContent = 'center';

    const card = createPhotoCard({
      size,
      title: args.title,
      imageSrc,
      imageAlt: args.imageAlt,
    });

    outer.appendChild(card);
    return html`${outer}`;
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: Object.values(PHOTO_CARD_SIZES),
      table: { category: 'Layout' },
    },
    title: {
      control: 'text',
      table: { category: 'Content' },
    },
    imageSrc: {
      control: 'text',
      description: 'Leave empty to use a placeholder.',
      table: { category: 'Image' },
    },
    imageAlt: {
      control: 'text',
      table: { category: 'Image' },
    },
  },
  args: {
    size: PHOTO_CARD_SIZES.S,
    title: 'Text',
    imageSrc: '',
    imageAlt: 'Photo card image',
  },
};

export const SizeS = {
  args: {
    size: PHOTO_CARD_SIZES.S,
  },
};

export const SizeM = {
  args: {
    size: PHOTO_CARD_SIZES.M,
  },
};

export const SideBySide = {
  render: () => {
    const cardS = createPhotoCard({
      size: PHOTO_CARD_SIZES.S,
      title: 'Text',
      imageSrc: createPlaceholderImageDataUri({ label: 'S', width: 380, height: 240 }),
      imageAlt: 'Photo card size S',
    });

    const cardM = createPhotoCard({
      size: PHOTO_CARD_SIZES.M,
      title: 'Text',
      imageSrc: createPlaceholderImageDataUri({ label: 'M', width: 870, height: 489 }),
      imageAlt: 'Photo card size M',
    });

    return html`
      <div style="display: flex; gap: 3rem; align-items: flex-start;">
        ${cardS}
        ${cardM}
      </div>
    `;
  },
};

