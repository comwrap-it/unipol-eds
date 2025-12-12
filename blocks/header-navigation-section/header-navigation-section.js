import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { getTemplateMetaContent } from '../../scripts/utils.js';
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

function buildMobileMenu(container) {
  const mobileMenu = document.createElement('ul');
  mobileMenu.className = 'mobile-nav-hidden-pills';

  const wrappers = Array.from(container.querySelectorAll('.navigation-pill-wrapper'));
  const hiddenWrappers = wrappers.slice(2);

  hiddenWrappers.forEach((wrapper) => {
    const li = document.createElement('li');
    li.className = 'mobile-nav-item';

    const pill = wrapper.querySelector('button, a');
    if (!pill) return;

    const cloned = pill.cloneNode(true);
    cloned.removeAttribute('aria-controls');
    cloned.removeAttribute('aria-expanded');

    li.appendChild(cloned);
    mobileMenu.appendChild(li);
  });

  document.dispatchEvent(
    new CustomEvent('unipol-mobile-menu-ready', { detail: mobileMenu }),
  );
}

function updateHiddenPillsAccessibility(container) {
  const wrappers = container.querySelectorAll('.navigation-pill-wrapper');
  wrappers.forEach((wrapper) => {
    const isHidden = wrapper.classList.contains('nav-pill-hidden');
    const interactiveElements = wrapper.querySelectorAll('button, a');
    interactiveElements.forEach((el) => {
      el.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
      el.tabIndex = isHidden ? -1 : 0;
    });
  });
}

function closeBoxWithAnimation(box) {
  return new Promise((resolve) => {
    if (!box) {
      resolve();
      return;
    }
    box.classList.remove('header-box-open');
    let finished = false;
    const onEnd = (e) => {
      if (!(e && e.propertyName && !['max-height', 'opacity', 'transform'].includes(e.propertyName)) && !finished) {
        finished = true;
        box.removeEventListener('transitionend', onEnd);
        box.style.display = 'none';
        resolve();
      }
    };
    box.addEventListener('transitionend', onEnd, { once: true });
    setTimeout(() => { if (!finished) { finished = true; box.style.display = 'none'; resolve(); } }, 50);
  });
}

async function closeBox(pill, box) {
  if (!box) return;
  await closeBoxWithAnimation(box);

  pill?.classList.remove('header-nav-pill-active');
  pill?.setAttribute('aria-expanded', 'false');
}

function addCloseIconToBox(box, pill) {
  if (!box || !pill) return;
  if (window.innerWidth > 1200) return;

  if (box.querySelector('.un-close-btn')) return;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'un-close-btn';
  closeBtn.setAttribute('aria-label', 'Close Header Navigation box');

  const spanIcon = document.createElement('span');
  spanIcon.className = 'un-icon-close';

  closeBtn.appendChild(spanIcon);

  closeBtn.addEventListener('click', async () => {
    await closeBox(pill, box);
  });

  box.appendChild(closeBtn);
}

async function closeAllBoxesExcept(map, currentPill, currentBox) {
  if (!map || typeof map.entries !== 'function') return;

  const tasks = [];
  map.forEach((box, pill) => {
    if (box !== currentBox) {
      tasks.push(closeBox(pill, box));
    }
  });

  await Promise.all(tasks);
}

function showSecondRightIcon() {
  const icon = document.querySelector('.second-pill-right-icon');
  if (icon) icon.style.opacity = '1';
}

function hideSecondRightIcon() {
  const icon = document.querySelector('.second-pill-right-icon');
  if (icon) icon.style.opacity = '0';
}

function showMobileSecondRightIcon() {
  const icon = document.querySelector('.second-pill-right-icon');
  if (icon) icon.style.opacity = '1';
}

function updateContainerWidth(container) {
  const wrappers = Array.from(container.querySelectorAll('.navigation-pill-wrapper'));
  const ready = wrappers.some((w) => w.offsetWidth > 0);
  if (!ready) {
    return;
  }

  let width = 0;
  wrappers.forEach((w) => {
    if (!w.classList.contains('nav-pill-hidden')) {
      width += w.offsetWidth + 3.5;
    }
  });
  container.style.width = `${width}px`;
}

