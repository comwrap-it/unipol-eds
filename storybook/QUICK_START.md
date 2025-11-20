# Storybook Quick Start Guide

## 🚀 Getting Started

### Start Development Server
```bash
cd storybook
npm run storybook
```

### Build Static Storybook
```bash
cd storybook
npm run build-storybook
```

## ✅ Architecture Summary

### CSS Loading Strategy
**All CSS is loaded via HTML `<link>` tags in `preview-head.html`**
- ✅ Works reliably with Vite
- ✅ No JavaScript transformation
- ✅ Clear load order
- ✅ Easy to debug

### JavaScript Imports
**Use Vite aliases for all JS imports:**
```javascript
import { createButton } from '@blocks/atoms/buttons/standard-button/standard-button.js';
```

**Available aliases:**
- `@blocks` → `../../blocks`
- `@scripts` → `../../scripts`
- `@styles` → `../../styles`

## 📝 Adding a New Component

### Step-by-Step Process

1. **Create the story file:**
   ```
   storybook/src/stories/{level}/{component}.stories.js
   ```

2. **Import ONLY JavaScript (no CSS):**
   ```javascript
   import { createMyComponent } from '@blocks/{level}/{component}/{component}.js';
   // CSS imported globally in preview-head.html
   ```

3. **Add CSS to `preview-head.html`:**
   ```html
   <!-- ========== ATOMS ========== -->
   <link rel="stylesheet" href="/blocks/atoms/{component}/{component}.css">
   ```

4. **Test in Storybook:**
   - Restart Storybook if needed
   - Check Network tab to verify CSS loads
   - Test all component variants

### Example Story
```javascript
import { html } from 'lit';
import { createMyComponent, MY_CONSTANTS } from '@blocks/atoms/my-component/my-component.js';

export default {
  title: 'Atoms/My Component',
  tags: ['autodocs'],
  render: (args) => {
    const element = createMyComponent(args.prop1, args.prop2);
    return html`${element}`;
  },
  argTypes: {
    prop1: { control: 'text', description: 'Description' },
  },
  args: {
    prop1: 'default',
  },
};

export const Default = {};
export const Variant = { args: { prop1: 'variant' } };
```

## 🏗️ Scalability for Molecules/Organisms

### Adding Molecule Stories

**Molecules** compose multiple atoms:

1. **Create molecule story:**
   ```
   storybook/src/stories/molecules/{molecule}.stories.js
   ```

2. **Import all atom dependencies:**
   ```javascript
   import { createButton } from '@blocks/atoms/buttons/standard-button/standard-button.js';
   import { createInput } from '@blocks/atoms/inputs/textfield/textfield.js';
   import { createMyMolecule } from '@blocks/molecules/{molecule}/{molecule}.js';
   ```

3. **Add molecule CSS to `preview-head.html`:**
   ```html
   <!-- ========== MOLECULES ========== -->
   <link rel="stylesheet" href="/blocks/molecules/{molecule}/{molecule}.css">
   ```

**Note:** Atom CSS is already loaded, so molecules automatically inherit styles from their atomic components.

### Adding Organism Stories

**Organisms** compose molecules and atoms:

1. **Follow same pattern as molecules**
2. **Add organism CSS under `ORGANISMS` section**
3. **All dependencies (atoms + molecules) are already loaded**

## 🔧 Configuration Files

### Key Files

| File | Purpose |
|------|---------|
| `main.js` | Storybook configuration, Vite aliases, staticDirs |
| `preview.js` | Global preview settings (layout, backgrounds, a11y) |
| `preview-head.html` | **CSS loading** (most important for styles) |
| `STORYBOOK_ARCHITECTURE.md` | Full architecture documentation |

### Troubleshooting

#### Problem: Component has no styles
✅ **Check:** Is CSS added to `preview-head.html`?

#### Problem: Import error for `@blocks`
✅ **Check:** Are aliases configured in `main.js` → `viteFinal`?

#### Problem: CSS shows as `export default "/@fs/..."`
✅ **Fix:** Remove any `import './file.css'` from JS files. Add to `preview-head.html` instead.

#### Problem: 404 on CSS file
✅ **Check:** Is the `staticDirs` path correct in `main.js`?

## 📦 Project Structure

```
storybook/
├── .storybook/
│   ├── main.js                    # Main config + aliases + staticDirs
│   ├── preview.js                 # Preview settings
│   └── preview-head.html          # ⭐ CSS LOADING (CRITICAL)
├── src/
│   ├── stories/
│   │   ├── atoms/                 # Atom component stories
│   │   ├── molecules/             # Molecule component stories (future)
│   │   └── organisms/             # Organism component stories (future)
│   └── eds-components/
│       ├── aem-mock.js            # Mock AEM functions
│       └── scripts-mock.js        # Mock EDS scripts
├── STORYBOOK_ARCHITECTURE.md      # Full documentation
├── QUICK_START.md                 # This file
└── package.json
```

## 🎯 Best Practices

### DO ✅
- Use EDS component factory functions (`createButton`, `createOption`, etc.)
- Return `lit-html` templates from render functions
- Document all props with `argTypes`
- Create multiple stories for different states/variants
- Use `autodocs` tag for automatic documentation
- Add CSS to `preview-head.html` in the correct section
- Use `@blocks` alias for JS imports

### DON'T ❌
- Import CSS in JavaScript files (use `preview-head.html`)
- Forget to add new component CSS to `preview-head.html`
- Use relative paths for component imports (use `@blocks`)
- Mix lit-html with direct DOM manipulation in stories

## 📚 Further Reading

- [Storybook Web Components Documentation](https://storybook.js.org/docs/web-components/get-started/introduction)
- [lit-html Documentation](https://lit.dev/docs/libraries/standalone-templates/)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- Full project documentation: `STORYBOOK_ARCHITECTURE.md`

---

**Last Updated:** November 2025  
**Maintainer:** EDS Component Team

