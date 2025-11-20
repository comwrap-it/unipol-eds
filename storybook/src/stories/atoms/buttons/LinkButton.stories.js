import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Link Button components
import { createLinkButton, ICON_SIZES } from '@blocks/atoms/buttons/link-button/link-button.js';
import '@blocks/atoms/buttons/link-button/link-button.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Buttons/Link Button',
  tags: ['autodocs'],
  render: (args) => {
    // Create the link button element using EDS createLinkButton function
    // createLinkButton(label, href, showLeftIcon, showRightIcon, leftIconSize, rightIconSize, disabled)
    const linkButtonElement = createLinkButton(
      args.label,
      args.href,
      args.showLeftIcon,
      args.showRightIcon,
      args.leftIconSize,
      args.rightIconSize,
      args.disabled
    );
    
    // Return as lit-html template
    return html`${linkButtonElement}`;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Link button text content'
    },
    href: {
      control: 'text',
      description: 'Link URL'
    },
    showLeftIcon: {
      control: 'boolean',
      description: 'Show or hide left icon'
    },
    showRightIcon: {
      control: 'boolean',
      description: 'Show or hide right icon'
    },
    leftIconSize: {
      control: { type: 'select' },
      options: ['s', 'm', 'l', 'xl'],
      description: 'Size of left icon'
    },
    rightIconSize: {
      control: { type: 'select' },
      options: ['s', 'm', 'l', 'xl'],
      description: 'Size of right icon'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    }
  },
  args: { 
    onClick: fn(),
    label: 'Link Button',
    href: '#',
    showLeftIcon: false,
    showRightIcon: false,
    leftIconSize: ICON_SIZES.M,
    rightIconSize: ICON_SIZES.M,
    disabled: false
  },
};

// Basic Link Button Stories
export const BasicLink = {
  args: {
    label: 'Basic Link',
    href: 'https://example.com',
  },
};

export const BasicLinkHover = {
  args: {
    label: 'Basic Link Hover',
    href: 'https://example.com',
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const BasicLinkPressed = {
  args: {
    label: 'Basic Link Pressed',
    href: 'https://example.com',
  },
  parameters: {
    pseudo: { active: true }
  }
};

export const DisabledLink = {
  args: {
    label: 'Disabled Link',
    href: 'https://example.com',
    disabled: true,
  },
};

// Link with Icons
export const WithLeftIcon = {
  args: {
    label: 'Link with Left Icon',
    href: 'https://example.com',
    showLeftIcon: true,
    leftIconSize: ICON_SIZES.M,
  },
  parameters: {
    docs: {
      description: {
        story: 'Link button with a left icon.'
      }
    }
  }
};

export const WithRightIcon = {
  args: {
    label: 'Link with Right Icon',
    href: 'https://example.com',
    showRightIcon: true,
    rightIconSize: ICON_SIZES.M,
  },
  parameters: {
    docs: {
      description: {
        story: 'Link button with a right icon. Commonly used for "read more" or external links.'
      }
    }
  }
};

export const WithBothIcons = {
  args: {
    label: 'Link with Both Icons',
    href: 'https://example.com',
    showLeftIcon: true,
    showRightIcon: true,
    leftIconSize: ICON_SIZES.M,
    rightIconSize: ICON_SIZES.M,
  },
  parameters: {
    docs: {
      description: {
        story: 'Link button with both left and right icons.'
      }
    }
  }
};

// Left Icon Size Variations
export const LeftIconSmall = {
  args: {
    label: 'Small Left Icon',
    href: 'https://example.com',
    showLeftIcon: true,
    leftIconSize: ICON_SIZES.S,
  },
};

export const LeftIconMedium = {
  args: {
    label: 'Medium Left Icon',
    href: 'https://example.com',
    showLeftIcon: true,
    leftIconSize: ICON_SIZES.M,
  },
};

export const LeftIconLarge = {
  args: {
    label: 'Large Left Icon',
    href: 'https://example.com',
    showLeftIcon: true,
    leftIconSize: ICON_SIZES.L,
  },
};

export const LeftIconExtraLarge = {
  args: {
    label: 'XL Left Icon',
    href: 'https://example.com',
    showLeftIcon: true,
    leftIconSize: ICON_SIZES.XL,
  },
};

// Right Icon Size Variations
export const RightIconSmall = {
  args: {
    label: 'Small Right Icon',
    href: 'https://example.com',
    showRightIcon: true,
    rightIconSize: ICON_SIZES.S,
  },
};

export const RightIconMedium = {
  args: {
    label: 'Medium Right Icon',
    href: 'https://example.com',
    showRightIcon: true,
    rightIconSize: ICON_SIZES.M,
  },
};

export const RightIconLarge = {
  args: {
    label: 'Large Right Icon',
    href: 'https://example.com',
    showRightIcon: true,
    rightIconSize: ICON_SIZES.L,
  },
};

export const RightIconExtraLarge = {
  args: {
    label: 'XL Right Icon',
    href: 'https://example.com',
    showRightIcon: true,
    rightIconSize: ICON_SIZES.XL,
  },
};

// All Icon Configurations Showcase
export const AllIconConfigurations = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${createLinkButton('No Icons', 'https://example.com', false, false)}
      ${createLinkButton('Left Icon Only', 'https://example.com', true, false, ICON_SIZES.M)}
      ${createLinkButton('Right Icon Only', 'https://example.com', false, true, ICON_SIZES.M, ICON_SIZES.M)}
      ${createLinkButton('Both Icons', 'https://example.com', true, true, ICON_SIZES.M, ICON_SIZES.M)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All icon configurations displayed together for comparison.'
      }
    }
  }
};

