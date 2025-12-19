# Standard Radio Button

## Overview
Single radio input with checked/unchecked state.

## Field Reference (UE Model)
- type (select): "unchecked" or "checked".
- disabled (switch): Toggle to disable radio button.

## Runtime Behavior
- DOM: `<label.radio>` with `<input type=radio>` (unique ID and name).
- State: If type is "checked", input.checked is true and `.circle-icon` class added. Change event toggles class.
- Disabled: Adds `.custom-disabled` class and disables pointer events on wrapper.
- Instrumentation: Restored to label element from first row.

## Authoring Notes
- Provide type (unchecked/checked) and disabled flag in two rows.

## Defaults and Fallbacks
- Type defaults to "unchecked"; disabled defaults to false.
