import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Option components
import createOption from '@blocks/atoms/options/option/option.js';
import { CHECKBOX_TYPES } from '@blocks/atoms/checkbox/standard-checkbox/checkbox.js';
// CSS imported globally in preview.js

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Options/Option',
  tags: ['autodocs'],
  render: (args) => {
    // Create the option element using EDS createOption function
    // createOption(labelText, descriptionText, shouldShowCheckbox, typeStatus, disabled, instrumentation)
    const optionElement = createOption(
      args.labelText,
      args.descriptionText,
      args.shouldShowCheckbox,
      args.typeStatus,
      args.disabled,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${optionElement}`;
  },
  argTypes: {
    labelText: {
      control: 'text',
      description: 'Option label/title text'
    },
    descriptionText: {
      control: 'text',
      description: 'Optional description text below the label'
    },
    shouldShowCheckbox: {
      control: 'boolean',
      description: 'Whether to show a checkbox'
    },
    typeStatus: {
      control: { type: 'select' },
      options: ['unchecked', 'checked', 'indeterminate'],
      description: 'Checkbox state (if checkbox is shown)'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    }
  },
  args: { 
    onClick: fn(),
    labelText: 'Option Label',
    descriptionText: '',
    shouldShowCheckbox: false,
    typeStatus: CHECKBOX_TYPES.UNCHECKED,
    disabled: false,
    instrumentation: {}
  },
};

// Basic Option (No Checkbox)
export const BasicOption = {
  args: {
    labelText: 'Select this option',
    descriptionText: '',
    shouldShowCheckbox: false,
  },
};

// Option with Description
export const WithDescription = {
  args: {
    labelText: 'Premium Plan',
    descriptionText: 'Get access to all premium features',
    shouldShowCheckbox: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Option with a descriptive subtitle.'
      }
    }
  }
};

// Option with Checkbox - Unchecked
export const WithCheckboxUnchecked = {
  args: {
    labelText: 'Email notifications',
    descriptionText: 'Receive updates via email',
    shouldShowCheckbox: true,
    typeStatus: CHECKBOX_TYPES.UNCHECKED,
  },
  parameters: {
    docs: {
      description: {
        story: 'Option with an unchecked checkbox.'
      }
    }
  }
};

// Option with Checkbox - Checked
export const WithCheckboxChecked = {
  args: {
    labelText: 'SMS alerts',
    descriptionText: 'Get instant alerts via SMS',
    shouldShowCheckbox: true,
    typeStatus: CHECKBOX_TYPES.CHECKED,
  },
  parameters: {
    docs: {
      description: {
        story: 'Option with a checked checkbox.'
      }
    }
  }
};

// Option with Checkbox - Indeterminate
export const WithCheckboxIndeterminate = {
  args: {
    labelText: 'Partial selection',
    descriptionText: 'Some sub-options are selected',
    shouldShowCheckbox: true,
    typeStatus: CHECKBOX_TYPES.INDETERMINATE,
  },
  parameters: {
    docs: {
      description: {
        story: 'Option with an indeterminate checkbox state.'
      }
    }
  }
};

// Disabled Option
export const Disabled = {
  args: {
    labelText: 'Disabled option',
    descriptionText: 'This option is not available',
    shouldShowCheckbox: true,
    typeStatus: CHECKBOX_TYPES.UNCHECKED,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled option that cannot be interacted with.'
      }
    }
  }
};

// All Checkbox States
export const AllCheckboxStates = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;">
      ${createOption('Unchecked', 'Default unchecked state', true, CHECKBOX_TYPES.UNCHECKED, false)}
      ${createOption('Checked', 'Selected option', true, CHECKBOX_TYPES.CHECKED, false)}
      ${createOption('Indeterminate', 'Partially selected', true, CHECKBOX_TYPES.INDETERMINATE, false)}
      ${createOption('Disabled', 'Cannot be selected', true, CHECKBOX_TYPES.UNCHECKED, true)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All checkbox states displayed together.'
      }
    }
  }
};

// Settings Example
export const SettingsExample = {
  render: () => html`
    <div style="max-width: 500px; padding: 2rem; background: #f5f5f5; border-radius: 8px;">
      <h3 style="margin: 0 0 1.5rem 0;">Notification Preferences</h3>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${createOption(
          'Email notifications',
          'Get updates about account activity',
          true,
          CHECKBOX_TYPES.CHECKED,
          false
        )}
        ${createOption(
          'SMS alerts',
          'Security and login alerts via SMS',
          true,
          CHECKBOX_TYPES.UNCHECKED,
          false
        )}
        ${createOption(
          'Push notifications',
          'Instant notifications on your mobile device',
          true,
          CHECKBOX_TYPES.CHECKED,
          false
        )}
        ${createOption(
          'Weekly digest',
          'Summary of product updates and news',
          true,
          CHECKBOX_TYPES.UNCHECKED,
          false
        )}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Notification preferences using options with checkboxes.'
      }
    }
  }
};

// Plan Selection Example
export const PlanSelectionExample = {
  render: () => html`
    <div style="max-width: 600px; padding: 2rem; background: white; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="margin: 0 0 1.5rem 0; color: #00408F;">Choose Your Plan</h2>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${createOption(
          'Basic Plan',
          'Essential features for individuals - $9/month',
          false,
          CHECKBOX_TYPES.UNCHECKED,
          false
        )}
        ${createOption(
          'Pro Plan',
          'Advanced features for professionals - $29/month',
          false,
          CHECKBOX_TYPES.UNCHECKED,
          false
        )}
        ${createOption(
          'Enterprise Plan',
          'Complete solution for teams - $99/month',
          false,
          CHECKBOX_TYPES.UNCHECKED,
          false
        )}
        ${createOption(
          'Custom Plan',
          'Tailored to your specific needs - Contact us',
          false,
          CHECKBOX_TYPES.UNCHECKED,
          true
        )}
      </div>
      <button style="margin-top: 1.5rem; padding: 0.75rem 2rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">
        Continue
      </button>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Plan selection interface using options without checkboxes.'
      }
    }
  }
};

// Features List Example
export const FeaturesListExample = {
  render: () => html`
    <div style="max-width: 600px; padding: 2rem; background: white; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="margin: 0 0 1rem 0; color: #00408F;">Select Optional Features</h2>
      <p style="margin: 0 0 2rem 0; color: #666;">
        Choose additional features to enhance your plan
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${createOption(
          'Premium Support',
          '24/7 priority support with dedicated account manager (+$20/month)',
          true,
          CHECKBOX_TYPES.UNCHECKED,
          false
        )}
        ${createOption(
          'Advanced Analytics',
          'Detailed insights and custom reports (+$15/month)',
          true,
          CHECKBOX_TYPES.CHECKED,
          false
        )}
        ${createOption(
          'API Access',
          'Full API access with 10,000 requests/month (+$30/month)',
          true,
          CHECKBOX_TYPES.CHECKED,
          false
        )}
        ${createOption(
          'White Label',
          'Remove branding and use your own logo (+$50/month)',
          true,
          CHECKBOX_TYPES.UNCHECKED,
          false
        )}
        ${createOption(
          'Custom Integrations',
          'Connect with your existing tools (Coming soon)',
          true,
          CHECKBOX_TYPES.UNCHECKED,
          true
        )}
      </div>
      <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: #666;">Total Monthly Cost</p>
          <p style="margin: 0; font-size: 1.5rem; font-weight: 700; color: #00408F;">$74/month</p>
        </div>
        <button style="padding: 0.75rem 2rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">
          Proceed to Checkout
        </button>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Feature selection interface with pricing information.'
      }
    }
  }
};

