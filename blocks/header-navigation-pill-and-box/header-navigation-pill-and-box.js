import {
  NAVIGATION_PILL_VARIANTS,
  NAVIGATION_PILL_ICON_SIZES,
  createNavigationPill,
  extractInstrumentationAttributes,
} from '../atoms/navigation-pill/navigation-pill.js';

let isStylesLoaded = false;

/**
 * Carica gli stili CSS del navigation pill
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const base = window.hlx.codeBasePath;
  await loadCSS(`${base}/blocks/atoms/navigation-pill/navigation-pill.css`);
  isStylesLoaded = true;
}

/**
 * Estrae i valori di un singolo Navigation Pill da un row
 */
function extractNavigationPillValues(row) {
  const rows = Array.from(row.children);

  const text = rows[0]?.textContent?.trim() || 'Navigation Pill';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_VARIANTS.PRIMARY;
  const href = rows[2]?.querySelector('a')?.href || rows[2]?.textContent?.trim();
  const leftIcon = rows[3]?.textContent?.trim() || '';
  const lftIcnSz = rows[4]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM;
  const rightIcon = rows[5]?.textContent?.trim() || '';
  const rghtIcnSz = rows[6]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM;
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    text,
    variant,
    href,
    leftIcon,
    lftIcnSz,
    rightIcon,
    rghtIcnSz,
    instrumentation,
  };
}

/**
 * Crea un Navigation Pill da un row
 */
function buildNavigationPill(row) {
  const cfg = extractNavigationPillValues(row);
  return createNavigationPill(
    cfg.text,
    cfg.href,
    cfg.variant,
    cfg.leftIcon,
    cfg.lftIcnSz,
    cfg.rightIcon,
    cfg.rghtIcnSz,
    cfg.instrumentation,
  );
}

/**
 * Decorator principale per header-navigation-pill-and-box
 */
export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  // Trova i rows effettivi, supporta wrapper opzionale
  let pillRows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) pillRows = Array.from(wrapper.children);

  // Contenitore flessibile per i pills
  const pillsContainer = document.createElement('div');
  pillsContainer.className = 'navigation-pill-cont';

  // Costruisci ogni pill dinamicamente dai row
  pillRows.forEach((row) => {
    const pillElement = buildNavigationPill(row);
    pillsContainer.appendChild(pillElement);
  });

  // Sostituisci contenuto originale con i pills ricreati
  block.innerHTML = '';
  block.appendChild(pillsContainer);
  block.classList.add('header-navigation-pill-and-box');
}
