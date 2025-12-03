import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  NAVIGATION_PILL_VARIANTS,
  NAVIGATION_PILL_ICON_SIZES,
  createNavigationPill,
  extractInstrumentationAttributes,
} from '../atoms/navigation-pill/navigation-pill.js';

/**
 * Carica CSS navigation pill
 */
let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/atoms/navigation-pill/navigation-pill.css`,
  );
  isStylesLoaded = true;
}

/**
 * Estrae dati da un row (singolo Navigation Pill)
 */
function extractNavigationPillValues(row) {
  const rows = Array.from(row.children);

  const text = rows[0]?.textContent?.trim() || 'Navigation Pill';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_VARIANTS.PRIMARY;
  const href = rows[2]?.querySelector('a')?.href || rows[2]?.textContent?.trim() || undefined;
  const leftIcon = rows[3]?.textContent?.trim() || '';
  const lftIcnSze = rows[4]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM;
  const rightIcon = rows[5]?.textContent?.trim() || '';
  const rhtIcnSze = rows[6]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM;
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    text, variant, href, leftIcon, lftIcnSze, rightIcon, rhtIcnSze, instrumentation,
  };
}

/**
 * Crea Navigation Pill
 */
function buildNavigationPill(row) {
  const cfg = extractNavigationPillValues(row);
  return createNavigationPill(
    cfg.text,
    cfg.href,
    cfg.variant,
    cfg.leftIcon,
    cfg.lftIcnSze,
    cfg.rightIcon,
    cfg.rhtIcnSze,
    cfg.instrumentation,
  );
}

/**
 * Decorator principale per header-navigation-pill-and-box
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  // Gestione wrapper opzionale
  let pillRows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) pillRows = Array.from(wrapper.children);

  // Contenitore flessibile pills
  const container = document.createElement('div');
  container.className = 'navigation-pill-container';
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '12px';

  // Flag strumentazione
  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  // Processa ogni pill
  const pillElements = pillRows.map((row) => {
    const pillEl = buildNavigationPill(row);

    // Mantieni strumentazione
    if (hasInstrumentation) {
      moveInstrumentation(row, pillEl);
    }

    return pillEl;
  });

  // Append pills al container
  pillElements.forEach((pillEl) => container.appendChild(pillEl));

  // Replace block originale
  block.innerHTML = '';
  block.appendChild(container);
  block.classList.add('header-navigation-pill-and-box');

  // Carica eventuale blocco dinamico (se necessario)
  await Promise.all(pillElements.map((pillEl) => loadBlock(pillEl)));
}
