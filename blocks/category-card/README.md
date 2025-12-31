# Insurance Product Card

Product teaser card with image, tag, title/description, CTA + note, and optional 3D icons. Model in `_insurance-product-card.json`; behavior in `insurance-product-card.js`.

## Overview
- Renders product image with Tag overlay, text content, CTA with optional note, and 3D icons bar.
- Preserves UE instrumentation and optimizes images; prioritizes first card image for LCP.

## Field Reference (UE Model)
Source: `_insurance-product-card.json` (model: `insurance-product-card`).

1) title (text)
- Purpose: Card title. Required; max 15 chars.

2) description (text)
- Purpose: Supporting copy. Required; max 130 chars.

3) button-container (container)
- Purpose: Configure CTA via Standard Button fields.

4) note (text)
- Purpose: Small note under CTA. Required; max 60 chars.

5) tag (container)
- Purpose: Configure Tag (label/category/variant) via Tag model fields.

6) image (reference)
- Purpose: Product image.
- Required: Yes.

7) imageSR (text)
- Purpose: Image alt text. Required.

8) icons-3D (container)
- Purpose: Configure vehicle/property/welfare icon visibility via Icons 3D model.
- Required: Yes.

## Runtime Behavior (insurance-product-card.js)
- Image: Uses authored `<picture>` or optimizes `<img>`/URL; assigns alt; sets eager/high priority on first card.
- Tag: Builds from Tag rows and overlays onto the image.
- Text: Preserves existing heading/paragraph nodes; assigns `.title`/`.description` classes.
- CTA: Builds via Standard Button; note rendered as `.subdescription`.
- 3D Icons: Built via `create3DiconsFromRows` and appended in `.img-vector`.
- Instrumentation: Restored from first row onto the final card container.

## Authoring Notes (Universal Editor)
- Typical row mapping:
  - 0: title
  - 1: description
  - 2–8: Standard Button fields
  - 9: note
  - 10–12: Tag fields
  - 13: image
  - 14: image alt
  - 15–17: 3D icons flags

## Defaults and Fallbacks
- Missing CTA: button area omitted.
- Missing Tag or 3D icons: those areas are omitted.
