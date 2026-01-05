# Icons 3D

## Overview
Container for up to three 3D category icons: Vehicles & Mobility, Home & Family, and Personal Protection (Health).

## Field Reference (UE Model)
- vehiclesShowIcon (boolean): Show Vehicles & Mobility icon.
- homeShowIcon (boolean): Show Home & Family icon.
- personalShowIcon (boolean): Show Personal Protection icon.

## Runtime Behavior
- DOM: `.icons-3d` with one `.icons-3d-icon` per enabled icon; each icon contains an `<img>` with corresponding .webp asset (vehicles.webp, property.webp, welfare.webp).
- Icons: Mobility (`.icon-mobility`), Property (`.icon-property`), Welfare (`.icon-welfare`).
- Programmatic API: `create3Dicons(vehiclesShowIcon, homeShowIcon, personalShowIcon)` and `create3DiconsFromRows(rows)` for reuse in Cards and other blocks.
- Standalone block: `decorate3Dicons(block)` reads three boolean rows and builds the icon container.

## Authoring Notes
- Provide three boolean flags (true/false) for each icon in three rows.

## Defaults and Fallbacks
- All icons default to false (hidden).
