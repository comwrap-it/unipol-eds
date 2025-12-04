module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  ignorePatterns: [
    'static/**',
    'storybook/**',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce LF for repo consistency (see .gitattributes)
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    'xwalk/max-cells': ['warn', { '*': 60 }],
    'xwalk/no-orphan-collapsible-fields': 'error',
  },
};
