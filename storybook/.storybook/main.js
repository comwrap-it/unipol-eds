import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeViteAlias(alias) {
  if (!alias) return [];
  if (Array.isArray(alias)) return [...alias];
  return Object.entries(alias).map(([find, replacement]) => ({ find, replacement }));
}

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
    { from: '../../styles', to: '/styles' },  // Design tokens and CSS
    { from: '../../blocks', to: '/blocks' },  // Component CSS
    { from: '../../fonts', to: '/fonts' },    // Font files (TTF)
    { from: '../../icons', to: '/icons' },    // Icon files (SVG/PNG)
  ],
  
  viteFinal: async (config) => {
    const aemMock = path.resolve(__dirname, '../src/eds-components/aem-mock.js');
    const scriptsMock = path.resolve(__dirname, '../src/eds-components/scripts-mock.js');

    // Configure Vite aliases for JavaScript imports
    // NOTE: These aliases work ONLY for JS imports, NOT for CSS imports
    // CSS must be loaded via preview-head.html
    config.resolve = config.resolve || {};
    const alias = normalizeViteAlias(config.resolve.alias);
    alias.push(
      // EDS component paths
      { find: '@blocks', replacement: path.resolve(__dirname, '../../blocks') },
      { find: '@scripts', replacement: path.resolve(__dirname, '../../scripts') },
      { find: '@styles', replacement: path.resolve(__dirname, '../../styles') },
      { find: '@unipol-ds', replacement: path.resolve(__dirname, '../../scripts/libs/ds') },

      /**
       * Mock AEM/EDS scripts for Storybook environment.
       * Match any relative depth: ../scripts/aem.js, ../../scripts/aem.js, ../../../scripts/aem.js, ...
       */
      { find: /^(\.\.\/)+scripts\/aem\.js$/, replacement: aemMock },
      { find: /^(\.\.\/)+scripts\/scripts\.js$/, replacement: scriptsMock },
    );
    config.resolve.alias = alias;

    // Avoid loading multiple copies of Lit when importing code outside storybook/
    const dedupe = Array.isArray(config.resolve.dedupe) ? config.resolve.dedupe : [];
    config.resolve.dedupe = Array.from(new Set([...dedupe, 'lit', 'lit-html', 'lit-element']));
    
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
    if (!config.optimizeDeps.include.includes('lit')) config.optimizeDeps.include.push('lit');
    
    return config;
  },
};

export default config;
