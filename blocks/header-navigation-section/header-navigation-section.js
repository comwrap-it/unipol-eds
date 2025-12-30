import { createNavigationPill } from '@unipol-ds/components/atoms/navigation-pill/navigation-pill.js';
import { BUTTON_ICON_SIZES, NAVIGATION_PILL_VARIANTS } from '../../constants/index.js';
import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { extractInstrumentationAttributes, getTemplateMetaContent } from '../../scripts/utils.js';

let isStylesLoaded = false;
const openBoxRef = { box: null, pill: null };
let blockScrollHide = false;

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

function closeBoxWithAnimation(pill, box) {
  if (!box) return;

  const animator = box.querySelector('.header-box-text-content');
  if (!animator) return;

  const logoContainer = document.querySelector('.section.header-logo-container.header-navigation-section-container');
  const logoWrapper = document.querySelector('.header-logo-wrapper');
  const utilitiesWrapper = document.querySelector('.header-utilities-section-wrapper');

  const height = animator.scrollHeight;
  animator.style.height = `${height}px`;
  animator.style.opacity = '1';

  requestAnimationFrame(() => {
    animator.style.height = '0px';
    animator.style.opacity = '0';
  });

  const onEnd = (e) => {
    if (e.propertyName !== 'height') return;

    animator.style.height = '';
    animator.style.opacity = '';

    box.classList.remove('is-open');
    pill?.classList.remove('header-nav-pill-active');
    pill?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('body-header-overlay');
    if (logoContainer && logoWrapper && utilitiesWrapper) {
      logoContainer.style.position = '';
      logoContainer.style.top = '';
      logoContainer.style.zIndex = '';
      logoContainer.style.paddingTop = '';

      logoWrapper.style.zIndex = '';
      utilitiesWrapper.style.zIndex = '';
    }
    blockScrollHide = false;

    animator.removeEventListener('transitionend', onEnd);
  };

  animator.addEventListener('transitionend', onEnd);
}

async function closeBox(pill, box) {
  if (!box) return;
  await closeBoxWithAnimation(pill, box);

  pill?.classList.remove('header-nav-pill-active');
  pill?.setAttribute('aria-expanded', 'false');
}

function addCloseIconToBox(box, pill) {
  if (!box || !pill) return;
  if (box.querySelector('.un-close-btn')) return;

  const textContent = box.querySelector('.header-box-text-content');
  if (!textContent) return;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'un-close-btn';
  closeBtn.setAttribute('aria-label', 'Close Header Navigation box');

  const spanIcon = document.createElement('span');
  spanIcon.className = 'un-icon-close';
  closeBtn.appendChild(spanIcon);

  closeBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await closeBox(pill, box);
  });

  textContent.appendChild(closeBtn);
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
      width += w.offsetWidth + 4;
    }
  });
  container.style.width = `${width}px`;
}

function showSecondRightIcon() {
  const icon = document.querySelector('.second-pill-right-icon');
  if (!icon) return;

  icon.style.display = 'block';

  const container = document.querySelector('.navigation-pill-container');
  if (container) {
    updateContainerWidth(container);
  }
}

function hideSecondRightIcon() {
  const icon = document.querySelector('.second-pill-right-icon');
  if (icon) icon.style.display = 'none';
}

function showMobileSecondRightIcon() {
  const icon = document.querySelector('.second-pill-right-icon');
  if (icon) icon.style.display = 'block';
}

let homepageCanHidePills = true;

function applyStickyHeaderRulesIfBoxOpen() {
  const sectionWrapper = document.querySelector('.header-navigation-section-wrapper');
  const logoContainer = document.querySelector('.section.header-logo-container.header-navigation-section-container');
  const logoWrapper = document.querySelector('.header-logo-wrapper');
  const utilitiesWrapper = document.querySelector('.header-utilities-section-wrapper');
  const container = document.querySelector('.navigation-pill-container');

  const openBox = document.querySelector('.header-box-text-container.is-open');

  if (!sectionWrapper || !openBox) return;

  if (sectionWrapper.classList.contains('nav-header-sticky') && logoContainer && logoWrapper && utilitiesWrapper) {
    logoContainer.style.position = 'fixed';
    logoContainer.style.top = '0';
    logoContainer.style.zIndex = '3';
    logoContainer.style.paddingTop = '20px';

    logoWrapper.style.zIndex = '3';
    utilitiesWrapper.style.zIndex = '3';
    if (container) {
      const hiddenWrappers = container.querySelectorAll('.nav-pill-hidden');
      hiddenWrappers.forEach((wrapper) => wrapper.classList.remove('nav-pill-hidden'));
      updateHiddenPillsAccessibility(container);
      updateContainerWidth(container);
    }
  }
}

