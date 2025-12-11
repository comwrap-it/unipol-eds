import { moveInstrumentation } from '../../scripts/scripts.js';
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
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/atoms/navigation-pill/navigation-pill.css`,
  );
  isStylesLoaded = true;
}

function extractNavigationPillValues(row) {
  const rows = Array.from(row.children);

  const rawFlag = rows[0]?.textContent?.trim() || 'false';
  const hideLabel = rawFlag === 'true';

  if (rows[0]) rows[0].textContent = '';

  const text = rows[1]?.textContent?.trim() || '';
  const variant = rows[2]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_VARIANTS.PRIMARY;
  const href = rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || undefined;
  const leftIcon = rows[4]?.textContent?.trim() || '';
  const lftIcnSze = rows[5]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM;
  const rightIcon = rows[6]?.textContent?.trim() || '';
  const rhtIcnSze = rows[7]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM;
  const instrumentation = extractInstrumentationAttributes(rows[1]);

  return {
    text,
    hideLabel,
    variant,
    href,
    leftIcon,
    lftIcnSze,
    rightIcon,
    rhtIcnSze,
    instrumentation,
  };
}

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
    cfg.hideLabel,
  );
}

function updatePillLabels() {
  const pills = document.querySelectorAll('.header-utilities-container .navigation-pill');

  pills.forEach((pill) => {
    const labelSpan = pill.querySelector('span:not(.icon)');

    if (labelSpan) {
      const text = labelSpan.textContent.trim();

      if (text && !pill.hasAttribute('aria-label')) {
        pill.setAttribute('aria-label', text);
      }

      if (window.innerWidth <= 1200) {
        labelSpan.classList.add('pill-hide-label');
      } else {
        labelSpan.classList.remove('pill-hide-label');
      }
    }
  });
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  let pillRows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) pillRows = Array.from(wrapper.children);

  const container = document.createElement('div');
  container.className = 'header-utilities-container';

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  const pillElements = pillRows.map((row) => {
    const pillEl = buildNavigationPill(row);

    if (hasInstrumentation) {
      moveInstrumentation(row, pillEl);
    }

    return pillEl;
  });

  pillElements.forEach((pillEl) => container.appendChild(pillEl));

  block.innerHTML = '';
  block.appendChild(container);
  block.classList.add('header-utilities-nav-pill');
  requestAnimationFrame(() => {
    updatePillLabels();

    requestAnimationFrame(updatePillLabels);
  });
  window.addEventListener('resize', updatePillLabels);
}
