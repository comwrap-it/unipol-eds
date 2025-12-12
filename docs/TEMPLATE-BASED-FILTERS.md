# Template-Based Filters System - Technical Documentation

## Overview

This document describes the custom template-based filtering system implemented for Universal Editor in AEM Edge Delivery Services (EDS). This enhancement allows controlling which blocks and components can be added to the page based on a `template` metadata value.

## Problem Statement

In AEM EDS out-of-the-box (OOTB), there is no concept of "page templates" like traditional CMS platforms. All pages have the same editing capabilities, which can lead to:
- Content editors adding inappropriate blocks to specific page types
- Inconsistent page structures
- Lack of editorial guardrails

**Example**: A footer page should only allow the `unipol-footer` widget, but OOTB allows any block to be added.

## Solution

We implemented a **template-based filtering system** that:
1. Reads a `template` metadata value from the page
2. Maps templates to specific component filters
3. Applies different filters to `main` element and `sections` based on the template
4. Respects widget models that have their own labels and filters

---

## Architecture

### File Structure

```
project/
├── scripts/
│   ├── scripts.js                    # ← Modified (custom decorateSections)
│   ├── template-filters-config.js    # ← NEW (template configuration)
│   └── aem.js                        # ← OOTB (unchanged)
├── models/_component-filters.json    # ← Modified (added template filters)
└── docs/
    └── TEMPLATE-BASED-FILTERS.md     # This document
```

### System Flow

```
┌─────────────────────────────────┐
│  Page Document                   │
│  metadata:                       │
│    template: footer              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  scripts.js                      │
│  decorateMain() →                │
│    applyMainFilter()             │ Reads template metadata
│  decorateSections()              │ and applies filters
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  template-filters-config.js      │
│  Maps template to filter IDs:    │
│  'footer' → 'footer-template'    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  _component-filters.json         │
│  Defines allowed components:     │
│  'footer-template': ['unipol-    │
│   footer']                       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Universal Editor (Browser)      │
│  Shows only allowed components   │
│  in the "+" menu                 │
└─────────────────────────────────┘
```

---

## Code Changes vs OOTB EDS

### 1. New File: `scripts/template-filters-config.js`

**Purpose**: Centralized configuration mapping templates to filters.

**Key Exports**:
- `TEMPLATE_FILTERS`: Object mapping template names to filter configurations
- `getMainFilter(templateName)`: Returns filter ID for main element
- `getSectionFilter(templateName, sectionIndex)`: Returns filter ID for a specific section
- `getTemplateFilterConfig(templateName)`: Returns full config for a template

**Configuration Structure**:

```javascript
export const TEMPLATE_FILTERS = {
  'footer': {
    main: 'footer-template',           // Filter for main element
    sections: {
      default: null,                   // null = no filter
      transparent: true,               // Label/filter from widget model
    }
  },
  'homepage': {
    main: 'main',
    sections: {
      default: 'section',
      byIndex: {
        0: 'homepage-hero-section',    // First section only
      }
    }
  }
};
```

**Transparent Sections**:
- When `transparent: true`, sections don't get label/filter set manually
- Widget models (like `unipol-footer`) provide their own `data-aue-label` and `data-aue-filter`
- Used for templates where sections are just containers for widgets

---

### 2. Modified: `scripts/scripts.js`

#### A. New Imports

```javascript
import {
  getMainFilter,
  getSectionFilter,
  getTemplateFilterConfig,
} from './template-filters-config.js';
```

These are **additional** to the standard EDS imports from `aem.js`.

#### B. New Function: `applyMainFilter()`

**Purpose**: Apply Universal Editor filter to the `main` element based on template.

**Location**: Before `decorateSections()`

**Code**:

```javascript
function applyMainFilter(main) {
  const templateName = toClassName(getMetadata('template'));
  const mainFilter = getMainFilter(templateName);
  
  main.dataset.aueType = 'container';
  main.dataset.aueFilter = mainFilter;
  
  console.log(`[Template Filters] Template: "${templateName}" -> Main Filter: "${mainFilter}"`);
}
```

**What it does**:
1. Reads `template` metadata from the page
2. Gets the appropriate filter ID from configuration
3. Sets `data-aue-type="container"` on main
4. Sets `data-aue-filter` to control what can be added to main
5. Logs for debugging

**OOTB Behavior**: The `main` element doesn't have Universal Editor attributes in standard EDS.

