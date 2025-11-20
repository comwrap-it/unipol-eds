import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Checkbox components
import { createCheckbox, CHECKBOX_TYPES } from '@blocks/atoms/checkbox/standard-checkbox/checkbox.js';
import '@blocks/atoms/checkbox/standard-checkbox/checkbox.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Checkbox',
  tags: ['autodocs'],
  render: (args) => {
    // Create the checkbox element using EDS createCheckbox function
    // createCheckbox(typeStatus, disabled)
    const checkboxElement = createCheckbox(
      args.typeStatus,
      args.disabled
    );
    
    // Return as lit-html template
    return html`${checkboxElement}`;
  },
  argTypes: {
    typeStatus: {
      control: { type: 'select' },
      options: ['unchecked', 'checked', 'indeterminate'],
      description: 'Checkbox state'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    }
  },
  args: { 
    onChange: fn(),
    typeStatus: CHECKBOX_TYPES.UNCHECKED,
    disabled: false
  },
};

// Unchecked State
export const Unchecked = {
  args: {
    typeStatus: CHECKBOX_TYPES.UNCHECKED,
    disabled: false,
  },
};

export const UncheckedHover = {
  args: {
    typeStatus: CHECKBOX_TYPES.UNCHECKED,
    disabled: false,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const UncheckedDisabled = {
  args: {
    typeStatus: CHECKBOX_TYPES.UNCHECKED,
    disabled: true,
  },
};

// Checked State
export const Checked = {
  args: {
    typeStatus: CHECKBOX_TYPES.CHECKED,
    disabled: false,
  },
};

export const CheckedHover = {
  args: {
    typeStatus: CHECKBOX_TYPES.CHECKED,
    disabled: false,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const CheckedDisabled = {
  args: {
    typeStatus: CHECKBOX_TYPES.CHECKED,
    disabled: true,
  },
};

// Indeterminate State
export const Indeterminate = {
  args: {
    typeStatus: CHECKBOX_TYPES.INDETERMINATE,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Indeterminate state is typically used when a parent checkbox controls multiple child checkboxes, and only some of the children are checked.'
      }
    }
  }
};

export const IndeterminateHover = {
  args: {
    typeStatus: CHECKBOX_TYPES.INDETERMINATE,
    disabled: false,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const IndeterminateDisabled = {
  args: {
    typeStatus: CHECKBOX_TYPES.INDETERMINATE,
    disabled: true,
  },
};

// All States Showcase
export const AllStates = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${createCheckbox(CHECKBOX_TYPES.UNCHECKED, false)}
        <label>Unchecked</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${createCheckbox(CHECKBOX_TYPES.CHECKED, false)}
        <label>Checked</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${createCheckbox(CHECKBOX_TYPES.INDETERMINATE, false)}
        <label>Indeterminate</label>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All checkbox states displayed together for comparison.'
      }
    }
  }
};

// All Disabled States Showcase
export const AllDisabledStates = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${createCheckbox(CHECKBOX_TYPES.UNCHECKED, true)}
        <label style="color: #999;">Unchecked Disabled</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${createCheckbox(CHECKBOX_TYPES.CHECKED, true)}
        <label style="color: #999;">Checked Disabled</label>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${createCheckbox(CHECKBOX_TYPES.INDETERMINATE, true)}
        <label style="color: #999;">Indeterminate Disabled</label>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All checkbox disabled states displayed together.'
      }
    }
  }
};

