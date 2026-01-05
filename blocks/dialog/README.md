# Dialog

Modal dialog with optional action button. The UE model is in `_dialog.json`; behavior in `dialog.js`.

## Overview
- Renders an overlay and a modal panel with header, content, and footer.
- Close button (icon) dismisses the dialog with animation and restores body scroll.
- Optional Standard Button in the footer for primary action.
- Preserves UE instrumentation on title and rich text.

## Field Reference (UE Model)
Source: `_dialog.json` (model: `dialog`).

1) dialogTitleLabel (text)
- Purpose: Dialog title text.
- Required: Yes.
- Validation: `maxLength: 80` with custom error message.

2) dialogTextContentRichtext (richtext)
- Purpose: Main dialog content.
- Default: empty.

3) actionButtonConfig (container)
- standardButtonLabel (text): Button label.
- standardButtonVariant (select): `primary` | `secondary` | `accent`.
- standardButtonHref (aem-content): Target URL (optional). If provided, renders as `<a>`; otherwise `<button>`.
- standardButtonOpenInNewTab (boolean): Opens in a new tab when true.
- standardButtonSize (select): Icon size `small` | `medium` | `large` | `extra-large`.
- standardButtonLeftIcon / standardButtonRightIcon (select): Optional icon classes.
- Purpose: Configure the footer action button.
- Fields: Inlines all fields from `atoms/buttons/standard-button/_standard-button.json`.

## Runtime Behavior (dialog.js)
- Structure: Builds `.dialog` containing `.dialog-overlay` and an `<aside.dialog-panel role="dialog" aria-modal="true">`.
- Header: Contains a close Icon Button (`un-icon-close`) and the title (`.dialog-title`).
- Content: Renders the provided rich text inside `.dialog-text-content`.
- Footer: If a Standard Button label is provided, creates a button via `createButton(...)` and appends it.
- Interactions: Locks body scroll when opened; on close, animates out and unlocks scroll; overlay and panel get `is-closing` class.

## Authoring Notes (Universal Editor)
- Field-to-row mapping (typical):
  - Title → `dialogTitleLabel`
  - Content → `dialogTextContentRichtext`
  - Button → `actionButtonConfig` (Standard Button fields)
- Instrumentation is restored on rendered title and content to keep them editable.

## Defaults and Fallbacks
- No rich text: dialog shows only title and footer (if configured).
- No action button configured: footer renders empty.
