import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Tag components
import { createTag } from '@blocks/atoms/tag/tag.js';
// CSS imported globally in preview.js

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Tag',
  tags: ['autodocs'],
  render: (args) => {
    // Create the tag element using EDS createTag function
    // createTag(label, category, type, instrumentation)
    const tagElement = createTag(
      args.label,
      args.category,
      args.type,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${tagElement}`;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Tag label text'
    },
    category: {
      control: { type: 'select' },
      options: ['mobility', 'welfare', 'property'],
      description: 'Category name (defines color scheme)'
    },
    type: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'filled'],
      description: 'Tag style type'
    }
  },
  args: { 
    onClick: fn(),
    label: 'Tag',
    category: 'mobility',
    type: 'default',
    instrumentation: {}
  },
};

// Mobility Category - Default Type
export const MobilityDefault = {
  args: {
    label: 'Car Insurance',
    category: 'mobility',
    type: 'default',
  },
};

export const MobilityOutlined = {
  args: {
    label: 'Car Insurance',
    category: 'mobility',
    type: 'outlined',
  },
};

export const MobilityFilled = {
  args: {
    label: 'Car Insurance',
    category: 'mobility',
    type: 'filled',
  },
};

// Welfare Category
export const WelfareDefault = {
  args: {
    label: 'Health',
    category: 'welfare',
    type: 'default',
  },
};

export const WelfareOutlined = {
  args: {
    label: 'Health',
    category: 'welfare',
    type: 'outlined',
  },
};

export const WelfareFilled = {
  args: {
    label: 'Health',
    category: 'welfare',
    type: 'filled',
  },
};

// Property Category
export const PropertyDefault = {
  args: {
    label: 'Home',
    category: 'property',
    type: 'default',
  },
};

export const PropertyOutlined = {
  args: {
    label: 'Home',
    category: 'property',
    type: 'outlined',
  },
};

export const PropertyFilled = {
  args: {
    label: 'Home',
    category: 'property',
    type: 'filled',
  },
};

// All Categories by Type
export const AllCategoriesDefault = {
  render: () => html`
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
      ${createTag('Car Insurance', 'mobility', 'default')}
      ${createTag('Health', 'welfare', 'default')}
      ${createTag('Home', 'property', 'default')}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All categories with default style.'
      }
    }
  }
};

export const AllCategoriesOutlined = {
  render: () => html`
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
      ${createTag('Car Insurance', 'mobility', 'outlined')}
      ${createTag('Health', 'welfare', 'outlined')}
      ${createTag('Home', 'property', 'outlined')}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All categories with outlined style.'
      }
    }
  }
};

export const AllCategoriesFilled = {
  render: () => html`
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
      ${createTag('Car Insurance', 'mobility', 'filled')}
      ${createTag('Health', 'welfare', 'filled')}
      ${createTag('Home', 'property', 'filled')}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All categories with filled style.'
      }
    }
  }
};

// All Types Showcase
export const AllTypes = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <span style="min-width: 80px; font-weight: 600;">Default:</span>
        ${createTag('Car Insurance', 'mobility', 'default')}
        ${createTag('Health', 'welfare', 'default')}
        ${createTag('Home', 'property', 'default')}
      </div>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <span style="min-width: 80px; font-weight: 600;">Outlined:</span>
        ${createTag('Car Insurance', 'mobility', 'outlined')}
        ${createTag('Health', 'welfare', 'outlined')}
        ${createTag('Home', 'property', 'outlined')}
      </div>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <span style="min-width: 80px; font-weight: 600;">Filled:</span>
        ${createTag('Car Insurance', 'mobility', 'filled')}
        ${createTag('Health', 'welfare', 'filled')}
        ${createTag('Home', 'property', 'filled')}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all tag types across categories.'
      }
    }
  }
};

// Complete Example
export const CompleteExample = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 800px;">
      <div>
        <h3 style="margin: 0 0 1rem 0;">Product Tags</h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${createTag('Popular', 'mobility', 'filled')}
          ${createTag('New', 'welfare', 'filled')}
          ${createTag('Best Value', 'property', 'filled')}
          ${createTag('Limited Time', 'mobility', 'outlined')}
        </div>
      </div>
      
      <div>
        <h3 style="margin: 0 0 1rem 0;">Category Filters</h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${createTag('Mobility', 'mobility', 'default')}
          ${createTag('Welfare', 'welfare', 'default')}
          ${createTag('Property', 'property', 'default')}
        </div>
      </div>
      
      <div>
        <h3 style="margin: 0 0 1rem 0;">Product Card Example</h3>
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem;">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            ${createTag('Car Insurance', 'mobility', 'filled')}
            ${createTag('Popular', 'mobility', 'outlined')}
          </div>
          <h4 style="margin: 0 0 0.5rem 0;">Premium Auto Coverage</h4>
          <p style="margin: 0; color: #666;">
            Comprehensive protection for your vehicle with 24/7 roadside assistance 
            and collision coverage.
          </p>
          <div style="margin-top: 1rem; font-size: 1.5rem; font-weight: 700; color: #00408F;">
            $49.99/month
          </div>
        </div>
      </div>
      
      <div>
        <h3 style="margin: 0 0 1rem 0;">Blog Post Tags</h3>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${createTag('Insurance Tips', 'welfare', 'default')}
          ${createTag('Safety', 'mobility', 'default')}
          ${createTag('Home Protection', 'property', 'default')}
          ${createTag('Expert Advice', 'welfare', 'outlined')}
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete examples showing tags in realistic use cases.'
      }
    }
  }
};