// Form Example
export const FormExample = {
  render: () => html`
    <div style="max-width: 500px; padding: 2rem; background: #f5f5f5; border-radius: 8px;">
      <h3 style="margin: 0 0 1.5rem 0;">Newsletter Preferences</h3>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          ${createCheckbox(CHECKBOX_TYPES.CHECKED, false)}
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 0.25rem;">Product Updates</label>
            <p style="margin: 0; font-size: 0.875rem; color: #666;">Receive updates about new features and products</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          ${createCheckbox(CHECKBOX_TYPES.CHECKED, false)}
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 0.25rem;">Marketing Emails</label>
            <p style="margin: 0; font-size: 0.875rem; color: #666;">Get the latest deals and promotions</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          ${createCheckbox(CHECKBOX_TYPES.UNCHECKED, false)}
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 0.25rem;">Weekly Digest</label>
            <p style="margin: 0; font-size: 0.875rem; color: #666;">Summary of important updates once a week</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          ${createCheckbox(CHECKBOX_TYPES.UNCHECKED, true)}
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 0.25rem; color: #999;">Beta Features</label>
            <p style="margin: 0; font-size: 0.875rem; color: #999;">Early access to experimental features (coming soon)</p>
          </div>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Realistic form using checkboxes with labels and descriptions.'
      }
    }
  }
};

// Hierarchical Example
export const HierarchicalExample = {
  render: () => {
    const container = document.createElement('div');
    container.style.maxWidth = '400px';
    container.style.padding = '1.5rem';
    container.style.background = 'white';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '8px';
    
    const title = document.createElement('h3');
    title.textContent = 'Select Features';
    title.style.margin = '0 0 1rem 0';
    container.appendChild(title);
    
    // Parent checkbox
    const parentContainer = document.createElement('div');
    parentContainer.style.display = 'flex';
    parentContainer.style.alignItems = 'center';
    parentContainer.style.gap = '0.75rem';
    parentContainer.style.marginBottom = '0.5rem';
    
    const parentCheckbox = createCheckbox(CHECKBOX_TYPES.INDETERMINATE, false);
    const parentLabel = document.createElement('label');
    parentLabel.textContent = 'All Features';
    parentLabel.style.fontWeight = '600';
    
    parentContainer.appendChild(parentCheckbox);
    parentContainer.appendChild(parentLabel);
    container.appendChild(parentContainer);
    
    // Child checkboxes
    const childrenContainer = document.createElement('div');
    childrenContainer.style.marginLeft = '2rem';
    childrenContainer.style.display = 'flex';
    childrenContainer.style.flexDirection = 'column';
    childrenContainer.style.gap = '0.75rem';
    
    const features = [
      { name: 'Email Notifications', checked: true },
      { name: 'SMS Alerts', checked: true },
      { name: 'Push Notifications', checked: false },
      { name: 'Weekly Reports', checked: false }
    ];
    
    features.forEach(feature => {
      const childContainer = document.createElement('div');
      childContainer.style.display = 'flex';
      childContainer.style.alignItems = 'center';
      childContainer.style.gap = '0.75rem';
      
      const childCheckbox = createCheckbox(
        feature.checked ? CHECKBOX_TYPES.CHECKED : CHECKBOX_TYPES.UNCHECKED,
        false
      );
      const childLabel = document.createElement('label');
      childLabel.textContent = feature.name;
      
      childContainer.appendChild(childCheckbox);
      childContainer.appendChild(childLabel);
      childrenContainer.appendChild(childContainer);
    });
    
    container.appendChild(childrenContainer);
    
    return html`${container}`;
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing a parent checkbox with indeterminate state controlling child checkboxes.'
      }
    }
  }
};

// Terms and Conditions Example
export const TermsAndConditionsExample = {
  render: () => html`
    <div style="max-width: 600px; padding: 2rem; background: white; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="margin: 0 0 1.5rem 0;">Complete Your Registration</h2>
      
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          ${createCheckbox(CHECKBOX_TYPES.UNCHECKED, false)}
          <div>
            <label style="font-weight: 500;">
              I agree to the <a href="#" style="color: #00408F;">Terms of Service</a> and <a href="#" style="color: #00408F;">Privacy Policy</a>
            </label>
          </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          ${createCheckbox(CHECKBOX_TYPES.CHECKED, false)}
          <div>
            <label style="font-weight: 500;">
              I want to receive newsletters and updates about products
            </label>
          </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          ${createCheckbox(CHECKBOX_TYPES.UNCHECKED, false)}
          <div>
            <label style="font-weight: 500;">
              I consent to the use of my data for analytics purposes
            </label>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #666;">
              This helps us improve our services
            </p>
          </div>
        </div>
        
        <button style="padding: 0.75rem 2rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; align-self: flex-start;">
          Complete Registration
        </button>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Registration form with terms and conditions checkboxes.'
      }
    }
  }
};

