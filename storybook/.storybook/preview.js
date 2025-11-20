/**
 * Storybook Preview Configuration
 * 
 * IMPORTANT: All CSS is loaded via preview-head.html as static <link> tags.
 * Do NOT import CSS files here - Vite will transform them into JS modules.
 */

/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
    // Controls addon configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // Accessibility addon configuration
    a11y: {
      test: 'todo', // Show a11y violations in UI only (don't fail builds)
    },

    // Story organization and sorting
    options: {
      storySort: {
        order: [
          'Atoms',
          ['Buttons', 'Inputs', 'Form Elements', 'Content Elements'],
          'Molecules',
          'Organisms',
          'Blocks',
        ],
      },
    },

    // Default layout for stories
    layout: 'padded',

    // Background options for testing components
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gray', value: '#f5f5f5' },
      ],
    },
  },
};

export default preview;
