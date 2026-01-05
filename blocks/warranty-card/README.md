# Warranty Card

## Overview
Card presenting warranty/coverage info by category, with icon, title, description, optional tag, and an optional link button that can load a fragment inline.

## Field Reference (UE Model)
- category (select, required): `mobility` | `welfare` | `property` | `default-mobility` | `default-welfare` | `default-property`.
- title (text, required, max 30): Card title.
- description (text, required, max 200): Short description.
- warranty-card-icon (select, required): Icon class (e.g., `un-icon-newspaper`, `un-icon-headphones`, `un-icon-play-circle`).
- button-label (text): Link button label.
- reference (aem-content): Target fragment/content URL. Used for the link button.
- tag-label (text): Optional tag label.

## Runtime Behavior
- DOM: `.warranty-card.{category}` with:
  - Icon + tag: `.icon-tag-wrapper` containing `.icon-wrapper` and optional Tag (from atoms/tag). Tag `category` and `type` are derived: for `default-*` categories, tag `type=custom` and no category; otherwise `type=secondary` and tag `category` reflects the card category.
  - Text: `.text-content` with `h3.title` and `p.description`. When authored with UE instrumentation, text is created via `createTextElementFromRow()` to preserve attributes.
  - Link button: `.link-btn` styled via `link-button.css`. Clicking loads the referenced fragment via `loadFragment(href)` and appends its section to `document.body`.
- Styles: Lazily loads tag and link-button CSS as needed.
- Instrumentation: Text rows preserve UE attributes when present.

## Authoring Notes
- Row order: 1) category, 2) title, 3) description, 4) icon class, 5) button label, 6) reference URL (link element or plain URL), 7) tag label.
- For the reference, you can provide a link element so its `href` is read automatically.
- Choose one of the supported icon classes; icons are rendered via CSS class.

## Defaults and Fallbacks
- If category is missing, defaults to `default-mobility`.
- The link button renders only if both label and href are present.
- Tag renders only if `tag-label` is provided.
