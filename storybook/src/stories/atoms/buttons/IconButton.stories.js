import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Icon Button components
import { createIconButton } from '@blocks/atoms/buttons/icon-button/icon-button.js';
import { BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '@blocks/atoms/buttons/standard-button/standard-button.js';
// CSS imported globally in preview-head.html

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Buttons/Icon Button',
  tags: ['autodocs'],
  render: (args) => {
    // Create the icon button element using EDS createIconButton function
    // Signature: createIconButton(icon, variant, iconSize, href, openInNewTab, instrumentation)
    const iconButtonElement = createIconButton(
      args.icon,
      args.variant,
      args.iconSize,
      args.href,
      args.openInNewTab,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${iconButtonElement}`;
  },
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: ['un-icon-chevron-left', 'un-icon-chevron-right', 'un-icon-search', 'un-icon-close', 'un-icon-settings'],
      description: 'Icon class name'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description: 'Icon button variant style'
    },
    iconSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Icon button size'
    },
    href: {
      control: 'text',
      description: 'Optional URL to make this a link button'
    },
    openInNewTab: {
      control: 'boolean',
      description: 'Open link in new tab (only applies when href is provided)'
    }
  },
  args: { 
    onClick: fn(),
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
    href: '',
    openInNewTab: false,
    instrumentation: {}
  },
};

// Icon Only Buttons - Primary Variant
export const PrimaryIconButton = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
};

export const PrimaryIconButtonHover = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const PrimaryIconButtonPressed = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    pseudo: { active: true }
  }
};

// Icon Only Buttons - Secondary Variant
export const SecondaryIconButton = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
};

export const SecondaryIconButtonHover = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const SecondaryIconButtonPressed = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
  parameters: {
    pseudo: { active: true }
  }
};

// Different Icons
export const ChevronLeft = {
  args: {
    icon: 'un-icon-chevron-left',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chevron left icon, commonly used for navigation "previous" actions.'
      }
    }
  }
};

export const ChevronRight = {
  args: {
    icon: 'un-icon-chevron-right',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chevron right icon, commonly used for navigation "next" actions.'
      }
    }
  }
};

export const SearchIcon = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search icon button.'
      }
    }
  }
};

// Different Sizes
export const SmallIconButton = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.SMALL,
  },
};

export const MediumIconButton = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const LargeIconButton = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.LARGE,
  },
};

export const ExtraLargeIconButton = {
  args: {
    icon: 'un-icon-search',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.EXTRA_LARGE,
  },
};

// As Link
export const AsLink = {
  args: {
    icon: 'un-icon-chevron-right',
    variant: BUTTON_VARIANTS.PRIMARY,
    href: 'https://example.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon button rendered as a link when href is provided.'
      }
    }
  }
};

// All Variants Showcase
export const AllVariants = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      ${createIconButton('un-icon-search', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All icon button variants displayed together for comparison.'
      }
    }
  }
};

// All Sizes Showcase
export const AllSizes = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.SMALL)}
      ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.LARGE)}
      ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.EXTRA_LARGE)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All icon button sizes displayed together for comparison.'
      }
    }
  }
};

// Navigation Example
export const NavigationControls = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      ${createIconButton('un-icon-chevron-left', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      <span style="padding: 0 1rem;">Page 1 of 10</span>
      ${createIconButton('un-icon-chevron-right', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Practical example: navigation controls for carousels or pagination.'
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
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Secondary Actions</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Navigation</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${createIconButton('un-icon-chevron-left', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('un-icon-chevron-right', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('un-icon-close', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Different Sizes</h3>
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.SMALL)}
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.LARGE)}
        ${createIconButton('un-icon-search', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.EXTRA_LARGE)}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing various icon button configurations in a realistic layout.'
      }
    }
  }
};
