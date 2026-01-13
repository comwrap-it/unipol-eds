import { html } from 'lit';

import decorateInfoPillars from '@blocks/info-pillars/info-pillars.js';
import { createTextBlock } from '@blocks/text-block/text-block.js';
import { createTextCard } from '@blocks/text-card/text-card.js';

const ICON_OPTIONS = [
  'un-icon-home',
  'un-icon-car',
  'un-icon-health',
  'un-icon-pets',
  'un-icon-search',
];

const ICON_MODES = {
  SINGLE: 'single',
  ALTERNATING: 'alternating',
};

const buildTitle = (title) => {
  const element = document.createElement('p');
  element.className = 'text-card-title';
  element.textContent = title;
  return element;
};

const buildCard = (title, icon) => createTextCard({
  icon,
  titleElement: buildTitle(title),
});

const resolveIcon = (iconMode, icon, index) => {
  if (iconMode === ICON_MODES.ALTERNATING) {
    return ICON_OPTIONS[index % ICON_OPTIONS.length];
  }
  return icon;
};

export default {
  title: 'Blocks/Info Pillars Widget',
  tags: ['autodocs'],
  render: (args) => {
    const section = document.createElement('div');
    section.className = 'section';

    const textBlock = createTextBlock(args.title, true, args.subtitle);
    section.appendChild(textBlock);

    const block = document.createElement('div');
    block.className = 'info-pillars';

    const totalCards = Math.max(3, Math.min(6, Number(args.cardCount) || 3));
    for (let index = 0; index < totalCards; index += 1) {
      const icon = resolveIcon(args.iconMode, args.icon, index);
      const title = `${args.cardTitlePrefix} ${index + 1}`;
      block.appendChild(buildCard(title, icon));
    }

    section.appendChild(block);
    decorateInfoPillars(block);

    return html`${section}`;
  },
  argTypes: {
    title: {
      control: 'text',
      table: { category: 'Header' },
    },
    subtitle: {
      control: 'text',
      table: { category: 'Header' },
    },
    cardCount: {
      control: { type: 'range', min: 3, max: 6, step: 1 },
      table: { category: 'Cards' },
    },
    cardTitlePrefix: {
      control: 'text',
      table: { category: 'Cards' },
    },
    iconMode: {
      control: { type: 'select' },
      options: Object.values(ICON_MODES),
      table: { category: 'Cards' },
    },
    icon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      table: { category: 'Cards' },
    },
  },
  args: {
    title: 'Title',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    cardCount: 3,
    cardTitlePrefix: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed',
    iconMode: ICON_MODES.SINGLE,
    icon: 'un-icon-home',
  },
};

export const Default = {};

export const AlternatingIcons = {
  args: {
    iconMode: ICON_MODES.ALTERNATING,
    cardCount: 4,
  },
};
