import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Link Button components
import { createLinkButton } from '@blocks/atoms/buttons/link-button/link-button.js';
import { BUTTON_ICON_SIZES } from '@blocks/atoms/buttons/standard-button/standard-button.js';
// CSS imported globally in preview-head.html

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Buttons/Link Button',
  tags: ['autodocs'],
  render: (args) => {
    // Create the link button element using EDS createLinkButton function
    // Signature: createLinkButton(label, href, openInNewTab, leftIcon, rightIcon, leftIconSize, rightIconSize, disabled)
    const linkButtonElement = createLinkButton(
      args.label,
      args.href,
      args.openInNewTab,
      args.leftIcon,
      args.rightIcon,
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
    openInNewTab: {
      control: 'boolean',
      description: 'Open link in new tab'
    },
    leftIcon: {
      control: { type: 'select' },
      options: ['', 'un-icon-chevron-left', 'un-icon-chevron-right', 'un-icon-search'],
      description: 'Left icon class name'
    },
    rightIcon: {
      control: { type: 'select' },
      options: ['', 'un-icon-chevron-left', 'un-icon-chevron-right', 'un-icon-search'],
      description: 'Right icon class name'
    },
    leftIconSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Size of left icon'
    },
    rightIconSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extra-large'],
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
    openInNewTab: false,
    leftIcon: '',
    rightIcon: '',
    leftIconSize: BUTTON_ICON_SIZES.MEDIUM,
    rightIconSize: BUTTON_ICON_SIZES.MEDIUM,
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
    leftIcon: 'un-icon-chevron-left',
    leftIconSize: BUTTON_ICON_SIZES.MEDIUM,
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
    rightIcon: 'un-icon-chevron-right',
    rightIconSize: BUTTON_ICON_SIZES.MEDIUM,
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
    leftIcon: 'un-icon-chevron-left',
    rightIcon: 'un-icon-chevron-right',
    leftIconSize: BUTTON_ICON_SIZES.MEDIUM,
    rightIconSize: BUTTON_ICON_SIZES.MEDIUM,
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
    leftIcon: 'un-icon-chevron-left',
    leftIconSize: BUTTON_ICON_SIZES.SMALL,
  },
};

export const LeftIconMedium = {
  args: {
    label: 'Medium Left Icon',
    href: 'https://example.com',
    leftIcon: 'un-icon-chevron-left',
    leftIconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const LeftIconLarge = {
  args: {
    label: 'Large Left Icon',
    href: 'https://example.com',
    leftIcon: 'un-icon-chevron-left',
    leftIconSize: BUTTON_ICON_SIZES.LARGE,
  },
};

export const LeftIconExtraLarge = {
  args: {
    label: 'XL Left Icon',
    href: 'https://example.com',
    leftIcon: 'un-icon-chevron-left',
    leftIconSize: BUTTON_ICON_SIZES.EXTRA_LARGE,
  },
};

// Right Icon Size Variations
export const RightIconSmall = {
  args: {
    label: 'Small Right Icon',
    href: 'https://example.com',
    rightIcon: 'un-icon-chevron-right',
    rightIconSize: BUTTON_ICON_SIZES.SMALL,
  },
};

export const RightIconMedium = {
  args: {
    label: 'Medium Right Icon',
    href: 'https://example.com',
    rightIcon: 'un-icon-chevron-right',
    rightIconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const RightIconLarge = {
  args: {
    label: 'Large Right Icon',
    href: 'https://example.com',
    rightIcon: 'un-icon-chevron-right',
    rightIconSize: BUTTON_ICON_SIZES.LARGE,
  },
};

export const RightIconExtraLarge = {
  args: {
    label: 'XL Right Icon',
    href: 'https://example.com',
    rightIcon: 'un-icon-chevron-right',
    rightIconSize: BUTTON_ICON_SIZES.EXTRA_LARGE,
  },
};

// All Icon Configurations Showcase
export const AllIconConfigurations = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${createLinkButton('No Icons', 'https://example.com', false)}
      ${createLinkButton('Left Icon Only', 'https://example.com', false, 'un-icon-chevron-left', '', BUTTON_ICON_SIZES.MEDIUM)}
      ${createLinkButton('Right Icon Only', 'https://example.com', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
      ${createLinkButton('Both Icons', 'https://example.com', false, 'un-icon-chevron-left', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
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
      ${createLinkButton('Small', 'https://example.com', false, 'un-icon-chevron-left', '', BUTTON_ICON_SIZES.SMALL)}
      ${createLinkButton('Medium', 'https://example.com', false, 'un-icon-chevron-left', '', BUTTON_ICON_SIZES.MEDIUM)}
      ${createLinkButton('Large', 'https://example.com', false, 'un-icon-chevron-left', '', BUTTON_ICON_SIZES.LARGE)}
      ${createLinkButton('Extra Large', 'https://example.com', false, 'un-icon-chevron-left', '', BUTTON_ICON_SIZES.EXTRA_LARGE)}
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
      ${createLinkButton('Small', 'https://example.com', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.SMALL)}
      ${createLinkButton('Medium', 'https://example.com', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
      ${createLinkButton('Large', 'https://example.com', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.LARGE)}
      ${createLinkButton('Extra Large', 'https://example.com', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.EXTRA_LARGE)}
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
        ${createLinkButton('Go Back', '/previous-page', false, 'un-icon-chevron-left', '', BUTTON_ICON_SIZES.MEDIUM)}
        ${createLinkButton('Continue', '/next-page', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
        ${createLinkButton('Learn More', 'https://example.com', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Document Links</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${createLinkButton('Download PDF', '/document.pdf', false, 'un-icon-chevron-left', '', BUTTON_ICON_SIZES.MEDIUM)}
        ${createLinkButton('View Documentation', '/docs', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
        ${createLinkButton('External Resource', 'https://external.com', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Action Links</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${createLinkButton('Read Article', '/article', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
        ${createLinkButton('View All Items', '/items', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM)}
        ${createLinkButton('Contact Support', '/support', false, 'un-icon-chevron-left', '', BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Disabled State</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${createLinkButton('Disabled Link', '#', false, '', '', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM, true)}
        ${createLinkButton('Disabled with Icon', '#', false, '', 'un-icon-chevron-right', BUTTON_ICON_SIZES.MEDIUM, BUTTON_ICON_SIZES.MEDIUM, true)}
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
