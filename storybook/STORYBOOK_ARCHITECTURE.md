# Storybook Architecture for EDS Components

## Overview

This Storybook instance documents and tests the Unipol EDS (Edge Delivery Services) component library, organized using Atomic Design principles: **Atoms → Molecules → Organisms → Complete Blocks**.

## Directory Structure

```
storybook/
├── .storybook/
│   ├── main.js              # Storybook configuration
│   ├── preview.js           # Global preview settings
│   └── preview-head.html    # CSS loading (CRITICAL - see below)
├── src/
│   ├── stories/
│   │   ├── atoms/           # Atomic component stories
│   │   ├── molecules/       # Molecular component stories (future)
│   │   └── organisms/       # Organism component stories (future)
│   ├── eds-components/
│   │   ├── aem-mock.js      # Mock AEM functions for Storybook
│   │   └── scripts-mock.js  # Mock scripts for Storybook
│   └── styles/
│       └── storybook-globals.css  # Storybook-specific overrides
└── vite.config.js           # Vite aliases (NOT used by Storybook directly)
```

## CSS Loading Architecture

### Why This Approach?

**Problem:** Vite transforms JavaScript-imported CSS into JS modules (`export default "/@fs/..."`), which breaks CSS loading in Storybook.

**Solution:** Load ALL CSS as static HTML `<link>` tags in `preview-head.html` instead of importing them in JavaScript.

### How It Works

1. **`main.js` → `staticDirs`**: Serves parent directories as static files
   ```javascript
   staticDirs: [
     { from: '../../styles', to: '/styles' },
     { from: '../../blocks', to: '/blocks' }
   ]
   ```

2. **`preview-head.html`**: Loads CSS with standard HTML `<link>` tags
   ```html
   <link rel="stylesheet" href="/styles/index.css">
   <link rel="stylesheet" href="/blocks/atoms/buttons/standard-button/standard-button.css">
   ```

3. **Stories (`.stories.js`)**: Import ONLY JavaScript, NO CSS
   ```javascript
   // ✅ Good - import JS
   import { createButton } from '@blocks/atoms/buttons/standard-button/standard-button.js';
   
   // ❌ Bad - do NOT import CSS (add it to preview-head.html instead)
   // import '@blocks/atoms/buttons/standard-button/standard-button.css';
   ```

### Adding a New Component

When creating a new component story:

1. **Write the story** in `src/stories/{level}/{component}.stories.js`
2. **Import only JS** using the `@blocks` alias
3. **Add CSS to `preview-head.html`** in the appropriate section:
   ```html
   <!-- ========== MOLECULES ========== -->
   <link rel="stylesheet" href="/blocks/molecules/my-component/my-component.css">
   ```

## Vite Aliases

Aliases are configured in `main.js` → `viteFinal` (NOT `vite.config.js`):

- `@blocks` → `../../blocks` (EDS components)
- `@scripts` → `../../scripts` (EDS scripts)
- `@styles` → `../../styles` (Design tokens)

**IMPORTANT:** Aliases work for JavaScript imports ONLY, not for CSS imports.

## Component Story Pattern

### Standard Story Structure

```javascript
import { html } from 'lit';
import { createMyComponent, MY_COMPONENT_CONSTANTS } from '@blocks/atoms/my-component/my-component.js';
// CSS is loaded globally in preview-head.html

export default {
  title: 'Atoms/My Component',
  tags: ['autodocs'],
  render: (args) => {
    const element = createMyComponent(args.prop1, args.prop2);
    return html`${element}`;
  },
  argTypes: {
    prop1: { control: 'text', description: 'Description of prop1' },
    prop2: { control: { type: 'select' }, options: ['option1', 'option2'] },
  },
  args: {
    prop1: 'default value',
    prop2: 'option1',
  },
};

export const Default = {
  args: {
    prop1: 'Example',
  },
};
```

### Best Practices

1. **Use EDS component factory functions** (`createButton`, `createOption`, etc.)
2. **Return `lit-html` templates** from render functions
3. **Document all props** with `argTypes`
4. **Provide meaningful defaults** in `args`
5. **Create multiple stories** for different states/variants
6. **Use `autodocs` tag** for automatic documentation generation

## Atomic Design Hierarchy

### Atoms (Smallest building blocks)
- Buttons (`standard-button`, `icon-button`, `link-button`)
- Inputs (`textfield`, `textarea`)
- Form elements (`checkbox`, `option`)
- Content elements (`tag`, `category-chip`)

**CSS Loading:** Each atom's CSS is loaded individually in `preview-head.html`.

### Molecules (Combinations of atoms)
- Will be composed of multiple atoms
- Example: `button-group`, `search-bar`, `card-header`

**CSS Loading:** Molecule CSS should be added to `preview-head.html` under the `MOLECULES` section. Atom CSS dependencies are already loaded.

### Organisms (Combinations of molecules and atoms)
- Complex components like `header`, `footer`, `hero`
- May include multiple molecules and atoms

**CSS Loading:** Organism CSS should be added to `preview-head.html` under the `ORGANISMS` section. All dependencies are already loaded.

## Scalability Considerations

### Current Approach: Manual CSS Management
**Pros:**
- Full control over load order
- No build complexity
- Easy to debug
- Works reliably with Vite/Storybook

**Cons:**
- Must manually add CSS for each new component
- Could forget to add CSS when creating stories

### Future Automation (if needed)
If the component library grows significantly (50+ components), consider:
1. **Auto-generate `preview-head.html`** with a Node script that scans `blocks/` directory
2. **Use a JSON manifest** to define component CSS dependencies
3. **Create a CLI tool** to scaffold new component stories with CSS registration

For now, the manual approach is sufficient and maintainable.

## Troubleshooting

### Problem: Component has no styles
**Solution:** Check if CSS is added to `preview-head.html`

### Problem: Import error for `@blocks`
**Solution:** Verify aliases are configured in `main.js` → `viteFinal`

### Problem: CSS transformed to JS module
**Solution:** Remove any `import './file.css'` from JavaScript files and add to `preview-head.html`

### Problem: 404 on CSS file
**Solution:** Check that `staticDirs` in `main.js` correctly maps the parent directory

## Testing Workflow

1. **Start Storybook:** `npm run storybook`
2. **Navigate to your story** in the sidebar
3. **Use Controls panel** to test different props
4. **Check Accessibility** with a11y addon
5. **Verify responsive behavior** with viewport addon
6. **Generate docs** automatically with `autodocs` tag

## Maintenance Checklist

When adding a new component:
- [ ] Create the component in `blocks/{level}/{component}/`
- [ ] Create the story in `storybook/src/stories/{level}/`
- [ ] Add CSS to `preview-head.html` in the correct section
- [ ] Import JS using `@blocks` alias (NO CSS imports)
- [ ] Test in Storybook
- [ ] Verify styles load correctly (check Network tab)
- [ ] Document props with `argTypes`
- [ ] Add multiple story variants for different states

---

**Last Updated:** November 2025
**Maintainer:** EDS Component Team

