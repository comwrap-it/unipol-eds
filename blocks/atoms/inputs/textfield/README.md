# Textfield Input

## Overview
Single-line text input with floating label and optional hint.

## Field Reference (UE Model)
- textfieldLabel (text): Main label (required).
- textfieldIcon (select): Optional icon class.
- iconSize (text): Icon size.
- hintText (text): Helper text below textfield.
- hintIcon (select): Icon for hint.

## Runtime Behavior
- DOM: `.input-main-wrapper` > `.input-container` with `<input.input.textfield>`, `<label>`, optional icon span, and optional `.helper-container` with hint icon and text.
- Placeholder: Set to space to enable floating label CSS.
- Instrumentation: Restored to the main wrapper from first row.

## Authoring Notes
- Provide label, icon, icon size, hint text, and hint icon in five rows.

## Defaults and Fallbacks
- Label required; icon/hint optional. Blank values render as no icon/hint.
