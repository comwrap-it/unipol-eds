import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Icon Button components
import { createIconButton } from '@blocks/atoms/buttons/icon-button/icon-button.js';
import '@blocks/atoms/buttons/icon-button/icon-button.css';

// Sample SVG icons for demonstration
const SAMPLE_ICONS = {
  heart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Buttons/Icon Button',
  tags: ['autodocs'],
  render: (args) => {
    // Create the icon button element using EDS createIconButton function
    const iconButtonElement = createIconButton(args);
    
    // Return as lit-html template
    return html`${iconButtonElement}`;
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Optional button text (for icon + text buttons)'
    },
    icon: {
      control: { type: 'select' },
      options: Object.keys(SAMPLE_ICONS),
      mapping: SAMPLE_ICONS,
      description: 'Icon to display'
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['leading', 'trailing', 'only'],
      description: 'Position of icon relative to text'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'accent', 'secondary'],
      description: 'Icon button variant style'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Icon button size'
    },
    style: {
      control: { type: 'select' },
      options: ['standard', 'circular', 'fab'],
      description: 'Icon button style'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width icon button'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state'
    },
    toggle: {
      control: 'boolean',
      description: 'Toggle button functionality'
    },
    active: {
      control: 'boolean',
      description: 'Active state (for toggle buttons)'
    },
    badge: {
      control: 'text',
      description: 'Badge text to display'
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessibility label'
    }
  },
  args: { 
    onClick: fn(),
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'primary',
    size: 'medium',
    style: 'standard',
    disabled: false,
    fullWidth: false,
    loading: false,
    toggle: false,
    active: false,
    ariaLabel: 'Icon button'
  },
};

// Icon Only Buttons - Primary Variant
export const IconOnlyPrimary = {
  args: {
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'primary',
    ariaLabel: 'Like button'
  },
};

export const IconOnlyPrimaryHover = {
  args: {
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'primary',
    ariaLabel: 'Like button'
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const IconOnlyPrimaryPressed = {
  args: {
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'primary',
    ariaLabel: 'Like button'
  },
  parameters: {
    pseudo: { active: true }
  }
};

export const IconOnlyPrimaryDisabled = {
  args: {
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'primary',
    disabled: true,
    ariaLabel: 'Like button'
  },
};

// Icon Only Buttons - Accent Variant
export const IconOnlyAccent = {
  args: {
    icon: SAMPLE_ICONS.star,
    iconPosition: 'only',
    variant: 'accent',
    ariaLabel: 'Star button'
  },
};

// Icon Only Buttons - Secondary Variant
export const IconOnlySecondary = {
  args: {
    icon: SAMPLE_ICONS.settings,
    iconPosition: 'only',
    variant: 'secondary',
    ariaLabel: 'Settings button'
  },
};

// Icon + Text Buttons
export const IconWithTextLeading = {
  args: {
    text: 'Download',
    icon: SAMPLE_ICONS.download,
    iconPosition: 'leading',
    variant: 'primary',
  },
};

export const IconWithTextTrailing = {
  args: {
    text: 'Settings',
    icon: SAMPLE_ICONS.settings,
    iconPosition: 'trailing',
    variant: 'accent',
  },
};

// Different Sizes
export const SmallIconButton = {
  args: {
    icon: SAMPLE_ICONS.plus,
    iconPosition: 'only',
    variant: 'primary',
    size: 'small',
    ariaLabel: 'Add button'
  },
};

export const MediumIconButton = {
  args: {
    icon: SAMPLE_ICONS.plus,
    iconPosition: 'only',
    variant: 'primary',
    size: 'medium',
    ariaLabel: 'Add button'
  },
};

export const LargeIconButton = {
  args: {
    icon: SAMPLE_ICONS.plus,
    iconPosition: 'only',
    variant: 'primary',
    size: 'large',
    ariaLabel: 'Add button'
  },
};

// Different Styles
export const StandardStyle = {
  args: {
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'primary',
    style: 'standard',
    ariaLabel: 'Like button'
  },
};

export const CircularStyle = {
  args: {
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'primary',
    style: 'circular',
    ariaLabel: 'Like button'
  },
};

export const FloatingActionButton = {
  args: {
    icon: SAMPLE_ICONS.plus,
    iconPosition: 'only',
    variant: 'accent',
    style: 'fab',
    size: 'large',
    ariaLabel: 'Add new item'
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating Action Button (FAB) style for primary actions.'
      }
    }
  }
};

