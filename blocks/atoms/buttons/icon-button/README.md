# Icon Button

Utility block and helper for rendering a single, stylable icon-only button. It can render as a native `<button>` or as a link (`<a>`) depending on the configured URL. The Universal Editor (UE) model is defined in `_icon-button.json` and the runtime behavior in `icon-button.js`.

## Overview
- Renders one clickable element: either `<button>` or `<a role="button">`.
- Applies variant and size via CSS classes.
- Injects the chosen icon as a child `<span>` with icon classes.
- Preserves Universal Editor instrumentation attributes on the rendered element.
- Adds keyboard support (Enter/Space) and `tabindex="0"` for accessibility.

## Field Reference (UE Model)
Source: `_icon-button.json` (fields are read by row order).

1) iconButtonIcon (select)
- Purpose: Choose which icon to render.
- Values: `""` (none), `un-icon-chevron-left`, `un-icon-chevron-right`, `un-icon-search`.
- Required: Yes (the model marks it required; an empty value results in no icon class).
- How it works: The chosen value becomes part of the icon span class list: `span.class = "icon icon-{size} {iconClass}"`. If the value is empty, the span has no specific icon class and nothing will display.

2) iconButtonVariant (select)
- Purpose: Visual style of the button.
- Default: `primary`.
- Values: `primary`, `secondary`.
- How it works: Applied to the root element as `btn-icon-{variant}` (e.g., `btn-icon-primary`, `btn-icon-secondary`).

3) iconButtonSize (select)
- Purpose: Size of the icon inside the button.
- Default: `medium`.
- Values: `small`, `medium`, `large`, `extra-large`.
- How it works: Applied to the icon span as `icon-{size}` (e.g., `icon-medium`). Ensure corresponding CSS exists for sizes.

4) iconButtonHref (aem-content)
- Purpose: Optional link URL. If provided, the component renders an anchor; otherwise a button.
- How it works:
  - With URL: element is `<a>` with `href` and `role="button"`.
  - Without URL: element is a native `<button>`.

5) iconButtonOpenInNewTab (boolean)
- Purpose: Open the link in a new tab/window (only relevant when a URL is set).
- Default: `false`.
- How it works: When `true` and `href` is present, sets `target="_blank"` and `rel="noopener noreferrer"` on the `<a>`.

## Runtime Behavior (icon-button.js)
- Element type: Chooses `<a>` vs `<button>` based on whether a non-empty `href` is provided.
- Classes on root: Always includes `btn-icon` and `btn-icon-{variant}` (defaults to `primary`).
- Icon element: Creates a child `<span>` with classes `icon icon-{size} {iconClass}`.
- Accessibility: Adds `tabindex="0"` and keydown handler for Enter/Space to trigger `.click()`.
- Instrumentation: Any UE instrumentation found on the first row is copied onto the rendered element so Universal Editor remains fully functional.

## Authoring Notes (Universal Editor)
- Field-to-row mapping (by order):
  - Row 0 → `iconButtonIcon`
  - Row 1 → `iconButtonVariant`
  - Row 2 → `iconButtonSize`
  - Row 3 → `iconButtonHref`
  - Row 4 → `iconButtonOpenInNewTab`
- With instrumentation present, the decorator preserves UE structure and injects/updates the button inside the first row. Without instrumentation, it replaces the block content with the rendered button.

## DOM Output Examples
Button (no URL):

```html
<button class="btn-icon btn-icon-primary" tabindex="0">
  <span class="icon icon-medium un-icon-search"></span>
</button>
```

Link (with URL, new tab):

```html
<a class="btn-icon btn-icon-secondary" href="/search" role="button" target="_blank" rel="noopener noreferrer" tabindex="0">
  <span class="icon icon-large un-icon-chevron-right"></span>
</a>
```

## Defaults and Fallbacks
- Variant defaults to `primary` if unset/unknown.
- Icon size defaults to `medium` if unset/unknown.
- `openInNewTab` only has an effect when a valid `href` is provided.
- An empty icon value renders no specific icon class on the span, resulting in no visible glyph.
