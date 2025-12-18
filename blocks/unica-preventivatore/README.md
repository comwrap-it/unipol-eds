# Unica Preventivatore

## Overview
Embeds an Angular-based custom element with a skeleton-first UX. In Universal Editor mode it shows a preview-only skeleton; at runtime it lazy-loads assets and reveals the component when it starts rendering.

## Field Reference (UE Model)
- No configurable fields. The block loads external assets under `static/js/standalone/*` and `static/css/standalone/styles.css`.

## Runtime Behavior
- Skeleton: Renders `.unica-preventivatore-skeleton` with a compact card structure (title, fields, date row, button, links).
- Author Mode: If `isAuthorMode(block)` returns true, remains as a skeleton and shows `ups-editor-badge` labeled "Preview only".
- Angular element: Appends `<tpd-disambiguazione-widget>` (hidden). Observes its DOM; once content appears, removes skeleton and reveals the element.
- Loading: Uses `setupAssetPathInterceptor('tpd-disambiguazione-widget')`, loads `styles.css` via `loadCSS`, and injects `runtime.js`, `polyfills.js`, `vendor.js`, and `main.js` as deferred module scripts.
- Timing: Defers load until the EDS delayed phase and when near the viewport (IntersectionObserver). Optionally schedules via `requestIdleCallback`.
- Fallback: Reveals after ~8s if rendering doesn’t start.

## Authoring Notes
- No rows/fields required; place the block where the Angular widget should render.
- In Universal Editor, the skeleton is expected; the widget is not loaded.

## Defaults and Fallbacks
- On asset load error, the skeleton is removed and the widget element is revealed to avoid dead-ends.
