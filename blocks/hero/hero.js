import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
  createButton,
} from '../atoms/buttons/standard-button/standard-button.js';

/**
 * Sets up the Hero container with background media (image or video).
 * @param {boolean} isVideoBackground
 * @param {HTMLElement} mediaSrc - The media element (video or picture)
 * @param {boolean} showHeroPauseIcon
 * @returns {HTMLDivElement}
 */
const setupHeroWithBg = (isVideoBackground, mediaSrc, showHeroPauseIcon) => {
  const hero = document.createElement('div');
  hero.className = 'hero';
  // Background media
  if (!isVideoBackground) {
    const pictureBg = mediaSrc.cloneNode(true);
    moveInstrumentation(mediaSrc, pictureBg);
    pictureBg.className = 'hero-bg';
    pictureBg.setAttribute('aria-hidden', 'true');
    hero.appendChild(pictureBg);
  } else {
    const videoBg = mediaSrc.cloneNode(true);
    moveInstrumentation(mediaSrc, videoBg);
    videoBg.className = 'hero-bg';
    videoBg.setAttribute('aria-hidden', 'true');
    videoBg.autoplay = true;
    videoBg.muted = true;
    videoBg.loop = true;
    videoBg.playsInline = true;
    hero.appendChild(videoBg);

    if (showHeroPauseIcon) {
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
) => {
  const mainSection = document.createElement('div');
  mainSection.className = 'main-section';
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
 * @param {string} variant
 * @param {boolean} showHeroButton
 * @param {string} btnLabel
 * @param {string} btnHref
 * @param {string} btnVariant
 * @param {string} btnIconSize
 * @param {string} btnLeftIcon
 * @param {string} btnRightIcon
 * @param {HTMLDivElement} mainSection - reference for carousel variant placement
 * @returns {HTMLDivElement}
 */
const createHeroButtonSection = (
  variant,
  showHeroButton,
  btnLabel,
  btnHref,
  btnOpenInNewTab,
  btnVariant,
  btnIconSize,
  btnLeftIcon,
  btnRightIcon,
  mainSection,
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
    if (variant === 'carousel') {
      mainSection.appendChild(button);
    } else {
      buttonSection.appendChild(button);
    }
  }
  if (variant === 'carousel') {
    // TODO: Add carousel controls here
  }
  return buttonSection;
};

/**
 * Creates a Hero component
 *
 * @param {string} variant default | carousel
 * @param {HTMLElement} heroBackground - the background media source
 * @param {boolean} isVideoBackground
 * @param {boolean} showHeroButton
 * @param {boolean} showHeroLogo
 * @param {HTMLElement} heroLogo - the hero logo element
 * @param {boolean} showHeroPauseIcon
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
 * @returns {HTMLElement}
 */
export function createHero(
  variant,
  heroBackground,
  isVideoBackground,
  showHeroButton,
  showHeroLogo,
  heroLogo,
  showHeroPauseIcon,
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
) {
  const hero = setupHeroWithBg(
    isVideoBackground,
    heroBackground,
    showHeroPauseIcon,
  );
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
  );
  heroContent.appendChild(mainSection);
  const buttonSection = createHeroButtonSection(
    variant,
    showHeroButton,
    btnLabel,
    btnHref,
    btnOpenInNewTab,
    btnVariant,
    btnIconSize,
    btnLeftIcon,
    btnRightIcon,
    mainSection,
  );
  heroContent.appendChild(buttonSection);
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
  const mediaElement = row?.querySelector(isVideo ? 'video' : 'picture');
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
const extractValuesFromRows = (rows) => {
  const variant = rows[0]?.textContent?.trim() || '';
  const heroBackground = extractMediaFromRow(rows[1]);
  const isVideoBackground = rows[2]?.textContent?.trim().toLowerCase() === 'true';
  const showHeroLogo = rows[3]?.textContent?.trim().toLowerCase() === 'true';
  const heroLogo = extractMediaFromRow(rows[4]);
  const showHeroPauseIcon = rows[5]?.textContent?.trim().toLowerCase() === 'true';
  const title = rows[6]?.textContent?.trim() || '';
  const subtitleBold = rows[7]?.textContent?.trim() || '';
  const subtitle = rows[8]?.textContent?.trim() || '';
  const showHeroBulletList = rows[9]?.textContent?.trim().toLowerCase() === 'true';
  const bulletList = [
    rows[10]?.textContent?.trim() || '',
    rows[11]?.textContent?.trim() || '',
    rows[12]?.textContent?.trim() || '',
  ].filter(Boolean);
  // Button properties
  const showHeroButton = rows[13]?.textContent?.trim().toLowerCase() === 'true';
  const btnText = rows[14]?.textContent?.trim() || '';
  const btnVariant = rows[15]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const btnHref = rows[16]?.querySelector('a')?.href || rows[16]?.textContent?.trim() || '';
  const btnOpenInNewTab = rows[17]?.textContent?.trim().toLowerCase() === 'true';
  const btnIconSize = rows[18]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const btnLeftIcon = rows[19]?.textContent?.trim() || '';
  const btnRightIcon = rows[20]?.textContent?.trim() || '';
  return {
    variant,
    heroBackground,
    isVideoBackground,
    showHeroButton,
    showHeroLogo,
    heroLogo,
    showHeroPauseIcon,
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
    variant,
    heroBackground,
    isVideoBackground,
    showHeroButton,
    showHeroLogo,
    heroLogo,
    showHeroPauseIcon,
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
  } = extractValuesFromRows(rows);

  const heroElement = createHero(
    variant,
    heroBackground,
    isVideoBackground,
    showHeroButton,
    showHeroLogo,
    heroLogo,
    showHeroPauseIcon,
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
