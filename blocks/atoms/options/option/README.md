# Option

## Overview
Single selectable list item with optional description and checkbox.

## Field Reference (UE Model)
- option-checkbox-container (container): Standard Checkbox fields (type, disabled).
- label (text): Main option label (required).
- description (text): Secondary text below label.
- showCheckbox (switch): Toggle to show/hide the checkbox.

## Runtime Behavior
- DOM: `.option-container` > `<button.option>` (role option, aria-selected) with optional checkbox, `.texts-container` with `.title` and `.description`.
- Selection: On click or Enter/Space, toggles `.selected` class, updates `aria-selected`, and emits `option-click` custom event.
- Checkbox: Rendered via `createCheckbox` if `showCheckbox` is true; state toggles with selection.
- Instrumentation: Restored to the option button element.

## Authoring Notes
- Provide checkbox type, disabled flag, label, description, and showCheckbox switch in five rows.

## Defaults and Fallbacks
- Checkbox defaults to unchecked; showCheckbox defaults to false (no checkbox).
