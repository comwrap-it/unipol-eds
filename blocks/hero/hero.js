import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
  createButton,
} from '../atoms/buttons/standard-button/standard-button.js';

/**
 * Sets up the Hero container with background media (image or video).
 * @param {HTMLElement} heroBackground - The media element (video or picture)
 * @param {boolean} isVideoBackground
 * @returns {HTMLDivElement}
 */
const setupHeroWithBg = (heroBackground, isVideoBackground = false) => {
  if (!heroBackground) return null;

  const hero = document.createElement('div');
  hero.className = 'hero swiper-slide';
  // Background media
  if (!isVideoBackground) {
    const pictureBg = heroBackground.cloneNode(true);
    moveInstrumentation(heroBackground, pictureBg);
    pictureBg.className = 'hero-bg';
    pictureBg.setAttribute('aria-hidden', 'true');
    hero.appendChild(pictureBg);
  } else {
    const videoPath = heroBackground.href;
    const videoBg = document.createElement('video');
    videoBg.src = videoPath;
    moveInstrumentation(heroBackground, videoBg);
    videoBg.className = 'hero-bg';
    videoBg.setAttribute('aria-hidden', 'true');
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
 * Builds the main textual/logo section of a Hero.
 * @param {boolean} showHeroLogo
 * @param {HTMLElement} heroLogo - the hero logo element
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
  isCarousel,
) => {
  const mainSection = document.createElement('div');
  mainSection.className = `main-section${isCarousel ? ' carousel' : ''}`;
  if (showHeroLogo) {
    const logo = heroLogo.cloneNode(true);
    logo.className = 'hero-logo';
    mainSection.appendChild(logo);
  }
  const titleEl = document.createElement('h2');
  titleEl.className = 'hero-title';
  titleEl.textContent = title;
  mainSection.appendChild(titleEl);
  if (subtitleBold) {
    const subtitleBoldEl = document.createElement('p');
    subtitleBoldEl.className = 'hero-subtitle-bold';
    subtitleBoldEl.textContent = subtitleBold;
    mainSection.appendChild(subtitleBoldEl);
  }
  if (subtitle) {
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'hero-subtitle';
    subtitleEl.textContent = subtitle;
    mainSection.appendChild(subtitleEl);
  }
  if (showHeroBulletList && bulletList?.length > 0) {
    const bullets = document.createElement('ul');
    bullets.className = 'hero-bullets';
    bulletList?.forEach((bullet) => {
      if (!bullet) return;
      const listItem = document.createElement('li');
      listItem.innerHTML = bullet;
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
 * ensures styles are loaded only once
 */
let isStylesAlreadyLoaded = false;
const ensureStylesLoaded = async () => {
  if (isStylesAlreadyLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const cssPromises = [
    `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    `${window.hlx.codeBasePath}/blocks/hero/hero.css`,
  ].map((cssPath) => loadCSS(cssPath));
  await Promise.all(cssPromises);
  isStylesAlreadyLoaded = true;
};

/**
 * Creates a Hero component
 *
 * @param {HTMLElement} heroBackground - the background media source
 * @param {boolean} isVideoBackground
 * @param {boolean} showHeroButton
 * @param {boolean} showHeroLogo
 * @param {HTMLElement} heroLogo - the hero logo element
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
 * @param {boolean} isCarousel - Flag indicating if the hero is part of a carousel
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
  isCarousel = false,
) {
  ensureStylesLoaded(); // i intentionally not awaited to not block rendering
  const hero = setupHeroWithBg(heroBackground, isVideoBackground);
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';
  const mainSection = createHeroMainSection(
    showHeroLogo,
    heroLogo,
    title,
    subtitleBold,
    subtitle,
    showHeroBulletList,
    bulletList,
    isCarousel,
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
      isCarousel,
    );
    if (buttonSection) {
      heroContent.appendChild(buttonSection);
    }
  }
  hero.appendChild(heroContent);
  return hero;
}
/** Get media source URL from a row
 *
 * @param {HTMLElement} row - The row element
 * @param {boolean} isVideo - Flag to indicate if media is video
 * @returns {HTMLElement|null} The media element (video or picture) or null if not found
 */
const extractMediaFromRow = (row, isVideo = false) => {
  const mediaElement = row?.querySelector(isVideo ? 'a' : 'picture');
  moveInstrumentation(row, mediaElement);
  if (mediaElement) return mediaElement;
  return null;
};

/** Extract hero properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing hero properties
 *
 */
export const extractHeroPropertiesFromRows = (rows) => {
  const isVideoBackground = rows[1]?.textContent?.trim().toLowerCase() === 'true';
  const heroBackground = extractMediaFromRow(rows[0], isVideoBackground);
  const showHeroLogo = rows[2]?.textContent?.trim().toLowerCase() === 'true';
  const heroLogo = extractMediaFromRow(rows[3]);
  const title = rows[4]?.textContent?.trim() || '';
  const subtitleBold = rows[5]?.textContent?.trim() || '';
  const subtitle = rows[6]?.textContent?.trim() || '';
  const showHeroBulletList = rows[7]?.textContent?.trim().toLowerCase() === 'true';
  const bulletList = [
    rows[8]?.textContent?.trim() || '',
    rows[9]?.textContent?.trim() || '',
    rows[10]?.textContent?.trim() || '',
  ].filter(Boolean);
  // Button properties
  const showHeroButton = rows[11]?.textContent?.trim().toLowerCase() === 'true';
  const btnText = rows[12]?.textContent?.trim() || '';
  const btnVariant = rows[13]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const btnHref = rows[14]?.querySelector('a')?.href || rows[14]?.textContent?.trim() || '';
  const btnOpenInNewTab = rows[15]?.textContent?.trim().toLowerCase() === 'true';
  const btnIconSize = rows[16]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const btnLeftIcon = rows[17]?.textContent?.trim() || '';
  const btnRightIcon = rows[18]?.textContent?.trim() || '';
  return {
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
    btnText,
    btnHref,
    btnOpenInNewTab,
    btnVariant,
    btnIconSize,
    btnLeftIcon,
    btnRightIcon,
  };
};

/**
 * @param {HTMLElement} block
 */
export default async function decorateHero(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const {
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
    btnText,
    btnHref,
    btnOpenInNewTab,
    btnVariant,
    btnIconSize,
    btnLeftIcon,
    btnRightIcon,
  } = extractHeroPropertiesFromRows(rows);

  const heroElement = createHero(
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
    btnText,
    btnHref,
    btnOpenInNewTab,
    btnVariant,
    btnIconSize,
    btnLeftIcon,
    btnRightIcon,
  );
  moveInstrumentation(block, heroElement);
  block.replaceWith(heroElement);
}
