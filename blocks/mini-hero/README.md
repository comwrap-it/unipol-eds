# Mini Hero

## Overview
Compact hero with background image or video, title, optional subtitle and up to 3 bullet points, plus an optional button. Can be used standalone or as slides inside Mini Hero Carousel.

## Field Reference (UE Model)
- miniHeroBackgroundMediaSrc (reference, string): Background media. Use an image (AEM asset) or a video URL. For video, also enable `isVideoBackground`.
- isVideoBackground (boolean): Enables video background handling; image handling when false.
- miniHeroMainLabel (text, required, max 50): Main title.
- miniHeroSubtitle (text, max 50): Optional subtitle below the title.
- showMiniHeroBulletList (boolean): Toggles the bullet list.
- miniHeroBullet1/2/3 (text, max 40): Up to three bullet items. Used only when `showMiniHeroBulletList` is true.
- showMiniHeroButton (boolean): Toggles the call-to-action button.
- mini-hero-button-container (container): Standard Button configuration:
  - standardButtonLabel (text): Button label.
  - standardButtonVariant (select): `primary` | `secondary` | `accent`.
  - standardButtonHref (aem-content): Button URL. Can be a pasted URL or a link element.
  - standardButtonOpenInNewTab (boolean): Opens link in new tab when true.
  - standardButtonSize (select): Icon size `small` | `medium` | `large` | `extra-large`.
  - standardButtonLeftIcon/standardButtonRightIcon (select): Optional icon classes.

## Runtime Behavior
- Structure: `.mini-hero` → `.hero-bg` (picture or video, `aria-hidden`), `.hero-overlay`, `.hero-content` → `.main-section` (h2.hero-title, p.hero-subtitle, optional `ul.hero-bullets`).
- Image background: Cloned picture is set to eager load with async decoding and high fetch priority.
- Video background: `<video muted loop autoplay playsinline>` created from provided URL, with a play/pause toggle button that switches `un-icon-pause-circle`/`un-icon-play-circle` classes.
- Button placement: Standalone → button rendered inside a sibling `.button-section`. Carousel variant → button appended inside `.main-section`.
- Instrumentation: UE attributes are preserved via `moveInstrumentation()` when cloning/moving nodes.

## Authoring Notes
- Expected row order per Mini Hero:
  1) Background media, 2) `isVideoBackground`, 3) Title, 4) Subtitle,
  5) `showMiniHeroBulletList`, 6–8) Bullet 1–3,
  9) `showMiniHeroButton`, 10) Button label, 11) Variant, 12) Href, 13) Open in new tab, 14) Icon size, 15) Left icon, 16) Right icon.
- For `standardButtonHref`, either insert a link element (its `href` is read) or provide a plain URL.
- Keep texts within the specified max lengths to avoid truncation/clipping.
- When used inside Mini Hero Carousel, the carousel injects slider UI and sets the carousel placement for the button automatically.

## Defaults and Fallbacks
- Button: Variant defaults to `primary`; icon size defaults to `medium`.
- Bullets: Render only when `showMiniHeroBulletList` is true and at least one bullet is filled.
- Button is rendered only when `showMiniHeroButton` is true and a label is provided.
- If media is missing, the hero renders without a background; provide media for intended design.
