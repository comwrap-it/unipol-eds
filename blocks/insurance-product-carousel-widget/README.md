# Insurance Product Carousel Widget

Auxiliary behavior for Insurance Product Carousel to toggle dark theme at section level.

## Overview
- Reads a boolean value to apply or remove `theme-dark` on the closest section.
- Loads its CSS when used.

## Field Reference (UE Model)
- This widget does not define its own model. It reads text content from the second child within the carousel container to determine dark mode.

## Runtime Behavior (insurance-product-carousel-widget.js)
- Locates `.insurance-product-carousel-container` and reads the second child’s text (`"true"`/`"false"`).
- Applies or removes `theme-dark` on the nearest `.section` accordingly.
- Ensures `insurance-product-carousel-widget.css` is loaded.

## Authoring Notes (Universal Editor)
- Place the widget markup as children of the Insurance Product Carousel container if needed; set the second child’s content to `true` to enable dark theme.

## Defaults and Fallbacks
- Missing or non-`true` value: dark theme is not applied.
