# Image Text Grid

Grid of up to four image + text items with alternating image alignment and optional CTA button per item. Grid and item models in `_image-text-grid.json`; behavior in `image-text-grid.js`.

## Overview
- Computes left/right alignment per item based on the initial alignment field.
- For each item, renders an optimized responsive image, title, description, and optional button.
- Preserves instrumentation when replacing images with optimized `<picture>`.

## Field Reference (UE Model)
Source: `_image-text-grid.json`.

Model: `image-text-grid`
1) initialAlignment (select)
- Purpose: Determines the alignment of the first image; subsequent items alternate.
- Values: `left`, `right` (required).

Model: `image-text-item`
1) image (aem-content)
- Purpose: Image asset path/URL.
- Required: Yes.

2) title (text)
- Purpose: Item title; max length 50.

3) description (text)
- Purpose: Supporting description; max length 240.

4) buttonConfig (container)
- Purpose: Optional CTA configuration via Standard Button fields.

## Filters
- Filter: `image-text-grid` → Allowed components: `image-text-item`.
- Constraints: `min: 1`, `max: 4` items.

## Runtime Behavior (image-text-grid.js)
- Reads the first child’s text for `initialAlignment`, then processes remaining rows as items.
- Replaces image refs with `createOptimizedPicture` applying responsive breakpoints; marks first block’s image as eager/high priority.
- Adds `.title` and `.description` classes to text nodes; builds a Standard Button when labeled/linked.

## Authoring Notes (Universal Editor)
- Provide the first row as the alignment value, then one row per item following the item model field order.
- Include an `imageAlt` field near image content to supply alt text for optimization.

## Defaults and Fallbacks
- Missing images result in items without media.
- Buttons render only when label or href is provided.
