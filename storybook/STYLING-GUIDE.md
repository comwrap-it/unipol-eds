# Styling Guide - Storybook EDS

## 📋 Overview

This guide explains how CSS styles are loaded and managed in the Storybook environment for EDS (Edge Delivery Services) components.

## 🎨 Global Styles

All EDS design tokens, fonts, and base styles are automatically loaded through the `storybook-globals.css` file, which is imported in `.storybook/preview.js`.

### What's Included Globally:

1. **Design Tokens** (`styles/index.css`)
   - Colors
   - Typography (font families, sizes, weights)
   - Spacing (dimensions, sizes)
   - Border radius & width
   - Shadows & gradients
   - Blur effects

2. **Fonts** (`styles/fonts.css`)
   - All custom fonts used in the project

3. **Icons** (`styles/icons.css`)
   - Icon definitions and utilities

4. **Base Styles** (`styles/styles.css`)
   - Global resets and utilities

## 🧩 Component Styles

Each story imports its specific component CSS using the `@blocks` alias:

```javascript
import { createButton } from '@blocks/atoms/buttons/standard-button/standard-button.js';
import '@blocks/atoms/buttons/standard-button/standard-button.css';
```

### How It Works:

1. **Vite Aliases**: The `vite.config.js` defines `@blocks` pointing to `../blocks`
2. **Auto-loading**: Vite automatically processes and injects the CSS
3. **CSS Isolation**: Each component's styles are scoped appropriately

## 🔧 Configuration Files

### `.storybook/preview.js`
- Imports global styles
- Defines decorators for story layout
- Sets up theme and background options

### `vite.config.js`
- Configures path aliases (`@blocks`, `@styles`, `@scripts`)
- Sets up CSS preprocessing
- Handles asset includes

### `.storybook/main.js`
- Configures Storybook addons
- Sets up Vite integration
- Ensures proper module optimization

## 🎯 Best Practices

### ✅ DO:

1. **Always import component CSS** in your story file:
   ```javascript
   import '@blocks/your-component/your-component.css';
   ```

2. **Use design tokens** from global styles:
   ```css
   .my-component {
     color: var(--color-text-primary);
     padding: var(--space-200);
   }
   ```

3. **Import dependent styles** if your component uses other atoms:
   ```javascript
   import '@blocks/atoms/buttons/standard-button/standard-button.css';
   import '@blocks/atoms/checkbox/standard-checkbox/checkbox.css';
   ```

### ❌ DON'T:

1. **Don't duplicate global styles** in component files
2. **Don't use absolute paths** - use `@blocks` alias instead
3. **Don't inline critical CSS** that should be in the component's CSS file

## 📱 Responsive Design

All responsive breakpoints and media queries are included in the global styles:

- **Mobile**: `styles/mobile/`
- **Tablet Portrait**: `styles/tablet-portrait/`
- **Tablet**: `styles/tablet/`
- **Desktop**: Default

## 🌗 Themes

The Storybook provides background options for testing components:
- Light (default)
- Dark
- Gray

Dark mode styles are automatically included from `styles/dark/color.css`.

## 🔍 Debugging Styles

### Check if global styles are loaded:
```javascript
// In browser console:
getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500');
```

### Check if component CSS is loaded:
```javascript
// Check for specific CSS class in stylesheets
[...document.styleSheets].some(sheet => {
  try {
    return [...sheet.cssRules].some(rule => 
      rule.selectorText && rule.selectorText.includes('.your-component')
    );
  } catch(e) { return false; }
});
```

### Common Issues:

1. **Styles not appearing**:
   - Check console for CSS loading errors
   - Verify the CSS import path is correct
   - Ensure `@blocks` alias is resolving properly

2. **Design tokens not working**:
   - Check if `storybook-globals.css` is imported in `preview.js`
   - Verify the CSS variable name in `styles/base/` files

3. **Icons not showing**:
   - Ensure `styles/icons.css` is loaded
   - Check if icon class names match the definitions

## 🚀 Adding New Styles

### For a new component:

1. Create the component CSS file in `blocks/`
2. Import it in your story:
   ```javascript
   import '@blocks/your-component/your-component.css';
   ```

### For new global tokens:

1. Add to appropriate file in `styles/base/`
2. The tokens will be automatically available in all stories

## 📚 Resources

- [EDS Styling Documentation](../styles/README.md)
- [Storybook CSS Documentation](https://storybook.js.org/docs/configure/styling-and-css)
- [Design Tokens Specification](../styles/cssTokens/README.md)

---

*Last updated: January 2025*