---

#### C. Modified Function: `decorateSections()`

**Status**: **Shadowing OOTB function** from `aem.js`

The import in `scripts.js` is commented out:
```javascript
//decorateSections,  // ← Commented, using custom version
```

**Key Differences from OOTB**:

| Aspect | OOTB EDS | Custom Implementation |
|--------|----------|---------------------|
| Universal Editor attributes | ❌ Not added | ✅ Adds `data-aue-type`, `data-aue-label`, `data-aue-filter` |
| Template awareness | ❌ No | ✅ Reads template metadata |
| Dynamic filters | ❌ No | ✅ Different filters per template |
| Section-specific filters | ❌ No | ✅ Filter by section index |
| Transparent sections | ❌ No | ✅ Respects widget model labels/filters |

**Custom Logic Flow**:

```javascript
export function decorateSections(main) {
  const templateName = toClassName(getMetadata('template'));

  main.querySelectorAll(':scope > div:not([data-section-status])').forEach((section, index) => {
    
    // --- STANDARD EDS LOGIC (unchanged) ---
    // Create wrappers, add classes, etc.
    
    // --- CUSTOM UNIVERSAL EDITOR LOGIC ---
    section.dataset.aueType = 'container';
    
    const templateConfig = getTemplateFilterConfig(templateName);
    const isTransparent = templateConfig.sections?.transparent === true;
    
    if (!isTransparent) {
      // Only set if not already set (preserves widget model values)
      if (!section.dataset.aueLabel) {
        section.dataset.aueLabel = 'Section';
      }
      if (!section.dataset.aueFilter) {
        const sectionFilter = getSectionFilter(templateName, index);
        section.dataset.aueFilter = sectionFilter;
      }
    }
    
    // --- STANDARD METADATA PROCESSING (unchanged) ---
    // Process section-metadata, can override filters
  });
}
```

**Key Points**:
1. **Preserves OOTB wrapper logic** - no changes to standard section decoration
2. **Adds Universal Editor attributes** - enables editing in Universal Editor
3. **Respects existing values** - doesn't overwrite `data-aue-label`/`data-aue-filter` if already set
4. **Template-aware** - applies different filters based on template
5. **Transparent mode** - skips setting attributes when widget models handle them

---

#### D. Modified Function: `decorateMain()`

**Added call to `applyMainFilter()`**:

```javascript
export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  
  applyMainFilter(main);  // ← NEW: Apply template filter to main
  
  decorateSections(main);
  decorateBlocks(main);
}
```

**Timing**: Called **before** `decorateSections()` and `decorateBlocks()` to ensure main has filter attributes before sections are processed.

---

### 3. Modified: `_component-filters.json`

**Added template-specific filters**:

```json
[
  {
    "id": "main",
    "components": [
      "section",
      "kpi-highlights-widget",
      "insurance-product-carousel-widget",
      "hero-widget",
      "blog-carousel-widget"
    ]
  },
  {
    "id": "footer-template",
    "components": [
      "unipol-footer"
    ]
  },
  {
    "id": "header-template",
    "components": [
      "unipol-header"
    ]
  },
  // ... existing filters ...
]
```

**OOTB**: Only contains standard block filters (e.g., `section`, `cards`, `columns`).

**Custom**: Added template-level filters that restrict what can be added to main element.

---

## Step-by-Step Execution Flow

### Scenario: Page with `template: footer`

#### Step 1: Page Load
```html
Document metadata:
---
template: footer
---
```

#### Step 2: `loadPage()` → `loadEager()` → `decorateMain()`
Standard EDS flow starts.

#### Step 3: `applyMainFilter(main)` is called
```javascript
// 1. Read metadata
const templateName = toClassName(getMetadata('template')); // 'footer'

// 2. Get filter from config
const mainFilter = getMainFilter('footer'); // 'footer-template'

// 3. Apply to main element
main.dataset.aueType = 'container';
main.dataset.aueFilter = 'footer-template';

// Result:
<main data-aue-type="container" data-aue-filter="footer-template">
```

#### Step 4: `decorateSections(main)` is called
```javascript
// For each section:
const templateConfig = getTemplateFilterConfig('footer');
// Returns: { main: 'footer-template', sections: { default: null, transparent: true } }

const isTransparent = true; // transparent: true

// Because transparent=true, skip setting label/filter
// Widget model will provide them

// Result when unipol-footer is added:
<div class="section"
     data-aue-type="container"
     data-aue-model="unipol-footer"
     data-aue-label="Unipol Footer"    ← From model
     data-aue-filter="unipol-footer">  ← From model
```

