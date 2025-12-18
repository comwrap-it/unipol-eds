# Navigation Pill

## Overview
Clickable pill atom that can be a link or button, with optional left/right icons and a hideable label for icon-only UI.

## Field Reference (UE Model)
- showNavigationPillLabel (boolean): When `true`, label is visible; when `false`, label is hidden (icon-only).
- navigationPillLabel (text, required): Pill text.
- navigationPillVariant (select): `primary` | `secondary`.
- navigationPillHref (aem-content): Optional destination URL.
- navigationPillLeftIcon / navigationPillRightIcon (select): Optional icon classes.
- navigationPillLeftIconSize / navigationPillRightIconSize (select): Icon sizes `small` | `medium` | `large` | `extra-large`.

## Runtime Behavior
- DOM: `<a|button>.navigation-pill.navigation-pill-{variant}` with optional icon `<span>`s and label `<span>` unless hidden (then `aria-label` set).
- Accessibility: Adds `tabIndex=0`; Enter/Space trigger click; links get `role=button`.
- Helpers: `createNavigationPill(...)` and internal value extractors.
- Standalone block: `decorateNavigationPill(block)` reads rows, constructs the pill, and preserves UE instrumentation.

## Authoring Notes
- First row is the boolean flag to show or hide the label; subsequent rows fill label, variant, href, and icon choices.
- If `href` is provided, the pill renders as a link; otherwise as a button.

## Defaults and Fallbacks
- Variant defaults to `primary`; icon sizes default to `medium`.
- Missing label → falls back to "Navigation Pill".
