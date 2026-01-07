# Category Carousel Widget

Auxiliary behavior for Category Carousel to toggle dark theme at section level.

## Overview
- Reads a boolean value to apply or remove `theme-dark` on the closest section.
- Loads its CSS when used.

## Field Reference (UE Model)
- This widget does not define its own model. It reads text content from the second child within the carousel container to determine dark mode.

## Runtime Behavior (category-carousel-widget.js)
- Locates `.category-carousel-container` and reads the data attribute `categoryCarouselWidgetDarkTheme`.
- Applies or removes `theme-dark` on the nearest `.section` accordingly.
- Ensures `category-carousel-widget.css` is loaded.

## Authoring Notes (Universal Editor)
- Place the widget markup as children of the Category Carousel container if needed; set the `Tema scuro` boolean flag to `true` to enable dark theme.

## Defaults and Fallbacks
- Missing or non-`true` value: dark theme is not applied.
