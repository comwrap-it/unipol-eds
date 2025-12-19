# Checkbox (Standard)

## Overview
Accessible checkbox atom supporting checked and indeterminate states, with keyboard and ARIA updates.

## Field Reference (UE Model)
- type (select): `unchecked` | `checked` | `indeterminate`.
- disabled (switch): Disables the checkbox when true.

## Runtime Behavior
- DOM: `<label.checkbox>` wrapping `<input type="checkbox">` and `<span.checkbox-custom>` used for icon rendering (`un-icon-check` or `un-icon-minus`).
- ARIA: Sets `aria-checked` to `true`/`false`/`mixed` accordingly. Disabled adds `aria-disabled=true` and styling.
- Instrumentation: Restored onto the input element.
- Standalone block: `decorateCheckbox(block)` reads rows and renders the checkbox, preserving UE structure.

## Authoring Notes
- Choose one of the three states and optionally toggle disabled.

## Defaults and Fallbacks
- Type defaults to `unchecked`.
