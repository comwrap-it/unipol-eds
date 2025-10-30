/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    options: {
      storySort: {
        order: [
          'Atoms', 
          ['Buttons', ['Standard Button', 'Icon Button', 'Link Button']],
          'Organisms',
          ['Cards', 'Header', 'Footer', 'Hero', 'Columns', 'Fragment'],
          'Layout',
          'Components',
          'Development',
          'Example'
        ],
      },
    },
  },
};

export default preview;
