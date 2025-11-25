import { html } from 'lit';
import { createUnipolHeader } from '@blocks/unipol-header/unipol-header.js';
import { NAVIGATION_PILL_VARIANTS } from '@blocks/atoms/navigation-pill/navigation-pill.js';

export default {
  title: 'Organisms/Unipol Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Unipol Header

Main navigation header component for the Unipol website. Combines a logo with navigation pills for primary site navigation.

## Features

- **Responsive Design**: Adapts from mobile to desktop
- **Sticky Navigation**: Stays at top of viewport
- **Flexible Pills**: Supports multiple navigation items
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Universal Editor**: Integrated with AEM EDS

## Structure

\`\`\`
Unipol Header (Organism)
├── Logo (Image)
└── Navigation Pills (Atoms)
    ├── Navigation Pill 1
    ├── Navigation Pill 2
    └── Navigation Pill N...
\`\`\`

## Usage in AEM EDS

The header expects:
- **Row 1**: Logo image
- **Row 2+**: Navigation pill configurations (label, link, variant)

## CSS Variables

Uses design tokens from the Unipol design system.
        `,
      },
    },
  },
  argTypes: {
    logoUrl: {
      control: 'text',
      description: 'URL or path to the logo image',
      table: { category: 'Logo' },
    },
    navItems: {
      control: 'object',
      description: 'Array of navigation pill configurations',
      table: { category: 'Navigation' },
    },
  },
};

// Default navigation items
const defaultNavItems = [
  {
    label: 'Navigation Pill',
    href: '#',
    variant: NAVIGATION_PILL_VARIANTS.PRIMARY,
  },
  {
    label: 'Navigation Pill',
    href: '#',
    variant: NAVIGATION_PILL_VARIANTS.PRIMARY,
  },
  {
    label: 'Navigation Pill',
    href: '#',
    variant: NAVIGATION_PILL_VARIANTS.PRIMARY,
  },
  {
    label: 'Navigation Pill',
    href: '#',
    variant: NAVIGATION_PILL_VARIANTS.SECONDARY,
  },
];

// Template
const Template = (args) => {
  const element = createUnipolHeader(
    args.logoUrl,
    args.navItems,
  );
  return html`${element}`;
};

/**
 * Default header with logo and navigation pills
 */
export const Default = Template.bind({});
Default.args = {
  logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIGZpbGw9IiMwMDFDMzUiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VU5JUE9MPC90ZXh0Pjwvc3ZnPg==',
  navItems: defaultNavItems,
};

/**
 * Header with many navigation items
 */
export const WithManyItems = Template.bind({});
WithManyItems.args = {
  logoUrl: Default.args.logoUrl,
  navItems: [
    { label: 'Home', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'Products', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'Services', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'About Us', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'Contact', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'Support', href: '#', variant: NAVIGATION_PILL_VARIANTS.SECONDARY },
    { label: 'Login', href: '#', variant: NAVIGATION_PILL_VARIANTS.SECONDARY },
  ],
};

/**
 * Header with mixed variants
 */
export const MixedVariants = Template.bind({});
MixedVariants.args = {
  logoUrl: Default.args.logoUrl,
  navItems: [
    { label: 'Home', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'Products', href: '#', variant: NAVIGATION_PILL_VARIANTS.SECONDARY },
    { label: 'Services', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'Login', href: '#', variant: NAVIGATION_PILL_VARIANTS.SECONDARY },
  ],
};

/**
 * Header with navigation pills with icons
 */
export const WithIcons = Template.bind({});
WithIcons.args = {
  logoUrl: Default.args.logoUrl,
  navItems: [
    {
      label: 'Search',
      href: '#',
      variant: NAVIGATION_PILL_VARIANTS.PRIMARY,
      leftIcon: 'search-icon',
    },
    {
      label: 'Products',
      href: '#',
      variant: NAVIGATION_PILL_VARIANTS.PRIMARY,
      rightIcon: 'chevron-right-icon',
    },
    {
      label: 'Menu',
      href: '#',
      variant: NAVIGATION_PILL_VARIANTS.SECONDARY,
      rightIcon: 'dropdown-icon',
    },
  ],
};

/**
 * Minimal header with few items
 */
export const Minimal = Template.bind({});
Minimal.args = {
  logoUrl: Default.args.logoUrl,
  navItems: [
    { label: 'Home', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'Login', href: '#', variant: NAVIGATION_PILL_VARIANTS.SECONDARY },
  ],
};

/**
 * Header with only logo (no navigation)
 */
export const LogoOnly = Template.bind({});
LogoOnly.args = {
  logoUrl: Default.args.logoUrl,
  navItems: [],
};

/**
 * Header with long labels
 */
export const LongLabels = Template.bind({});
LongLabels.args = {
  logoUrl: Default.args.logoUrl,
  navItems: [
    { label: 'Insurance Products', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'Customer Support', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
    { label: 'My Account Dashboard', href: '#', variant: NAVIGATION_PILL_VARIANTS.SECONDARY },
  ],
};

/**
 * Mobile view preview (resize viewport to see mobile behavior)
 */
export const MobilePreview = Template.bind({});
MobilePreview.args = Default.args;
MobilePreview.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
  docs: {
    description: {
      story: 'View at mobile viewport size. Note: Some pills hide on mobile to prevent overflow.',
    },
  },
};

/**
 * Tablet view preview
 */
export const TabletPreview = Template.bind({});
TabletPreview.args = Default.args;
TabletPreview.parameters = {
  viewport: {
    defaultViewport: 'tablet',
  },
};

/**
 * Desktop view preview
 */
export const DesktopPreview = Template.bind({});
DesktopPreview.args = WithManyItems.args;
DesktopPreview.parameters = {
  viewport: {
    defaultViewport: 'desktop',
  },
};

/**
 * Interactive playground - customize all properties
 */
export const Playground = Template.bind({});
Playground.args = {
  logoUrl: Default.args.logoUrl,
  navItems: [
    {
      label: 'Home',
      href: '#home',
      variant: NAVIGATION_PILL_VARIANTS.PRIMARY,
      leftIcon: '',
      rightIcon: '',
    },
    {
      label: 'Products',
      href: '#products',
      variant: NAVIGATION_PILL_VARIANTS.PRIMARY,
      leftIcon: '',
      rightIcon: 'chevron-right-icon',
    },
    {
      label: 'Services',
      href: '#services',
      variant: NAVIGATION_PILL_VARIANTS.PRIMARY,
      leftIcon: '',
      rightIcon: '',
    },
    {
      label: 'Contact',
      href: '#contact',
      variant: NAVIGATION_PILL_VARIANTS.SECONDARY,
      leftIcon: 'phone-icon',
      rightIcon: '',
    },
  ],
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Customize the header with your own logo URL and navigation items. Edit the controls below to see changes in real-time.',
    },
  },
};

