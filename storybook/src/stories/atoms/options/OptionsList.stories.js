import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS OptionsList components
import { createOptionsList } from '@blocks/atoms/options/options-list/options-list.js';
import { CHECKBOX_TYPES } from '@blocks/atoms/checkbox/standard-checkbox/checkbox.js';
// CSS imported globally in preview.js

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Options/Options List',
  tags: ['autodocs'],
  render: (args) => {
    // Create the options list element using EDS createOptionsList function
    // createOptionsList(optionsArray, instrumentation)
    const optionsListElement = createOptionsList(
      args.optionsArray,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${optionsListElement}`;
  },
  argTypes: {
    optionsArray: {
      control: 'object',
      description: 'Array of option configurations'
    }
  },
  args: { 
    onClick: fn(),
    optionsArray: [
      {
        labelText: 'Option 1',
        descriptionText: 'Description for option 1',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false,
        instrumentation: {}
      },
      {
        labelText: 'Option 2',
        descriptionText: 'Description for option 2',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false,
        instrumentation: {}
      }
    ],
    instrumentation: {}
  },
};

// Basic Options List
export const BasicOptionsList = {
  args: {
    optionsArray: [
      {
        labelText: 'First option',
        descriptionText: 'Description for first option',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false
      },
      {
        labelText: 'Second option',
        descriptionText: 'Description for second option',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false
      },
      {
        labelText: 'Third option',
        descriptionText: 'Description for third option',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false
      }
    ]
  },
};

// Options List with Mixed States
export const MixedStates = {
  args: {
    optionsArray: [
      {
        labelText: 'Email notifications',
        descriptionText: 'Get updates about account activity',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.CHECKED,
        disabled: false
      },
      {
        labelText: 'SMS alerts',
        descriptionText: 'Security and login alerts via SMS',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: true
      },
      {
        labelText: 'Weekly digest',
        descriptionText: 'Summary of product updates',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.INDETERMINATE,
        disabled: false
      },
      {
        labelText: 'Beta features',
        descriptionText: 'Access experimental features',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Options list with various checkbox states.'
      }
    }
  }
};

// Options List without Checkboxes
export const WithoutCheckboxes = {
  args: {
    optionsArray: [
      {
        labelText: 'Basic Plan',
        descriptionText: 'Essential features - $9/month',
        shouldShowCheckbox: false
      },
      {
        labelText: 'Pro Plan',
        descriptionText: 'Advanced features - $29/month',
        shouldShowCheckbox: false
      },
      {
        labelText: 'Enterprise Plan',
        descriptionText: 'Complete solution - $99/month',
        shouldShowCheckbox: false
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Options list without checkboxes for single-selection scenarios.'
      }
    }
  }
};

// Settings Panel Example
export const SettingsPanelExample = {
  render: () => {
    const optionsArray = [
      {
        labelText: 'Email notifications',
        descriptionText: 'Get updates about account activity',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.CHECKED,
        disabled: false,
        instrumentation: { 'data-tracking-id': 'opt_email' }
      },
      {
        labelText: 'SMS alerts',
        descriptionText: 'Security and login alerts via SMS',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: true,
        instrumentation: { 'data-tracking-id': 'opt_sms' }
      },
      {
        labelText: 'Weekly digest',
        descriptionText: 'Summary of product updates',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.INDETERMINATE,
        disabled: false,
        instrumentation: { 'data-tracking-id': 'opt_digest' }
      },
      {
        labelText: 'Beta features',
        descriptionText: 'Access experimental features',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false,
        instrumentation: { 'data-tracking-id': 'opt_beta' }
      }
    ];
    
    const container = document.createElement('div');
    container.style.maxWidth = '600px';
    container.style.padding = '2rem';
    container.style.background = '#f5f5f5';
    container.style.borderRadius = '8px';
    
    const title = document.createElement('h2');
    title.textContent = 'Notification Preferences';
    title.style.margin = '0 0 1.5rem 0';
    container.appendChild(title);
    
    const optionsList = createOptionsList(optionsArray);
    container.appendChild(optionsList);
    
    const button = document.createElement('button');
    button.textContent = 'Save Preferences';
    button.style.cssText = 'margin-top: 1.5rem; padding: 0.75rem 2rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;';
    container.appendChild(button);
    
    return html`${container}`;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete settings panel with an options list.'
      }
    }
  }
};

// Feature Selection Example
export const FeatureSelectionExample = {
  render: () => {
    const optionsArray = [
      {
        labelText: 'Premium Support',
        descriptionText: '24/7 priority support with dedicated account manager',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false
      },
      {
        labelText: 'Advanced Analytics',
        descriptionText: 'Detailed insights and custom reports',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.CHECKED,
        disabled: false
      },
      {
        labelText: 'API Access',
        descriptionText: 'Full API access with 10,000 requests/month',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.CHECKED,
        disabled: false
      },
      {
        labelText: 'White Label',
        descriptionText: 'Remove branding and use your own logo',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false
      },
      {
        labelText: 'Custom Integrations',
        descriptionText: 'Connect with your existing tools (Coming soon)',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: true
      }
    ];
    
    const container = document.createElement('div');
    container.style.maxWidth = '700px';
    container.style.padding = '2rem';
    container.style.background = 'white';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '8px';
    
    const title = document.createElement('h2');
    title.textContent = 'Select Optional Features';
    title.style.margin = '0 0 0.5rem 0';
    title.style.color = '#00408F';
    container.appendChild(title);
    
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Choose additional features to enhance your plan';
    subtitle.style.margin = '0 0 2rem 0';
    subtitle.style.color = '#666';
    container.appendChild(subtitle);
    
    const optionsList = createOptionsList(optionsArray);
    container.appendChild(optionsList);
    
    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;';
    
    const totalContainer = document.createElement('div');
    const totalLabel = document.createElement('p');
    totalLabel.textContent = 'Total Monthly Cost';
    totalLabel.style.cssText = 'margin: 0; font-size: 0.875rem; color: #666;';
    totalContainer.appendChild(totalLabel);
    
    const totalAmount = document.createElement('p');
    totalAmount.textContent = '$74/month';
    totalAmount.style.cssText = 'margin: 0; font-size: 1.5rem; font-weight: 700; color: #00408F;';
    totalContainer.appendChild(totalAmount);
    footer.appendChild(totalContainer);
    
    const button = document.createElement('button');
    button.textContent = 'Proceed to Checkout';
    button.style.cssText = 'padding: 0.75rem 2rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;';
    footer.appendChild(button);
    
    container.appendChild(footer);
    
    return html`${container}`;
  },
  parameters: {
    docs: {
      description: {
        story: 'Feature selection interface with options list and pricing.'
      }
    }
  }
};

// Plan Selection Example (No Checkboxes)
export const PlanSelectionExample = {
  render: () => {
    const optionsArray = [
      {
        labelText: 'Basic Plan',
        descriptionText: 'Essential features for individuals - $9/month',
        shouldShowCheckbox: false
      },
      {
        labelText: 'Pro Plan',
        descriptionText: 'Advanced features for professionals - $29/month',
        shouldShowCheckbox: false
      },
      {
        labelText: 'Enterprise Plan',
        descriptionText: 'Complete solution for teams - $99/month',
        shouldShowCheckbox: false
      }
    ];
    
    const container = document.createElement('div');
    container.style.maxWidth = '600px';
    container.style.padding = '2rem';
    container.style.background = 'white';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '8px';
    
    const title = document.createElement('h2');
    title.textContent = 'Choose Your Plan';
    title.style.margin = '0 0 1.5rem 0';
    title.style.color = '#00408F';
    container.appendChild(title);
    
    const optionsList = createOptionsList(optionsArray);
    container.appendChild(optionsList);
    
    const button = document.createElement('button');
    button.textContent = 'Continue';
    button.style.cssText = 'margin-top: 1.5rem; padding: 0.75rem 2rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; width: 100%;';
    container.appendChild(button);
    
    return html`${container}`;
  },
  parameters: {
    docs: {
      description: {
        story: 'Plan selection with options list (single selection mode).'
      }
    }
  }
};

// Privacy Settings Example
export const PrivacySettingsExample = {
  render: () => {
    const optionsArray = [
      {
        labelText: 'Analytics Cookies',
        descriptionText: 'Help us improve by allowing analytics cookies',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.CHECKED,
        disabled: false
      },
      {
        labelText: 'Marketing Cookies',
        descriptionText: 'Allow us to show you personalized content',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false
      },
      {
        labelText: 'Essential Cookies',
        descriptionText: 'Required for the website to function (always enabled)',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.CHECKED,
        disabled: true
      },
      {
        labelText: 'Third-party Cookies',
        descriptionText: 'Allow third-party services to set cookies',
        shouldShowCheckbox: true,
        typeStatus: CHECKBOX_TYPES.UNCHECKED,
        disabled: false
      }
    ];
    
    const container = document.createElement('div');
    container.style.maxWidth = '600px';
    container.style.padding = '2rem';
    container.style.background = 'white';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '8px';
    
    const title = document.createElement('h2');
    title.textContent = 'Cookie Preferences';
    title.style.margin = '0 0 0.5rem 0';
    container.appendChild(title);
    
    const description = document.createElement('p');
    description.textContent = 'Manage how we use cookies on this website';
    description.style.margin = '0 0 2rem 0';
    description.style.color = '#666';
    container.appendChild(description);
    
    const optionsList = createOptionsList(optionsArray);
    container.appendChild(optionsList);
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = 'margin-top: 1.5rem; display: flex; gap: 1rem;';
    
    const acceptAllButton = document.createElement('button');
    acceptAllButton.textContent = 'Accept All';
    acceptAllButton.style.cssText = 'flex: 1; padding: 0.75rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;';
    buttonsContainer.appendChild(acceptAllButton);
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Preferences';
    saveButton.style.cssText = 'flex: 1; padding: 0.75rem; background: transparent; color: #00408F; border: 1px solid #00408F; border-radius: 4px; font-size: 1rem; cursor: pointer;';
    buttonsContainer.appendChild(saveButton);
    
    container.appendChild(buttonsContainer);
    
    return html`${container}`;
  },
  parameters: {
    docs: {
      description: {
        story: 'Cookie/privacy settings with mandatory and optional options.'
      }
    }
  }
};

