# Editorial Carousel Card

Molecule card used inside Editorial Carousel. Includes title, description, image, optional CTA button, and optional note. Model in `_editorial-carousel-card.json`; behavior in `editorial-carousel-card.js`.

## Overview
- Renders a responsive image, text content (title + description), and optional CTA + note.
- Supports two sizes (S, M) impacting image breakpoints and layout.
- Preserves UE instrumentation when transforming authored rows into finalized markup.

## Field Reference (UE Model)
Source: `_editorial-carousel-card.json` (model: `editorial-carousel-card`).

1) title (text)
- Purpose: Card heading.
- Required: Yes.
- Validation: `maxLength: 65`.

2) description (text)
- Purpose: Supporting copy under the title.
- Required: Yes.
- Validation: `maxLength: 200`.

3) button-container (container)
- standardButtonLabel (text): Button label.
- standardButtonVariant (select): `primary` | `secondary` | `accent`.
- standardButtonHref (aem-content): Target URL (optional). If provided, renders as `<a>`; otherwise `<button>`.
- standardButtonOpenInNewTab (boolean): Opens in a new tab when true.
- standardButtonSize (select): Icon size `small` | `medium` | `large` | `extra-large`.
- standardButtonLeftIcon / standardButtonRightIcon (select): Optional icon classes.
- Purpose: Configure an optional CTA button.
- Fields: Inlines all fields from `atoms/buttons/standard-button/_standard-button.json` (transformed into a link button at runtime).

1) image (reference)
- Purpose: Card image asset.
- Type: string reference; required.

1) imageSR (text)
- Purpose: Image alternative text for screen readers.
- Required: Yes.

## Runtime Behavior (editorial-carousel-card.js)
- Structure: Wraps content in `.editorial-carousel-card-container.card-block` with an image section and content section.
- Image handling: Uses breakpoints depending on size (S or M) and prioritizes the first card’s image for LCP.
- Title/description: Attempts to preserve existing heading/paragraph nodes; falls back to newly created elements.
- CTA: Builds a link-style button from Standard Button fields; optionally appends a `.subdescription` note.
- Instrumentation: Collects and re-applies UE attributes from rows and block to final nodes.

## Authoring Notes (Universal Editor)
- Typical row mapping:
  - Row 0 → `title`
  - Row 1 → `description`
  - Rows 2–8 → Standard Button fields (converted to link button)
  - Row 9 → Note (optional)
  - Later rows → `image`, `imageSR`
- The first card in a carousel is treated as LCP candidate for image loading.

## Defaults and Fallbacks
- Missing button: CTA area is omitted.
- Missing description: only title renders.
- Missing image: card renders without media; provide a valid asset to avoid layout issues.
