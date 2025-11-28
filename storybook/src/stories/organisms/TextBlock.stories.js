import { html } from 'lit';

// Import Text Block component
import { 
  createTextBlock, 
  BUTTON_VARIANTS, 
  BUTTON_ICON_SIZES 
} from '@blocks/text-block/text-block.js';

// CSS is loaded globally in preview-head.html

/**
 * Text Block Component Story
 * 
 * Text Block is an organism component that displays:
 * - A title (required)
 * - Optional body text (visible only when centered)
 * - Optional call-to-action button
 * - Two layout modes: centered or left-aligned
 */
export default {
  title: 'Organisms/Text Block',
  tags: ['autodocs'],
  render: (args) => {
    const buttonConfig = args.showButton ? {
      label: args.buttonLabel,
      href: args.buttonHref,
      variant: args.buttonVariant,
      iconSize: args.buttonIconSize,
      leftIcon: args.buttonLeftIcon,
      rightIcon: args.buttonRightIcon,
    } : null;

    const element = createTextBlock(
      args.title,
      args.centered,
      args.text,
      null,          // buttonElement (not used in Storybook)
      buttonConfig   // buttonConfig (for creating button)
    );

    return html`${element}`;
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title of the text block',
      table: {
        category: 'Content',
      },
    },
    centered: {
      control: 'boolean',
      description: 'Whether to center content and show body text',
      table: {
        category: 'Layout',
      },
    },
    text: {
      control: 'text',
      description: 'Body text (visible only when centered is true)',
      if: { arg: 'centered', eq: true },
      table: {
        category: 'Content',
      },
    },
    showButton: {
      control: 'boolean',
      description: 'Whether to show the call-to-action button',
      table: {
        category: 'Button',
      },
    },
    buttonLabel: {
      control: 'text',
      description: 'Button label text',
      if: { arg: 'showButton', eq: true },
      table: {
        category: 'Button',
      },
    },
    buttonHref: {
      control: 'text',
      description: 'Button URL',
      if: { arg: 'showButton', eq: true },
      table: {
        category: 'Button',
      },
    },
    buttonVariant: {
      control: { type: 'select' },
      options: Object.values(BUTTON_VARIANTS),
      description: 'Button style variant',
      if: { arg: 'showButton', eq: true },
      table: {
        category: 'Button',
      },
    },
    buttonIconSize: {
      control: { type: 'select' },
      options: Object.values(BUTTON_ICON_SIZES),
      description: 'Icon size for button',
      if: { arg: 'showButton', eq: true },
      table: {
        category: 'Button',
      },
    },
    buttonLeftIcon: {
      control: { type: 'select' },
      options: ['', 'un-icon-chevron-left', 'un-icon-chevron-right', 'un-icon-search'],
      description: 'Left icon for button',
      if: { arg: 'showButton', eq: true },
      table: {
        category: 'Button',
      },
    },
    buttonRightIcon: {
      control: { type: 'select' },
      options: ['', 'un-icon-chevron-left', 'un-icon-chevron-right', 'un-icon-search'],
      description: 'Right icon for button',
      if: { arg: 'showButton', eq: true },
      table: {
        category: 'Button',
      },
    },
  },
  args: {
    title: 'Welcome to Our Platform',
    centered: true,
    text: 'Discover amazing features and start your journey with us today. Our platform provides everything you need to succeed.',
    showButton: true,
    buttonLabel: 'Get Started',
    buttonHref: '#',
    buttonVariant: BUTTON_VARIANTS.PRIMARY,
    buttonIconSize: BUTTON_ICON_SIZES.MEDIUM,
    buttonLeftIcon: '',
    buttonRightIcon: 'un-icon-chevron-right',
  },
};

// ========== CENTERED LAYOUT STORIES ==========

/**
 * Default centered text block with title, text, and CTA button
 */
export const Centered = {
  args: {
    title: 'Welcome to Our Platform',
    centered: true,
    text: 'Discover amazing features and start your journey with us today. Our platform provides everything you need to succeed.',
    showButton: true,
    buttonLabel: 'Get Started',
    buttonRightIcon: 'un-icon-chevron-right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Centered layout with title, descriptive text, and a call-to-action button. Ideal for hero sections or landing pages.',
      },
    },
  },
};

/**
 * Centered layout with longer text content
 */
export const CenteredLongText = {
  args: {
    title: 'Transform Your Business',
    centered: true,
    text: 'Join thousands of businesses that trust our platform. We provide comprehensive solutions designed to help you grow, scale, and succeed in the digital age. Our commitment to excellence and innovation sets us apart.',
    showButton: true,
    buttonLabel: 'Learn More',
    buttonVariant: BUTTON_VARIANTS.ACCENT,
    buttonRightIcon: 'un-icon-chevron-right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Centered layout with longer descriptive text, demonstrating text wrapping and readability.',
      },
    },
  },
};

/**
 * Centered layout without button
 */
export const CenteredNoButton = {
  args: {
    title: 'Pure Content Section',
    centered: true,
    text: 'Sometimes you just need a clean, centered title and text without any call-to-action. Perfect for informational sections.',
    showButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Centered layout without a button, useful for informational sections.',
      },
    },
  },
};

/**
 * Centered layout with secondary button
 */
export const CenteredSecondaryButton = {
  args: {
    title: 'Explore Our Features',
    centered: true,
    text: 'Take a tour of our platform and see what makes us different. Discover the tools and features designed for your success.',
    showButton: true,
    buttonLabel: 'Start Tour',
    buttonVariant: BUTTON_VARIANTS.SECONDARY,
    buttonLeftIcon: 'un-icon-search',
  },
  parameters: {
    docs: {
      description: {
        story: 'Centered layout with a secondary button variant and left icon.',
      },
    },
  },
};

