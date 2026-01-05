# Options List

## Overview
Container for multiple Option items with single or multi-select behavior.

## Field Reference (UE Model)
- Composed of multiple `unipol-option` items (each with 5 fields): option-checkbox-container, label, description, showCheckbox.

## Runtime Behavior
- DOM: `.options-list` containing one `.option-container` per configured option.
- Selection logic: If not multi-select, deselects all previously selected options on new selection. Emits `option-click` events from child options.
- Lazy CSS: Loads `option.css` and `checkbox.css` on first decorate.
- Programmatic API: `createOptionsList(optionsArray, setSelectedOption, canSelectMultiple, instrumentation)` exports for use in Select or other components.
- Standalone block: `decorate(block)` reads groups of 5 rows per option and builds the list.

## Authoring Notes
- Add multiple Option items; each item uses 5 fields (checkbox type, disabled, label, description, showCheckbox).
- Block-level filter: `options` for Universal Editor.

## Defaults and Fallbacks
- Each option falls back to standard Option defaults.
