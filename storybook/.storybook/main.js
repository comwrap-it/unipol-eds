import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.mdx',
  ],
  
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  
  core: {
    disableTelemetry: true,
  },
  
  // Serve parent EDS directories as static files
  // This allows preview-head.html to load CSS via <link> tags
  staticDirs: [
    { from: '../../styles', to: '/styles' },  // Design tokens, fonts, icons
    { from: '../../blocks', to: '/blocks' },  // Component CSS
  ],
  
  viteFinal: async (config) => {
    // Configure Vite aliases for JavaScript imports
    // NOTE: These aliases work ONLY for JS imports, NOT for CSS imports
    // CSS must be loaded via preview-head.html
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // EDS component paths
      '@blocks': path.resolve(__dirname, '../../blocks'),
      '@scripts': path.resolve(__dirname, '../../scripts'),
      '@styles': path.resolve(__dirname, '../../styles'),
      
      // Mock AEM/EDS scripts for Storybook environment
      '../../scripts/aem.js': path.resolve(__dirname, '../src/eds-components/aem-mock.js'),
      '../scripts/aem.js': path.resolve(__dirname, '../src/eds-components/aem-mock.js'),
      '../../scripts/scripts.js': path.resolve(__dirname, '../src/eds-components/scripts-mock.js'),
      '../scripts/scripts.js': path.resolve(__dirname, '../src/eds-components/scripts-mock.js'),
    };
    
    // Allow Vite dev server to read files outside storybook/ directory
    config.server = config.server || {};
    config.server.fs = config.server.fs || {};
    config.server.fs.allow = [
      ...(config.server.fs.allow || []),
      path.resolve(__dirname, '../../'),
    ];
    
    // Optimize dependencies for faster dev server startup
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = config.optimizeDeps.include || [];
    config.optimizeDeps.include.push('lit');
    
    return config;
  },
};

export default config;