/* ------------------------------------------------------------------
   MAKE NAVIGATION STICKY
------------------------------------------------------------------ */
function makeNavigationSticky(block) {
  if (window.innerWidth <= 1200) return () => {};

  const container = block.querySelector('.navigation-pill-container');
  if (!container) return () => {};
  const header = document.querySelector('header');
  if (!header) return () => {};

  const headerBottom = header.offsetTop + header.offsetHeight;
  let isSticky = false;
  let animating = false;

  const pillWrappers = Array.from(container.children)
    .filter((el) => el.classList.contains('navigation-pill-wrapper'));

  const hidePills = () => {
    if (animating) return;
    animating = true;
    const wrappersToHide = pillWrappers.slice(2).reverse();
    wrappersToHide.forEach((wrapper, i) => {
      setTimeout(() => {
        wrapper.classList.add('nav-pill-hidden');
        updateContainerWidth(container);
        updateHiddenPillsAccessibility(container);
        if (i === wrappersToHide.length - 1) { animating = false; showSecondRightIcon(); }
      }, i * 20);
    });
  };

  const showPills = () => {
    if (animating) return;
    animating = true;
    const wrappersToShow = pillWrappers.slice(2);
    wrappersToShow.forEach((wrapper, i) => {
      setTimeout(() => {
        wrapper.classList.remove('nav-pill-hidden');
        updateContainerWidth(container);
        updateHiddenPillsAccessibility(container);
        if (i === wrappersToShow.length - 1) { animating = false; hideSecondRightIcon(); }
      }, i * 20);
    });
  };

  const onScroll = () => {
    if (window.innerWidth <= 1200) return;
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > headerBottom && !isSticky) {
      isSticky = true;
      container.classList.add('nav-header-sticky');
      hidePills();
    } else if (scrollY <= headerBottom && isSticky) {
      isSticky = false;
      container.classList.remove('nav-header-sticky');
      showPills();
    }
  };

  window.addEventListener('scroll', onScroll);

  return () => {
    window.removeEventListener('scroll', onScroll);
    container.classList.remove('nav-header-sticky');
    pillWrappers.forEach((w) => w.classList.remove('nav-pill-hidden'));
    updateHiddenPillsAccessibility(container);
    hideSecondRightIcon();
  };
}

/* ------------------------------------------------------------------
   CONTROLLER RESPONSIVE
------------------------------------------------------------------ */
function navigationResponsiveController(block) {
  let stickyCleanup = null;

  const recalcWidth = () => {
    const container = block.querySelector('.navigation-pill-container');
    if (!container) return;
    updateContainerWidth(container);
  };

  const check = () => {
    if (window.innerWidth <= 1200) {
      if (stickyCleanup) { stickyCleanup(); stickyCleanup = null; }
      recalcWidth();
      showMobileSecondRightIcon();
    } else {
      if (!stickyCleanup) stickyCleanup = makeNavigationSticky(block);
      recalcWidth();
    }
  };

  check();
  window.addEventListener('resize', check);
}

/* ------------------------------------------------------------------
   EXTRACT NAVIGATION PILL
------------------------------------------------------------------ */
function extractNavigationPillValues(row) {
  const rows = Array.from(row.children);
  const rawFlag = rows[0]?.textContent?.trim() || 'false';
  const hideLabel = rawFlag === 'true';
  if (rows[0]) rows[0].textContent = '';

  return {
    text: rows[1]?.textContent?.trim() || '',
    hideLabel,
    variant: rows[2]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_VARIANTS.PRIMARY,
    href: rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || undefined,
    leftIcon: rows[4]?.textContent?.trim() || '',
    lftIcnSze: rows[5]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM,
    rightIcon: rows[6]?.textContent?.trim() || '',
    rhtIcnSze: rows[7]?.textContent?.trim().toLowerCase() || NAVIGATION_PILL_ICON_SIZES.MEDIUM,
    instrumentation: extractInstrumentationAttributes(rows[1]),
    boxText: rows[8]?.textContent?.trim() || '',
  };
}