function openBoxWithAnimation(pill, box, { defaultOpen = false } = {}) {
  if (!box) return;

  const animator = box.querySelector('.header-box-text-content');
  if (!animator) return;

  const sectionWrapper = document.querySelector('.header-navigation-section-wrapper');
  const logoContainer = document.querySelector('.section.header-logo-container.header-navigation-section-container');
  const logoWrapper = document.querySelector('.header-logo-wrapper');
  const utilitiesWrapper = document.querySelector('.header-utilities-section-wrapper');
  const container = box.parentElement;

  document.querySelectorAll('.header-box-text-container.is-open').forEach((otherBox) => {
    if (otherBox !== box) {
      const otherAnimator = otherBox.querySelector('.header-box-text-content');
      if (!otherAnimator) return;

      otherAnimator.style.height = '';
      otherAnimator.style.opacity = '';
      otherBox.classList.remove('is-open');

      const otherPill = document.querySelector(`[aria-controls="${otherBox.id}"]`);
      if (otherPill) {
        otherPill.classList.remove('header-nav-pill-active');
        otherPill.setAttribute('aria-expanded', 'false');
      }
    }
  });

  box.classList.add('is-open');
  pill.classList.add('header-nav-pill-active');
  pill.setAttribute('aria-expanded', 'true');
  if (!defaultOpen) {
    document.body.classList.add('body-header-overlay');
  }
  if (sectionWrapper?.classList.contains('nav-header-sticky') && logoContainer && logoWrapper && utilitiesWrapper) {
    logoContainer.style.position = 'fixed';
    logoContainer.style.top = '0';
    logoContainer.style.zIndex = '3';
    logoContainer.style.paddingTop = '24px';

    logoWrapper.style.zIndex = '3';
    utilitiesWrapper.style.zIndex = '3';

    if (container) {
      const hiddenWrappers = container.querySelectorAll('.nav-pill-hidden');
      hiddenWrappers.forEach((wrapper) => wrapper.classList.remove('nav-pill-hidden'));
      updateHiddenPillsAccessibility(container);
      updateContainerWidth(container);
    }
    blockScrollHide = true;
  }

  if (!defaultOpen) {
    animator.style.height = '0px';
    animator.style.opacity = '0';

    requestAnimationFrame(() => {
      const height = animator.scrollHeight;
      animator.style.height = `${height}px`;
      animator.style.opacity = '1';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      animator.style.height = '';
      animator.removeEventListener('transitionend', onEnd);
    };
    animator.addEventListener('transitionend', onEnd);
  } else {
    animator.style.height = '';
    animator.style.opacity = '1';
  }
}

function observeHeaderPassingFirstSection(container) {
  const header = document.querySelector('header');
  const firstSectionAfterMain = document.querySelector('main .section');

  if (!header || !firstSectionAfterMain || !container) return;

  const sectionWrapper = container.closest('.header-navigation-section-wrapper');
  if (!sectionWrapper) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        sectionWrapper.classList.remove('header-sticky-gradient');
      } else {
        sectionWrapper.classList.add('header-sticky-gradient');
      }
    },
    {
      root: null,
      threshold: 0,
      rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
    },
  );

  observer.observe(firstSectionAfterMain);
}

function observeHomepageFirstSectionForPills(container) {
  const header = document.querySelector('header');
  const firstSectionAfterMain = document.querySelector('main .section');

  if (!header || !firstSectionAfterMain || !container) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      homepageCanHidePills = !entry.isIntersecting;
    },
    {
      root: null,
      threshold: 0,
      rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
    },
  );

  observer.observe(firstSectionAfterMain);
}

/* ------------------------------------------------------------------
   MAKE NAVIGATION STICKY
------------------------------------------------------------------ */
function makeNavigationSticky(block) {
  if (window.innerWidth < 1200) return () => {};

  const container = block.querySelector('.navigation-pill-container');
  if (!container) return () => {};

  const sectionWrapper = block.closest('.header-navigation-section-wrapper');
  if (!sectionWrapper) return () => {};

  const pillWrappers = Array.from(container.children)
    .filter((el) => el.classList.contains('navigation-pill-wrapper'));

  let lastScrollY = window.scrollY || window.pageYOffset;
  let animating = false;

  const hidePills = () => {
    if (animating || blockScrollHide) return;
    animating = true;
    const wrappersToHide = pillWrappers.slice(2).reverse();
    wrappersToHide.forEach((wrapper, i) => {
      setTimeout(() => {
        wrapper.classList.add('nav-pill-hidden');
        updateContainerWidth(container);
        updateHiddenPillsAccessibility(container);
        if (i === wrappersToHide.length - 1) {
          animating = false;
        }
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
        if (i === wrappersToShow.length - 1) {
          animating = false;
        }
      }, i * 20);
    });
  };

  const offsetTop = sectionWrapper.offsetTop + 35;

  const onScroll = () => {
    if (window.innerWidth < 1200) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const scrollingDown = scrollY > lastScrollY;
    lastScrollY = scrollY;

    const openBox = document.querySelector('.header-box-text-container.is-open');

    if (openBox) {
      sectionWrapper.classList.add('nav-header-sticky');
      applyStickyHeaderRulesIfBoxOpen();
      return;
    }

    if (scrollY <= offsetTop) {
      showPills();
      sectionWrapper.classList.remove('nav-header-sticky');
      hideSecondRightIcon();
      return;
    }

    if (scrollingDown) {
      if (getTemplateMetaContent() !== 'homepage' || homepageCanHidePills) {
        hidePills();
      }
      sectionWrapper.classList.add('nav-header-sticky');
      showSecondRightIcon();
    } else {
      if (getTemplateMetaContent() !== 'homepage' || homepageCanHidePills) {
        showPills();
      }
      sectionWrapper.classList.add('nav-header-sticky');
      showSecondRightIcon();
    }
  };

  window.addEventListener('scroll', onScroll);

  return () => {
    window.removeEventListener('scroll', onScroll);
    sectionWrapper.classList.remove('nav-header-sticky');
    pillWrappers.forEach((w) => w.classList.remove('nav-pill-hidden'));
    updateHiddenPillsAccessibility(container);
    hideSecondRightIcon();
  };
}

