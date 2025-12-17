import { html } from 'lit';

import { createEditorialCarousel } from '@blocks/editorial-carousel/editorial-carousel.js';
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

export default {
  title: 'Organisms/Editorial Carousel',
  tags: ['autodocs'],
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'editorial-carousel-wrapper';

    const cards = Array.from({ length: args.cardCount }, (_, index) => {
      const imageSrc = createPlaceholderImageDataUri({
        label: `Card ${index + 1}`,
        background: index % 2 ? '#D9E2FF' : '#E7F6F2',
        foreground: index % 2 ? '#0A1F44' : '#003D2B',
      });

      return {
        title: `${args.titlePrefix} ${index + 1}`,
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
      };
    });

    const carousel = createEditorialCarousel({
      cards,
      showMoreButtonLabel: args.showMoreLabel,
    });
    carousel.classList.add('block', 'editorial-carousel-block');

    wrapper.appendChild(carousel);
    return html`${wrapper}`;
  },
  argTypes: {
    cardSize: {
      control: { type: 'select' },
      options: Object.values(EDITORIAL_CAROUSEL_CARD_SIZES),
      description: 'Global size for all cards: `s` (small) or `m` (medium).',
      table: { category: 'Layout' },
    },
    showMoreLabel: {
      control: 'text',
      description: 'Mobile-only label for the "show more" CTA.',
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
      description: 'Optional note shown under the CTA.',
      table: { category: 'Card Content' },
    },
    buttonLabel: {
      control: 'text',
      description: 'CTA label for all cards.',
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
    cardSize: EDITORIAL_CAROUSEL_CARD_SIZES.S,
    showMoreLabel: 'Mostra di piu',
    cardCount: 6,
    titlePrefix: 'Editorial Card',
    description: 'Esempio di descrizione: contenuto editoriale per il carosello, con testo coerente e leggibile.',
    note: '',
    buttonLabel: 'Scopri di piu',
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
