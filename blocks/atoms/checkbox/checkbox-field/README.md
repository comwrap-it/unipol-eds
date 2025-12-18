# Checkbox Field

## Overview
Compound field combining the standard checkbox with a main label and optional description.

## Field Reference (UE Model)
- checkboxLabel (text): Main label.
- checkboxDescription (text): Secondary description.
- checkbox-field-checkbox (container): Standard Checkbox fields (`type`, `disabled`).

## Runtime Behavior
- DOM: `.checkbox-field` with the checkbox on the left and a `.checkbox-field-text-box` holding `.checkbox-field-label` and `.checkbox-field-description`.
- Disabled: Adds disabled styles to both label and description when the checkbox is disabled.
- Instrumentation: Restored from the checkbox’s first row onto the input.
- Standalone block: `decorateCheckboxField(block)` reads four rows and renders the field.

## Authoring Notes
- Provide checkbox state first, then disabled, then the label and description.

## Defaults and Fallbacks
- Type defaults to `unchecked`; blank label/description render as empty.
