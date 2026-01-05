# Cards

Generic list of cards (image + rich text). Defines a container filter for `Card` items and a `card` model for individual entries. Logic in `cards.js`.

## Overview
- Transforms rows into a semantic list: `<ul><li>...</li></ul>`.
- Each item supports an image and a text body.
- Optimizes images using the shared `createOptimizedPicture` helper.
- Preserves UE instrumentation when moving content.

## Field Reference (UE Model)
Source: `_cards.json`.

Model: `card` (per item)
1) image (reference)
- Purpose: Asset for the card image.
- Type: string reference.

2) text (richtext)
- Purpose: Body content of the card.
- Type: string rich text.
- Default: empty.

## Filters
- Filter: `cards` → Allowed components: `card`.
- Purpose: Authoring UI restricts children to `Card` items inside the Cards block.

## Runtime Behavior (cards.js)
- Wraps all rows into `<ul>`; each row becomes a `<li>`.
- Class assignment: image container → `cards-card-image`; text container → `cards-card-body`.
- Image optimization: replaces raw `<img>` with responsive `<picture>` via `createOptimizedPicture`.
- Instrumentation is moved from original nodes to the new structure with `moveInstrumentation`.

## Authoring Notes (Universal Editor)
- Each row represents one `Card` item following the `card` model.
- Add an image and optional rich text; the script assigns appropriate classes for styling.

## Defaults and Fallbacks
- Missing image: item renders without a picture.
- Empty text: item renders image-only layout.
