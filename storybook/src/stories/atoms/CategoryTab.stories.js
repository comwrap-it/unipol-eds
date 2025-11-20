import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Category Tab components
import { createCategoryTab } from '@blocks/atoms/category-tab/category-tab.js';
import { BUTTON_ICON_SIZES } from '@blocks/atoms/buttons/standard-button/standard-button.js';
// CSS imported globally in preview.js

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Category Tab',
  tags: ['autodocs'],
  render: (args) => {
    // Create the category tab element using EDS createCategoryTab function
    // createCategoryTab(category, icon, iconSize, instrumentation)
    const categoryTabElement = createCategoryTab(
      args.category,
      args.icon,
      args.iconSize,
      args.instrumentation
    );
    
    // Return as lit-html template
    return html`${categoryTabElement}`;
  },
  argTypes: {
    category: {
      control: 'text',
      description: 'Category name (displays as capitalized text)'
    },
    icon: {
      control: 'text',
      description: 'Icon class name (e.g., mobility-icon, welfare-icon, property-icon)'
    },
    iconSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extra-large'],
      description: 'Icon size'
    }
  },
  args: { 
    onClick: fn(),
    category: 'mobility',
    icon: 'mobility-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
    instrumentation: {}
  },
};

// Basic Category Tabs
export const Mobility = {
  args: {
    category: 'mobility',
    icon: 'mobility-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const MobilityHover = {
  args: {
    category: 'mobility',
    icon: 'mobility-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const Welfare = {
  args: {
    category: 'welfare',
    icon: 'welfare-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const WelfareHover = {
  args: {
    category: 'welfare',
    icon: 'welfare-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const Property = {
  args: {
    category: 'property',
    icon: 'property-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const PropertyHover = {
  args: {
    category: 'property',
    icon: 'property-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
  parameters: {
    pseudo: { hover: true }
  }
};

// Icon Size Variations
export const SmallIcon = {
  args: {
    category: 'mobility',
    icon: 'mobility-icon',
    iconSize: BUTTON_ICON_SIZES.SMALL,
  },
};

export const MediumIcon = {
  args: {
    category: 'mobility',
    icon: 'mobility-icon',
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
  },
};

export const LargeIcon = {
  args: {
    category: 'mobility',
    icon: 'mobility-icon',
    iconSize: BUTTON_ICON_SIZES.LARGE,
  },
};

export const ExtraLargeIcon = {
  args: {
    category: 'mobility',
    icon: 'mobility-icon',
    iconSize: BUTTON_ICON_SIZES.EXTRA_LARGE,
  },
};

// All Categories Showcase
export const AllCategories = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      ${createCategoryTab('mobility', 'mobility-icon', BUTTON_ICON_SIZES.MEDIUM)}
      ${createCategoryTab('welfare', 'welfare-icon', BUTTON_ICON_SIZES.MEDIUM)}
      ${createCategoryTab('property', 'property-icon', BUTTON_ICON_SIZES.MEDIUM)}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All category tabs displayed together for comparison.'
      }
    }
  }
};

// All Icon Sizes Showcase
export const AllIconSizes = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
      ${createCategoryTab('mobility', 'mobility-icon', BUTTON_ICON_SIZES.SMALL)}
      ${createCategoryTab('mobility', 'mobility-icon', BUTTON_ICON_SIZES.MEDIUM)}
      ${createCategoryTab('mobility', 'mobility-icon', BUTTON_ICON_SIZES.LARGE)}
      ${createCategoryTab('mobility', 'mobility-icon', BUTTON_ICON_SIZES.EXTRA_LARGE)}
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

// Tab Navigation Example
export const TabNavigation = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '0.5rem';
    container.style.borderBottom = '1px solid #ddd';
    container.style.paddingBottom = '0.5rem';
    
    const mobilityTab = createCategoryTab('mobility', 'mobility-icon', BUTTON_ICON_SIZES.MEDIUM);
    const welfareTab = createCategoryTab('welfare', 'welfare-icon', BUTTON_ICON_SIZES.MEDIUM);
    const propertyTab = createCategoryTab('property', 'property-icon', BUTTON_ICON_SIZES.MEDIUM);
    
    // Add selected state to first tab
    mobilityTab.classList.add('selected');
    
    // Add click handlers to toggle selected state
    [mobilityTab, welfareTab, propertyTab].forEach(tab => {
      tab.addEventListener('click', () => {
        [mobilityTab, welfareTab, propertyTab].forEach(t => t.classList.remove('selected'));
        tab.classList.add('selected');
      });
    });
    
    container.appendChild(mobilityTab);
    container.appendChild(welfareTab);
    container.appendChild(propertyTab);
    
    return html`${container}`;
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive tab navigation with selected state.'
      }
    }
  }
};

// Complete Example
export const CompleteExample = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '2rem';
    wrapper.style.maxWidth = '800px';
    
    // Tab Navigation
    const header = document.createElement('h3');
    header.textContent = 'Product Categories';
    wrapper.appendChild(header);
    
    const tabsContainer = document.createElement('div');
    tabsContainer.style.display = 'flex';
    tabsContainer.style.gap = '0.5rem';
    tabsContainer.style.borderBottom = '2px solid #e0e0e0';
    tabsContainer.style.paddingBottom = '0.5rem';
    
    const mobilityTab = createCategoryTab('mobility', 'mobility-icon', BUTTON_ICON_SIZES.MEDIUM);
    const welfareTab = createCategoryTab('welfare', 'welfare-icon', BUTTON_ICON_SIZES.MEDIUM);
    const propertyTab = createCategoryTab('property', 'property-icon', BUTTON_ICON_SIZES.MEDIUM);
    
    mobilityTab.classList.add('selected');
    
    [mobilityTab, welfareTab, propertyTab].forEach(tab => {
      tab.addEventListener('click', () => {
        [mobilityTab, welfareTab, propertyTab].forEach(t => t.classList.remove('selected'));
        tab.classList.add('selected');
      });
    });
    
    tabsContainer.appendChild(mobilityTab);
    tabsContainer.appendChild(welfareTab);
    tabsContainer.appendChild(propertyTab);
    wrapper.appendChild(tabsContainer);
    
    // Content Area
    const content = document.createElement('div');
    content.style.padding = '1.5rem';
    content.style.backgroundColor = '#f5f5f5';
    content.style.borderRadius = '8px';
    content.innerHTML = `
      <h4 style="margin: 0 0 1rem 0;">Mobility Products</h4>
      <p style="margin: 0; color: #666;">
        Browse our comprehensive range of mobility insurance products, including vehicle insurance, 
        roadside assistance, and more. Find the perfect coverage for your needs.
      </p>
    `;
    wrapper.appendChild(content);
    
    return html`${wrapper}`;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing category tabs in a realistic tabbed interface.'
      }
    }
  }
};

