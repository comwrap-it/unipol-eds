import { html } from 'lit';

import decorateTextCard, { createTextCard } from '@blocks/text-card/text-card.js';

const ICON_OPTIONS = [
  'un-icon-home',
  'un-icon-car',
  'un-icon-health',
  'un-icon-pets',
  'un-icon-search',
];

const buildTitle = (title) => {
  const element = document.createElement('p');
  element.className = 'text-card-title';
  element.textContent = title;
  return element;
};

const buildCard = (title, icon) => {
  const card = createTextCard({
    icon,
    titleElement: buildTitle(title),
  });
  decorateTextCard(card);
  return card;
};

export default {
  title: 'Atoms/Text Card',
  tags: ['autodocs'],
  render: (args) => {
    const outer = document.createElement('div');
    outer.style.display = 'flex';
    outer.style.justifyContent = 'center';
    outer.style.padding = '2rem 0';

    outer.appendChild(buildCard(args.title, args.icon));

    return html`${outer}`;
  },
  argTypes: {
    title: {
      control: 'text',
      table: { category: 'Content' },
    },
    icon: {
      control: { type: 'select' },
      options: ICON_OPTIONS,
      table: { category: 'Content' },
    },
  },
  args: {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed',
    icon: 'un-icon-home',
  },
};

export const Default = {};

export const ThreeCards = {
  render: () => {
    const outer = document.createElement('div');
    outer.style.display = 'flex';
    outer.style.flexWrap = 'wrap';
    outer.style.justifyContent = 'center';
    outer.style.gap = '1.5rem';
    outer.style.padding = '2rem 0';

    ICON_OPTIONS.slice(0, 3).forEach((icon, index) => {
      outer.appendChild(buildCard(`Card text ${index + 1}`, icon));
    });

    return html`${outer}`;
  },
};
