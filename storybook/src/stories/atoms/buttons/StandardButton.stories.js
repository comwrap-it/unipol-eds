import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Button components
import { createButton } from '@blocks/atoms/buttons/button/button.js';
import '@blocks/atoms/buttons/button/button.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Buttons/Standard Button',
  tags: ['autodocs'],
  render: (args) => {
    // Create the button element using EDS createButton function
    const buttonElement = createButton(args);
    
    // Return as lit-html template
    return html`${buttonElement}`;
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Button text content'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'accent', 'secondary'],
      description: 'Button variant style'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Button size'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state'
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Button type attribute'
    }
  },
  args: { 
    onClick: fn(),
    text: 'Button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    fullWidth: false,
    loading: false,
    type: 'button'
  },
};

// Primary Button Stories
export const Primary = {
  args: {
    text: 'Primary Button',
    variant: 'primary',
  },
};

export const PrimaryHover = {
  args: {
    text: 'Primary Hover',
    variant: 'primary',
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const PrimaryPressed = {
  args: {
    text: 'Primary Pressed',
    variant: 'primary',
  },
  parameters: {
    pseudo: { active: true }
  }
};

export const PrimaryDisabled = {
  args: {
    text: 'Primary Disabled',
    variant: 'primary',
    disabled: true,
  },
};

// Accent Button Stories
export const Accent = {
  args: {
    text: 'Accent Button',
    variant: 'accent',
  },
};

export const AccentHover = {
  args: {
    text: 'Accent Hover',
    variant: 'accent',
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const AccentPressed = {
  args: {
    text: 'Accent Pressed',
    variant: 'accent',
  },
  parameters: {
    pseudo: { active: true }
  }
};

export const AccentDisabled = {
  args: {
    text: 'Accent Disabled',
    variant: 'accent',
    disabled: true,
  },
};

// Secondary Button Stories
export const Secondary = {
  args: {
    text: 'Secondary Button',
    variant: 'secondary',
  },
};

export const SecondaryHover = {
  args: {
    text: 'Secondary Hover',
    variant: 'secondary',
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const SecondaryPressed = {
  args: {
    text: 'Secondary Pressed',
    variant: 'secondary',
  },
  parameters: {
    pseudo: { active: true }
  }
};

export const SecondaryDisabled = {
  args: {
    text: 'Secondary Disabled',
    variant: 'secondary',
    disabled: true,
  },
};

// Size Variations
export const SmallButton = {
  args: {
    text: 'Small Button',
    variant: 'primary',
    size: 'small',
  },
};

export const MediumButton = {
  args: {
    text: 'Medium Button',
    variant: 'primary',
    size: 'medium',
  },
};

export const LargeButton = {
  args: {
    text: 'Large Button',
    variant: 'primary',
    size: 'large',
  },
};

// Special States
export const FullWidthButton = {
  args: {
    text: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
};

export const LoadingButton = {
  args: {
    text: 'Loading Button',
    variant: 'primary',
    loading: true,
  },
};

// All Variants Showcase
export const AllVariants = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${createButton({ text: 'Primary', variant: 'primary' })}
      ${createButton({ text: 'Accent', variant: 'accent' })}
      ${createButton({ text: 'Secondary', variant: 'secondary' })}
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

// All Sizes Showcase
export const AllSizes = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      ${createButton({ text: 'Small', variant: 'primary', size: 'small' })}
      ${createButton({ text: 'Medium', variant: 'primary', size: 'medium' })}
      ${createButton({ text: 'Large', variant: 'primary', size: 'large' })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All button sizes displayed together for comparison.'
      }
    }
  }
};