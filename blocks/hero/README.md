# Hero

Large hero section with background media (image or video), optional logo, title, subtitle(s), bullets, and optional CTA. Model in `_hero.json`; behavior in `hero.js`.

## Overview
- Supports background image or autoplaying looped video with play/pause toggle.
- Optional logo above the title, bold subtitle, rich-text subtitle, and up to three bullets.
- Optional Standard Button as CTA; layout adapts when used in a carousel.

## Field Reference (UE Model)
Source: `_hero.json` (model: `hero`).

1) heroBackgroundMediaSrc (reference)
- Purpose: Background media (image or video source link).

2) isVideoBackground (boolean)
- Purpose: Enable video background mode.

3) showHeroLogo (boolean)
- Purpose: Toggle displaying a logo inside the hero.

4) heroLogoMediaSrc (reference)
- Purpose: Logo image when `showHeroLogo` is true.
- Condition: Visible only if `showHeroLogo === true`.

5) heroMainLabel (text)
- Purpose: Main title.
- Required: Yes. Max length: 50.

6) heroSubtitleBold (text)
- Purpose: Bold subtitle line.
- Max length: 50.

7) heroSubtitle (richtext)
- Purpose: Supporting subtitle/copy.
- Max length: 150.

8) showHeroBulletList (boolean)
- Purpose: Enable bullet list (up to 3 items).

9) heroBullet1 (text)
10) heroBullet2 (text)
11) heroBullet3 (text)
- Purpose: Bullet items 1–3.
- Condition: Visible only if `showHeroBulletList === true`.

12) showHeroButton (boolean)
- Purpose: Toggle CTA button.

13) hero-button-container (container)
- standardButtonLabel (text): Button label.
- standardButtonVariant (select): `primary` | `secondary` | `accent`.
- standardButtonHref (aem-content): Target URL (optional). If provided, renders as `<a>`; otherwise `<button>`.
- standardButtonOpenInNewTab (boolean): Opens in a new tab when true.
- standardButtonSize (select): Icon size `small` | `medium` | `large` | `extra-large`.
- standardButtonLeftIcon / standardButtonRightIcon (select): Optional icon classes.
- Purpose: Configure the CTA via Standard Button fields.

## Runtime Behavior (hero.js)
- Background: Clones and optimizes image; or builds a `<video>` with looped autoplay and a play/pause control.
- Content: Creates title, optional bold subtitle and rich-text subtitle; optional bullet list.
- CTA: When present, renders via Standard Button; placed inside the main section when in a carousel.
- Accessibility: Background media marked `aria-hidden`; overlay added for contrast.

## Authoring Notes (Universal Editor)
- Field order matches extraction logic; ensure background, title, and optional elements are authored in order.
- Use `isVideoBackground` with a valid media link; the block creates the `<video>` element.

## Defaults and Fallbacks
- Missing logo/subtitles/bullets: corresponding sections are omitted.
- Without CTA, no button section is rendered.
