import { moveInstrumentation } from "../../../scripts/scripts.js";
import { isAuthorMode } from "../../../scripts/utils.js";
import { createIconButton } from "../../atoms/buttons/icon-button/icon-button.js";
import {
  createDynamicGalleryCard,
  createDynamicGalleryCardFromRows
} from "../../molecules/cards/dynamic-gallery-card/dynamic-gallery-card.js";

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  try {
    if (isStylesLoaded) return;
    const { loadCSS } = await import("../../../scripts/aem.js");
    await Promise.all([
      loadCSS(
        new URL(
          "../../atoms/buttons/standard-button/standard-button.css",
          import.meta.url
        ).href
      ),
      loadCSS(new URL("../../atoms/tag/tag.css", import.meta.url).href),
      loadCSS(
        new URL(
          "../../molecules/cards/dynamic-gallery-card/dynamic-gallery-card.css",
          import.meta.url
        ).href
      )
    ]);
    isStylesLoaded = true;
  } catch (error) {
    console.error("Error loading styles for Dynamic Gallery Row:", error);
  }
}

/**
 * removes instrumentation attributes and IDs from the given root element and its descendants
 * @param {Element} root
 */
const stripInstrumentationAndIds = (root) => {
  if (!(root instanceof Element)) return;
  [root, ...root.querySelectorAll("*")].forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (
        attr.name.startsWith("data-aue-") ||
        attr.name.startsWith("data-richtext-")
      ) {
        el.removeAttribute(attr.name);
      }
    });
    if (el.id) el.removeAttribute("id");
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

/**
 * Handles the play/pause button click event.
 * @param {HTMLElement} iconEl the icon element inside the button
 * @param {HTMLElement} section the section containing the block
 */
const handlePlayPauseClick = (iconEl, section) => {
  if (iconEl.classList.contains("un-icon-pause-circle")) {
    iconEl.classList.remove("un-icon-pause-circle");
    iconEl.classList.add("un-icon-play-circle");
    const event = new Event("pauseDynamicGallery");
    section.dispatchEvent(event);
  } else if (iconEl.classList.contains("un-icon-play-circle")) {
    iconEl.classList.remove("un-icon-play-circle");
    iconEl.classList.add("un-icon-pause-circle");
    const event = new Event("playDynamicGallery");
    section.dispatchEvent(event);
  }
};

/**
 * Adds a play/pause button to the section containing the block.
 * @param {HTMLElement} block the block element
 */
const addPlayPauseBtnToSection = (block) => {
  if (!block) return;
  const section = block.closest(".section") || block.parentElement;
  if (!section) return;
  const alreadyExistentButton = section.querySelector(
    ".dynamic-gallery-play-pause-btn"
  );
  if (alreadyExistentButton) return;
  const button = createIconButton(
    "un-icon-pause-circle",
    "secondary",
    "extra-large",
    null,
    false
  );
  button.classList.add("dynamic-gallery-play-pause-btn");
  const iconSpan = button.querySelector("span");
  button.addEventListener("click", () =>
    handlePlayPauseClick(iconSpan, section)
  );
  section.appendChild(button);
};

/**
 *
 * @param {HTMLElement} block the block element
 * @returns {boolean} true if the block is the second dynamic-gallery-row in its parent element
 */
const isSecondSectionRow = (block) => {
  if (!block) return false;
  const parentSection = block.closest(".section") || block.parentElement;
  const parentEl = parentSection || block.parentElement;
  const rows = Array.from(
    parentEl?.querySelectorAll(
      parentSection ? ".dynamic-gallery-row.block" : ".dynamic-gallery-marquee"
    )
  );
  return rows.length > 1 && rows[1] === block;
};

const BASE_SPEED_PX_PER_SECOND = 55;
const FAST_SPEED_PX_PER_SECOND = 70;
// On hover we want to be 33% slower => speed becomes 2/3 of the original.
const HOVER_SPEED_FACTOR = 2 / 3;

/**
 * Creates a lightweight infinite marquee.
 *
 * Structure expectations:
 * - containerEl: the overflow-hidden viewport (where hover listeners are attached)
 * - beltEl: the element we translate on X (contains segment + cloned segment)
 * - segmentEl: the first segment; its width is the wrap distance
 */
