# Footer Download Section - Developer Documentation

## Overview
The Footer Download Section is a molecule component that displays a branded download area in the footer. It includes a logo with brand button, QR code with descriptive text, and app store download buttons. The component is designed to be AEM Universal Editor compatible with proper attribute preservation.

## Architecture

### Component Structure
- **Block Component**: `footer-download-section` - Single block component (not item-based)

### File Structure
- `_footer-download-section.json`: Universal Editor model definition with 10 fields
- `footer-download-section.js`: Component logic, data extraction, and DOM creation
- `footer-download-section.css`: Styling with design system variables and responsive breakpoints

## Model Definition (`_footer-download-section.json`)

### Block Definition
The `footer-download-section` block uses a direct model (not filter-based) with the model ID `footer-download-section`.

### Model Fields
The model defines 10 fields in a specific order:

1. **`logoUnipolFooter`** (reference)
   - Label: "Logo Unipol Footer"
   - Unipol logo image for the section

2. **`UnipolButtonGroup`** (text)
   - Label: "Testo Unipol Group"
   - Brand button/link text label

3. **`UnipolButtonHref`** (aem-content)
   - Label: "Link URL Unipol Group"
   - Brand button/link destination URL

4. **`buttonIconUnipolGroup`** (reference)
   - Label: "Icona Button Unipol Group"
   - Optional icon displayed within the brand button

5. **`qrCodeFooterImg`** (reference)
   - Label: "Immagine QR CODE"
   - QR code image

6. **`qrCodeImg`** (text)
   - Label: "Testo sezione QR Code"
   - Text displayed near the QR code
   - Max length: 30 characters
   - Validation error: "Testo troppo lungo (max 30 caratteri)"

7. **`googlePlayImg`** (reference)
   - Label: "Immagine GooglePlay"
   - Google Play badge image

8. **`googlePlayHref`** (aem-content)
   - Label: "GooglePlay Link URL"
   - Link to Google Play store

9. **`appStoreImg`** (reference)
   - Label: "Immagine AppleStore"
   - App Store badge image

10. **`appStoreHref`** (aem-content)
    - Label: "appStore Link URL"
    - Link to Apple App Store

## JavaScript Implementation (`footer-download-section.js`)

### Data Extraction
The component reads data from a 10-row table structure, where each row corresponds to a specific field:

**Row Mapping:**
- Row 0: Logo (image element)
- Row 1: Brand text (text content)
- Row 2: Brand href (link URL)
- Row 3: Brand icon (image element, optional)
- Row 4: QR code (image element)
- Row 5: QR code text (text content)
- Row 6: Google Play image (image element)
- Row 7: Google Play href (link URL)
- Row 8: App Store image (image element)
- Row 9: App Store href (link URL)

### Core Functions

#### `extractDownloadSectionData(rows)`
Extracts configuration from AEM rows:
- Maps each row to its corresponding config property
- Handles both prebuilt elements (from UE) and raw URLs
- Provides fallbacks for logo and QR code:
  - Logo fallback: `/content/dam/unipol/logo/Unipol-Logo-OnDark.svg`
  - QR code fallback: Dynamic Media URL with specific asset ID
- Returns configuration object with all extracted data

#### `createFooterDownloadSection(config)`
Factory function that creates the complete component structure:

**Structure:**
```
.footer-download-section
  ├── .footer-download-brand
  │   ├── logo (img/picture)
  │   └── .footer-download-brand-button (a)
  │       ├── text content
  │       └── icon (img/picture, optional)
  └── .footer-download-bottom-app
      ├── .footer-download-qr
      │   ├── QR image (img/picture)
      │   └── .footer-download-qr-text (span)
      └── .footer-download-apps
          ├── .footer-download-app-link.footer-download-app-google (a)
          │   └── Google Play image
          └── .footer-download-app-link.footer-download-app-apple (a)
              └── App Store image
```

**Element Creation Logic:**
- Accepts both HTMLElement instances and URL strings
- For images: clones existing elements or creates new `<img>` elements
- For links: creates anchor elements with appropriate classes and attributes
- Sets ARIA labels for accessibility (`aria-label` on app store links)
- Handles optional elements gracefully (brand icon, missing images)

