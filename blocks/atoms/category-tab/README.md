# Category Tab

## Overview
Clickable tab with icon and capitalized category label. Intended for category switches and filters.

## Field Reference (UE Model)
- categoryTabLabel (text, required): Label text used to derive the category.
- categoryTabIcon (select, required): Icon class.
- categoryTabIconSize (select): Icon size `small` | `medium` | `large` | `extra-large`.

## Runtime Behavior
- DOM: `<button.category-tab>` containing an icon `<span.icon icon-{size} {icon}>` and a text `<span>`.
- Interaction: Click adds `.selected` to the tab.
- Instrumentation: Attributes restored onto the button.
- Standalone block: `decorateCategoryTab(block)` reads three rows and renders/updates the tab.

## Authoring Notes
- Label, icon, and icon size are read in order.

## Defaults and Fallbacks
- Icon size defaults to `medium`.
