# Text Switch

## Overview
Binary toggle component with two labeled buttons and visual dot indicator for active side.

## Field Reference (UE Model)
- labelLeft (text): Text for left option.
- labelRight (text): Text for right option.
- initialActive (select): "left" or "right" for initial active state.
- text-switch-switch-label (container): Switch Label fields (status, label) for button styling.

## Runtime Behavior
- DOM: `.text-switch` with two `.switch-label` buttons; active button has `.active` class and `.switch-label-dot` child.
- Click handlers: Toggle active state between left and right; rebuild label DOM on each activation to add/remove dot.
- Functions: `activateLeft()` and `activateRight()` update classes and reconstruct label contents.

## Authoring Notes
- Provide labelLeft, labelRight, and initialActive in three rows.

## Defaults and Fallbacks
- labelLeft defaults to "Option A"; labelRight to "Option B"; initialActive defaults to "left".