#### `decorate(block)` (default export)
Main decoration function:
- Checks for minimum 10 rows (returns early if insufficient)
- Handles `.default-content-wrapper` if present (AEM structure)
- Extracts data using `extractDownloadSectionData()`
- Creates section using `createFooterDownloadSection()`
- Replaces block content while preserving Universal Editor attributes:
  - Preserves all `data-aue-*` attributes
  - Preserves `data-block-name` attribute
- Adds `footer-download-section` class to block

### Fallback Behavior
- **Logo**: Falls back to default Unipol logo SVG if missing
- **QR Code**: Falls back to Dynamic Media asset if missing
- **Other images**: Missing images result in those elements not being rendered
- **Insufficient rows**: Component decoration is skipped if fewer than 10 rows

## CSS Styling (`footer-download-section.css`)

### Class Structure
- `.footer-download-section`: Main container
- `.footer-download-brand`: Brand area container (logo + button)
- `.footer-download-brand-button`: Brand link/button element
- `.footer-download-brand-icon`: Icon within brand button
- `.footer-download-bottom-app`: Container for QR and app buttons
- `.footer-download-qr`: QR code container
- `.footer-download-qr-img`: QR code image
- `.footer-download-qr-text`: QR code description text
- `.footer-download-apps`: App store buttons container
- `.footer-download-app-link`: Individual app store link
- `.footer-download-app-google`: Google Play link modifier
- `.footer-download-app-apple`: App Store link modifier

### Design System Integration
Uses CSS custom properties (variables):
- `--Footer-Primary-Border`: Border color (#F9F9F7)
- `--Footer-Radius`: Border radius (16px)
- `--Footer-Box-Padding`: Container padding (12px)
- `--Footer-Primary-Text`: Text color (#F9F9F7)
- `--font-size-14`: Font size (0.875rem)
- `--Footer-Download-Gap`: Gap between elements (8px)
- `--Footer-Box-Gap`: Gap within boxes (40px)
- `--Size-16`: Font size (1rem)
- `--Button-Gap`: Gap in button (8px)
- `--Icon-100-16`: Icon size (16px)
- `--Footer-Logo-Gap`: Gap after logo (40px)

### Layout Details

#### Desktop (>768px)
- Fixed width: 280px
- Flex column layout
- Aligned to end (right)
- Logo area: 100% width with border and padding
- QR + Apps: Stacked vertically

#### Tablet (375px - 768px)
- Full width layout
- Flex row layout (brand | QR+Apps)
- Brand area: 45% width
- Bottom app container: 50% width
- App badges: Reduced sizes (110px Google Play, 90px App Store) at ≤565px

#### Mobile (≤375px)
- Full width layout
- Flex column layout
- Brand area: Full width with bottom margin
- QR + Apps: Stacked vertically

### Styling Details

#### Brand Area
- Border: 1px solid with rounded corners (top-right only on desktop)
- Padding: 12px
- Logo: 80px × 33px
- Button: Flex layout with icon spacing
- Icon: 16px width

#### QR Code Area
- Border: 1px solid with full border radius
- Padding: 12px
- Flex layout: Image + text
- QR image: 80px × 80px
- Text: 0.875rem, 400 weight
- Gap between image and text: 40px

#### App Store Buttons
- Flex layout: Space between
- Links: No default styling (inherits from footer)
- Images: Responsive sizing on smaller tablets

## Data Flow

1. **Authoring**: Editor configures 10 fields in Universal Editor
2. **Storage**: Data stored as table rows (10 rows total)
3. **Extraction**: `extractDownloadSectionData()` parses rows into config object
4. **Creation**: `createFooterDownloadSection()` builds DOM structure
5. **Decoration**: `decorate()` replaces block content and preserves UE attributes
6. **Styling**: CSS applies design system styles and responsive behavior

## Dependencies

None - standalone component with no external JavaScript dependencies.

## Notes

- Component requires exactly 10 rows to function; decoration is skipped if fewer rows are present
- Handles both prebuilt elements (from Universal Editor) and raw URLs/strings
- Fallback images are provided for logo and QR code to ensure component always renders
- Universal Editor attributes are preserved on the block element for proper editing experience
- Component is idempotent and safe for Universal Editor live editing
- Wrapper class `.footer-download-section-wrapper` can be used for additional layout control