const createMarqueeController = (
  containerEl,
  beltEl,
  segmentEl,
  { speedPxPerSecond }
) => {
  let rafId = null;
  let lastFrameTime = 0;
  let x = 0;

  let segmentWidth = 0;

  const baseSpeedPxPerMs = Math.max(0, speedPxPerSecond) / 1000;
  let currentSpeedPxPerMs = baseSpeedPxPerMs;
  let targetSpeedPxPerMs = baseSpeedPxPerMs;

  const measureSegmentWidth = () => {
    segmentWidth = segmentEl?.getBoundingClientRect?.().width || 0;

    // Keep x within a sane range after resizes to avoid a visible jump.
    if (segmentWidth > 0) {
      while (x <= -segmentWidth) x += segmentWidth;
      while (x > 0) x -= segmentWidth;
    }
  };

  const isAlive = () => containerEl?.isConnected && beltEl?.isConnected;

  const applyTransform = () => {
    beltEl.style.transform = `translate3d(${x}px, 0, 0)`;
  };

  const wrapX = () => {
    if (segmentWidth <= 0) return;
    if (x <= -segmentWidth) x += segmentWidth;
    if (x > 0) x -= segmentWidth;
  };

  const tick = (dt) => {
    // Smooth speed changes (hover in/out) so the belt doesn't "jerk".
    currentSpeedPxPerMs += (targetSpeedPxPerMs - currentSpeedPxPerMs) * 0.18;

    x -= currentSpeedPxPerMs * dt;
    wrapX();
    applyTransform();
  };

  const frame = (t) => {
    if (!isAlive()) {
      rafId = null;
      return;
    }

    if (!lastFrameTime) lastFrameTime = t;
    const dt = Math.min(64, t - lastFrameTime);
    lastFrameTime = t;

    if (segmentWidth <= 0) measureSegmentWidth();
    if (segmentWidth > 0) tick(dt);

    rafId = requestAnimationFrame(frame);
  };

  const play = () => {
    if (rafId) return;
    lastFrameTime = 0;
    measureSegmentWidth();
    rafId = requestAnimationFrame(frame);
  };

  const pause = () => {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = null;
    lastFrameTime = 0;
  };

  const setHoverSlow = (enabled) => {
    targetSpeedPxPerMs = enabled
      ? baseSpeedPxPerMs * HOVER_SPEED_FACTOR
      : baseSpeedPxPerMs;
  };

  // ResizeObserver keeps the wrap distance correct if fonts/images/layout change.
  const ro =
    "ResizeObserver" in window
      ? new ResizeObserver(() => {
          measureSegmentWidth();
        })
      : null;

  ro?.observe?.(containerEl);
  ro?.observe?.(segmentEl);

  return {
    play,
    pause,
    setHoverSlow,
    destroy: () => {
      pause();
      ro?.disconnect?.();
    }
  };
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
  carousel.addEventListener("mouseenter", () => {
    marquee.setHoverSlow(true);
  });
  carousel.addEventListener("mouseleave", () => {
    marquee.setHoverSlow(false);
  });

  const section =
    block?.closest(".section") ||
    carousel.closest(".section") ||
    carousel.parentElement;

  section.addEventListener("pauseDynamicGallery", () => {
    marquee.pause();
  });

  section.addEventListener("playDynamicGallery", () => {
    marquee.play();
  });
};

/**
 * A single item rendered inside the Dynamic Gallery Row.
 *
 * @typedef {Object} DynamicGalleryRowItem
 * @property {HTMLElement} picture The picture element.
 * @property {string} imgAltText The alt text for the image.
 * @property {string} tagLabel The tag label.
 * @property {string} tagCategory The tag category.
 * @property {string} tagType The tag type.
 * @property {string} btnLabel The button label.
 * @property {string} btnLink The button link URL.
 */

/**
 * Creates the Dynamic Gallery Row.
 *
 * @param {DynamicGalleryRowItem[]} galleryItems Items to render.
 * @param {HTMLElement|null} block The block element (optional).
 * @returns {Promise<HTMLElement>} The Dynamic Gallery Row element.
 */
export const createDynamicGalleryRow = async (
  galleryItems = [],
  block = null
) => {
  await ensureStylesLoaded();
  // - marqueeContainer clips overflow
  // - belt is translated on X
  // - segment is measured and cloned to create a loop
  const marqueeContainer = document.createElement("div");
  marqueeContainer.className = "dynamic-gallery-marquee";

  const belt = document.createElement("div");
  belt.className = "dynamic-gallery-row marquee-track";

  const segment = document.createElement("div");
  segment.className = "dynamic-gallery-row-group";

  if (block) {
    const rows = Array.from(block.children);
    const promises = rows.map(async (row) => {
      const childrenRows = Array.from(row.children);
      const card = await createDynamicGalleryCardFromRows(childrenRows);
      if (card) {
        moveInstrumentation(row, card);
        segment.appendChild(card);
      }
    });
    await Promise.all(promises);
  } else {
    const promises = galleryItems.map(async (item) => {
      const card = await createDynamicGalleryCard(
        item.picture,
        item.imgAltText,
        item.tagLabel,
        item.tagCategory,
        item.tagType,
        item.btnLabel,
        item.btnLink
      );
      segment.appendChild(card);
    });
    await Promise.all(promises);
  }

  const isAuthor = isAuthorMode();
  if (!isAuthor) {
    // Duplicate content for seamless wrap
    ensureEnoughSlides(segment, 10);

    // Two identical groups are required for a seamless infinite marquee.
    const groupClone = segment.cloneNode(true);
    stripInstrumentationAndIds(groupClone);

    belt.append(segment, groupClone);
  } else {
    belt.appendChild(segment);
  }
  marqueeContainer.appendChild(belt);
  if (block) {
    block.replaceChildren(marqueeContainer);
  }
  addPlayPauseBtnToSection(block || marqueeContainer);

  const isSecondRow = isSecondSectionRow(block || marqueeContainer);
  const speed = isSecondRow
    ? FAST_SPEED_PX_PER_SECOND
    : BASE_SPEED_PX_PER_SECOND;
  const marquee = createMarqueeController(marqueeContainer, belt, segment, {
    speedPxPerSecond: speed
  });
  if (!isAuthor) marquee.play();
  setupListeners(marquee, marqueeContainer, block);
};
