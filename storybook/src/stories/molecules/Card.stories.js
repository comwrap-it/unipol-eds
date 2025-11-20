/**
 * Card Molecule Stories - Atomic Design System
 * Single card component with image, title, description, and primary button
 */

import { createCard } from '@blocks/molecules/card/card.js';
import '@blocks/molecules/card/card.css';
import '@blocks/atoms/buttons/button/button.css';

export default {
  title: 'Molecules/Card',
  parameters: {
    docs: {
      description: {
        component: 'A single card molecule that combines image, title, description, and a primary button. Part of the Atomic Design System.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
      defaultValue: 'Titolo della Card',
    },
    description: {
      control: 'text',
      description: 'Card description text',
      defaultValue: 'Descrizione della card con informazioni utili per l\'utente.',
    },
    image: {
      control: 'text',
      description: 'Image URL for the card',
      defaultValue: 'https://via.placeholder.com/400x200/007acc/ffffff?text=Card+Image',
    },
    imageAlt: {
      control: 'text',
      description: 'Alt text for the image',
      defaultValue: 'Immagine di esempio',
    },
    buttonText: {
      control: 'text',
      description: 'Text for the primary button',
      defaultValue: 'Scopri di più',
    },
    buttonLink: {
      control: 'text',
      description: 'Link URL for the button',
      defaultValue: '#',
    },
    variant: {
      control: 'select',
      options: ['default', 'featured', 'compact'],
      description: 'Card variant style',
      defaultValue: 'default',
    },
  },
};

const Template = (args) => {
  const { variant, ...cardArgs } = args;
  const card = createCard({
    ...cardArgs,
    className: variant !== 'default' ? variant : '',
  });
  
  // Create container for better display in Storybook
  const container = document.createElement('div');
  container.style.maxWidth = '400px';
  container.style.margin = '0 auto';
  container.appendChild(card);
  
  return container;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Card Standard',
  description: 'Questa è una card standard con tutti gli elementi base: immagine, titolo, descrizione e bottone.',
  image: 'https://via.placeholder.com/400x200/007acc/ffffff?text=Card+Standard',
  imageAlt: 'Card standard',
  buttonText: 'Scopri di più',
  buttonLink: '#',
  variant: 'default',
};

export const WithoutImage = Template.bind({});
WithoutImage.args = {
  title: 'Card Senza Immagine',
  description: 'Questa card non ha un\'immagine, mostra solo il contenuto testuale con il bottone.',
  image: '',
  imageAlt: '',
  buttonText: 'Vai al dettaglio',
  buttonLink: '#',
  variant: 'default',
};

export const Featured = Template.bind({});
Featured.args = {
  title: 'Card in Evidenza',
  description: 'Questa card è messa in evidenza con uno stile speciale che la distingue dalle altre.',
  image: 'https://via.placeholder.com/400x200/ff6b35/ffffff?text=Card+Featured',
  imageAlt: 'Card in evidenza',
  buttonText: 'Scopri l\'offerta',
  buttonLink: '#',
  variant: 'featured',
};

export const Compact = Template.bind({});
Compact.args = {
  title: 'Card Compatta',
  description: 'Una versione più compatta della card con dimensioni ridotte.',
  image: 'https://via.placeholder.com/400x120/28a745/ffffff?text=Compact+Card',
  imageAlt: 'Card compatta',
  buttonText: 'Dettagli',
  buttonLink: '#',
  variant: 'compact',
};

export const LongContent = Template.bind({});
LongContent.args = {
  title: 'Card con Contenuto Lungo',
  description: 'Questa card ha un contenuto molto più lungo per testare come si comporta il layout quando il testo è esteso. Il bottone dovrebbe rimanere sempre in fondo alla card, indipendentemente dalla lunghezza del contenuto.',
  image: 'https://via.placeholder.com/400x200/6c757d/ffffff?text=Long+Content',
  imageAlt: 'Card con contenuto lungo',
  buttonText: 'Leggi tutto',
  buttonLink: '#',
  variant: 'default',
};

export const CustomButton = Template.bind({});
CustomButton.args = {
  title: 'Card con Bottone Personalizzato',
  description: 'Questa card mostra come personalizzare il testo del bottone per diverse azioni.',
  image: 'https://via.placeholder.com/400x200/17a2b8/ffffff?text=Custom+Button',
  imageAlt: 'Card con bottone personalizzato',
  buttonText: 'Acquista ora',
  buttonLink: '#',
  variant: 'default',
};

// Interactive example showing all variants together
export const AllVariants = () => {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  container.style.gap = '24px';
  container.style.padding = '20px';

  const variants = [
    {
      title: 'Card Standard',
      description: 'Card con stile standard',
      image: 'https://via.placeholder.com/400x200/007acc/ffffff?text=Standard',
      variant: 'default',
    },
    {
      title: 'Card in Evidenza',
      description: 'Card con stile in evidenza',
      image: 'https://via.placeholder.com/400x200/ff6b35/ffffff?text=Featured',
      variant: 'featured',
    },
    {
      title: 'Card Compatta',
      description: 'Card con stile compatto',
      image: 'https://via.placeholder.com/400x120/28a745/ffffff?text=Compact',
      variant: 'compact',
    },
  ];

  variants.forEach((config) => {
    const card = createCard({
      ...config,
      className: config.variant !== 'default' ? config.variant : '',
      buttonText: 'Scopri di più',
    });
    container.appendChild(card);
  });

  return container;
};