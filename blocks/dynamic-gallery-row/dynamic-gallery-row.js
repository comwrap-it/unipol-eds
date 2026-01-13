import { createIconButton } from '../../scripts/libs/ds/components/atoms/buttons/icon-button/icon-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { isAuthorMode } from '../../scripts/utils.js';
import { createDynamicGalleryCardFromRows } from '../dynamic-gallery-card/dynamic-gallery-card.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    ),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/dynamic-gallery-card/dynamic-gallery-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

const stripInstrumentationAndIds = (root) => {
  if (!(root instanceof Element)) return;
  [root, ...root.querySelectorAll('*')].forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (
        attr.name.startsWith('data-aue-')
        || attr.name.startsWith('data-richtext-')
      ) {
        el.removeAttribute(attr.name);
      }
    });
    if (el.id) el.removeAttribute('id');
  });
};

/**
 * Duplicates slides to ensure enough for loop mode
 * @param {HTMLElement} wrapper - The swiper-wrapper element
 * @param {number} minSlides - Minimum number of slides needed
 */
const ensureEnoughSlides = (wrapper, minSlides = 10) => {
  const isAuthor = isAuthorMode();
  if (isAuthor) return;
  const originalSlides = Array.from(wrapper.children);
  const originalCount = originalSlides.length;

  if (originalCount === 0) return;

  // Calculate how many times we need to duplicate
  const duplicationsNeeded = Math.ceil(minSlides / originalCount);

  for (let i = 1; i < duplicationsNeeded; i += 1) {
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      // Remove any instrumentation/IDs from clones to avoid duplicates
      stripInstrumentationAndIds(clone);
      wrapper.appendChild(clone);
    });
  }
};

const BASE_SPEED_PX_PER_SECOND = 55;
const FAST_SPEED_PX_PER_SECOND = 70;
const HOVER_SLOWDOWN_MULTIPLIER = 3;

/**
 * Creates a self-contained, rAF-driven marquee.
 * The track must contain two identical groups placed side-by-side.
 */
const getCssNumberVar = (el, name, fallback) => {
  if (!el) return fallback;
  const raw = getComputedStyle(el).getPropertyValue(name)?.trim();
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
};

const initMarquee = (carouselEl, trackEl, groupEl, { speedPxPerSecond }) => {
  let rafId = null;
  let lastTime = 0;
  let offsetX = 0;

  let groupWidth = 0;
  let currentSpeedPxPerMs = Math.max(0, speedPxPerSecond) / 1000;
  let targetSpeedPxPerMs = Math.max(0, speedPxPerSecond) / 1000;

  const computeFromMeasurements = () => {
    groupWidth = groupEl?.getBoundingClientRect?.().width || 0;
  };

  const step = (t) => {
    if (!carouselEl?.isConnected || !trackEl?.isConnected) {
      rafId = null;
      return;
    }
    if (!lastTime) lastTime = t;
    const dt = Math.min(64, t - lastTime);
    lastTime = t;

    if (groupWidth <= 0) computeFromMeasurements();
    if (groupWidth <= 0) {
      rafId = requestAnimationFrame(step);
      return;
    }

    // Smooth speed transitions to avoid visual jerk on hover.
    currentSpeedPxPerMs += (targetSpeedPxPerMs - currentSpeedPxPerMs) * 0.18;
    offsetX -= currentSpeedPxPerMs * dt;

    // Wrap seamlessly when one full group has passed.
    if (offsetX <= -groupWidth) offsetX += groupWidth;
    if (offsetX > 0) offsetX -= groupWidth;

    trackEl.style.transform = `translate3d(${offsetX}px, 0, 0)`;
    rafId = requestAnimationFrame(step);
  };

  const play = () => {
    if (rafId) return;
    lastTime = 0;
    computeFromMeasurements();
    rafId = requestAnimationFrame(step);
  };

  const pause = () => {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = null;
    lastTime = 0;
  };

  const setHoverSlow = (enabled) => {
    const baseSpeed = Math.max(0, speedPxPerSecond) / 1000;
    targetSpeedPxPerMs = enabled
      ? baseSpeed / HOVER_SLOWDOWN_MULTIPLIER
      : baseSpeed;
  };

  const ro = 'ResizeObserver' in window
    ? new ResizeObserver(() => {
      computeFromMeasurements();
    })
    : null;

  ro?.observe?.(carouselEl);
  ro?.observe?.(groupEl);

  return {
    play,
    pause,
    setHoverSlow,
    destroy: () => {
      pause();
      ro?.disconnect?.();
    },
  };
};