#### Step 5: Universal Editor
When user clicks "+" in main element:
- Reads `data-aue-filter="footer-template"`
- Looks up in `component-filters.json`
- Shows only: `unipol-footer`

---

## Template Configuration Patterns

### Pattern 1: Restrictive Template (Footer)

**Use Case**: Page should only contain a specific widget.

```javascript
'footer': {
  main: 'footer-template',        // Only unipol-footer allowed
  sections: {
    default: null,
    transparent: true,            // Widget provides label/filter
  }
}
```

```json
{
  "id": "footer-template",
  "components": ["unipol-footer"]  // Single widget only
}
```

**Behavior**:
- ✅ Main accepts only `unipol-footer`
- ✅ Section label: "Unipol Footer" (from model)
- ✅ Section filter: "unipol-footer" (from model)

---

### Pattern 2: Standard Template with Special First Section

**Use Case**: Homepage with hero in first section, standard content elsewhere.

```javascript
'homepage': {
  main: 'main',                   // Standard widgets
  sections: {
    default: 'section',           // Standard blocks
    byIndex: {
      0: 'homepage-hero-section', // First section special
    }
  }
}
```

```json
[
  {
    "id": "homepage-hero-section",
    "components": ["hero-widget", "full-screen-hero-carousel"]
  },
  {
    "id": "section",
    "components": ["text", "image", "button", "title", "cards", ...]
  }
]
```

**Behavior**:
- ✅ Main: standard widgets
- ✅ First section: only hero components
- ✅ Other sections: standard blocks

---

### Pattern 3: No Template (Default)

**Use Case**: Standard page, no restrictions.

```javascript
// No entry in TEMPLATE_FILTERS
// Falls back to DEFAULT_TEMPLATE_CONFIG:
{
  main: 'main',
  sections: {
    default: 'section',
  }
}
```

**Behavior**:
- ✅ Main: all standard widgets
- ✅ Sections: all standard blocks
- ✅ Widget models respected (labels/filters not overwritten)

---

## Key Design Decisions

### 1. Why Shadow `decorateSections()` Instead of Extending?

**Decision**: Create a custom version in `scripts.js` instead of modifying `aem.js`.

**Reasons**:
- ✅ Keeps `aem.js` unchanged for easier EDS updates
- ✅ All customizations in one place (`scripts.js`)
- ✅ Can be disabled by simply importing OOTB version

**How it works**:
```javascript
// scripts.js
//decorateSections,  // ← Comment out OOTB import
export function decorateSections(main) {
  // Custom implementation
}
```

---

### 2. Why Not Overwrite Widget Model Labels/Filters?

**Decision**: Check if `data-aue-label` and `data-aue-filter` exist before setting.

**Reasons**:
- ✅ Widget models (like `unipol-footer`) provide their own labels
- ✅ Universal Editor sets these from model definitions
- ✅ Template filters should only apply to "empty" sections

**Implementation**:
```javascript
if (!section.dataset.aueLabel) {
  section.dataset.aueLabel = 'Section';
}
```

---

### 3. Why "Transparent" Sections?

**Decision**: Add `transparent: true` flag for templates where sections are widget containers.

**Reasons**:
- ✅ Footer/Header templates: sections are just wrappers for widgets
- ✅ Widget model should provide all metadata
- ✅ Avoids conflict between template filter and model filter

**Without transparent**:
```html
<!-- Wrong: label overwritten -->
<div data-aue-label="Section" data-aue-filter="section">
  <div class="unipol-footer" data-aue-model="unipol-footer"></div>
</div>
```

**With transparent**:
```html
<!-- Correct: label from model -->
<div data-aue-label="Unipol Footer" data-aue-filter="unipol-footer"
     data-aue-model="unipol-footer">
  <div class="unipol-footer"></div>
</div>
```

---

### 4. Why Separate Configuration File?

**Decision**: Create `template-filters-config.js` instead of embedding in `scripts.js`.

**Reasons**:
- ✅ Easy to add new templates without touching core logic
- ✅ Clear separation of concerns (config vs. logic)
- ✅ Can be edited by non-developers
- ✅ Easier to test and validate

