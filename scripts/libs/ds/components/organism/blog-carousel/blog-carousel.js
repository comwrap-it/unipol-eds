import { loadCSS } from "../../../scripts/aem.js";
import loadSwiper from "../../../scripts/delayed.js";
import mockBlogCards from "../../../scripts/mock.js";
import { initCarouselAnimations } from "../../../scripts/reveal.js";
import { handleSlideChange } from "../../../scripts/utils.js";
import { createButton } from "../../atoms/buttons/standard-button/standard-button.js";
import { createBlogCard } from "../../molecules/cards/blog-preview-card/blog-preview-card.js";
import createScrollIndicator from "../../molecules/scroll-indicator/scroll-indicator.js";

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  await Promise.all([
    loadCSS(`../../atoms/tag/tag.css`),
    loadCSS(`../../molecules/cards/blog-preview-card/blog-preview-card.css`)
  ]);
  isStylesLoaded = true;
}

/**
 *
 * @param {} Swiper the swiper instance
 * @param {HTMLElement} carousel the carousel element
 * @param {HTMLElement} leftIconButton the left navigation button
 * @param {HTMLElement} rightIconButton the right navigation button
 */
const initSwiper = (
  Swiper,
  carousel,
  leftIconButton = null,
  rightIconButton = null
) => {
  // Initialize Swiper after DOM insertion
  const swiper = new Swiper(carousel || ".swiper", {
    navigation: {
      nextEl: rightIconButton || ".swiper-button-next",
      prevEl: leftIconButton || ".swiper-button-prev",
      addIcons: false
    },
    slidesPerView: "auto",
    speed: 700,
    allowTouchMove: true,
    breakpoints: {
      // width >= 1200
      1200: {
        allowTouchMove: false
      }
    },
    resistanceRatio: 0.85,
    touchReleaseOnEdges: true,
    effect: "slide",
    // Optional accessibility tweaks
    a11y: { enabled: false }
  });

  return swiper;
};

/**
 * Creates the blog carousel block
 * @param {string} btnText - Button text/label
 * @param {string} btnHref - Button URL (optional)
 * @param {boolean} btnOpenInNewTab - Open link in new tab (optional)
 * @param {string} btnVariant - Button variant (primary, secondary, accent)
 * @param {string} btnIconSize - Icon size (small, medium, large, extra-large)
 * @param {string} btnLeftIcon - Left icon (optional)
 * @param {string} btnRightIcon - Right icon (optional)
 */
export default async function createBlogCarousel(
  btnText,
  btnHref,
  btnOpenInNewTab,
  btnVariant,
  btnIconSize,
  btnLeftIcon,
  btnRightIcon
) {
  await ensureStylesLoaded();

  // Create carousel container structure
  const carousel = document.createElement("div");
  carousel.className = "blog-carousel-container swiper";
  carousel.setAttribute("role", "region");
  carousel.setAttribute("aria-label", "Blog carousel");
  carousel.setAttribute("tabindex", "0");

  // Create carousel track (scrollable container)
  const track = document.createElement("div");
  track.className = "blog-carousel swiper-wrapper";
  track.setAttribute("role", "list");

  const smallDevicesButton = createButton(
    btnText,
    btnHref,
    btnOpenInNewTab,
    btnVariant,
    btnIconSize,
    btnLeftIcon,
    btnRightIcon
  );
  smallDevicesButton?.classList.add("blog-carousel-button");

  const cardsData = await mockBlogCards();
  const isThereMultipleCards = cardsData.length > 1;

  const cardPromises = cardsData.map(async (cardData) => {
    const {
      image,
      title,
      durationIcon,
      durationText,
      tagLabel,
      tagCategory,
      tagType
    } = cardData;
    const card = await createBlogCard(
      image,
      title,
      durationIcon,
      durationText,
      tagLabel,
      tagCategory,
      tagType,
      true, // isSlide
      "reveal-in-up" // animationClass
    );
    track.appendChild(card);
  });
  await Promise.all(cardPromises);
  carousel.appendChild(track);

  if (isThereMultipleCards) {
    initCarouselAnimations(carousel);

    const { leftIconButton, scrollIndicator, rightIconButton, setExpandedDot } =
      await createScrollIndicator();
    carousel.appendChild(scrollIndicator);
    if (smallDevicesButton) {
      carousel.appendChild(smallDevicesButton);
    }

    // Initialize Swiper after DOM insertion
    const Swiper = await loadSwiper();
    const swiperInstance = initSwiper(
      Swiper,
      carousel,
      leftIconButton,
      rightIconButton
    );
    handleSlideChange(
      swiperInstance,
      setExpandedDot,
      leftIconButton,
      rightIconButton
    );
  } else if (smallDevicesButton) {
    // If only one card, no need for carousel functionality
    carousel.appendChild(smallDevicesButton);
  }

  return carousel;
}