/**
 *
 * @param {HTMLElement} block the block element
 * @returns {boolean} true if the block is the second dynamic-gallery-row in its section
 */
const isSecondSectionRow = (block) => {
  if (!block) return false;
  const parentSection = block.closest('.section');
  const rows = Array.from(
    parentSection?.querySelectorAll('.dynamic-gallery-row.block'),
  );
  return rows.length > 1 && rows[1] === block;
};

/**
 * Sets up event listeners for mouse enter/leave and custom play/pause events.
 * @param {object} marquee the marquee controller
 * @param {HTMLElement} carousel the carousel element
 * @param {HTMLElement} block the block element
 */
const setupListeners = (marquee, carousel, block = null) => {
  const isAuthor = isAuthorMode();
  if (!marquee || !carousel || isAuthor) return;
  carousel.addEventListener('mouseenter', () => {
    marquee.setHoverSlow(true);
  });
  carousel.addEventListener('mouseleave', () => {
    marquee.setHoverSlow(false);
  });

  const section = block?.closest('.section') || carousel.closest('.section');

  section.addEventListener('pauseDynamicGallery', () => {
    marquee.pause();
  });

  section.addEventListener('playDynamicGallery', () => {
    marquee.play();
  });
};

/**
 * Adds a play/pause button to the section containing the block.
 * @param {HTMLElement} block the block element
 */
const addPlayPauseBtnToSection = (block) => {
  if (!block) return;
  const section = block.closest('.section');
  if (!section) return;
  const alreadyExistentButton = section.querySelector(
    '.dynamic-gallery-play-pause-btn',
  );
  if (alreadyExistentButton) return;
  const button = createIconButton(
    'un-icon-pause-circle',
    'secondary',
    'extra-large',
    null,
    false,
  );
  button.classList.add('dynamic-gallery-play-pause-btn');
  const iconSpan = button.querySelector('span');
  button.addEventListener('click', () => {
    if (iconSpan.classList.contains('un-icon-pause-circle')) {
      iconSpan.classList.remove('un-icon-pause-circle');
      iconSpan.classList.add('un-icon-play-circle');
      const event = new Event('pauseDynamicGallery');
      section.dispatchEvent(event);
    } else if (iconSpan.classList.contains('un-icon-play-circle')) {
      iconSpan.classList.remove('un-icon-play-circle');
      iconSpan.classList.add('un-icon-pause-circle');
      const event = new Event('playDynamicGallery');
      section.dispatchEvent(event);
    }
  });
  section.appendChild(button);
};

export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();
  const isAuthor = isAuthorMode();

  const rows = Array.from(block.children);

  const carousel = document.createElement('div');
  carousel.className = 'dynamic-gallery-marquee';

  const track = document.createElement('div');
  track.className = 'dynamic-gallery-row marquee-track';

  const group = document.createElement('div');
  group.className = 'dynamic-gallery-row-group';

  const promises = rows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const card = await createDynamicGalleryCardFromRows(childrenRows);
    if (card) {
      moveInstrumentation(row, card);
      group.appendChild(card);
    }
  });

  await Promise.all(promises);

  // Duplicate content for seamless wrap
  ensureEnoughSlides(group, 10);

  // Two identical groups are required for a seamless infinite marquee.
  const groupClone = group.cloneNode(true);
  stripInstrumentationAndIds(groupClone);

  track.append(group, groupClone);
  carousel.appendChild(track);
  block.replaceChildren(carousel);
  addPlayPauseBtnToSection(block);

  const isSecondRow = isSecondSectionRow(block);
  const speedVarName = isSecondRow
    ? '--dynamic-gallery-marquee-speed-fast'
    : '--dynamic-gallery-marquee-speed';
  const fallbackSpeed = isSecondRow
    ? FAST_SPEED_PX_PER_SECOND
    : BASE_SPEED_PX_PER_SECOND;
  const speedPxPerSecond = getCssNumberVar(
    carousel,
    speedVarName,
    fallbackSpeed,
  );
  const marquee = initMarquee(carousel, track, group, {
    speedPxPerSecond,
  });
  if (!isAuthor) marquee.play();
  setupListeners(marquee, carousel, block);
}