// All Left Icon Sizes Showcase
export const AllLeftIconSizes = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${createLinkButton('Small', 'https://example.com', true, false, ICON_SIZES.S)}
      ${createLinkButton('Medium', 'https://example.com', true, false, ICON_SIZES.M)}
      ${createLinkButton('Large', 'https://example.com', true, false, ICON_SIZES.L)}
      ${createLinkButton('Extra Large', 'https://example.com', true, false, ICON_SIZES.XL)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All left icon sizes displayed together for comparison.'
      }
    }
  }
};

// All Right Icon Sizes Showcase
export const AllRightIconSizes = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${createLinkButton('Small', 'https://example.com', false, true, ICON_SIZES.M, ICON_SIZES.S)}
      ${createLinkButton('Medium', 'https://example.com', false, true, ICON_SIZES.M, ICON_SIZES.M)}
      ${createLinkButton('Large', 'https://example.com', false, true, ICON_SIZES.M, ICON_SIZES.L)}
      ${createLinkButton('Extra Large', 'https://example.com', false, true, ICON_SIZES.M, ICON_SIZES.XL)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All right icon sizes displayed together for comparison.'
      }
    }
  }
};

// Complete Example
export const CompleteExample = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
      <h3>Navigation Links</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${createLinkButton('Go Back', '/previous-page', true, false, ICON_SIZES.M)}
        ${createLinkButton('Continue', '/next-page', false, true, ICON_SIZES.M, ICON_SIZES.M)}
        ${createLinkButton('Learn More', 'https://example.com', false, true, ICON_SIZES.M, ICON_SIZES.M)}
      </div>
      
      <h3>Document Links</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${createLinkButton('Download PDF', '/document.pdf', true, false, ICON_SIZES.M)}
        ${createLinkButton('View Documentation', '/docs', false, true, ICON_SIZES.M, ICON_SIZES.M)}
        ${createLinkButton('External Resource', 'https://external.com', false, true, ICON_SIZES.M, ICON_SIZES.M)}
      </div>
      
      <h3>Action Links</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${createLinkButton('Read Article', '/article', false, true, ICON_SIZES.M, ICON_SIZES.M)}
        ${createLinkButton('View All Items', '/items', false, true, ICON_SIZES.M, ICON_SIZES.M)}
        ${createLinkButton('Contact Support', '/support', true, false, ICON_SIZES.M)}
      </div>
      
      <h3>Disabled State</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${createLinkButton('Disabled Link', '#', false, false, ICON_SIZES.M, ICON_SIZES.M, true)}
        ${createLinkButton('Disabled with Icon', '#', false, true, ICON_SIZES.M, ICON_SIZES.M, true)}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing various link button configurations in a realistic layout.'
      }
    }
  }
};
