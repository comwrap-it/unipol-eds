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
    'NavPill',               // label
    '',                      // href
    NAVIGATION_PILL_VARIANTS.SECONDARY,
    'search-icon',           // leftIcon
    NAVIGATION_PILL_ICON_SIZES.LARGE,
    'phone-icon',            // rightIcon
    NAVIGATION_PILL_ICON_SIZES.SMALL,
    false,                   // openInNewTab
    NAVIGATION_PILL_TYPOLOGIES.CUSTOM,
    true,                    // showLeftIcon
    true,                    // showRightIcon
    {}                       // instrumentation
  );
}


export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const headerNavPill = document.createElement('div');
  headerNavPill.className = 'uheader-navigation-pill';


  headerNavPill.appendChild(buildNavigationPill());

  // Mount
  block.innerHTML = '';
  block.appendChild(headerNavPill);
}

