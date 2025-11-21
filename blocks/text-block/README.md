# Text Block Component

## Overview

The Text Block is an **organism-level component** in the Unipol EDS design system that combines title, text, and call-to-action elements into a cohesive content block.

## Component Type

- **Level**: Organism
- **Category**: Content Block
- **Composed of**: Standard Button (Atom)

## Features

- ✅ Two layout modes: centered and left-aligned
- ✅ Conditional text visibility based on layout
- ✅ Integrated CTA button with full customization
- ✅ Universal Editor instrumentation support
- ✅ Responsive design with mobile-first approach
- ✅ Accessibility-focused

## Usage in AEM EDS

### Centered Layout (Default)

```markdown
| Text Block |
|------------|
| Welcome to Our Platform |
| true |
| Discover amazing features and start your journey with us today. |
| Get Started |
| primary |
| https://example.com |
| medium |
| |
| chevron-right-icon |
```

### Left-Aligned Layout

```markdown
| Text Block |
|------------|
| Quick Action Section |
| false |
| This text won't be shown |
| Take Action |
| primary |
| https://example.com |
| medium |
| |
| chevron-right-icon |
```

## Field Structure

1. **Title** (text) - The main heading
2. **Content Alignment** (boolean) - `true` = centered with text, `false` = left-aligned without text
3. **Text** (richtext) - Body text (visible only when centered)
4. **Button Label** (text) - CTA button text
5. **Button Variant** (select) - `primary`, `secondary`, or `accent`
6. **Button URL** (aem-content) - Link destination
7. **Icon Size** (select) - `small`, `medium`, `large`, `extra-large`
8. **Left Icon** (select) - Optional left icon
9. **Right Icon** (select) - Optional right icon

## Programmatic Usage (Storybook/Testing)

```javascript
import { createTextBlock, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '@blocks/text-block/text-block.js';

// Create a centered text block with button
const textBlock = createTextBlock(
  'Welcome to Our Platform',  // title
  true,                         // centered
  'Discover amazing features and start your journey.', // text
  null,                         // buttonElement (null for config-based)
  {                             // buttonConfig
    label: 'Get Started',
    href: '#signup',
    variant: BUTTON_VARIANTS.PRIMARY,
    iconSize: BUTTON_ICON_SIZES.MEDIUM,
    rightIcon: 'chevron-right-icon',
  }
);

document.body.appendChild(textBlock);
```

## Architecture & Code Organization

### Design Principle: Single Source of Truth

The text-block component follows the **DRY (Don't Repeat Yourself)** principle with a clear separation of concerns:

1. **`createTextBlock()`** - The ONLY function that creates the DOM structure
   - Accepts both HTMLElements (from AEM) and strings (from Storybook)
   - Handles all layout logic (centered vs left-aligned)
   - Manages button integration

2. **`decorate()`** - Extracts data from Universal Editor and calls `createTextBlock()`
   - Parses rows from AEM structure
   - Preserves instrumentation attributes
   - Delegates DOM creation to `createTextBlock()`

3. **Helper functions**:
   - `extractTitleElement()` - Extracts title with instrumentation
   - `extractTextElement()` - Extracts text with instrumentation
   - `preserveBlockAttributes()` - Preserves AEM metadata

This architecture ensures:
- ✅ No code duplication
- ✅ Easy to test and maintain
- ✅ Clear separation between AEM parsing and component creation
- ✅ Reusable in both AEM and Storybook contexts

## Layout Modes

### Centered Mode (`centered: true`)
- Content is centered vertically and horizontally
- Title and text are stacked vertically
- Button appears below the text
- Ideal for: Hero sections, landing pages, promotional content

### Left-Aligned Mode (`centered: false`)
- Content is aligned horizontally (left-aligned)
- Title and button appear side-by-side
- Text is hidden
- Ideal for: Page headers, section headers, quick actions

## Storybook

View all variants and configurations in Storybook:

```bash
cd storybook
npm run storybook
```

Navigate to: **Organisms → Text Block**

### Available Stories

- **Centered** - Default centered layout
- **CenteredLongText** - Centered with longer content
- **CenteredNoButton** - Centered without CTA
- **CenteredSecondaryButton** - Centered with secondary button
- **LeftAligned** - Left-aligned layout
- **LeftAlignedAccent** - Left-aligned with accent button
- **LeftAlignedSearch** - Left-aligned with search icon
- **LeftAlignedNoButton** - Left-aligned without button
- **LayoutComparison** - Side-by-side comparison
- **AllButtonVariants** - All button styles
- **LandingPageHero** - Real-world example
- **PageHeaderWithAction** - Real-world example

## CSS Custom Properties

The component uses design tokens from the EDS system:

- `--font-size-32` / `--dimension-font-size-title-page` - Title sizes
- `--font-size-16` - Text size
- `--font-family-font-1` - Title font
- `--font-family-font-2` - Text font
- `--color-brand-800` - Text color
- `--color-primary` - Focus outline

## Accessibility

- Semantic HTML with proper heading hierarchy
- Focus management with visible outlines
- Keyboard navigation support through button component
- ARIA attributes preserved from Universal Editor

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported (uses modern CSS features)

## Related Components

- **Standard Button** (Atom) - Used for CTA buttons
- **Hero** (Organism) - Alternative for full-page heroes
- **Section** (Template) - Container for multiple text blocks

## Best Practices

1. **Keep titles concise** - Max 60 characters recommended
2. **Use centered layout for impact** - Best for landing pages
3. **Use left-aligned for headers** - Best for internal pages
4. **Choose button variants wisely**:
   - Primary: Main actions
   - Accent: High-priority/promotional
   - Secondary: Supporting actions
5. **Limit text length** - 2-3 lines optimal for readability

## Notes

- Text Block is **not a native Web Component** - it uses AEM EDS decorator pattern
- The `createTextBlock` factory function is for Storybook/testing only
- In production, use AEM authoring interface with Universal Editor
- Button styles are loaded dynamically to avoid CSS duplication

