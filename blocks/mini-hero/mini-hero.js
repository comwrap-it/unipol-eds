import {
  createTextElementFromRow,
  extractBooleanValueFromRow,
  extractMediaElementFromRow,
} from '../../scripts/domHelpers.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
  createButton,
} from '../atoms/buttons/standard-button/standard-button.js';

/**
 * Sets up the Mini Hero container with background media (image or video).
 * @param {HTMLElement} heroBackground - The media element (video or picture)
 * @param {boolean} isVideoBackground
 * @param {boolean} isCarousel
 * @returns {HTMLDivElement}
 */
const setupMiniHeroWithBg = (
  heroBackground,
  isVideoBackground = false,
  isCarousel = false,
) => {
  const hero = document.createElement('div');
  hero.className = `mini-hero${isCarousel ? ' swiper-slide' : ''}`;
  // Background media
  if (!isVideoBackground && heroBackground) {
    const pictureBg = heroBackground.cloneNode(true);
    moveInstrumentation(heroBackground, pictureBg);
    pictureBg.className = 'hero-bg';
    pictureBg.setAttribute('aria-hidden', 'true');
    const img = pictureBg.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.decoding = 'async';
      img.fetchPriority = 'high';
    }
    hero.appendChild(pictureBg);
  } else if (heroBackground) {
    const videoPath = heroBackground.href;
    const videoBg = document.createElement('video');
    videoBg.src = videoPath;
    moveInstrumentation(heroBackground, videoBg);
    videoBg.className = 'hero-bg';
    videoBg.setAttribute('aria-hidden', 'true');
    videoBg.preload = 'auto';
    videoBg.autoplay = true;
    videoBg.muted = true;
    videoBg.loop = true;
    videoBg.playsInline = true;
    hero.appendChild(videoBg);

    const pauseIcon = document.createElement('button');
    pauseIcon.className = 'hero-icon un-icon-pause-circle icon-extra-large';
    hero.appendChild(pauseIcon);
    pauseIcon.onclick = () => {
      if (pauseIcon.classList.contains('un-icon-play-circle')) {
        videoBg.play();
        pauseIcon.classList.remove('un-icon-play-circle');
        pauseIcon.classList.add('un-icon-pause-circle');
      } else {
        videoBg.pause();
        pauseIcon.classList.remove('un-icon-pause-circle');
        pauseIcon.classList.add('un-icon-play-circle');
      }
    };
  }
  const heroOverlay = document.createElement('div');
  heroOverlay.className = 'hero-overlay';
  heroOverlay.setAttribute('aria-hidden', 'true');
  hero.appendChild(heroOverlay);
  return hero;
};

/**
 * Builds the main textual/logo section of a Mini Hero.
 * @param {HTMLElement} titleRow
 * @param {HTMLElement} subtitleRow
 * @param {boolean} showHeroBulletList
 * @param {HTMLElement[]} bulletListRows
 * @param {boolean} isCarousel
 * @returns {HTMLDivElement}
 */
const createMiniHeroMainSection = (
  titleRow,
  subtitleRow,
  showHeroBulletList,
  bulletListRows,
  isCarousel = false,
) => {
  const mainSection = document.createElement('div');
  mainSection.className = `main-section${isCarousel ? ' carousel' : ''}`;
  const titleEl = createTextElementFromRow(titleRow, 'hero-title', 'h2');
  mainSection.appendChild(titleEl);
  if (subtitleRow.firstChild) {
    const subtitleBoldEl = createTextElementFromRow(
      subtitleRow,
      'hero-subtitle',
      'p',
    );
    mainSection.appendChild(subtitleBoldEl);
  }
  if (showHeroBulletList && bulletListRows?.length > 0) {
    const bullets = document.createElement('ul');
    bullets.className = 'hero-bullets';
    bulletListRows?.forEach((bulletRow) => {
      const listItem = createTextElementFromRow(bulletRow, '', 'li');
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
  isCarousel = false,
) => {
  const buttonSection = document.createElement('div');
  buttonSection.className = 'button-section';
  if (showHeroButton) {
    const button = createButton(
      btnLabel,
      btnHref,
      btnOpenInNewTab,
      btnVariant,
      btnIconSize,
      btnLeftIcon,
      btnRightIcon,
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
 * @param {HTMLElement} heroBackground - the background media source
 * @param {boolean} isVideoBackground
 * @param {HTMLElement} title (required)
 * @param {HTMLElement} subtitleRow
 * @param {boolean} showHeroBulletList
 * @param {HTMLElement[]} bulletListRows
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
  titleRow,
  subtitleRow,
  showHeroBulletList,
  bulletListRows,
  showHeroButton,
  btnLabel,
  btnHref,
  btnOpenInNewTab,
  btnVariant,
  btnIconSize,
  btnLeftIcon,
  btnRightIcon,
  isCarousel = false,
) {
  const hero = setupMiniHeroWithBg(heroBackground, isVideoBackground, isCarousel);
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';
  const mainSection = createMiniHeroMainSection(
    titleRow,
    subtitleRow,
    showHeroBulletList,
    bulletListRows,
    isCarousel,
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
      isCarousel,
    );
    if (buttonSection) {
      heroContent.appendChild(buttonSection);
    }
  }
  hero.appendChild(heroContent);
  return hero;
}

/** Extract hero properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing hero properties
 *
 */
export const extractMiniHeroPropertiesFromRows = (rows) => {
  const heroBackground = extractMediaElementFromRow(rows[0]);
  const isVideoBackground = extractBooleanValueFromRow(rows[1]);
  const titleRow = rows[2];
  const subtitleRow = rows[3];
  const showHeroBulletList = extractBooleanValueFromRow(rows[4]);
  const bulletListRows = [rows[5], rows[6], rows[7]].filter(
    (row) => row?.firstChild,
  );
  // Button properties
  const showHeroButton = extractBooleanValueFromRow(rows[8]);
  const btnText = rows[9]?.textContent?.trim() || '';
  const btnVariant = rows[10]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const btnHref = rows[11]?.querySelector('a')?.href || rows[11]?.textContent?.trim() || '';
  const btnOpenInNewTab = extractBooleanValueFromRow(rows[12]);
  const btnIconSize = rows[13]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const btnLeftIcon = rows[14]?.textContent?.trim() || '';
  const btnRightIcon = rows[15]?.textContent?.trim() || '';
  return {
    heroBackground,
    isVideoBackground,
    showHeroButton,
    titleRow,
    subtitleRow,
    showHeroBulletList,
    bulletListRows,
    btnText,
    btnHref,
    btnOpenInNewTab,
    btnVariant,
    btnIconSize,
    btnLeftIcon,
    btnRightIcon,
  };
};
