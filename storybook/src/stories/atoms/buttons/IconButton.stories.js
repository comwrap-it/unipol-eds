import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Icon Button components
import { createIconButton } from '@blocks/atoms/buttons/icon-button/icon-button.js';
import { BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '@blocks/atoms/buttons/standard-button/standard-button.js';
import '@blocks/atoms/buttons/icon-button/icon-button.css';
import '@blocks/atoms/buttons/standard-button/standard-button.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Buttons/Icon Button',
  tags: ['autodocs'],
  render: (args) => {
    // Create the icon button element using EDS createIconButton function
    // createIconButton(icon, variant, iconSize, href, instrumentation)
    const iconButtonElement = createIconButton(
      args.icon,
      args.variant,
      args.iconSize,
      args.href,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${iconButtonElement}`;
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Icon name (e.g., chevron-left, chevron-right, search-icon)'
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
    }
  },
  args: { 
    onClick: fn(),
    icon: 'search-icon',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
    href: '',
    instrumentation: {}
  },
};

// Icon Only Buttons - Primary Variant
export const PrimaryIconButton = {
  args: {
    icon: 'search-icon',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
};

export const PrimaryIconButtonHover = {
  args: {
    icon: 'search-icon',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const PrimaryIconButtonPressed = {
  args: {
    icon: 'search-icon',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
  parameters: {
    pseudo: { active: true }
  }
};

// Icon Only Buttons - Secondary Variant
export const SecondaryIconButton = {
  args: {
    icon: 'settings-icon',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
};

export const SecondaryIconButtonHover = {
  args: {
    icon: 'settings-icon',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const SecondaryIconButtonPressed = {
  args: {
    icon: 'settings-icon',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
  parameters: {
    pseudo: { active: true }
  }
};

// Different Icons
export const ChevronLeft = {
  args: {
    icon: 'chevron-left',
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
    icon: 'chevron-right',
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
    icon: 'search-icon',
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
    icon: 'search-icon',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.SMALL,
  },
};

export const MediumIconButton = {
  args: {
    icon: 'search-icon',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const LargeIconButton = {
  args: {
    icon: 'search-icon',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.LARGE,
  },
};

export const ExtraLargeIconButton = {
  args: {
    icon: 'search-icon',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.EXTRA_LARGE,
  },
};

// As Link
export const AsLink = {
  args: {
    icon: 'external-link',
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
      ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      ${createIconButton('settings-icon', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
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
      ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.SMALL)}
      ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.LARGE)}
      ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.EXTRA_LARGE)}
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
      ${createIconButton('chevron-left', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      <span style="padding: 0 1rem;">Page 1 of 10</span>
      ${createIconButton('chevron-right', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
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
        ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('filter-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('refresh-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Secondary Actions</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${createIconButton('settings-icon', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('info-icon', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('help-icon', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Navigation</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${createIconButton('chevron-left', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('chevron-right', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('close-icon', BUTTON_VARIANTS.SECONDARY, BUTTON_ICON_SIZES.MEDIUM)}
      </div>
      
      <h3>Different Sizes</h3>
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.SMALL)}
        ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.MEDIUM)}
        ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.LARGE)}
        ${createIconButton('search-icon', BUTTON_VARIANTS.PRIMARY, BUTTON_ICON_SIZES.EXTRA_LARGE)}
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
