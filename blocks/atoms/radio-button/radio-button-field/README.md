# Radio Button Field

## Overview
Compound field combining standard radio button with label and description.

## Field Reference (UE Model)
- radioButtonlabel (text): Primary text next to radio.
- radioButtonDescription (text): Secondary text below label.
- radio-button-field-radio (container): Standard Radio fields (type, disabled).

## Runtime Behavior
- DOM: `.radio-button-field` (inline-flex) with radio element and `.radio-button-text-box` containing `.radio-button-label` and `.radio-button-description`.
- Disabled: Adds `.disabled-label` and `.disabled-description` classes when radio is disabled.
- Instrumentation: Restored from radio's first row to radio element.
- Standalone block: `decorateRadioButtonField(block)` reads four rows (type, disabled, label, description) and renders the field.

## Authoring Notes
- Provide radio state first, then disabled, then label and description.

## Defaults and Fallbacks
- Type defaults to "unchecked"; blank label/description render as empty strings.
