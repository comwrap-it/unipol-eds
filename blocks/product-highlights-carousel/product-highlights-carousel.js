import loadSwiper from '../../scripts/delayed.js';

// #region CONSTANTS
const CAROUSEL_CLASS = 'product-highlights-carousel';
const TRACK_CLASS = 'product-highlights-carousel-track';

export const PRODUCT_HIGHLIGHTS_SWIPER_SPEED = 12000;
export const PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW = PRODUCT_HIGHLIGHTS_SWIPER_SPEED * 3; // 1/3
const PRODUCT_HIGHLIGHTS_MIN_LOOP_SLIDES = 5;
// #endregion

// #region HELPERS
let isStylesLoaded = false;
let stylesLoadingPromise = null;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  if (!stylesLoadingPromise) {
    stylesLoadingPromise = (async () => {
      const { loadCSS } = await import('../../scripts/aem.js');
      await Promise.all([
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/product-highlights-carousel/product-highlights-carousel.css`,
        ),
        loadCSS(`${window.hlx.codeBasePath}/blocks/photo-card/photo-card.css`),
      ]);
      isStylesLoaded = true;
    })();
  }
  await stylesLoadingPromise;
}

const getSpaceBetween = (carousel) => {
  const styles = window.getComputedStyle(carousel);
  const gap = styles.getPropertyValue('--product-highlights-carousel-gap');
  return Number.parseFloat(gap) || 0;
};

const removeExistingClones = (track) => {
  if (!track) return;
  Array.from(track.children).forEach((slide) => {
    if (slide?.dataset?.productHighlightsClone === 'true') slide.remove();
  });
};

const sanitizeClone = (clone) => {
  clone.dataset.productHighlightsClone = 'true';
  clone.setAttribute('aria-hidden', 'true');
  clone.tabIndex = -1;

  [clone, ...clone.querySelectorAll('*')].forEach((el) => {
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

const estimateRequiredSlidesForLoop = (carousel, slides, spaceBetween) => {
  const containerWidth = carousel.getBoundingClientRect().width || 0;
  const widths = slides
    .map((s) => s.getBoundingClientRect().width)
    .filter((w) => w > 0);

  if (!containerWidth || !widths.length) return PRODUCT_HIGHLIGHTS_MIN_LOOP_SLIDES;

  // stima conservativa: slide più stretta => evita warning su viewport larghi
  const minSlideWidth = Math.min(...widths);
  const step = Math.max(minSlideWidth + spaceBetween, 1);

  // quante slide "stanno" nel viewport (circa)
  const slidesPerViewEstimate = Math.ceil(containerWidth / step);

  // centered+loop richiede un margine: +2 è stabile nella pratica
  return Math.max(
    PRODUCT_HIGHLIGHTS_MIN_LOOP_SLIDES,
    slidesPerViewEstimate + 2,
  );
};

const ensureEnoughSlidesForLoop = (track, required) => {
  const slides = Array.from(track.children).filter((n) => n.classList.contains('swiper-slide'));
  if (!slides.length) return;

  let current = slides.length;
  let i = 0;

  while (current < required) {
    const source = slides[i % slides.length];
    const clone = source.cloneNode(true);
    sanitizeClone(clone);
    track.appendChild(clone);
    current += 1;
    i += 1;
  }
};

/**
 * Aggiorna speed e riavvia autoplay (se in esecuzione)
 */
export const setProductHighlightsSwiperSpeed = (swiperInstance, speed) => {
  if (!swiperInstance) return;
  swiperInstance.params.speed = speed;

  if (swiperInstance.autoplay?.running) {
    swiperInstance.autoplay.stop();
    swiperInstance.autoplay.start();
  }
};

/**
 * Hover lo rallenta a 1/3, leave lo fa tornare normale
 */
const setupHoverSlowdown = (carousel, swiperInstance) => {
  if (
    !carousel
    || !swiperInstance
    || carousel.dataset.productHighlightsHover === 'true'
  ) return;
  if (!swiperInstance.params?.autoplay) return;

  const handleMouseEnter = () => {
    carousel.dataset.productHighlightsHoverState = 'true';
    if (carousel.dataset.productHighlightsPaused === 'true') return;
    setProductHighlightsSwiperSpeed(
      swiperInstance,
      PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW,
    );
  };

  const handleMouseLeave = () => {
    carousel.dataset.productHighlightsHoverState = 'false';
    if (carousel.dataset.productHighlightsPaused === 'true') return;
    setProductHighlightsSwiperSpeed(
      swiperInstance,
      PRODUCT_HIGHLIGHTS_SWIPER_SPEED,
    );
  };

  carousel.addEventListener('mouseenter', handleMouseEnter);
  carousel.addEventListener('mouseleave', handleMouseLeave);
  carousel.dataset.productHighlightsHover = 'true';
};

/**
 * Click sulle card, NON deve succedere nulla:
 * - niente navigazione
 * - niente "snap"/spostamenti indesiderati
 * (Da riutilizzare piu avanti)
 */
const setupNoOpClickOnCards = (carousel) => {
  if (!carousel || carousel.dataset.productHighlightsNoClick === 'true') return;

  carousel.addEventListener(
    'click',
    (e) => {
      const slide = e.target.closest('.swiper-slide');
      if (!slide || !carousel.contains(slide)) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation?.();
    },
    true, // capture: blocca prima di handler interni / link
  );

  carousel.dataset.productHighlightsNoClick = 'true';
};

/**
 * Init Swiper
 */
const initSwiper = async (carousel) => {
  if (!carousel || carousel.swiper) return carousel?.swiper || null;

  const track = carousel.querySelector(`.${TRACK_CLASS}`);
  if (!track) return null;

  removeExistingClones(track);

  const baseSlides = Array.from(track.children).filter((n) => n.classList.contains('swiper-slide'));
  if (baseSlides.length < 2) return null;

  const spaceBetween = getSpaceBetween(carousel);
  const required = estimateRequiredSlidesForLoop(
    carousel,
    baseSlides,
    spaceBetween,
  );

  ensureEnoughSlidesForLoop(track, required);

  const finalSlidesCount = Array.from(track.children).filter((n) => n.classList.contains('swiper-slide')).length;
  const canLoop = finalSlidesCount >= required;

  const Swiper = await loadSwiper();

  const swiperInstance = new Swiper(carousel, {
    slidesPerView: 'auto',
    spaceBetween,
    centeredSlides: true,
    centeredSlidesBounds: true,

    // evita warning + blocchi
    loop: canLoop,

    // disabilita comportamenti click che vanno in slide
    slideToClickedSlide: false,
    preventClicks: true,
    preventClicksPropagation: true,

    speed: PRODUCT_HIGHLIGHTS_SWIPER_SPEED,
    allowTouchMove: true,

    autoplay: canLoop
      ? {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true,
      }
      : false,

    freeMode: {
      enabled: true,
      momentum: false,
    },

    a11y: { enabled: false },
  });

  carousel.dataset.productHighlightsPaused = 'false';
  carousel.dataset.productHighlightsHoverState = carousel.matches(':hover')
    ? 'true'
    : 'false';

  setupHoverSlowdown(carousel, swiperInstance);
  setupNoOpClickOnCards(carousel);

  return swiperInstance;
};
// #endregion

// #region CREATE
export async function createProductHighlightsCarousel({
  cards = [],
  root = null,
  track = null,
} = {}) {
  const carousel = root || document.createElement('div');
  carousel.classList.add(CAROUSEL_CLASS, 'swiper');

  const trackElement = track
    || carousel.querySelector(`:scope > .${TRACK_CLASS}`)
    || document.createElement('div');

  trackElement.classList.add(TRACK_CLASS, 'swiper-wrapper');
  if (trackElement.parentElement !== carousel) carousel.appendChild(trackElement);

  const { default: decoratePhotoCard, createPhotoCard } = await import(
    '../photo-card/photo-card.js'
  );
  const cardElements = await Promise.all(
    (cards || []).map(async (card) => {
      if (card instanceof HTMLElement) {
        await decoratePhotoCard(card);
        card.classList.add('swiper-slide');
        return card;
      }
      const created = createPhotoCard(card);
      created.classList.add('swiper-slide');
      return created;
    }),
  );

  cardElements.forEach((el) => {
    if (el && el.parentElement !== trackElement) trackElement.appendChild(el);
  });

  return carousel;
}
// #endregion

// #region PARSE
function parse(block) {
  const existingTrack = block.querySelector(`:scope > .${TRACK_CLASS}`);
  if (existingTrack) return { track: existingTrack, cards: Array.from(existingTrack.children) };

  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const cards = wrapper
    ? Array.from(wrapper.children)
    : Array.from(block.children);
  return { track: wrapper, cards };
}
// #endregion

// #region DECORATE
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const props = parse(block);
  const carousel = await createProductHighlightsCarousel({
    root: block,
    ...props,
  });

  const doc = block?.ownerDocument || document;
  const isEditor = doc.documentElement?.classList.contains('adobe-ue-edit');

  if (isEditor) {
    carousel.classList.remove('swiper');
    const track = carousel.querySelector(`.${TRACK_CLASS}`);
    track?.classList.remove('swiper-wrapper');

    carousel.querySelectorAll('.swiper-slide').forEach((slide) => {
      if (slide.dataset.productHighlightsClone === 'true') slide.remove();
      else slide.classList.remove('swiper-slide');
    });
    return;
  }

  const swiperInstance = await initSwiper(carousel);
  if (swiperInstance) carousel.swiper = swiperInstance;
}
// #endregion
