# Select Input

## Overview
Combobox input with floating label and dropdown options list.

## Field Reference (UE Model)
- textfieldLabel (text): Main label; floats when value present.
- textfieldIcon (select): Optional icon class.
- iconSize (text): Icon size ("small", "medium", etc.).
- hintText (text): Helper text below input.
- hintIcon (select): Icon for hint.

## Runtime Behavior
- DOM: `.input-main-wrapper` > `.input-container` with `<button.input.select>` (role combobox), `.select-value` span, `<label>`, and chevron icon. Dropdown options list toggled programmatically.
- Floating label: Class `.has-value` added when options are selected.
- Accessible: `role=combobox`, `aria-haspopup=listbox`, `aria-expanded`, `aria-controls`, keyboard navigation (Arrow keys, Enter, Escape).
- Options list: Built via `createOptionsList` from `options-list.js`.
- Multi-select: Optional; values shown as comma-separated labels.

## Authoring Notes
- Provide label, optional icon, icon size, hint text, and hint icon in successive rows.
- Options array passed programmatically (not UE-authored inline).

## Defaults and Fallbacks
- Label required; blank icon defaults to none. Hint text/icon optional.
