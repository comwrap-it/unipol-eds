import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Textarea components
import { createTextarea } from '@blocks/atoms/inputs/textarea/textarea.js';
import { BUTTON_ICON_SIZES } from '@blocks/atoms/buttons/standard-button/standard-button.js';
// CSS imported globally in preview.js

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Inputs/Textarea',
  tags: ['autodocs'],
  render: (args) => {
    // Create the textarea element using EDS createTextarea function
    // createTextarea(label, icon, iconSize, hintText, hintIcon, instrumentation)
    const textareaElement = createTextarea(
      args.label,
      args.icon,
      args.iconSize,
      args.hintText,
      args.hintIcon,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${textareaElement}`;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Textarea label'
    },
    icon: {
      control: 'text',
      description: 'Icon class name (e.g., message-icon, comment-icon)'
    },
    iconSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Icon size'
    },
    hintText: {
      control: 'text',
      description: 'Helper/hint text below the textarea'
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

// Basic Textarea
export const BasicTextarea = {
  args: {
    label: 'Message',
  },
};

// Textarea with Icon
export const WithIcon = {
  args: {
    label: 'Comments',
    icon: 'message-icon',
    iconSize: BUTTON_ICON_SIZES.SMALL,
  },
  parameters: {
    docs: {
      description: {
        story: 'Textarea with an icon.'
      }
    }
  }
};

// Textarea with Hint Text
export const WithHintText = {
  args: {
    label: 'Description',
    hintText: 'Provide a detailed description (max. 500 characters)',
  },
  parameters: {
    docs: {
      description: {
        story: 'Textarea with helper/hint text below.'
      }
    }
  }
};

// Textarea with Hint Icon
export const WithHintIcon = {
  args: {
    label: 'Feedback',
    hintText: 'Your feedback helps us improve our services',
    hintIcon: 'info-icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Textarea with hint text and an icon.'
      }
    }
  }
};

// Textarea with Everything
export const CompleteTextarea = {
  args: {
    label: 'Additional Comments',
    icon: 'message-icon',
    iconSize: BUTTON_ICON_SIZES.SMALL,
    hintText: 'Share any additional information that might be helpful',
    hintIcon: 'info-icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Textarea with icon, label, and hint text with icon.'
      }
    }
  }
};

// Icon Size Variations
export const SmallIcon = {
  args: {
    label: 'Message',
    icon: 'message-icon',
    iconSize: BUTTON_ICON_SIZES.SMALL,
  },
};

export const MediumIcon = {
  args: {
    label: 'Message',
    icon: 'message-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const LargeIcon = {
  args: {
    label: 'Message',
    icon: 'message-icon',
    iconSize: BUTTON_ICON_SIZES.LARGE,
  },
};

export const ExtraLargeIcon = {
  args: {
    label: 'Message',
    icon: 'message-icon',
    iconSize: BUTTON_ICON_SIZES.EXTRA_LARGE,
  },
};

// All Icon Sizes Showcase
export const AllIconSizes = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
      ${createTextarea('Small Icon', 'message-icon', BUTTON_ICON_SIZES.SMALL)}
      ${createTextarea('Medium Icon', 'message-icon', BUTTON_ICON_SIZES.MEDIUM)}
      ${createTextarea('Large Icon', 'message-icon', BUTTON_ICON_SIZES.LARGE)}
      ${createTextarea('Extra Large Icon', 'message-icon', BUTTON_ICON_SIZES.EXTRA_LARGE)}
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
      <h3 style="margin: 0;">Feedback Form</h3>
      
      ${createTextarea('How can we help?', 'question-icon', BUTTON_ICON_SIZES.SMALL, 'Describe your issue or question in detail')}
      
      ${createTextarea('Additional Comments', 'message-icon', BUTTON_ICON_SIZES.SMALL, 'Any other information you\'d like to share', 'info-icon')}
      
      ${createTextarea('Suggestions', 'lightbulb-icon', BUTTON_ICON_SIZES.SMALL, 'We value your feedback and suggestions', 'star-icon')}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing various textarea configurations in a realistic feedback form.'
      }
    }
  }
};

// Form Example
export const FormExample = {
  render: () => html`
    <div style="max-width: 600px; padding: 2rem; background: #f5f5f5; border-radius: 8px;">
      <h2 style="margin: 0 0 1.5rem 0;">Contact Us</h2>
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${createTextarea('Your Message', 'message-icon', BUTTON_ICON_SIZES.SMALL, 'Tell us how we can help you (min. 50 characters)', 'info-icon')}
        
        ${createTextarea('Additional Details', 'document-icon', BUTTON_ICON_SIZES.SMALL, 'Provide any additional context or information')}
        
        <button style="padding: 0.75rem 1.5rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">
          Send Message
        </button>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Realistic contact form using textareas.'
      }
    }
  }
};

// Support Ticket Example
export const SupportTicketExample = {
  render: () => html`
    <div style="max-width: 700px; padding: 2rem; background: white; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="margin: 0 0 1rem 0; color: #00408F;">Create Support Ticket</h2>
      <p style="margin: 0 0 2rem 0; color: #666;">
        Please provide as much detail as possible to help us resolve your issue quickly.
      </p>
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${createTextarea('Issue Description', 'warning-icon', BUTTON_ICON_SIZES.SMALL, 'Describe the problem you\'re experiencing', 'info-icon')}
        
        ${createTextarea('Steps to Reproduce', 'list-icon', BUTTON_ICON_SIZES.SMALL, 'List the steps that led to this issue')}
        
        ${createTextarea('Expected Behavior', 'checked-icon', BUTTON_ICON_SIZES.SMALL, 'What did you expect to happen?')}
        
        ${createTextarea('Actual Behavior', 'error-icon', BUTTON_ICON_SIZES.SMALL, 'What actually happened?')}
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button style="padding: 0.75rem 1.5rem; background: transparent; color: #00408F; border: 1px solid #00408F; border-radius: 4px; font-size: 1rem; cursor: pointer;">
            Cancel
          </button>
          <button style="padding: 0.75rem 1.5rem; background: #00408F; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive support ticket form with multiple textareas.'
      }
    }
  }
};

