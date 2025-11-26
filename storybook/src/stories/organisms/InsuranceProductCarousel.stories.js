import { html } from 'lit';

// Import Insurance Product Carousel component
import { createInsuranceProductCarousel } from '@blocks/insurance-product-carousel/insurance-product-carousel.js';

// Import card component for creating cards
import { createInsuranceProductCard, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '@blocks/insurance-product-card/insurance-product-card.js';

// CSS is loaded globally in preview-head.html

/**
 * Helper function to create an insurance product card from configuration
 * This separates data retrieval from component creation
 * 
 * @param {Object} config - Card configuration
 * @param {string} config.title - Card title
 * @param {string} config.description - Card description
 * @param {Object} config.button - Button configuration
 * @param {string} config.button.label - Button label
 * @param {string} config.button.href - Button URL
 * @param {string} config.button.variant - Button variant
 * @param {string} config.button.iconSize - Button icon size
 * @param {string} config.button.leftIcon - Button left icon
 * @param {string} config.button.rightIcon - Button right icon
 * @param {string} config.note - Note text
 * @param {Object} config.tag - Tag configuration
 * @param {string} config.tag.label - Tag label
 * @param {string} config.tag.category - Tag category
 * @param {string} config.tag.type - Tag type
 * @param {string} config.image - Image URL
 * @param {string} config.imageAlt - Image alt text
 * @param {Object} config.icons3D - 3D icons configuration
 * @param {boolean} config.icons3D.showVehicle - Show vehicle icon
 * @param {boolean} config.icons3D.showProperty - Show property icon
 * @param {boolean} config.icons3D.showWelfare - Show welfare icon
 * @returns {Promise<HTMLElement>} Decorated card element
 */
async function createCardFromConfig(config) {
  // Use the centralized createInsuranceProductCard function
  return await createInsuranceProductCard(
    config.title || '',
    config.description || '',
    config.button || null,
    config.note || '',
    config.tag || null,
    config.image || '',
    config.imageAlt || '',
    config.icons3D || null,
    {},
  );
}

/**
 * Insurance Product Carousel Component Story
 * 
 * Insurance Product Carousel is an organism component that displays:
 * - A horizontal scrollable list of insurance product cards
 * - Navigation arrows and dot indicators (when > 4 cards)
 * - Responsive design (mobile: 1 card, tablet: 2 cards, desktop: 3-4 cards)
 */
export default {
  title: 'Organisms/Insurance Product Carousel',
  tags: ['autodocs'],
  render: (args) => {
    // Create a container that will be populated asynchronously
    const container = document.createElement('div');
    
    // Show loading state initially
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">Loading carousel...</div>';
    
    // Async function to build the carousel
    (async () => {
      try {
        // Create cards from configurations
        const cardConfigs = args.cards || [];
        if (cardConfigs.length === 0) {
          container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;"><p>No cards provided</p></div>';
          return;
        }

        const cardElements = await Promise.all(
          cardConfigs.map((config) => createCardFromConfig(config))
        );

        // Create carousel using the centralized function
        const carousel = await createInsuranceProductCarousel(
          cardElements,
          args.showScrollIndicator
        );

        if (!carousel) {
          container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;"><p>Failed to create carousel</p></div>';
          return;
        }

        // Clear container and append carousel
        container.innerHTML = '';
        container.appendChild(carousel);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating carousel:', error);
        container.innerHTML = `<div style="padding: 2rem; text-align: center; color: #d32f2f;"><p>Error: ${error.message}</p></div>`;
      }
    })();

    return html`${container}`;
  },
  argTypes: {
    cards: {
      control: 'object',
      description: 'Array of card configurations',
      table: {
        category: 'Content',
      },
    },
    showScrollIndicator: {
      control: 'boolean',
      description: 'Whether to show scroll indicator (auto if > 4 cards)',
      table: {
        category: 'Layout',
      },
    },
  },
  args: {
    cards: [
      {
        title: 'Auto Insurance',
        description: 'Comprehensive coverage for your vehicle with 24/7 roadside assistance and collision protection.',
        button: {
          label: 'Get Quote',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €29.99/month',
        tag: {
          label: 'Popular',
          category: 'mobility',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Auto+Insurance',
        icons3D: {
          showVehicle: true,
          showProperty: false,
          showWelfare: false,
        },
      },
      {
        title: 'Home Insurance',
        description: 'Protect your home and belongings with our comprehensive property insurance coverage.',
        button: {
          label: 'Learn More',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €19.99/month',
        tag: {
          label: 'Best Value',
          category: 'property',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Home+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: true,
          showWelfare: false,
        },
      },
      {
        title: 'Health Insurance',
        description: 'Complete health coverage for you and your family with access to top medical facilities.',
        button: {
          label: 'Get Started',
          href: '#',
          variant: BUTTON_VARIANTS.ACCENT,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €39.99/month',
        tag: {
          label: 'New',
          category: 'welfare',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Health+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: false,
          showWelfare: true,
        },
      },
    ],
    showScrollIndicator: null, // Auto-detect
  },
};

// ========== BASIC STORIES ==========

/**
 * Default carousel with 3 cards
 */
export const Default = {
  args: {
    cards: [
      {
        title: 'Auto Insurance',
        description: 'Comprehensive coverage for your vehicle with 24/7 roadside assistance.',
        button: {
          label: 'Get Quote',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €29.99/month',
        tag: {
          label: 'Popular',
          category: 'mobility',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Auto+Insurance',
        icons3D: {
          showVehicle: true,
          showProperty: false,
          showWelfare: false,
        },
      },
      {
        title: 'Home Insurance',
        description: 'Protect your home and belongings with comprehensive property coverage.',
        button: {
          label: 'Learn More',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €19.99/month',
        tag: {
          label: 'Best Value',
          category: 'property',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Home+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: true,
          showWelfare: false,
        },
      },
      {
        title: 'Health Insurance',
        description: 'Complete health coverage for you and your family.',
        button: {
          label: 'Get Started',
          href: '#',
          variant: BUTTON_VARIANTS.ACCENT,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €39.99/month',
        tag: {
          label: 'New',
          category: 'welfare',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Health+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: false,
          showWelfare: true,
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Default carousel with 3 insurance product cards. Scroll indicator appears automatically when there are more than 4 cards.',
      },
    },
  },
};

/**
 * Carousel with 5 cards (triggers scroll indicator)
 */
export const WithScrollIndicator = {
  args: {
    cards: [
      {
        title: 'Auto Insurance',
        description: 'Comprehensive coverage for your vehicle.',
        button: {
          label: 'Get Quote',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €29.99/month',
        tag: {
          label: 'Popular',
          category: 'mobility',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Auto+Insurance',
        icons3D: {
          showVehicle: true,
          showProperty: false,
          showWelfare: false,
        },
      },
      {
        title: 'Home Insurance',
        description: 'Protect your home and belongings.',
        button: {
          label: 'Learn More',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €19.99/month',
        tag: {
          label: 'Best Value',
          category: 'property',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Home+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: true,
          showWelfare: false,
        },
      },
      {
        title: 'Health Insurance',
        description: 'Complete health coverage for you and your family.',
        button: {
          label: 'Get Started',
          href: '#',
          variant: BUTTON_VARIANTS.ACCENT,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €39.99/month',
        tag: {
          label: 'New',
          category: 'welfare',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Health+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: false,
          showWelfare: true,
        },
      },
      {
        title: 'Life Insurance',
        description: 'Secure your family\'s future with comprehensive life coverage.',
        button: {
          label: 'Explore',
          href: '#',
          variant: BUTTON_VARIANTS.SECONDARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €24.99/month',
        tag: {
          label: 'Limited Time',
          category: 'welfare',
          type: 'outlined',
        },
        image: 'https://via.placeholder.com/316x200?text=Life+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: false,
          showWelfare: true,
        },
      },
      {
        title: 'Travel Insurance',
        description: 'Travel with peace of mind wherever you go.',
        button: {
          label: 'Get Coverage',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €9.99/month',
        tag: {
          label: 'Special Offer',
          category: 'mobility',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Travel+Insurance',
        icons3D: {
          showVehicle: true,
          showProperty: false,
          showWelfare: false,
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with 5 cards automatically shows scroll indicator. Users can navigate through all products.',
      },
    },
  },
};

/**
 * Single card carousel
 */
export const SingleCard = {
  args: {
    cards: [
      {
        title: 'Auto Insurance',
        description: 'Comprehensive coverage for your vehicle with 24/7 roadside assistance and collision protection.',
        button: {
          label: 'Get Quote',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €29.99/month',
        tag: {
          label: 'Popular',
          category: 'mobility',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Auto+Insurance',
        icons3D: {
          showVehicle: true,
          showProperty: false,
          showWelfare: false,
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with a single card. No scroll indicator is shown.',
      },
    },
  },
};

/**
 * Carousel with all button variants
 */
export const AllButtonVariants = {
  args: {
    cards: [
      {
        title: 'Primary Button',
        description: 'Card with primary button variant for main call-to-actions.',
        button: {
          label: 'Primary Action',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Primary variant',
        tag: {
          label: 'Popular',
          category: 'mobility',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Primary',
        icons3D: {
          showVehicle: true,
          showProperty: false,
          showWelfare: false,
        },
      },
      {
        title: 'Accent Button',
        description: 'Card with accent button variant for highlighted actions.',
        button: {
          label: 'Accent Action',
          href: '#',
          variant: BUTTON_VARIANTS.ACCENT,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Accent variant',
        tag: {
          label: 'New',
          category: 'welfare',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Accent',
        icons3D: {
          showVehicle: false,
          showProperty: false,
          showWelfare: true,
        },
      },
      {
        title: 'Secondary Button',
        description: 'Card with secondary button variant for supporting actions.',
        button: {
          label: 'Secondary Action',
          href: '#',
          variant: BUTTON_VARIANTS.SECONDARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Secondary variant',
        tag: {
          label: 'Best Value',
          category: 'property',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Secondary',
        icons3D: {
          showVehicle: false,
          showProperty: true,
          showWelfare: false,
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all button variants within insurance product cards.',
      },
    },
  },
};

/**
 * Carousel with all tag categories
 */
export const AllTagCategories = {
  args: {
    cards: [
      {
        title: 'Mobility Tag',
        description: 'Card with mobility category tag.',
        button: {
          label: 'Get Quote',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Mobility category',
        tag: {
          label: 'Auto',
          category: 'mobility',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Mobility',
        icons3D: {
          showVehicle: true,
          showProperty: false,
          showWelfare: false,
        },
      },
      {
        title: 'Welfare Tag',
        description: 'Card with welfare category tag.',
        button: {
          label: 'Learn More',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Welfare category',
        tag: {
          label: 'Health',
          category: 'welfare',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Welfare',
        icons3D: {
          showVehicle: false,
          showProperty: false,
          showWelfare: true,
        },
      },
      {
        title: 'Property Tag',
        description: 'Card with property category tag.',
        button: {
          label: 'Get Started',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Property category',
        tag: {
          label: 'Home',
          category: 'property',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Property',
        icons3D: {
          showVehicle: false,
          showProperty: true,
          showWelfare: false,
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all tag categories (mobility, welfare, property) within insurance product cards.',
      },
    },
  },
};

// ========== REAL-WORLD EXAMPLES ==========

/**
 * Real-world example: Product showcase page
 */
export const ProductShowcase = {
  args: {
    cards: [
      {
        title: 'Auto Insurance',
        description: 'Comprehensive coverage for your vehicle with 24/7 roadside assistance, collision protection, and theft coverage.',
        button: {
          label: 'Get Quote',
          href: '#auto',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €29.99/month',
        tag: {
          label: 'Most Popular',
          category: 'mobility',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Auto+Insurance',
        icons3D: {
          showVehicle: true,
          showProperty: false,
          showWelfare: false,
        },
      },
      {
        title: 'Home Insurance',
        description: 'Protect your home and belongings with comprehensive property insurance coverage including fire, theft, and natural disasters.',
        button: {
          label: 'Learn More',
          href: '#home',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €19.99/month',
        tag: {
          label: 'Best Value',
          category: 'property',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Home+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: true,
          showWelfare: false,
        },
      },
      {
        title: 'Health Insurance',
        description: 'Complete health coverage for you and your family with access to top medical facilities and specialists.',
        button: {
          label: 'Get Started',
          href: '#health',
          variant: BUTTON_VARIANTS.ACCENT,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €39.99/month',
        tag: {
          label: 'New',
          category: 'welfare',
          type: 'filled',
        },
        image: 'https://via.placeholder.com/316x200?text=Health+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: false,
          showWelfare: true,
        },
      },
      {
        title: 'Life Insurance',
        description: 'Secure your family\'s future with comprehensive life coverage and flexible payment options.',
        button: {
          label: 'Explore',
          href: '#life',
          variant: BUTTON_VARIANTS.SECONDARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        },
        note: 'Starting from €24.99/month',
        tag: {
          label: 'Limited Time',
          category: 'welfare',
          type: 'outlined',
        },
        image: 'https://via.placeholder.com/316x200?text=Life+Insurance',
        icons3D: {
          showVehicle: false,
          showProperty: false,
          showWelfare: true,
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example of a product showcase page with multiple insurance products. Users can scroll through all available options.',
      },
    },
  },
};

