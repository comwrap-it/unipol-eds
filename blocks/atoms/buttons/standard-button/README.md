# Standard Button

## Overview
Reusable button/link atom supporting variants and optional left/right icons. Preserves UE instrumentation and keyboard accessibility.

## Field Reference (UE Model)
- standardButtonLabel (text): Button label.
- standardButtonVariant (select): `primary` | `secondary` | `accent`.
- standardButtonHref (aem-content): Target URL (optional). If provided, renders as `<a>`; otherwise `<button>`.
- standardButtonOpenInNewTab (boolean): Opens in a new tab when true.
- standardButtonSize (select): Icon size `small` | `medium` | `large` | `extra-large`.
- standardButtonLeftIcon / standardButtonRightIcon (select): Optional icon classes.

## Runtime Behavior
- DOM: `<a|button>.btn.btn-{variant}` with optional `<span id="left-icon">` and `<span id="right-icon">` using `icon-{size}` and the chosen icon class.
- Accessibility: Adds `tabindex=0`, simulates click on Enter/Space; links get `role=button`.
- Instrumentation: Attributes from UE are extracted and restored onto the final element.
- Helpers: `createButton(label, href, openInNewTab, variant, iconSize, leftIcon, rightIcon, instrumentation)` and `createButtonFromRows(rows)`.
- Standalone block: `decorateButton(block)` handles authored rows and preserves editor structure when instrumentation is present.

## Authoring Notes
- Provide a link element or plain URL in `standardButtonHref`. When a link element is present, its `href` is used.
- Icon size applies to both icons independently via their own `<span>`.

## Defaults and Fallbacks
- Variant defaults to `primary`; icon size defaults to `medium`.
- No label → button is not created in `createButtonFromRows`.
