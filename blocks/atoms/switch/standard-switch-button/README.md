# Standard Switch Button

## Overview
Toggle switch (checkbox with role=switch) with checked/unchecked state.

## Field Reference (UE Model)
- type (select): "unchecked" or "checked".
- disabled (switch): Toggle to disable switch.

## Runtime Behavior
- DOM: `<label.switch>` with `<input type=checkbox role=switch>` (unique ID and name).
- State: If type is "checked", input.checked is true.
- Disabled: Adds `.custom-disabled` class and disables pointer events on wrapper.
- Instrumentation: Restored to label element from first row.

## Authoring Notes
- Provide type (unchecked/checked) and disabled flag in two rows.

## Defaults and Fallbacks
- Type defaults to "unchecked"; disabled defaults to false.
