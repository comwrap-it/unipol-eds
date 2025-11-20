
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  
  // Serve parent directories as static files for CSS loading
  "staticDirs": [
    { from: '../../styles', to: '/styles' },
    { from: '../../blocks', to: '/blocks' }
  ],
  "viteFinal": async (config) => {
    // Configure Vite aliases (same as vite.config.js in storybook folder)
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@blocks': path.resolve(__dirname, '../../blocks'),
      '@scripts': path.resolve(__dirname, '../../scripts'),
      '@styles': path.resolve(__dirname, '../../styles'),
      // Intercetta le importazioni AEM e reindirizzale ai mock per Storybook
      '../../scripts/aem.js': path.resolve(__dirname, '../src/eds-components/aem-mock.js'),
      '../scripts/aem.js': path.resolve(__dirname, '../src/eds-components/aem-mock.js'),
      '../../scripts/scripts.js': path.resolve(__dirname, '../src/eds-components/scripts-mock.js'),
      '../scripts/scripts.js': path.resolve(__dirname, '../src/eds-components/scripts-mock.js'),
    };
    
    // Allow Vite dev server to read files outside storybook folder
    config.server = config.server || {};
    config.server.fs = config.server.fs || {};
    config.server.fs.allow = [
      ...(config.server.fs.allow || []),
      path.resolve(__dirname, '../../'),
    ];
    
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