// ========== LEFT-ALIGNED LAYOUT STORIES ==========

/**
 * Left-aligned layout with title and button (no visible text)
 */
export const LeftAligned = {
  args: {
    title: 'Quick Action Section',
    centered: false,
    text: '', // Text is hidden in left-aligned mode
    showButton: true,
    buttonLabel: 'Take Action',
    buttonVariant: BUTTON_VARIANTS.PRIMARY,
    buttonRightIcon: 'un-icon-chevron-right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Left-aligned layout with title and button side-by-side. Body text is not displayed in this layout mode. Perfect for page headers or quick action sections.',
      },
    },
  },
};

/**
 * Left-aligned with accent button
 */
export const LeftAlignedAccent = {
  args: {
    title: 'Ready to Get Started?',
    centered: false,
    showButton: true,
    buttonLabel: 'Sign Up Now',
    buttonVariant: BUTTON_VARIANTS.ACCENT,
    buttonRightIcon: 'un-icon-chevron-right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Left-aligned layout with accent button variant for high-priority actions.',
      },
    },
  },
};

/**
 * Left-aligned with search button
 */
export const LeftAlignedSearch = {
  args: {
    title: 'Find What You Need',
    centered: false,
    showButton: true,
    buttonLabel: 'Search',
    buttonVariant: BUTTON_VARIANTS.PRIMARY,
    buttonLeftIcon: 'un-icon-search',
  },
  parameters: {
    docs: {
      description: {
        story: 'Left-aligned layout with search functionality.',
      },
    },
  },
};

/**
 * Left-aligned without button
 */
export const LeftAlignedNoButton = {
  args: {
    title: 'Simple Section Header',
    centered: false,
    showButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Left-aligned layout with just a title, no button. Useful as a section header.',
      },
    },
  },
};

// ========== COMPARISON & SHOWCASE STORIES ==========

/**
 * Side-by-side comparison of both layouts
 */
export const LayoutComparison = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 3rem;">
      <div>
        <h3 style="margin-bottom: 1rem; font-size: 1.2rem; color: #666;">Centered Layout</h3>
        ${createTextBlock(
          'Welcome to Our Platform',
          true,
          'This is a centered layout with title, text, and button. Perfect for hero sections.',
          null,
          {
            label: 'Get Started',
            href: '#',
            variant: BUTTON_VARIANTS.PRIMARY,
            iconSize: BUTTON_ICON_SIZES.MEDIUM,
            rightIcon: 'un-icon-chevron-right',
          }
        )}
      </div>
      
      <div>
        <h3 style="margin-bottom: 1rem; font-size: 1.2rem; color: #666;">Left-Aligned Layout</h3>
        ${createTextBlock(
          'Quick Action Section',
          false,
          '',
          null,
          {
            label: 'Take Action',
            href: '#',
            variant: BUTTON_VARIANTS.PRIMARY,
            iconSize: BUTTON_ICON_SIZES.MEDIUM,
            rightIcon: 'un-icon-chevron-right',
          }
        )}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison showing both centered and left-aligned layouts.',
      },
    },
  },
};

/**
 * All button variants showcase
 */
export const AllButtonVariants = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      ${createTextBlock(
        'Primary Button Variant',
        true,
        'This text block uses the primary button variant for main call-to-actions.',
        null,
        {
          label: 'Primary Action',
          href: '#',
          variant: BUTTON_VARIANTS.PRIMARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        }
      )}
      
      ${createTextBlock(
        'Accent Button Variant',
        true,
        'This text block uses the accent button variant for highlighted actions.',
        null,
        {
          label: 'Accent Action',
          href: '#',
          variant: BUTTON_VARIANTS.ACCENT,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        }
      )}
      
      ${createTextBlock(
        'Secondary Button Variant',
        true,
        'This text block uses the secondary button variant for supporting actions.',
        null,
        {
          label: 'Secondary Action',
          href: '#',
          variant: BUTTON_VARIANTS.SECONDARY,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        }
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all button variants within text blocks.',
      },
    },
  },
};

/**
 * Real-world example: Landing page hero
 */
export const LandingPageHero = {
  render: () => html`
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 4rem 2rem; border-radius: 8px;">
      <div style="max-width: 900px; margin: 0 auto;">
        ${createTextBlock(
          'Build Your Future with Confidence',
          true,
          'Join over 10,000 satisfied customers who trust our platform. Start your journey today and experience the difference.',
          null,
          {
            label: 'Start Free Trial',
            href: '#signup',
            variant: BUTTON_VARIANTS.PRIMARY,
            iconSize: BUTTON_ICON_SIZES.MEDIUM,
            rightIcon: 'un-icon-chevron-right',
          }
        )}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example of a text block used as a landing page hero section with gradient background.',
      },
    },
  },
};

/**
 * Real-world example: Page header with action
 */
export const PageHeaderWithAction = {
  render: () => html`
    <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 1rem;">
      ${createTextBlock(
        'Customer Dashboard',
        false,
        '',
        null,
        {
          label: 'New Customer',
          href: '#new',
          variant: BUTTON_VARIANTS.ACCENT,
          iconSize: BUTTON_ICON_SIZES.MEDIUM,
          rightIcon: 'chevron-right-icon',
        }
      )}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example of a text block used as a page header with an action button.',
      },
    },
  },
};

