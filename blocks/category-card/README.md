# Category Card

Category card with image, 3D icon of the category, title/description, category chips and note. Model in `_category-card.json`; behavior in `category-card.js`.

## Overview
- Renders product image, text content, category chips with note and 3D icon.
- Preserves UE instrumentation and optimizes images.

## Field Reference (UE Model)
Source: `_category-card.json` (model: `category-card`).

1) title (text)
- Purpose: Card title. Required; max 25 chars.

2) description (text)
- Purpose: Supporting copy. Required; max 130 chars.

3) note (text)
- Purpose: Small note under category chips. Required; max 25 chars.

4) image (reference)
- Purpose: Product image.
- Required: Yes.

5) imageSR (text)
- Purpose: Image alt text. Required.

6) category (select)
- Purpose: Configure vehicle/property/welfare category.
- Required: Yes.

7) category chip icon (select)
- Purpose: Select an icon to be displayed in the category chip.

8) category chip text (text)
- Purpose: text displayed in category chip.

9) category chip icon (select)
- Purpose: Select an icon to be displayed in the category chip.

10) category chip text (text)
- Purpose: text displayed in category chip.

11) category chip icon (select)
- Purpose: Select an icon to be displayed in the category chip.

12) category chip text (text)
- Purpose: text displayed in category chip.

13) category chip icon (select)
- Purpose: Select an icon to be displayed in the category chip.

14) category chip text (text)
- Purpose: text displayed in category chip.

## Runtime Behavior (category-card.js)
- Image: Uses authored `<picture>` or optimizes `<img>`/URL; assigns alt.
- 3D Icon: Built via `create3DiconsFromRows`.
- Text: Preserves existing heading/paragraph nodes; assigns `.title`/`.description` classes.
- Category chips: Builds via `Category Chip`.
- Note rendered as `text`.

## Authoring Notes (Universal Editor)
- Typical row mapping:
  - 0: title
  - 1: description
  - 2: note
  - 3: image
  - 4: imageSR
  - 5: category
  - 6: first Category Chip icon and text
  - 7: second Category Chip icon and text
  - 8: third Category Chip icon and text
  - 9: fourth Category Chip icon and text

## Defaults and Fallbacks
- The 3D icons picks the category selected and always displayed.
- Category chips displayed only if configured both text and icon 