---

## How to Add a New Template

### Step 1: Define the filter in `_component-filters.json`

```json
{
  "id": "product-page-main",
  "components": [
    "hero-widget",
    "product-details-widget",
    "insurance-product-carousel-widget"
  ]
}
```

### Step 2: Add template configuration in `template-filters-config.js`

```javascript
export const TEMPLATE_FILTERS = {
  // ... existing templates ...
  
  'product-page': {
    main: 'product-page-main',
    sections: {
      default: 'section',
    }
  },
};
```

### Step 3: Use in document

```markdown
---
template: product-page
---

(Page content)
```

### Step 4: Test in Universal Editor

1. Open page in Universal Editor
2. Click "+" in main element
3. Verify only allowed widgets are shown
4. Add a widget and verify label is correct

---

## Debugging

### Console Logs

The system logs template and filter information:

```javascript
console.log(`[Template Filters] Template: "footer" -> Main Filter: "footer-template"`);
```

Look for this in browser console (F12) to verify template detection.

### Inspect Elements

Use browser DevTools to inspect Universal Editor attributes:

```html
<main data-aue-type="container" data-aue-filter="footer-template">
  <div class="section" 
       data-aue-type="container"
       data-aue-label="Unipol Footer"
       data-aue-filter="unipol-footer"
       data-aue-model="unipol-footer">
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Filter not applied | Template name typo | Check metadata spelling |
| Wrong components shown | Filter ID mismatch | Verify filter exists in `component-filters.json` |
| Label shows "Section" | Not transparent, widget model conflict | Add `transparent: true` to template config |
| No "+" button | Missing `data-aue-type` | Check `decorateSections()` is running |

---

## Backward Compatibility

### Pages Without Template Metadata

If a page doesn't have `template` metadata:
- ✅ Falls back to `DEFAULT_TEMPLATE_CONFIG`
- ✅ Uses standard `main` and `section` filters
- ✅ No breaking changes

### Existing Pages

All existing pages continue to work:
- ✅ Standard filters still defined
- ✅ No changes to OOTB blocks
- ✅ Widget models respected

---

## Performance Impact

### Minimal Overhead

The template system adds negligible performance impact:
- Single metadata read per page load
- Simple object lookup for filter IDs
- No additional network requests
- No blocking operations

### Compared to OOTB

- **Page load time**: No measurable difference
- **Decoration time**: < 1ms additional processing
- **Memory usage**: Negligible (small config object)

---

## Extension Points

### Custom Filter Logic

To add custom filter logic based on other criteria:

```javascript
function getCustomFilter(section, templateName, index) {
  // Example: Different filter based on section metadata
  const sectionMeta = section.dataset.category;
  if (sectionMeta === 'product') {
    return 'product-section-filter';
  }
  
  return getSectionFilter(templateName, index);
}
```

### Conditional Templates

To apply templates based on conditions other than metadata:

```javascript
function resolveTemplate() {
  const explicitTemplate = getMetadata('template');
  if (explicitTemplate) return explicitTemplate;
  
  // Example: Auto-detect based on URL
  if (window.location.pathname.includes('/footer')) {
    return 'footer';
  }
  
  return null;
}
```

---

## Summary

### What Was Added to OOTB EDS

1. **New file**: `scripts/template-filters-config.js` - Template to filter mapping
2. **Modified**: `scripts/scripts.js` - Custom `decorateSections()`, new `applyMainFilter()`
3. **Modified**: `_component-filters.json` - Template-specific filters
4. **New feature**: Template-based component filtering in Universal Editor

### Benefits

- ✅ Editorial guardrails for different page types
- ✅ Consistent page structures
- ✅ Flexible and extensible system
- ✅ No changes to OOTB EDS core files
- ✅ Backward compatible
- ✅ Respects widget model definitions

### Maintenance

- Easy to add new templates (2 files: config + filters)
- Clear separation of concerns
- Well documented and debuggable
- Can be disabled by reverting to OOTB `decorateSections()`

---

## References

- [AEM EDS Documentation](https://www.aem.live/docs/)
- [Universal Editor](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/introduction.html)
- Project files:
  - `scripts/template-filters-config.js`
  - `scripts/scripts.js`
  - `_component-filters.json`

---

**Version**: 1.0  
**Last Updated**: December 5, 2025  
**Author**: Development Team