function handleHomepageFirstScroll() {
  let closedOnScroll = false;
  const startScrollY = window.scrollY;

  const onScroll = () => {
    if (closedOnScroll) return;

    if (Math.abs(window.scrollY - startScrollY) > 8) {
      closedOnScroll = true;

      const openBoxes = document.querySelectorAll('.header-box-text-container.is-open');

      openBoxes.forEach((box) => {
        const pill = document.querySelector(`[aria-controls="${box.id}"]`);

        document.body.classList.remove('body-header-overlay');

        box.classList.remove('is-open');
        const animator = box.querySelector('.header-box-text-content');
        if (animator) {
          animator.style.height = '';
          animator.style.opacity = '';
        }

        if (pill) {
          pill.classList.remove('header-nav-pill-active');
          pill.setAttribute('aria-expanded', 'false');
        }

        if (openBoxRef.box === box) openBoxRef.box = null;
        if (openBoxRef.pill === pill) openBoxRef.pill = null;
      });

      const logoContainer = document.querySelector('.section.header-logo-container.header-navigation-section-container');
      const logoWrapper = document.querySelector('.header-logo-wrapper');
      const utilitiesWrapper = document.querySelector('.header-utilities-section-wrapper');

      if (logoContainer && logoWrapper && utilitiesWrapper) {
        logoContainer.style.position = '';
        logoContainer.style.top = '';
        logoContainer.style.zIndex = '';
        logoContainer.style.paddingTop = '';

        logoWrapper.style.zIndex = '';
        utilitiesWrapper.style.zIndex = '';
      }

      document.body.classList.remove('body-header-overlay');
      blockScrollHide = false;

      window.removeEventListener('scroll', onScroll);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
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
    if (window.innerWidth < 1200) {
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
    lftIcnSze: rows[5]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM,
    rightIcon: rows[6]?.textContent?.trim() || '',
    rhtIcnSze: rows[7]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM,
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

      const textContent = document.createElement('div');
      textContent.className = 'header-box-text-content';

      const textWrapper = document.createElement('div');
      textWrapper.className = 'text-wrapper';

      if (window.innerWidth < 1200) {
        const span = document.createElement('span');
        span.textContent = cfg.boxText;
        textWrapper.appendChild(span);
      } else {
        textWrapper.textContent = cfg.boxText;
      }

      textContent.appendChild(textWrapper);
      boxEl.appendChild(textContent);

      const boxId = `header-box-${Math.random().toString(36).substr(2, 9)}`;
      boxEl.id = boxId;
      pillEl.setAttribute('aria-controls', boxId);
      pillEl.setAttribute('aria-expanded', 'false');
      pillToBoxMap.set(pillEl, boxEl);

      addCloseIconToBox(boxEl, pillEl);

      pillEl.addEventListener('click', () => {
        const box = pillToBoxMap.get(pillEl);
        if (!box) return;

        const isOpen = box.classList.contains('is-open');
        if (isOpen) {
          closeBoxWithAnimation(pillEl, box);
        } else {
          openBoxWithAnimation(pillEl, box);
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
  const template = getTemplateMetaContent();

  if (template === 'pagina-prodotto') {
    const firstPill = container.querySelector(
      '.navigation-pill-wrapper .navigation-pill',
    );

    if (firstPill) {
      firstPill.classList.remove('navigation-pill-secondary');
      firstPill.classList.add('navigation-pill-primary');
    }
  }

  observeHeaderPassingFirstSection(container);
  if (getTemplateMetaContent() === 'homepage') {
    observeHomepageFirstSectionForPills(container);
  }
  block.classList.add('header-navigation-pill-and-box');
  buildMobileMenu(container);
  updateContainerWidth(container);

  if (template === 'homepage') {
    const firstPill = container.querySelector('.navigation-pill');
    const firstBox = pillToBoxMap.get(firstPill);

    if (firstPill && firstBox) {
      openBoxWithAnimation(firstPill, firstBox, { defaultOpen: true });

      handleHomepageFirstScroll(firstPill, firstBox);
    }
  }

  const secondWrapper = container.children[1];
  if (secondWrapper) {
    const rightIconEl = secondWrapper.querySelector('.icon:last-child');
    if (rightIconEl) {
      rightIconEl.classList.add('second-pill-right-icon');
      rightIconEl.style.display = 'none';
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

  navigationResponsiveController(block);
}
