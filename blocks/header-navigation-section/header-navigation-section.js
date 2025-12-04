import { loadBlock } from '../../scripts/aem.js';
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
  // navigation-pill
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
  // box
  const boxText = rows[8]?.textContent?.trim() || '';

  return {
    // navigation-pill
    text,
    hideLabel,
    variant,
    href,
    leftIcon,
    lftIcnSze,
    rightIcon,
    rhtIcnSze,
    instrumentation,
    // box
    boxText,
  };
}

function buildNavigationPill(row, openBoxRef) {
  const cfg = extractNavigationPillValues(row);

  // Wrapper per pill + box
  const wrapper = document.createElement('div');
  wrapper.className = 'navigation-pill-wrapper';

  const pillEl = createNavigationPill(
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

  wrapper.appendChild(pillEl);

  if (cfg.boxText) {
    const box = document.createElement('div');
    box.className = 'header-box-text-container';
    box.textContent = cfg.boxText;
    box.style.display = 'none';

    wrapper.appendChild(box);

    pillEl.addEventListener('click', () => {
      if (box.style.display === 'none') {
        if (openBoxRef.current && openBoxRef.current !== box) {
          openBoxRef.current.style.display = 'none';
        }
        box.style.display = 'block';
        openBoxRef.current = box;
      } else {
        box.style.display = 'none';
        openBoxRef.current = null;
      }
    });
  }

  return wrapper;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  let pillRows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) pillRows = Array.from(wrapper.children);

  const container = document.createElement('div');
  container.className = 'navigation-pill-container';

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  const openBoxRef = { current: null };

  pillRows.forEach((row) => {
    const pillEl = buildNavigationPill(row, container, openBoxRef);

    if (hasInstrumentation) {
      moveInstrumentation(row, pillEl);
    }

    if (!pillEl.nextSibling || !pillEl.nextSibling.classList.contains('header-box-text-container')) {
      container.appendChild(pillEl);
    }
  });

  block.innerHTML = '';
  block.appendChild(container);
  block.classList.add('header-navigation-pill-and-box');

  await Promise.all(Array.from(container.children)
    .filter((el) => el.classList.contains('navigation-pill'))
    .map((pillEl) => loadBlock(pillEl)));
}
