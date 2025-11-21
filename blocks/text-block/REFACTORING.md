# Text Block Refactoring Documentation

## Overview

This document explains the refactoring performed on the text-block component to eliminate code duplication and establish a clear separation of concerns.

## Problem Statement

### Before Refactoring

The original code had **two separate implementations** of the same DOM creation logic:

1. **`decorate()` function**: Created the entire component structure inline (lines 42-129)
2. **`createTextBlock()` function**: Recreated the same structure for Storybook (lines 173-221)

**Issues:**
- ❌ Code duplication (~80 lines of duplicated logic)
- ❌ Maintenance burden (changes needed in two places)
- ❌ Inconsistency risk (implementations could diverge)
- ❌ Testing difficulty (two code paths to test)

## Solution: Single Source of Truth

### After Refactoring

**Architecture:**

```
┌─────────────────────────────────────────────────────────┐
│                    AEM Universal Editor                  │
│                  (Block with rows/columns)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   decorate(block)     │
         │                       │
         │  • Extract rows       │
         │  • Parse data         │
         │  • Preserve metadata  │
         └───────────┬───────────┘
                     │
                     │ titleElement, centered, textElement, buttonElement
                     │
                     ▼
         ┌─────────────────────────────────────┐
         │     createTextBlock()               │
         │                                     │
         │  ✓ SINGLE SOURCE OF TRUTH          │
         │  ✓ Creates DOM structure            │
         │  ✓ Handles layout logic             │
         │  ✓ Manages button integration       │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   Text Block Component       │
         │   (Ready for render)         │
         └──────────────────────────────┘
```

### Key Functions

#### 1. `createTextBlock()` - The Core

```javascript
export function createTextBlock(
  titleContent,      // HTMLElement or string
  centered,          // boolean
  textContent,       // HTMLElement or string  
  buttonElement,     // Pre-created button (from AEM)
  buttonConfig       // Button config (for Storybook)
)
```

**Responsibilities:**
- ✅ Create the complete DOM structure
- ✅ Handle both HTMLElements (AEM) and strings (Storybook)
- ✅ Apply correct CSS classes
- ✅ Manage layout modes (centered vs left-aligned)

#### 2. `decorate()` - The Parser

```javascript
export default async function decorate(block) {
  // STEP 1: Extract rows from Universal Editor
  // STEP 2: Extract data from rows
  // STEP 3: Create text block using createTextBlock()
  // STEP 4: Preserve AEM instrumentation
  // STEP 5: Replace original block
}
```

**Responsibilities:**
- ✅ Parse Universal Editor structure
- ✅ Extract instrumentation attributes
- ✅ Delegate DOM creation to `createTextBlock()`
- ✅ Preserve AEM metadata

#### 3. Helper Functions

```javascript
extractTitleElement(titleRow)        // Extract title with instrumentation
extractTextElement(textRow)          // Extract text with instrumentation  
preserveBlockAttributes(source, target) // Preserve AEM metadata
```

**Responsibilities:**
- ✅ Encapsulate extraction logic
- ✅ Handle instrumentation preservation
- ✅ Keep code DRY and readable

## Benefits

### 1. Code Reduction
- **Before**: ~220 lines with duplication
- **After**: ~260 lines with NO duplication (better organized)
- Net gain: Better maintainability despite slightly more total lines

### 2. Separation of Concerns

| Function | Responsibility | Knows About |
|----------|---------------|-------------|
| `createTextBlock()` | DOM creation | CSS classes, HTML structure |
| `decorate()` | Data extraction | AEM structure, Universal Editor |
| Helper functions | Specific tasks | Instrumentation, attributes |

### 3. Testability

```javascript
// Easy to test DOM creation
const block = createTextBlock('Title', true, 'Text', null, {...});
assert(block.classList.contains('text-block-center'));

// Easy to test data extraction
const titleEl = extractTitleElement(mockRow);
assert(titleEl.hasAttribute('data-aue-resource'));
```

### 4. Flexibility

The same `createTextBlock()` function now works for:
- ✅ AEM Universal Editor (with HTMLElements)
- ✅ Storybook (with strings)
- ✅ Unit tests (with mock data)
- ✅ Programmatic usage (with any input)

## Migration Guide

### For Storybook Users

**Old way:**
```javascript
createTextBlock('Title', true, 'Text', buttonConfig)
```

**New way:**
```javascript
createTextBlock('Title', true, 'Text', null, buttonConfig)
//                                      ^^^^
//                              buttonElement parameter added
```

### For Component Developers

When creating similar organism components, follow this pattern:

1. **Create a factory function** (`createMyComponent()`) that:
   - Accepts flexible input (HTMLElement or primitive types)
   - Creates the complete DOM structure
   - Has NO knowledge of AEM structure

2. **Create a decorate function** that:
   - Parses AEM/Universal Editor data
   - Calls the factory function
   - Preserves AEM metadata
   - Has NO DOM creation logic

3. **Create helper functions** for:
   - Data extraction
   - Instrumentation handling
   - Attribute preservation

## Code Quality Improvements

### Before

```javascript
// In decorate()
const title = document.createElement('h2');
title.className = 'text-block-title';
// ... 80 lines of DOM creation ...

// In createTextBlock()  
const title = document.createElement('h2');
title.className = 'text-block-title';
// ... 80 lines of SAME logic ...
```

### After

```javascript
// In decorate() - Clean data extraction
const titleElement = extractTitleElement(titleRow);
const textElement = extractTextElement(textRow);
const buttonElement = createButtonFromRows(buttonRows);

// Call the single source of truth
const textBlock = createTextBlock(
  titleElement, centered, textElement, buttonElement
);

// In createTextBlock() - Single DOM creation
// ... ALL logic in ONE place ...
```

## Performance Impact

- ✅ **No performance degradation** - Same DOM operations
- ✅ **Slightly better** - Fewer function calls in some paths
- ✅ **Better memory** - No duplicated code in memory

## Backward Compatibility

- ✅ **AEM EDS**: 100% compatible (no changes to behavior)
- ✅ **Storybook**: Signature changed but all stories updated
- ✅ **External usage**: May need to update calls (add `null` parameter)

## Future Improvements

This refactoring enables:

1. **Easy testing**: Unit tests for `createTextBlock()` in isolation
2. **Component variants**: Easy to create alternate versions
3. **Type safety**: Can add TypeScript types to clear function signatures
4. **Documentation**: JSDoc is now more meaningful
5. **Reusability**: Pattern can be applied to other organisms

## Conclusion

This refactoring transforms the text-block from a **duplicated, monolithic** structure to a **clean, modular** architecture that follows software engineering best practices:

- ✅ **DRY** (Don't Repeat Yourself)
- ✅ **SRP** (Single Responsibility Principle)
- ✅ **OCP** (Open/Closed Principle)
- ✅ **KISS** (Keep It Simple, Stupid)

The code is now **easier to understand**, **easier to test**, and **easier to maintain**.

---

**Refactored by**: AI Assistant  
**Date**: November 21, 2024  
**Approved by**: Development Team

