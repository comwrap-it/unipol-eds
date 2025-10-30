import { fn } from 'storybook/test';
import { html } from 'lit';

// Import EDS Link Button components
import { createLinkButton } from '@blocks/atoms/buttons/link-button/link-button.js';
import '@blocks/atoms/buttons/link-button/link-button.css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Atoms/Buttons/Link Button',
  tags: ['autodocs'],
  render: (args) => {
    // Create the link button element using EDS createLinkButton function
    const linkButtonElement = createLinkButton(args);
    
    // Return as lit-html template
    return html`${linkButtonElement}`;
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Link button text content'
    },
    href: {
      control: 'text',
      description: 'Link URL'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'accent', 'secondary'],
      description: 'Link button variant style'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Link button size'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width link button'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state'
    },
    external: {
      control: 'boolean',
      description: 'External link (opens in new tab)'
    },
    download: {
      control: 'text',
      description: 'Download filename (makes link downloadable)'
    },
    target: {
      control: { type: 'select' },
      options: ['_self', '_blank', '_parent', '_top'],
      description: 'Link target attribute'
    },
    rel: {
      control: 'text',
      description: 'Link rel attribute'
    }
  },
  args: { 
    onClick: fn(),
    text: 'Link Button',
    href: '#',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    fullWidth: false,
    loading: false,
    external: false,
    target: '_self'
  },
};

// Primary Link Button Stories
export const Primary = {
  args: {
    text: 'Primary Link',
    variant: 'primary',
    href: 'https://example.com'
  },
};

export const PrimaryHover = {
  args: {
    text: 'Primary Link Hover',
    variant: 'primary',
    href: 'https://example.com'
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const PrimaryPressed = {
  args: {
    text: 'Primary Link Pressed',
    variant: 'primary',
    href: 'https://example.com'
  },
  parameters: {
    pseudo: { active: true }
  }
};

export const PrimaryDisabled = {
  args: {
    text: 'Primary Link Disabled',
    variant: 'primary',
    href: 'https://example.com',
    disabled: true,
  },
};

// Accent Link Button Stories
export const Accent = {
  args: {
    text: 'Accent Link',
    variant: 'accent',
    href: 'https://example.com'
  },
};

export const AccentHover = {
  args: {
    text: 'Accent Link Hover',
    variant: 'accent',
    href: 'https://example.com'
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const AccentPressed = {
  args: {
    text: 'Accent Link Pressed',
    variant: 'accent',
    href: 'https://example.com'
  },
  parameters: {
    pseudo: { active: true }
  }
};

export const AccentDisabled = {
  args: {
    text: 'Accent Link Disabled',
    variant: 'accent',
    href: 'https://example.com',
    disabled: true,
  },
};

// Secondary Link Button Stories
export const Secondary = {
  args: {
    text: 'Secondary Link',
    variant: 'secondary',
    href: 'https://example.com'
  },
};

export const SecondaryHover = {
  args: {
    text: 'Secondary Link Hover',
    variant: 'secondary',
    href: 'https://example.com'
  },
  parameters: {
    pseudo: { hover: true }
  }
};

export const SecondaryPressed = {
  args: {
    text: 'Secondary Link Pressed',
    variant: 'secondary',
    href: 'https://example.com'
  },
  parameters: {
    pseudo: { active: true }
  }
};

export const SecondaryDisabled = {
  args: {
    text: 'Secondary Link Disabled',
    variant: 'secondary',
    href: 'https://example.com',
    disabled: true,
  },
};

// Size Variations
export const SmallLinkButton = {
  args: {
    text: 'Small Link',
    variant: 'primary',
    size: 'small',
    href: 'https://example.com'
  },
};

export const MediumLinkButton = {
  args: {
    text: 'Medium Link',
    variant: 'primary',
    size: 'medium',
    href: 'https://example.com'
  },
};

export const LargeLinkButton = {
  args: {
    text: 'Large Link',
    variant: 'primary',
    size: 'large',
    href: 'https://example.com'
  },
};

// Special Link Types
export const ExternalLink = {
  args: {
    text: 'External Link',
    variant: 'primary',
    href: 'https://external-site.com',
    external: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'External link that opens in a new tab with proper security attributes.'
      }
    }
  }
};

export const DownloadLink = {
  args: {
    text: 'Download File',
    variant: 'accent',
    href: '/path/to/file.pdf',
    download: 'document.pdf',
  },
  parameters: {
    docs: {
      description: {
        story: 'Download link that triggers file download.'
      }
    }
  }
};

export const FullWidthLinkButton = {
  args: {
    text: 'Full Width Link',
    variant: 'primary',
    href: 'https://example.com',
    fullWidth: true,
  },
};

export const LoadingLinkButton = {
  args: {
    text: 'Loading Link',
    variant: 'primary',
    href: 'https://example.com',
    loading: true,
  },
};

// All Variants Showcase
export const AllVariants = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${createLinkButton({ text: 'Primary Link', variant: 'primary', href: 'https://example.com' })}
      ${createLinkButton({ text: 'Accent Link', variant: 'accent', href: 'https://example.com' })}
      ${createLinkButton({ text: 'Secondary Link', variant: 'secondary', href: 'https://example.com' })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All link button variants displayed together for comparison.'
      }
    }
  }
};

// All Sizes Showcase
export const AllSizes = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      ${createLinkButton({ text: 'Small Link', variant: 'primary', size: 'small', href: 'https://example.com' })}
      ${createLinkButton({ text: 'Medium Link', variant: 'primary', size: 'medium', href: 'https://example.com' })}
      ${createLinkButton({ text: 'Large Link', variant: 'primary', size: 'large', href: 'https://example.com' })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All link button sizes displayed together for comparison.'
      }
    }
  }
};

// Link Types Showcase
export const LinkTypes = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${createLinkButton({ text: 'Internal Link', variant: 'primary', href: '/internal-page' })}
      ${createLinkButton({ text: 'External Link', variant: 'accent', href: 'https://external-site.com', external: true })}
      ${createLinkButton({ text: 'Download Link', variant: 'secondary', href: '/file.pdf', download: 'document.pdf' })}
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Different types of links: internal, external, and download.'
      }
    }
  }
};