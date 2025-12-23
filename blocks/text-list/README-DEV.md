# Text List - Developer Documentation

## Overview
The Text List component is a flexible list block that can render rows as either title-only elements or clickable links, based on per-row configuration. It's designed to be AEM Universal Editor compatible with proper instrumentation preservation.

## Architecture

### Component Structure
- **Block Component**: `text-list` - The container block
- **Item Component**: `text-link` - Individual list items

### File Structure
- `_text-list.json`: Universal Editor model definitions and field configurations
- `text-list.js`: Component logic, data extraction, and DOM decoration
- `text-list.css`: Styling with design system variables and responsive breakpoints

## Model Definition (`_text-list.json`)

### Block Definition
The `text-list` block uses the `text-list` filter template and contains `text-link` items.

### Item Model (`text-link`)
The model defines four fields with conditional visibility:

1. **`hideTextLinkList`** (boolean)
   - Toggle field that controls which other fields are visible
   - `true`: Shows Title/Text configuration
   - `false`: Shows Link configuration

2. **`listLinks`** (text)
   - Visible when `hideTextLinkList === true`
   - Max length: 25 characters
   - Used for title text content

3. **`linkTextComp`** (text, required)
   - Visible when `hideTextLinkList === false`
   - Max length: 45 characters
   - The clickable link text

4. **`linkHrefComp`** (aem-content, required)
   - Visible when `hideTextLinkList === false`
   - Accepts either a link element or plain URL
   - The destination URL for the link

### Field Conditions
Fields use JSONLogic conditions to show/hide based on `hideTextLinkList`:
- Title mode fields: `{"===": [{"var": "hideTextLinkList"}, true]}`
- Link mode fields: `{"===": [{"var": "hideTextLinkList"}, false]}`

## JavaScript Implementation (`text-list.js`)

### Data Extraction
The component reads data from a 4-column table structure:

```javascript
[hideTitle, title, linkText, linkHref]
```

**Column Mapping:**
- **Column 0** (`hideTitleRow`): Boolean string (`"true"` or `"false"`)
- **Column 1** (`titleRow`): Title text content
- **Column 2** (`textRow`): Link text (extracted from `<p>` element)
- **Column 3** (`hrefRow`): Link URL (extracted from `<a>` element's `href`)

### Core Functions

#### `extractTextLinkItems(rows)`
Extracts data and preserves raw DOM references for instrumentation:
- Maps each row to an object with `hideTitle`, `title`, `linkText`, `linkHref`
- Keeps references to original cells for instrumentation transfer
- Returns array of item objects

#### `createTextLinkComponent(items)`
Factory function that creates the component structure:
- Creates `.text-link-list` container
- For each item, creates `.text-link-row` wrapper
- Conditionally renders:
  - `.text-link-title` when `hideTitle === true` and title exists
  - `.text-link` anchor when `hideTitle === false` and both text/href exist
- Moves Universal Editor instrumentation from source cells to rendered elements

#### `decorate(block)` (default export)
Main decoration function that transforms the block:
- Extracts items from block children
- Replaces each row's innerHTML with the appropriate element
- Preserves Universal Editor instrumentation via `moveInstrumentation()`
- Idempotent and safe for Universal Editor live editing

### Rendering Logic
```javascript
if (hideTitle === true && title exists) {
  // Render title div
} else if (hideTitle === false && linkText && linkHref exist) {
  // Render link anchor
}
```

### Universal Editor Compatibility
- Uses `moveInstrumentation()` utility to transfer UE data attributes
- Preserves instrumentation from both text and href cells onto the final link element
- Idempotent decoration allows safe re-rendering during editing

## CSS Styling (`text-list.css`)

### Class Structure
- `.text-link-list`: Container for all rows
- `.text-link-row`: Individual row wrapper
- `.text-link-title`: Title-only row element
- `.text-link`: Link anchor element

### Design System Integration
Uses CSS custom properties (variables):
- `--Space-200-8`: 8px spacing
- `--Space-300-16`: 16px spacing
- `--Size-14`: 0.875rem font size
- `--Size-16`: 1rem font size
- `--Text-Default-Primary`: Primary text color (#001C35)
- `--Footer-Primary-Text`: Footer text color (#F9F9F7)
- `--Accordion-Footer-Border`: Footer border color (#82909C)
- `--Accordion-Footer-Vertical-Padding`: Footer padding (20px)

### Styling Details

#### Title Styling
- Font size: 1rem (16px)
- Font weight: 500 (600 on mobile)
- Color: Primary text color
- Margin bottom: 16px

#### Link Styling
- Font size: 0.875rem (14px)
- Font weight: 400
- No text decoration
- Color: Primary text color

#### Footer Variants
- Different text colors for footer context
- Accordion behavior on mobile (≤768px)
- Border and padding for accordion items
- Icon toggle support (`.un-icon-plus`)

### Responsive Breakpoints

1. **Desktop** (>768px)
   - Standard layout

2. **Tablet** (395px - 768px)
   - Footer: 45% width
   - Accordion behavior in footer
   - Title font weight: 600

3. **Mobile** (≤395px)
   - Footer: 100% width
   - Title font weight: 600
   - Full-width layout

### Footer Accordion (Mobile)
On mobile within `.unipol-footer`:
- Titles become clickable accordion headers
- Border bottom styling
- Icon toggle (`.un-icon-plus`) positioned absolutely
- Padding for touch targets

## Data Flow

1. **Authoring**: Editor configures items in Universal Editor
2. **Storage**: Data stored as table rows with 4 columns
3. **Extraction**: `extractTextLinkItems()` parses rows into structured data
4. **Rendering**: `decorate()` transforms rows into semantic HTML
5. **Instrumentation**: UE attributes moved from source cells to rendered elements
6. **Styling**: CSS applies design system styles and responsive behavior

## Dependencies

- `../../scripts/scripts.js`: Provides `moveInstrumentation()` utility function

## Notes

- The `listLinks` field in the model is defined but not directly consumed by the script; the title is read from the second column instead
- Empty or invalid rows are skipped (no error thrown)
- The component is designed to be idempotent for Universal Editor compatibility
- Instrumentation is preserved on both title and link elements for proper UE editing