// Toggle Buttons
export const ToggleButton = {
  args: {
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'secondary',
    toggle: true,
    active: false,
    ariaLabel: 'Toggle like'
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle button that can be switched on/off.'
      }
    }
  }
};

export const ToggleButtonActive = {
  args: {
    icon: SAMPLE_ICONS.heart,
    iconPosition: 'only',
    variant: 'primary',
    toggle: true,
    active: true,
    ariaLabel: 'Toggle like'
  },
};

// Badge Button
export const ButtonWithBadge = {
  args: {
    icon: SAMPLE_ICONS.settings,
    iconPosition: 'only',
    variant: 'secondary',
    badge: '3',
    ariaLabel: 'Settings with 3 notifications'
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon button with a notification badge.'
      }
    }
  }
};

// Loading State
export const LoadingIconButton = {
  args: {
    icon: SAMPLE_ICONS.download,
    iconPosition: 'only',
    variant: 'primary',
    loading: true,
    ariaLabel: 'Downloading...'
  },
};

// Full Width
export const FullWidthIconButton = {
  args: {
    text: 'Full Width Action',
    icon: SAMPLE_ICONS.plus,
    iconPosition: 'leading',
    variant: 'primary',
    fullWidth: true,
  },
};

// All Variants Showcase
export const AllVariants = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${createIconButton({ icon: SAMPLE_ICONS.heart, iconPosition: 'only', variant: 'primary', ariaLabel: 'Primary' })}
      ${createIconButton({ icon: SAMPLE_ICONS.star, iconPosition: 'only', variant: 'accent', ariaLabel: 'Accent' })}
      ${createIconButton({ icon: SAMPLE_ICONS.settings, iconPosition: 'only', variant: 'secondary', ariaLabel: 'Secondary' })}
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
      ${createIconButton({ icon: SAMPLE_ICONS.plus, iconPosition: 'only', variant: 'primary', size: 'small', ariaLabel: 'Small' })}
      ${createIconButton({ icon: SAMPLE_ICONS.plus, iconPosition: 'only', variant: 'primary', size: 'medium', ariaLabel: 'Medium' })}
      ${createIconButton({ icon: SAMPLE_ICONS.plus, iconPosition: 'only', variant: 'primary', size: 'large', ariaLabel: 'Large' })}
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

// All Styles Showcase
export const AllStyles = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      ${createIconButton({ icon: SAMPLE_ICONS.heart, iconPosition: 'only', variant: 'primary', style: 'standard', ariaLabel: 'Standard' })}
      ${createIconButton({ icon: SAMPLE_ICONS.heart, iconPosition: 'only', variant: 'primary', style: 'circular', ariaLabel: 'Circular' })}
      ${createIconButton({ icon: SAMPLE_ICONS.plus, iconPosition: 'only', variant: 'accent', style: 'fab', size: 'large', ariaLabel: 'FAB' })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All icon button styles: standard, circular, and floating action button (FAB).'
      }
    }
  }
};

// Icon Positions Showcase
export const IconPositions = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${createIconButton({ text: 'Leading', icon: SAMPLE_ICONS.download, iconPosition: 'leading', variant: 'primary' })}
      ${createIconButton({ text: 'Trailing', icon: SAMPLE_ICONS.settings, iconPosition: 'trailing', variant: 'accent' })}
      ${createIconButton({ icon: SAMPLE_ICONS.heart, iconPosition: 'only', variant: 'secondary', ariaLabel: 'Icon only' })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Different icon positions: leading, trailing, and icon-only.'
      }
    }
  }
};