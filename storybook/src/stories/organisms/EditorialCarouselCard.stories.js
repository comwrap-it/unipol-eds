import { html } from 'lit';

import { createEditorialCarouselCard } from '@blocks/editorial-carousel-card/editorial-carousel-card.js';
import { BUTTON_ICON_SIZES } from '@blocks/atoms/buttons/standard-button/standard-button.js';

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

export default {
  title: 'Organisms/Editorial Carousel Card',
  tags: ['autodocs'],
  render: (args) => {
    const outer = document.createElement('div');
    outer.style.display = 'flex';
    outer.style.justifyContent = 'center';

    const wrapper = document.createElement('div');
    wrapper.className = 'editorial-carousel-card-wrapper';

    const imageSrc = args.imageSrc || createPlaceholderImageDataUri({ label: 'Card Image' });

    const card = createEditorialCarouselCard({
      title: args.title,
      description: args.description,
      imageSrc,
      imageAlt: args.imageAlt,
      note: args.note,
      buttonConfig: args.buttonLabel ? {
        label: args.buttonLabel,
        href: args.buttonHref,
        openInNewTab: args.openInNewTab,
        iconSize: args.buttonIconSize,
        leftIcon: args.leftIcon,
        rightIcon: args.rightIcon,
        disabled: !args.buttonHref,
      } : null,
    });

    wrapper.appendChild(card);
    outer.appendChild(wrapper);

    return html`${outer}`;
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title.',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Card description.',
      table: { category: 'Content' },
    },
    note: {
      control: 'text',
      description: 'Optional note under the CTA.',
      table: { category: 'Content' },
    },
    buttonLabel: {
      control: 'text',
      description: 'CTA label.',
      table: { category: 'CTA (Link Button)' },
    },
    buttonHref: {
      control: 'text',
      description: 'CTA href.',
      table: { category: 'CTA (Link Button)' },
    },
    openInNewTab: {
      control: 'boolean',
      description: 'Open CTA in a new tab.',
      table: { category: 'CTA (Link Button)' },
    },
    buttonIconSize: {
      control: { type: 'select' },
      options: Object.values(BUTTON_ICON_SIZES),
      description: 'Icon size.',
      table: { category: 'CTA (Link Button)' },
    },
    leftIcon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      description: 'Left icon class.',
      table: { category: 'CTA (Link Button)' },
    },
    rightIcon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      description: 'Right icon class.',
      table: { category: 'CTA (Link Button)' },
    },
    imageSrc: {
      control: 'text',
      description: 'Image source. Leave empty to use a placeholder.',
      table: { category: 'Image' },
    },
    imageAlt: {
      control: 'text',
      description: 'Image alt text.',
      table: { category: 'Image' },
    },
  },
  args: {
    title: 'Tecnologia Unibox',
    description: 'Con i nostri dispositivi satellitari Unibox, puoi ottenere sconti personalizzati sul premio in base al tuo stile di guida.',
    note: '',
    buttonLabel: 'Scopri di piu',
    buttonHref: 'https://example.com',
    openInNewTab: false,
    buttonIconSize: BUTTON_ICON_SIZES.MEDIUM,
    leftIcon: '',
    rightIcon: 'un-icon-chevron-right',
    imageSrc: '',
    imageAlt: 'Editorial card image',
  },
};

export const Default = {};

export const WithoutCta = {
  args: {
    buttonLabel: '',
    buttonHref: '',
  },
};