/* ------------------------------------------------------------------
   DECORATE
------------------------------------------------------------------ */
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
  const pillToBoxMap = new Map();

  const buildNavigationPill = (row) => {
    const cfg = extractNavigationPillValues(row);
    const wrapperEl = document.createElement('div');
    wrapperEl.className = 'navigation-pill-wrapper';
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
    wrapperEl.appendChild(pillEl);

    let boxEl = null;
    if (cfg.boxText) {
      boxEl = document.createElement('div');
      boxEl.className = 'header-box-text-container';
      boxEl.style.display = 'none';
      const textWrapper = document.createElement('div');
      textWrapper.className = 'header-box-text-content';
      textWrapper.textContent = cfg.boxText;
      boxEl.appendChild(textWrapper);
      const boxId = `header-box-${Math.random().toString(36).substr(2, 9)}`;
      boxEl.id = boxId;
      pillEl.setAttribute('aria-controls', boxId);
      pillEl.setAttribute('aria-expanded', 'false');
      pillToBoxMap.set(pillEl, boxEl);
      addCloseIconToBox(boxEl, pillEl);

      pillEl.addEventListener('click', async () => {
        const box = pillToBoxMap.get(pillEl);
        if (!box) return;
        const isClosed = box.style.display === 'none';
        await closeAllBoxesExcept(pillToBoxMap, pillEl, box);
        if (isClosed) {
          box.style.display = 'flex';
          requestAnimationFrame(() => box.classList.add('header-box-open'));
          pillEl.classList.add('header-nav-pill-active');
          pillEl.setAttribute('aria-expanded', 'true');
          openBoxRef.box = box;
          openBoxRef.pill = pillEl;
          addCloseIconToBox(box, pillEl);
        } else {
          await closeBox(pillEl, box);
          openBoxRef.box = null;
          openBoxRef.pill = null;
        }
      });
    }

    return { wrapperEl, boxEl };
  };

  const boxes = [];
  pillRows.forEach((row) => {
    const { wrapperEl, boxEl } = buildNavigationPill(row);
    if (hasInstrumentation) moveInstrumentation(row, wrapperEl);
    container.appendChild(wrapperEl);
    if (boxEl) boxes.push(boxEl);
  });
  boxes.forEach((box) => container.appendChild(box));

  block.innerHTML = '';
  block.appendChild(container);
  block.classList.add('header-navigation-pill-and-box');
  buildMobileMenu(container);
  updateContainerWidth(container);

  const template = getTemplateMetaContent();
  if (template === 'homepage') {
    const firstWrapper = container.querySelector('.navigation-pill-wrapper');
    if (firstWrapper) {
      const firstPill = firstWrapper.querySelector('.navigation-pill');
      const firstBox = pillToBoxMap.get(firstPill);

      if (firstPill && firstBox) {
        firstBox.style.display = 'flex';
        requestAnimationFrame(() => firstBox.classList.add('header-box-open'));

        firstPill.classList.add('header-nav-pill-active');
        firstPill.setAttribute('aria-expanded', 'true');

        openBoxRef.box = firstBox;
        openBoxRef.pill = firstPill;

        addCloseIconToBox(firstBox, firstPill);
      }
    }
  }

  const secondWrapper = container.children[1];
  if (secondWrapper) {
    const rightIconEl = secondWrapper.querySelector('.icon:last-child');
    if (rightIconEl) {
      rightIconEl.classList.add('second-pill-right-icon');
      rightIconEl.style.opacity = '0';
    }
  }

  await Promise.all(
    Array.from(container.children)
      .filter((el) => el.classList.contains('navigation-pill'))
      .map((pillEl) => loadBlock(pillEl)),
  );

  document.addEventListener('click', async (e) => {
    const { box, pill } = openBoxRef;
    if (!box) return;

    if (box.contains(e.target) || pill?.contains(e.target)) return;

    await closeBox(pill, box);
    openBoxRef.box = null;
    openBoxRef.pill = null;
  });
  window.addEventListener('resize', () => {
    pillToBoxMap.forEach((box, pill) => {
      if (window.innerWidth <= 1200) {
        addCloseIconToBox(box, pill);
      } else {
        const btn = box.querySelector('.un-close-btn');
        if (btn) box.removeChild(btn);
      }
    });
  });

  navigationResponsiveController(block);
  console.log('Template meta content:', getTemplateMetaContent());
}
