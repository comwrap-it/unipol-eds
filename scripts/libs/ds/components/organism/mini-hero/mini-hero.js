import { createOptimizedPicture } from "../../../scripts/aem";
import { createButton } from "../../atoms/buttons/standard-button/standard-button";

/**
 * Sets up the Mini Hero container with background media (image or video).
 * @param {string} heroBackground - The media element (video or picture)
 * @param {boolean} isVideoBackground
 * @param {boolean} isCarousel
 * @returns {HTMLDivElement}
 */
const setupMiniHeroWithBg = (
  heroBackground,
  isVideoBackground = false,
  isCarousel = false
) => {
  const hero = document.createElement("div");
  hero.className = `mini-hero${isCarousel ? " swiper-slide" : ""}`;

  if (!heroBackground) return hero;

  if (!isVideoBackground) {
    const pictureBg = createOptimizedPicture(
      heroBackground,
      "Mini Hero background image"
    );

    pictureBg.className = "hero-bg";
    pictureBg.setAttribute("aria-hidden", "true");
    const img = pictureBg.querySelector("img");
    if (img) {
      img.loading = "eager";
      img.decoding = "async";
      img.fetchPriority = "high";
    }
    hero.appendChild(pictureBg);
  } else {
    const videoPath = heroBackground;
    const videoBg = document.createElement("video");
    videoBg.muted = true;
    videoBg.className = "hero-bg";
    videoBg.setAttribute("aria-hidden", "true");
    videoBg.preload = "auto";
    videoBg.autoplay = true;
    videoBg.loop = true;
    videoBg.playsInline = true;
    videoBg.src = videoPath;
    hero.appendChild(videoBg);

    videoBg.addEventListener("canplay", () => {
      videoBg.play();
    });

    const pauseIcon = document.createElement("button");
    pauseIcon.className = "hero-icon un-icon-pause-circle icon-extra-large";
    hero.appendChild(pauseIcon);
    pauseIcon.onclick = () => {
      if (pauseIcon.classList.contains("un-icon-play-circle")) {
        videoBg.play();
        pauseIcon.classList.remove("un-icon-play-circle");
        pauseIcon.classList.add("un-icon-pause-circle");
      } else {
        videoBg.pause();
        pauseIcon.classList.remove("un-icon-pause-circle");
        pauseIcon.classList.add("un-icon-play-circle");
      }
    };
  }

  const heroOverlay = document.createElement("div");
  heroOverlay.className = "hero-overlay";
  heroOverlay.setAttribute("aria-hidden", "true");
  hero.appendChild(heroOverlay);
  return hero;
};

/**
 * Builds the main textual/logo section of a Mini Hero.
 * @param {string} title
 * @param {string} subtitle
 * @param {boolean} showHeroBulletList
 * @param {string[]} bulletList
 * @param {boolean} isCarousel
 * @returns {HTMLDivElement}
 */
const createMiniHeroMainSection = (
  title,
  subtitle,
  showHeroBulletList,
  bulletList,
  isCarousel = false
) => {
  const mainSection = document.createElement("div");
  mainSection.className = `main-section${isCarousel ? " carousel" : ""}`;
  const titleEl = document.createElement("h2");
  titleEl.className = "hero-title";
  titleEl.textContent = title;
  mainSection.appendChild(titleEl);
  if (subtitle) {
    const subtitleBoldEl = document.createElement("p");
    subtitleBoldEl.className = "hero-subtitle";
    subtitleBoldEl.textContent = subtitle;
    mainSection.appendChild(subtitleBoldEl);
  }
  if (showHeroBulletList && bulletList?.length > 0) {
    const bullets = document.createElement("ul");
    bullets.className = "hero-bullets";
    bulletList?.forEach((bullet) => {
      const listItem = document.createElement("li");
      listItem.textContent = bullet;
      bullets.appendChild(listItem);
    });
    mainSection.appendChild(bullets);
  }
  return mainSection;
};

/**
 * Builds the button section of a Mini Hero, handling carousel placement logic.
 * @param {boolean} showHeroButton
 * @param {string} btnLabel
 * @param {string} btnHref
 * @param {boolean} btnOpenInNewTab
 * @param {string} btnVariant
 * @param {string} btnIconSize
 * @param {string} btnLeftIcon
 * @param {string} btnRightIcon
 * @param {HTMLDivElement} mainSection - reference for carousel variant placement
 * @param {boolean} isCarousel
 * @returns {HTMLDivElement|null}
 */
const createMiniHeroButtonSection = async (
  showHeroButton,
  btnLabel,
  btnHref,
  btnOpenInNewTab,
  btnVariant,
  btnIconSize,
  btnLeftIcon,
  btnRightIcon,
  mainSection,
  isCarousel = false
) => {
  const buttonSection = document.createElement("div");
  buttonSection.className = "button-section";
  if (showHeroButton) {
    const button = createButton(
      btnLabel,
      btnHref,
      btnOpenInNewTab,
      btnVariant,
      btnIconSize,
      btnLeftIcon,
      btnRightIcon
    );
    if (isCarousel) {
      mainSection.appendChild(button);
      return null;
    }
    buttonSection.appendChild(button);
  }
  return buttonSection;
};

/**
 * Creates a Hero component
 *
 * @param {string} heroBackground - the background media source
 * @param {boolean} isVideoBackground
 * @param {string} title (required)
 * @param {string} subtitle
 * @param {boolean} showHeroBulletList
 * @param {string[]} bulletLists
 * @param {boolean} showHeroButton
 * @param {string} btnLabel - Button text/label
 * @param {string} btnHref - Button URL (optional)
 * @param {boolean} btnOpenInNewTab - Open link in new tab (optional)
 * @param {string} btnVariant - Button variant (primary, secondary, accent)
 * @param {string} btnIconSize - Icon size (small, medium, large, extra-large)
 * @param {string} btnLeftIcon - Left icon (optional)
 * @param {string} btnRightIcon - Right icon (optional)
 * @param {boolean} isCarousel - Flag indicating if the hero is part of a carousel (optional)
 * @returns {HTMLElement}
 */
export async function createMiniHero(
  heroBackground,
  isVideoBackground,
  title,
  subtitle,
  showHeroBulletList,
  bulletList,
  showHeroButton,
  btnLabel,
  btnHref,
  btnOpenInNewTab,
  btnVariant,
  btnIconSize,
  btnLeftIcon,
  btnRightIcon,
  isCarousel = false
) {
  const hero = setupMiniHeroWithBg(
    heroBackground,
    isVideoBackground,
    isCarousel
  );
  const heroContent = document.createElement("div");
  heroContent.className = "hero-content";
  const mainSection = createMiniHeroMainSection(
    title,
    subtitle,
    showHeroBulletList,
    bulletList,
    isCarousel
  );
  heroContent.appendChild(mainSection);
  if (showHeroButton) {
    const buttonSection = await createMiniHeroButtonSection(
      showHeroButton,
      btnLabel,
      btnHref,
      btnOpenInNewTab,
      btnVariant,
      btnIconSize,
      btnLeftIcon,
      btnRightIcon,
      mainSection,
      isCarousel
    );
    if (buttonSection) {
      heroContent.appendChild(buttonSection);
    }
  }
  hero.appendChild(heroContent);
  return hero;
}
