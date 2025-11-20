import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Category Chip components
import { createCategoryChip } from '@blocks/atoms/category-chip/category-chip.js';
// CSS imported globally in preview.js

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Category Chip',
  tags: ['autodocs'],
  render: (args) => {
    // Create the category chip element using EDS createCategoryChip function
    // createCategoryChip(category, icon, instrumentation)
    const categoryChipElement = createCategoryChip(
      args.category,
      args.icon,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${categoryChipElement}`;
  },
  argTypes: {
    category: {
      control: { type: 'select' },
      options: ['mobility', 'welfare', 'property'],
      description: 'Category name (defines style and text)'
    },
    icon: {
      control: 'text',
      description: 'Icon class name (e.g., mobility-icon, welfare-icon, property-icon)'
    }
  },
  args: { 
    onClick: fn(),
    category: 'mobility',
    icon: 'mobility-icon',
    instrumentation: {}
  },
};

// Mobility Category
export const Mobility = {
  args: {
    category: 'mobility',
    icon: 'mobility-icon',
  },
};

export const MobilityHover = {
  args: {
    category: 'mobility',
    icon: 'mobility-icon',
  },
  parameters: {
    pseudo: { hover: true }
  }
};

// Welfare Category
export const Welfare = {
  args: {
    category: 'welfare',
    icon: 'welfare-icon',
  },
};

export const WelfareHover = {
  args: {
    category: 'welfare',
    icon: 'welfare-icon',
  },
  parameters: {
    pseudo: { hover: true }
  }
};

// Property Category
export const Property = {
  args: {
    category: 'property',
    icon: 'property-icon',
  },
};

export const PropertyHover = {
  args: {
    category: 'property',
    icon: 'property-icon',
  },
  parameters: {
    pseudo: { hover: true }
  }
};

// All Categories Showcase
export const AllCategories = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${createCategoryChip('mobility', 'mobility-icon')}
      ${createCategoryChip('welfare', 'welfare-icon')}
      ${createCategoryChip('property', 'property-icon')}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All category chips displayed together for comparison.'
      }
    }
  }
};

// Complete Example
export const CompleteExample = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px;">
      <h3>Product Categories</h3>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        ${createCategoryChip('mobility', 'mobility-icon')}
        ${createCategoryChip('welfare', 'welfare-icon')}
        ${createCategoryChip('property', 'property-icon')}
      </div>
      
      <h3>Filter Example</h3>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <p>Filter products by category:</p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          ${createCategoryChip('mobility', 'mobility-icon')}
          ${createCategoryChip('welfare', 'welfare-icon')}
          ${createCategoryChip('property', 'property-icon')}
        </div>
      </div>
      
      <h3>Card Header Usage</h3>
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem;">
        <div style="margin-bottom: 1rem;">
          ${createCategoryChip('mobility', 'mobility-icon')}
        </div>
        <h4 style="margin: 0 0 0.5rem 0;">Insurance Product Title</h4>
        <p style="margin: 0; color: #666;">Product description and details go here...</p>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Complete examples showing category chips in realistic use cases.'
      }
    }
  }
};

