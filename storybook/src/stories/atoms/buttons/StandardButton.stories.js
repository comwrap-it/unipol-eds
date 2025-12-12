import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Button components
import { createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '@blocks/atoms/buttons/standard-button/standard-button.js';
// CSS is loaded globally in preview-head.html

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Buttons/Standard Button',
  tags: ['autodocs'],
  render: (args) => {
    // Create the button element using EDS createButton function
    // Signature: createButton(label, href, openInNewTab, variant, iconSize, leftIcon, rightIcon, instrumentation)
    const buttonElement = createButton(
      args.label,
      args.href,
      args.openInNewTab,
      args.variant,
      args.iconSize,
      args.leftIcon,
      args.rightIcon,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${buttonElement}`;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button text content'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'accent'],
      description: 'Button variant style'
    },
    href: {
      control: 'text',
      description: 'Optional URL for link button'
    },
    openInNewTab: {
      control: 'boolean',
      description: 'Open link in new tab (only applies when href is provided)'
    },
    iconSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Icon size'
    },
    leftIcon: {
      control: { type: 'select' },
      options: ['', 'un-icon-chevron-left', 'un-icon-chevron-right', 'un-icon-search'],
      description: 'Left icon'
    },
    rightIcon: {
      control: { type: 'select' },
      options: ['', 'un-icon-chevron-left', 'un-icon-chevron-right', 'un-icon-search'],
      description: 'Right icon'
    }
  },
  args: { 
    onClick: fn(),
    label: 'Button',
    variant: BUTTON_VARIANTS.PRIMARY,
    href: '',
    openInNewTab: false,
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
    leftIcon: '',
    rightIcon: '',
    instrumentation: {}
  },
};

// Primary Button Stories
export const Primary = {
  args: {
    label: 'Primary Button',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
};

export const PrimaryHover = {
  args: {
    label: 'Primary Hover',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const PrimaryPressed = {
  args: {
    label: 'Primary Pressed',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    pseudo: { active: true }
  }
};

// Accent Button Stories
export const Accent = {
  args: {
    label: 'Accent Button',
    variant: BUTTON_VARIANTS.ACCENT,
  },
};

export const AccentHover = {
  args: {
    label: 'Accent Hover',
    variant: BUTTON_VARIANTS.ACCENT,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const AccentPressed = {
  args: {
    label: 'Accent Pressed',
    variant: BUTTON_VARIANTS.ACCENT,
  },
  parameters: {
    pseudo: { active: true }
  }
};

// Secondary Button Stories
export const Secondary = {
  args: {
    label: 'Secondary Button',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
};

export const SecondaryHover = {
  args: {
    label: 'Secondary Hover',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const SecondaryPressed = {
  args: {
    label: 'Secondary Pressed',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
  parameters: {
    pseudo: { active: true }
  }
};

// Button with Icons
export const WithLeftIcon = {
  args: {
    label: 'Search',
    variant: BUTTON_VARIANTS.PRIMARY,
    leftIcon: 'un-icon-search',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with a left icon.'
      }
    }
  }
};

export const WithRightIcon = {
  args: {
    label: 'Continue',
    variant: BUTTON_VARIANTS.PRIMARY,
    rightIcon: 'un-icon-chevron-right',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with a right icon.'
      }
    }
  }
};

export const WithBothIcons = {
  args: {
    label: 'Navigate',
    variant: BUTTON_VARIANTS.ACCENT,
    leftIcon: 'un-icon-chevron-left',
    rightIcon: 'un-icon-chevron-right',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with both left and right icons.'
      }
    }
  }
};

// Icon Size Variations
export const SmallIconSize = {
  args: {
    label: 'Small Icons',
    variant: BUTTON_VARIANTS.PRIMARY,
    leftIcon: 'un-icon-search',
    rightIcon: 'un-icon-chevron-right',
    iconSize: BUTTON_ICON_SIZES.SMALL,
  },
};

export const MediumIconSize = {
  args: {
    label: 'Medium Icons',
    variant: BUTTON_VARIANTS.PRIMARY,
    leftIcon: 'un-icon-search',
    rightIcon: 'un-icon-chevron-right',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const LargeIconSize = {
  args: {
    label: 'Large Icons',
    variant: BUTTON_VARIANTS.PRIMARY,
    leftIcon: 'un-icon-search',
    rightIcon: 'un-icon-chevron-right',
    iconSize: BUTTON_ICON_SIZES.LARGE,
  },
};

export const ExtraLargeIconSize = {
  args: {
    label: 'XL Icons',
    variant: BUTTON_VARIANTS.PRIMARY,
    leftIcon: 'un-icon-search',
    rightIcon: 'un-icon-chevron-right',
    iconSize: BUTTON_ICON_SIZES.EXTRA_LARGE,
  },
};

// Link Button
export const AsLink = {
  args: {
    label: 'Link Button',
    variant: BUTTON_VARIANTS.PRIMARY,
    href: 'https://example.com',
    rightIcon: 'un-icon-chevron-right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button rendered as an anchor tag when href is provided.'
      }
    }
  }
};

// All Variants Showcase
export const AllVariants = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${createButton('Primary', '', false, BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      ${createButton('Accent', '', false, BUTTON_VARIANTS.ACCENT, BUTTON_ICON_SIZES.MEDIUM)}
      ${createButton('Secondary', '', false, BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All button variants displayed together for comparison.'
      }
    }
  }
};

// All Icon Sizes Showcase
export const AllIconSizes = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      ${createButton('Small', '', false, BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.SMALL, 'un-icon-search')}
      ${createButton('Medium', '', false, BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM, 'un-icon-search')}
      ${createButton('Large', '', false, BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.LARGE, 'un-icon-search')}
      ${createButton('XL', '', false, BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.EXTRA_LARGE, 'un-icon-search')}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All icon sizes displayed together for comparison.'
      }
    }
  }
};

// Complete Example
export const CompleteExample = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
      <h3>Primary Actions</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${createButton('Search', '', false, BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM, 'un-icon-search')}
        ${createButton('Save', '', false, BUTTON_VARIANTS.ACCENT, BUTTON_ICON_SIZES.MEDIUM, 'un-icon-search')}
        ${createButton('Cancel', '', false, BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Navigation Actions</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${createButton('Back', '', false, BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM, 'un-icon-chevron-left')}
        ${createButton('Next', '', false, BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM, '', 'un-icon-chevron-right')}
      </div>
      
      <h3>Link Actions</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${createButton('Learn More', 'https://example.com', false, BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM, '', 'un-icon-chevron-right')}
        ${createButton('Search Products', 'https://example.com', false, BUTTON_VARIANTS.ACCENT, BUTTON_ICON_SIZES.MEDIUM, 'un-icon-search')}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing various button configurations in a realistic layout.'
      }
    }
  }
};
