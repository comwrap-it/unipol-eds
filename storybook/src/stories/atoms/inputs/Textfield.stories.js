import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Textfield components
import { createTextfield } from '@blocks/atoms/inputs/textfield/textfield.js';
import { BUTTON_ICON_SIZES } from '@blocks/atoms/buttons/standard-button/standard-button.js';
import '@blocks/atoms/inputs/inputs.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Inputs/Textfield',
  tags: ['autodocs'],
  render: (args) => {
    // Create the textfield element using EDS createTextfield function
    // createTextfield(label, icon, iconSize, hintText, hintIcon, instrumentation)
    const textfieldElement = createTextfield(
      args.label,
      args.icon,
      args.iconSize,
      args.hintText,
      args.hintIcon,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${textfieldElement}`;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Textfield label'
    },
    icon: {
      control: 'text',
      description: 'Icon class name (e.g., search-icon, user-icon)'
    },
    iconSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Icon size'
    },
    hintText: {
      control: 'text',
      description: 'Helper/hint text below the input'
    },
    hintIcon: {
      control: 'text',
      description: 'Icon for hint text (e.g., info-icon, warning-icon)'
    }
  },
  args: { 
    onChange: fn(),
    label: 'Label',
    icon: '',
    iconSize: BUTTON_ICON_SIZES.SMALL,
    hintText: '',
    hintIcon: '',
    instrumentation: {}
  },
};

// Basic Textfield
export const BasicTextfield = {
  args: {
    label: 'Email Address',
  },
};

// Textfield with Icon
export const WithIcon = {
  args: {
    label: 'Search',
    icon: 'search-icon',
    iconSize: BUTTON_ICON_SIZES.SMALL,
  },
  parameters: {
    docs: {
      description: {
        story: 'Textfield with an icon inside the input.'
      }
    }
  }
};

// Textfield with Hint Text
export const WithHintText = {
  args: {
    label: 'Username',
    hintText: 'Enter your username (min. 6 characters)',
  },
  parameters: {
    docs: {
      description: {
        story: 'Textfield with helper/hint text below the input.'
      }
    }
  }
};

// Textfield with Hint Icon
export const WithHintIcon = {
  args: {
    label: 'Password',
    hintText: 'Password must be at least 8 characters',
    hintIcon: 'info-icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Textfield with hint text and an icon.'
      }
    }
  }
};

// Textfield with Everything
export const CompleteTextfield = {
  args: {
    label: 'Search Products',
    icon: 'search-icon',
    iconSize: BUTTON_ICON_SIZES.SMALL,
    hintText: 'Type at least 3 characters to search',
    hintIcon: 'info-icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Textfield with icon, label, and hint text with icon.'
      }
    }
  }
};

// Icon Size Variations
export const SmallIcon = {
  args: {
    label: 'Search',
    icon: 'search-icon',
    iconSize: BUTTON_ICON_SIZES.SMALL,
  },
};

export const MediumIcon = {
  args: {
    label: 'Search',
    icon: 'search-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const LargeIcon = {
  args: {
    label: 'Search',
    icon: 'search-icon',
    iconSize: BUTTON_ICON_SIZES.LARGE,
  },
};

export const ExtraLargeIcon = {
  args: {
    label: 'Search',
    icon: 'search-icon',
    iconSize: BUTTON_ICON_SIZES.EXTRA_LARGE,
  },
};

// All Icon Sizes Showcase
export const AllIconSizes = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
      ${createTextfield('Small Icon', 'search-icon', BUTTON_ICON_SIZES.SMALL)}
      ${createTextfield('Medium Icon', 'search-icon', BUTTON_ICON_SIZES.MEDIUM)}
      ${createTextfield('Large Icon', 'search-icon', BUTTON_ICON_SIZES.LARGE)}
      ${createTextfield('Extra Large Icon', 'search-icon', BUTTON_ICON_SIZES.EXTRA_LARGE)}
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
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 500px;">
      <h3 style="margin: 0;">Contact Form</h3>
      
      ${createTextfield('Full Name', '', BUTTON_ICON_SIZES.SMALL, 'Enter your full name')}
      
      ${createTextfield('Email Address', 'email-icon', BUTTON_ICON_SIZES.SMALL, 'We\'ll never share your email', 'checked-icon')}
      
      ${createTextfield('Phone Number', 'phone-icon', BUTTON_ICON_SIZES.SMALL, 'Optional - for urgent contact', 'info-icon')}
      
      ${createTextfield('Company Name', 'building-icon', BUTTON_ICON_SIZES.SMALL)}
      
      ${createTextfield('Search Location', 'search-icon', BUTTON_ICON_SIZES.SMALL, 'Enter city or ZIP code', 'location-icon')}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing various textfield configurations in a realistic form.'
      }
    }
  }
};

// Form Example
export const FormExample = {
  render: () => html`
    <div style="max-width: 600px; padding: 2rem; background: #f5f5f5; border-radius: 8px;">
      <h2 style="margin: 0 0 1.5rem 0;">Sign Up</h2>
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${createTextfield('Username', 'user-icon', BUTTON_ICON_SIZES.SMALL, 'Choose a unique username (min. 6 characters)')}
        
        ${createTextfield('Email', 'email-icon', BUTTON_ICON_SIZES.SMALL, 'We\'ll send a confirmation email', 'info-icon')}
        
        ${createTextfield('Password', 'lock-icon', BUTTON_ICON_SIZES.SMALL, 'Must be at least 8 characters with numbers and symbols', 'warning-icon')}
        
        <button style="padding: 0.75rem 1.5rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">
          Create Account
        </button>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Realistic sign-up form using textfields.'
      }
    }
  }
};

