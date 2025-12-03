import {
  NAVIGATION_PILL_VARIANTS,
  NAVIGATION_PILL_ICON_SIZES,
  createNavigationPill,
  extractInstrumentationAttributes,
} from '../atoms/navigation-pill/navigation-pill.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const base = window.hlx.codeBasePath;
  await loadCSS(`${base}/blocks/atoms/navigation-pill/navigation-pill.css`);
  isStylesLoaded = true;
}

function getNavigationPillConfig(row) {
  const rows = Array.from(row.children);
  return {
    text: rows[0]?.textContent?.trim() || 'Navigation Pill',
    variant: rows[1]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_VARIANTS.PRIMARY,
    href: rows[2]?.querySelector('a')?.href || rows[1]?.textContent?.trim() || undefined,
    leftIcon: rows[3]?.textContent?.trim() || '',
    leftIconSize: rows[4]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM,
    rightIcon: rows[5]?.textContent?.trim() || '',
    rightIconSize: rows[6]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM,
    instrumentation: rows[0] ? extractInstrumentationAttributes(rows[0]) : {},
  };
}

/**
 * Crea un Navigation Pill dal row
 */
function buildNavigationPill(row) {
  const cfg = getNavigationPillConfig(row);
  return createNavigationPill(
    cfg.text,
    cfg.href,
    cfg.variant,
    cfg.leftIcon,
    cfg.leftIconSize,
    cfg.rightIcon,
    cfg.rightIconSize,
    cfg.instrumentation,
  );
}

/**
 * Main decorator per header-navigation-pill-and-box
 */
export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  let pillRows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) pillRows = Array.from(wrapper.children);

  const pillsContainer = document.createElement('div');
  pillsContainer.className = 'navigation-pill-cont';

  pillRows.forEach((row) => {
    const pillElement = buildNavigationPill(row);
    pillsContainer.appendChild(pillElement);
  });

  block.innerHTML = '';
  block.appendChild(pillsContainer);
  block.classList.add('header-navigation-pill-and-box');
}
