# Header Navigation Section

Horizontal navigation composed of Pills with optional expandable boxes. Restricts children to navigation items. Model/filter in `_header-navigation-section.json`; behavior in `header-navigation-section.js`.

## Overview
- Renders a row of navigation pills; each can open a descriptive box below.
- Builds a mobile hamburger menu list with overflow pills and dispatches `unipol-mobile-menu-ready` for header integration.
- Applies sticky behavior and gradual hide/show of overflow pills on desktop scroll.

## Field Reference (UE Model)
Source: `_header-navigation-section.json`.

Model: `header-navigation-pill-and-box`
- Includes Navigation Pill fields from `atoms/navigation-pill/_navigation-pill.json` and an additional `header-box-top-text` field.

- header-nav-pill-tab (tab)
  - Purpose: UI grouping for pill fields.
- [Navigation Pill fields]
  - Purpose: Configure label/icon/variant/link of the pill.
- header-box-tab (tab)
  - Purpose: UI grouping for the box fields.
- header-box-top-text (text)
  - Purpose: Text shown inside the expandable box under the pill.

## Filters
- Filter: `header-navigation-section` → Allowed components: `header-navigation-pill-and-box`.

## Runtime Behavior (header-navigation-section.js)
- Builds pills via `createNavigationPill()` and wires expand/collapse to associated box panels.
- On desktop, makes nav sticky and hides overflow pills while scrolling; on mobile, shows secondary right icon.
- Updates widths and focusability of hidden pills; manages ARIA attributes and close buttons in mobile.
- Emits a mobile menu list of hidden pills for header consumption.

## Authoring Notes (Universal Editor)
- Each row defines one pill, with optional box text; the first pill may receive special style on certain templates.
- Use the pill fields to set label, icons, variant, and link; use `header-box-top-text` to provide box content.

## Defaults and Fallbacks
- Missing link or label results in non-interactive or visually minimal pills.
- If no boxes are defined, only the pills render.
