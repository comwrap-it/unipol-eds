import {
  NAVIGATION_PILL_VARIANTS,
  NAVIGATION_PILL_ICON_SIZES,
  createNavigationPill,
} from '../atoms/navigation-pill/navigation-pill.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const base = window.hlx.codeBasePath;
  await Promise.all(
    [
      'blocks/atoms/navigation-pill/navigation-pill.css',
    ].map((p) => loadCSS(`${base}/${p}`)),
  );
  isStylesLoaded = true;
}

function buildNavigationPill() {
  return createNavigationPill(
    'NavPill',
    undefined,
    NAVIGATION_PILL_VARIANTS.SECONDARY,
    'search-icon',
    NAVIGATION_PILL_ICON_SIZES.LARGE,
    'phone-icon',
    NAVIGATION_PILL_ICON_SIZES.SMALL,
  );
}

/* -------- Main Decorator -------- */
export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  const headerNavPill = document.createElement('div');
  headerNavPill.className = 'header-navigation-pill';

  headerNavPill.appendChild(buildNavigationPill());

  // Mount
  block.innerHTML = '';
  block.appendChild(headerNavPill);
}
