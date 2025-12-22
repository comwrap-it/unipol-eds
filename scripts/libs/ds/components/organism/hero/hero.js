import { createOptimizedPicture } from "../../../scripts/aem";
import { createButton } from "../../atoms/buttons/standard-button/standard-button";

/**
 * Sets up the Hero container with background media (image or video).
 * @param {string} heroBackground - The media element path (video or picture)
 * @param {boolean} isVideoBackground
 * @param {boolean} isCarousel
 * @returns {HTMLDivElement}
 */
const setupHeroWithBg = (
  heroBackground,
  isVideoBackground = false,
  isCarousel = false
) => {
  const hero = document.createElement("div");
  hero.className = `hero${isCarousel ? " swiper-slide" : ""}`;

  if (!heroBackground) return hero;

  if (!isVideoBackground) {
    const pictureBg = createOptimizedPicture(
      heroBackground,
      "Hero background image",
      true
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
    moveInstrumentation(heroBackground, videoBg);
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
 * Builds the main textual/logo section of a Hero.
 * @param {boolean} showHeroLogo
 * @param {string} heroLogo - the hero logo element
 * @param {string} title
 * @param {string} subtitleBold
 * @param {string} subtitle
 * @param {boolean} showHeroBulletList
 * @param {string[]} bulletList
 * @param {boolean} isCarousel
 * @returns {HTMLDivElement}
 */
const createHeroMainSection = (
  showHeroLogo,
  heroLogo,
  title,
  subtitleBold,
  subtitle,
  showHeroBulletList,
  bulletList,
  isCarousel = false
) => {
  const mainSection = document.createElement("div");
  mainSection.className = `main-section${isCarousel ? " carousel" : ""}`;
  if (showHeroLogo && heroLogo) {
    const logo = createOptimizedPicture(
      heroLogo,
      "Hero logo",
      true
    );
    logo.className = "hero-logo";
    mainSection.appendChild(logo);
  }
  const titleEl = document.createElement("h2");
  titleEl.className = "hero-title";
  titleEl.textContent = title;
  mainSection.appendChild(titleEl);
  if (subtitleBold) {
    const subtitleBoldEl = document.createElement("p");
    subtitleBoldEl.className = "hero-subtitle-bold";
    subtitleBoldEl.textContent = subtitleBold;
    mainSection.appendChild(subtitleBoldEl);
  }
  if (subtitle) {
    const subtitleEl = document.createElement("p");
    subtitleEl.className = "hero-subtitle";
    subtitleEl.textContent = subtitle;
    mainSection.appendChild(subtitleEl);
  }
  if (showHeroBulletList && bulletList?.length > 0) {
    const bullets = document.createElement("ul");
    bullets.className = "hero-bullets";
    bulletList?.forEach((bullet) => {
      const listItem = document.createElement("li");
      listItem.className = "hero-bullet-item";
      listItem.textContent = bullet;
      bullets.appendChild(listItem);
    });
    mainSection.appendChild(bullets);
  }
  return mainSection;
};

/**
 * Builds the button section of a Hero, handling carousel placement logic.
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
const createHeroButtonSection = async (
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
 * @param {string} heroBackground - the background media path
 * @param {boolean} isVideoBackground
 * @param {boolean} showHeroButton
 * @param {boolean} showHeroLogo
 * @param {string} heroLogo - the hero logo path
 * @param {string} title (required)
 * @param {string} subtitleBold
 * @param {string} subtitle
 * @param {boolean} showHeroBulletList
 * @param {string[]} bulletList
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
export async function createHero(
  heroBackground,
  isVideoBackground,
  showHeroButton,
  showHeroLogo,
  heroLogo,
  title,
  subtitleBold,
  subtitle,
  showHeroBulletList,
  bulletList,
  btnLabel,
  btnHref,
  btnOpenInNewTab,
  btnVariant,
  btnIconSize,
  btnLeftIcon,
  btnRightIcon,
  isCarousel = false
) {
  const hero = setupHeroWithBg(heroBackground, isVideoBackground, isCarousel);
  const heroContent = document.createElement("div");
  heroContent.className = "hero-content";
  const mainSection = createHeroMainSection(
    showHeroLogo,
    heroLogo,
    title,
    subtitleBold,
    subtitle,
    showHeroBulletList,
    bulletList,
    isCarousel
  );
  heroContent.appendChild(mainSection);
  if (showHeroButton) {
    const buttonSection = await createHeroButtonSection(
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
