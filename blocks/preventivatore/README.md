# Preventivatore

## Overview
Embeds an external React application with a skeleton placeholder. Shows skeleton immediately, then swaps to the React-rendered UI when the app signals readiness or after a short fallback.

## Field Reference (UE Model)
- No configurable fields. The block loads assets from `static/js` and `static/css`.

## Runtime Behavior
- Skeleton: Renders `.preventivatore-skeleton` with desktop and mobile substructures to simulate form and promo layout.
- App container: Adds `#root` (initially hidden). Listens for `window.preventivatoreComponentReady` to hide the skeleton and reveal the React app.
- Fallback: If no event arrives, hides the skeleton after ~5s.
- Loading: Uses `loadScript('/static/js/main.bc1853d5.js')` and `loadCSS('/static/css/main.4efb37a3.css')`. Also preloads the JS and may defer loading with `requestIdleCallback` or a short timeout.

## Authoring Notes
- Content is provided entirely by the external React bundle; the skeleton is a visual placeholder only.
- Ensure the referenced static files exist and the app dispatches the `preventivatoreComponentReady` event when ready.

## Defaults and Fallbacks
- If script or CSS fails, the skeleton is hidden and the app container shown to avoid leaving placeholders forever.
- Without the readiness event, the fallback timeout reveals the app after 5 seconds.
