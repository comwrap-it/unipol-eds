# Blog Preview Card

Single blog teaser card with image, title, reading/listening duration, and a category tag. UE model in `_blog-preview-card.json`; logic in `blog-preview-card.js`.

## Overview
- Renders an image with an overlaid tag, followed by title and duration.
- Can be used standalone or inside carousels (adds `swiper-slide` when requested by caller).
- Uses shared Tag atom for label/category/type display.

## Field Reference (UE Model)
Source: `_blog-preview-card.json` (fields by row order).

1) image (reference)
- Purpose: Asset reference for the card image.
- Type: string reference; required.

2) title (text)
- Purpose: Card title.
- Validation: `maxLength: 80`.
- Required: Yes.

3) duration-icon (select)
- Purpose: Icon representing content type/duration.
- Default: `un-icon-newspaper`.
- Options: `un-icon-newspaper` (Newspaper), `un-icon-headphones` (Headphones), `un-icon-play-circle` (Play Circle).

4) duration-text (text)
- Purpose: Human-readable duration (e.g., "5 min").
- Required: Yes.

5) tag (container)
- Purpose: Configure the tag displayed on the image.
- Fields: Inlines all fields from `atoms/tag/_tag.json` (label/category/type, etc.).

## Runtime Behavior (blog-preview-card.js)
- Structure: Wrapper `.blog-card` contains optimized `<picture>`, tag overlay, title, and duration block.
- Image: Uses `createOptimizedPicture(imagePath, alt)` to generate responsive `<picture>`.
- Tag: Created via `createTag(label, category, type)` and appended to the image.
- Duration: Builds an icon from the selected CSS class and a duration text element.

## Authoring Notes (Universal Editor)
- Field-to-row mapping (by order):
  - Row 0 → `image`
  - Row 1 → `title`
  - Row 2 → `duration-icon`
  - Row 3 → `duration-text`
  - Rows 4+ → `tag` fields from Tag model

## Defaults and Fallbacks
- Missing image: the card renders without a picture (provide a valid asset reference).
- Missing title or duration: results in empty text nodes; ensure required fields are filled in UE.
