

/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/web-components-vite",
    "options": {}
  },
  "core": {
    "disableTelemetry": true
  },
  "viteFinal": async (config) => {
    // Ensure proper handling of JS modules
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = config.optimizeDeps.include || [];
    config.optimizeDeps.include.push('lit');
    
    // Ensure CSS files are properly handled
    config.css = config.css || {};
    config.css.preprocessorOptions = config.css.preprocessorOptions || {};
    
    return config;
  }
};
export default config;
