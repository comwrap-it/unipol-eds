# Link Button

## Overview
Textual link with optional left/right icons and disabled state. Keyboard-accessible and instrumentation-friendly.

## Field Reference (UE Model)
- linkButtonLabel (text, required, max 30): Link text.
- linkButtonHref (aem-content, required): Destination URL; can be a link element or plain URL.
- linkButtonOpenInNewTab (boolean): Opens in a new tab when true.
- linkButtonLeftIcon / linkButtonRightIcon (select): Optional icon classes.
- linkButtonLeftIconSize / linkButtonRightIconSize (select): Icon sizes `small` | `medium` | `large` | `extra-large`.
- linkButtonDisabled (switch): Disables the link when true.

## Runtime Behavior
- DOM: `<a.link-btn>` with optional icon `<span>`s prepended/appended using `icon-{size}` and the chosen icon class.
- Accessibility: Adds `tabindex=0`; Enter/Space trigger click; disabled sets `aria-disabled=true` and removes pointer events/tab focus.
- Helpers: `createLinkButton(...)` and `createLinkButtonFromRows(rows)`.
- Standalone block: `decorateLinkButton(block)` reads rows, updates/creates the link, and preserves editor structure when instrumentation is present.

## Authoring Notes
- Provide link via element or URL; when both icons are used, sizes can differ.
- `openInNewTab` adds `target=_blank` with `rel=noopener noreferrer`.

## Defaults and Fallbacks
- Label defaults to "Link"; href defaults to `#` when missing.
- Icon size defaults to `medium`.
