# Dynamic Gallery Card - Developer Documentation

## Overview
`dynamic-gallery-card` is a molecule-level component used inside `dynamic-gallery-row`.

It renders:
- A 16:9 image (with authored alt text)
- An optional tag
- A hover overlay with an optional button that loads a fragment into the page

## Architecture

### File Structure
- `_dynamic-gallery-card.json`: Universal Editor model definition
- `dynamic-gallery-card.js`: (block folder) empty entrypoint (implementation lives in DS)
- `dynamic-gallery-card.css`: block-scoped styles for the card layout/overlay

Actual rendering logic lives in:
- `scripts/libs/ds/components/molecules/cards/dynamic-gallery-card/dynamic-gallery-card.js`

## Model Definition (`_dynamic-gallery-card.json`)

### Model: `dynamic-gallery-card`
Fields:
1. `image` (reference, required)
2. `imageSR` (text, required) — alt text
3. `tag` (container, optional)
   - delegates to `../atoms/tag/_tag.json#/models/tag/fields`
4. `button-label` (text, optional)
5. `reference` (aem-content, optional)
   - validated under `rootPath: /content/unipol`

## JavaScript Implementation (DS)

### Core functions

#### `createDynamicGalleryCard(picture, imgAltText, tagLabel, tagCategory, tagType, btnLabel, btnLink)`
- Creates `.dynamic-gallery-card` container.
- Applies alt text to the `<img>` inside the provided `picture`.
- Adds optional tag via `createTag(tagLabel, tagCategory, tagType)`.
- Adds `.dynamic-gallery-card-overlay.theme-dark`.
- If both `btnLabel` and `btnLink` exist, appends a standard button; click is handled to load a fragment.

#### `extractDynamicGalleryCardValuesFromRows(rows)`
When the card is authored as rows/cells (inside `dynamic-gallery-row`), extraction uses a fixed column order:

```text
[0] image (media)
[1] imageSR (alt text)
[2] tagLabel
[3] tagCategory
[4] tagType (maps to Tag “variant/type”)
[5] button label
[6] button link (href from <a>)
```

Note: UE model uses a `tag` container and `reference` aem-content picker; the authored table columns should resolve to the extraction order above.

### Fragment loading behavior
The button click handler:
- calls `loadFragment(href)`
- extracts the first `.section` within the fragment
- removes the `.section` class and appends the section to `document.body`

This is intentionally not a normal navigation.

## CSS Styling (`dynamic-gallery-card.css`)

### Key classes
- `.dynamic-gallery-card`: fixed width (responsive on desktop), 16:9 aspect ratio
- `.dynamic-gallery-card-image img`: rounded corners via `--Images-Radius`
- `.dynamic-gallery-card-overlay`: blurred dark overlay, fades in on hover

### Responsive
- Desktop (`@media (width >= 1200px)`): width increases from 285px to 360px

## Dependencies
- `scripts/domHelpers.js`: `extractMediaElementFromRow()`
- `scripts/fragment.js`: `loadFragment()`
- `scripts/libs/ds/components/atoms/buttons/standard-button/standard-button.js`: `createButton()`
- `scripts/libs/ds/components/atoms/tag/tag.js`: `createTag()`
