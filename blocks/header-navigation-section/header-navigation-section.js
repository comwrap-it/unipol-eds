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

function updateHiddenPillsAccessibility(container) {
  const wrappers = container.querySelectorAll('.navigation-pill-wrapper');

  wrappers.forEach((wrapper) => {
    const isHidden = wrapper.classList.contains('nav-pill-hidden');
    const interactiveElements = wrapper.querySelectorAll('button, a');
    interactiveElements.forEach((el) => {
      if (isHidden) {
        el.setAttribute('aria-hidden', 'true');
        el.tabIndex = -1;
      } else {
        el.setAttribute('aria-hidden', 'false');
        el.tabIndex = 0;
      }
    });
  });
}

function closeBoxWithAnimation(box) {
  return new Promise((resolve) => {
    if (!box) {
      resolve();
    }

    box.classList.remove('header-box-open');

    let finished = false;

    const onEnd = (e) => {
      if (e && e.propertyName && !['max-height', 'opacity', 'transform'].includes(e.propertyName)) return;
      if (finished) return;
      finished = true;
      box.removeEventListener('transitionend', onEnd);
      box.style.display = 'none';
      resolve();
    };

    box.addEventListener('transitionend', onEnd, { once: true });

    setTimeout(() => {
      if (finished) return;
      finished = true;
      box.removeEventListener('transitionend', onEnd);
      box.style.display = 'none';
      resolve();
    }, 250);
  });
}

function showSecondRightIcon() {
  const icon = document.querySelector('.second-pill-right-icon');
  if (icon) icon.style.opacity = '1';
}

function hideSecondRightIcon() {
  const icon = document.querySelector('.second-pill-right-icon');
  if (icon) icon.style.opacity = '0';
}

function makeNavigationSticky(block) {
  const container = block.querySelector('.navigation-pill-container');
  if (!container) return;

  const header = document.querySelector('header');
  if (!header) return;

  const headerBottom = header.offsetTop + header.offsetHeight;
  let isSticky = false;
  let animating = false;

  const pillWrappers = Array.from(container.children).filter((el) => el.classList.contains('navigation-pill-wrapper'));

  const updateContainerWidth = () => {
    let width = 0;
    const gap = parseInt(getComputedStyle(container).gap || 0, 10);
    pillWrappers.forEach((w) => {
      if (!w.classList.contains('nav-pill-hidden')) {
        width += w.offsetWidth + gap;
      }
    });
    container.style.width = `${width}px`;
  };

  const hidePills = () => {
    if (animating) return;
    animating = true;
    const wrappersToHide = pillWrappers.slice(2).reverse();

    wrappersToHide.forEach((wrapper, i) => {
      setTimeout(() => {
        wrapper.classList.add('nav-pill-hidden');
        updateContainerWidth();
        updateHiddenPillsAccessibility(container);
        let finished = false;
        const onEnd = () => {
          if (finished) return;
          finished = true;
          wrapper.removeEventListener('transitionend', onEnd);

          if (i === wrappersToHide.length - 1) {
            animating = false;
            showSecondRightIcon();
          }
        };

        wrapper.addEventListener('transitionend', onEnd);

        setTimeout(onEnd, 100);
      }, i * 50);
    });
  };

  const showPills = () => {
    if (animating) return;
    animating = true;
    const wrappersToShow = pillWrappers.slice(2);

    wrappersToShow.forEach((wrapper, i) => {
      setTimeout(() => {
        wrapper.classList.remove('nav-pill-hidden');
        updateContainerWidth();
        updateHiddenPillsAccessibility(container);

        let finished = false;
        const onEnd = () => {
          if (finished) return;
          finished = true;
          wrapper.removeEventListener('transitionend', onEnd);

          if (i === wrappersToShow.length - 1) {
            animating = false;
            hideSecondRightIcon();
          }
        };

        wrapper.addEventListener('transitionend', onEnd);
        setTimeout(onEnd, 200);
      }, i * 60);
    });
  };

  window.addEventListener('scroll', () => {
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
  });
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
    text,
    hideLabel,
    variant,
    href,
    leftIcon,
    lftIcnSze,
    rightIcon,
    rhtIcnSze,
    instrumentation,
    boxText,
  };
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
      boxEl.textContent = cfg.boxText;
      boxEl.style.display = 'none';

      pillEl.setAttribute('aria-expanded', 'false');
      const boxId = `header-box-${Math.random().toString(36).substr(2, 9)}`;
      boxEl.id = boxId;
      pillEl.setAttribute('aria-controls', boxId);

      pillToBoxMap.set(pillEl, boxEl);

      pillEl.addEventListener('click', () => {
        const box = pillToBoxMap.get(pillEl);
        if (!box) return;

        const isClosed = box.style.display === 'none';

        if (openBoxRef.current && openBoxRef.current !== box) {
          const prevPill = [...pillToBoxMap.entries()]
            .find(([, b]) => b === openBoxRef.current)?.[0];
          closeBoxWithAnimation(openBoxRef.current);
          if (prevPill) {
            prevPill.setAttribute('aria-expanded', 'false');
            prevPill.classList.remove('header-nav-pill-active');
          }
        }

        if (isClosed) {
          box.style.display = 'block';
          requestAnimationFrame(() => box.classList.add('header-box-open'));
          pillEl.setAttribute('aria-expanded', 'true');
          pillEl.classList.add('header-nav-pill-active');
          openBoxRef.current = box;
        } else {
          closeBoxWithAnimation(box);
          pillEl.setAttribute('aria-expanded', 'false');
          pillEl.classList.remove('header-nav-pill-active');
          openBoxRef.current = null;
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

  document.addEventListener('click', (e) => {
    if (!openBoxRef.current) return;

    const box = openBoxRef.current;
    const pill = [...pillToBoxMap.entries()].find(([, b]) => b === box)?.[0];

    if (!box.contains(e.target) && !pill.contains(e.target)) {
      closeBoxWithAnimation(box);
      if (pill) {
        pill.setAttribute('aria-expanded', 'false');
        pill.classList.remove('header-nav-pill-active');
      }
      openBoxRef.current = null;
    }
  });

  makeNavigationSticky(block);
}
