# Header Unipol Integration in AEM EDS Nav Fragment

## Overview

This document explains how to integrate the **Header Unipol** component into the AEM EDS navigation fragment so it appears on all pages of the site.

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│ Header Block (blocks/header/header.js)  │
│                                         │
│ 1. Loads /nav fragment                 │
│ 2. Checks for header-unipol block      │
│ 3. If found → Use header-unipol         │
│    If not → Use default nav structure   │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Nav Fragment (/nav)                    │
│                                         │
│ Contains:                               │
│ - header-unipol block (optional)       │
│ - OR default nav structure             │
└─────────────────────────────────────────┘
```

### Flow

1. **Page Load**: AEM EDS loads the header block
2. **Fragment Loading**: Header block loads `/nav` fragment
3. **Block Detection**: Checks if fragment contains `header-unipol` block
4. **Decoration**: If found, uses `header-unipol`; otherwise uses default nav
5. **Display**: Header appears on all pages

## Setup Instructions

### Step 1: Create Nav Fragment in AEM

1. Navigate to AEM EDS Universal Editor
2. Go to `/nav` page (or create it if it doesn't exist)
3. Add a **Section** to the page
4. Inside the section, add a **Block** with class `header-unipol`

### Step 2: Configure Header Unipol Block

Inside the `header-unipol` block, add:

**Row 1**: Logo Image
- Upload or reference the Unipol logo

**Row 2+**: Navigation Items
- Each row becomes a navigation pill
- Format: `Label | Link URL | Variant (optional)`

**Example Structure**:
```
┌─────────────────────────────┐
│ header-unipol              │
├─────────────────────────────┤
│ [Logo Image]                │
│ Home | / | primary          │
│ Products | /products | primary │
│ Services | /services | primary │
│ Login | /login | secondary  │
└─────────────────────────────┘
```

### Step 3: Verify Metadata

Ensure the page metadata includes:

```html
<meta name="nav" content="/nav">
```

Or in AEM EDS metadata:
- **Key**: `nav`
- **Value**: `/nav` (or your nav fragment path)

## Code Changes

### Modified Files

#### 1. `blocks/header/header.js`

**Changes**:
- Added detection for `header-unipol` block in fragment
- If found, uses `header-unipol` directly
- Falls back to default nav structure if not found

**Key Code**:
```javascript
// Check if fragment contains header-unipol block
const headerUnipolBlock = fragment.querySelector('.header-unipol');

if (headerUnipolBlock) {
  // Use header-unipol component directly
  await loadBlock(headerUnipolBlock);
  
  // Create wrapper and append
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(headerUnipolBlock);
  block.append(navWrapper);
  
  return; // Skip default nav structure
}
```

#### 2. `blocks/header/header.css`

**Changes**:
- Added styles for `header-unipol` inside `nav-wrapper`
- Overrides sticky positioning (nav-wrapper is already fixed)
- Maintains responsive behavior

**Key Code**:
```css
/* header-unipol integration */
header .nav-wrapper .header-unipol {
  width: 100%;
  position: relative;
  /* Override sticky positioning when inside nav-wrapper */
  position: static;
}

header .nav-wrapper .header-unipol .header-unipol-container {
  max-width: 1440px;
  margin: 0 auto;
}
```

## Fragment Structure

### Option 1: Header Unipol Only

```
/nav
└── Section
    └── header-unipol block
        ├── Logo
        ├── Navigation Pill 1
        ├── Navigation Pill 2
        └── ...
