# Switch Button Field

## Overview
Compound field combining standard switch with label and description.

## Field Reference (UE Model)
- switchLabel (text): Primary text next to switch.
- switchDescription (text): Secondary text below label.
- switch-button-field-switch (container): Standard Switch fields (type, disabled).

## Runtime Behavior
- DOM: `.switch-button-field` (inline-flex) with switch element and `.switch-button-text-box` containing `.switch-button-label` and `.switch-button-description`.
- Disabled: Adds `.disabled-label` and `.disabled-description` classes when switch is disabled.
- Instrumentation: Restored from switch's first row to switch element.
- Standalone block: `decorateSwitchButtonField(block)` reads four rows (type, disabled, label, description) and renders the field.

## Authoring Notes
- Provide switch state first, then disabled, then label and description.

## Defaults and Fallbacks
- Type defaults to "unchecked"; blank label/description render as empty strings.
