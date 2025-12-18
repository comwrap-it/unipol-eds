# Prodotto Unico Header

## Overview
Brand header with logo and up to three action buttons (cart, user, phone). Reads logo and link from the first two rows and builds a tools list from subsequent rows.

## Field Reference (UE Model)
- logoImage (reference, required): Brand logo image.
- logoLink (text): Destination URL for the logo anchor.
- Actions (`prodotto-unico-header-action`, 1–3 allowed):
  - icon (select): `cart` | `user` | `phone`.
  - link (text): Target URL; can be a pasted URL or link element.

## Runtime Behavior
- Logo: Wraps the logo `<img>` in an `<a>` pointing to `logoLink`. Sets `alt="Unipol"`, `loading="eager"`, and `fetchPriority="high"`. Moves instrumentation to the anchor.
- Rows: Hides the `logoLink` row after building the logo. Action rows are also hidden after rendering.
- Actions: Creates `.header-tools > ul` with items containing `.header-button-{icon}` and a `.tool-btn` anchor holding a `span.icon.icon-{icon}`.
- Instrumentation: Preserves Universal Editor attributes with `moveInstrumentation()` for both icon and link cells.
- Icons: Calls `decorateIcons(block)` to ensure icon sprites/styles are applied.

## Authoring Notes
- Provide the first two rows for the logo image and link. Then add 1–3 action rows where columns are: [icon, link].
- For the link, either add an anchor element (its `href` is read) or plain text URL.

## Defaults and Fallbacks
- If `logoLink` is empty, it defaults to `/`.
- Action rows without an icon value are ignored.