```

### Option 2: Mixed (Header Unipol + Default Nav)

**Not Recommended**: The current implementation uses either `header-unipol` OR default nav, not both.

If you need both, you would need to modify `header.js` to combine them.

## Universal Editor Configuration

### Block Setup

1. **Create Block**: Add block with class `header-unipol`
2. **Configure Logo**: First row should contain logo image
3. **Add Navigation**: Each subsequent row becomes a navigation pill

### Navigation Pill Configuration

Each navigation row can contain:
- **Label**: Text for the pill
- **Link**: URL the pill points to
- **Variant**: `primary` or `secondary` (optional)

## Testing

### Manual Testing

1. **Create Nav Fragment**:
   ```
   /nav
   └── Section
       └── header-unipol
           ├── Logo
           ├── Home | / | primary
           └── Login | /login | secondary
   ```

2. **Verify Metadata**:
   - Check page metadata has `nav: /nav`

3. **Load Page**:
   - Navigate to any page
   - Header should show `header-unipol` component

4. **Check Console**:
   - No errors should appear
   - Header should render correctly

### Expected Behavior

✅ **With Header Unipol**:
- Header shows logo on left
- Navigation pills on right
- Responsive design works
- Sticky positioning (via nav-wrapper)

✅ **Without Header Unipol**:
- Falls back to default AEM EDS nav
- Hamburger menu on mobile
- Dropdown menus on desktop

## Troubleshooting

### Header Unipol Not Showing

**Problem**: Default nav appears instead of header-unipol

**Solutions**:
1. **Check Fragment Path**:
   ```javascript
   // Verify metadata
   const navMeta = getMetadata('nav');
   console.log('Nav path:', navMeta);
   ```

2. **Check Block Class**:
   ```html
   <!-- In /nav fragment -->
   <div class="header-unipol block">
     <!-- content -->
   </div>
   ```

3. **Verify Block Decoration**:
   - Open DevTools
   - Check if `.header-unipol` exists in fragment
   - Check if it has class `block` and `header-unipol`

4. **Check Console Errors**:
   - Look for JavaScript errors
   - Verify `header-unipol.js` loads correctly

### Styling Issues

**Problem**: Header Unipol doesn't look right

**Solutions**:
1. **Check CSS Loading**:
   - Verify `header-unipol.css` is loaded
   - Check `header.css` for integration styles

2. **Position Conflicts**:
   - `nav-wrapper` has `position: fixed`
   - `header-unipol` has `position: sticky` (overridden to `static`)

3. **Width Issues**:
   - `header-unipol-container` has `max-width: 1440px`
   - Should center within `nav-wrapper`

### Navigation Pills Not Working

**Problem**: Pills don't render or don't link correctly

**Solutions**:
1. **Check Navigation Pill Block**:
   - Verify `navigation-pill` atom is loaded
   - Check `navigation-pill.css` is included

2. **Verify Row Structure**:
   ```
   Row 1: Logo
   Row 2: Navigation Pill 1
   Row 3: Navigation Pill 2
   ...
   ```

3. **Check Link Format**:
   - Links should be absolute (`/page`) or relative
   - Verify href attributes are set

## Best Practices

### 1. Fragment Organization

✅ **DO**:
- Keep nav fragment simple
- Use `header-unipol` for main navigation
- Use default nav for complex dropdowns (if needed)

❌ **DON'T**:
- Mix `header-unipol` and default nav in same fragment
- Duplicate navigation items

### 2. Logo Management

✅ **DO**:
- Use optimized images (SVG preferred)
- Provide alt text
- Use appropriate dimensions

❌ **DON'T**:
- Use very large images
- Use decorative images without alt

### 3. Navigation Items

✅ **DO**:
- Limit to 5-7 primary items
- Use clear, concise labels
- Group related items logically

❌ **DON'T**:
- Overcrowd with too many items
- Use ambiguous labels
- Nest complex dropdowns (not supported in pills)

## Migration Guide

### From Default Nav to Header Unipol

1. **Create Nav Fragment**:
   - Go to `/nav` in AEM
   - Add `header-unipol` block

2. **Configure Navigation**:
   - Add logo
   - Add navigation pills

3. **Test**:
   - Verify header appears on all pages
   - Check responsive behavior
   - Test navigation links

4. **Deploy**:
   - Push changes to production
   - Monitor for issues

### Rollback

If you need to revert to default nav:

1. **Remove Header Unipol**:
   - Delete `header-unipol` block from `/nav` fragment
   - Or comment out detection code in `header.js`

2. **Restore Default Nav**:
   - Default nav structure will automatically be used

## Performance Considerations

### Loading

- **Fragment Load**: `/nav` fragment loads once per page
- **Block Decoration**: `header-unipol` decorates after fragment loads
- **CSS**: Both `header.css` and `header-unipol.css` load

### Optimization

- **Fragment Caching**: AEM EDS caches fragments
- **CSS**: Minify and combine CSS files
- **Images**: Optimize logo image

## Related Documentation

- [Header Unipol README](../header-unipol/README.md)
- [Navigation Pill README](../atoms/navigation-pill/README.md)
- [AEM EDS Fragment Documentation](https://www.aem.live/developer/block-collection/fragment)

## Summary

✅ **Integration Complete**:
- `header.js` detects `header-unipol` in nav fragment
- Uses `header-unipol` if found, otherwise defaults to standard nav
- CSS supports both scenarios
- Works on all pages via fragment

✅ **Next Steps**:
1. Create `/nav` fragment in AEM
2. Add `header-unipol` block
3. Configure logo and navigation pills
4. Test on all pages

---

**Last Updated**: November 21, 2024  
**Status**: ✅ Ready for Production  
**Integration**: Header Unipol ↔ AEM EDS Nav Fragment

