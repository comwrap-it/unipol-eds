import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';
import { createLinkButton } from '../atoms/buttons/link-button/link-button.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS, createButton } from '../atoms/buttons/standard-button/standard-button.js';

let isBtnsStylesLoaded = false;
async function ensureBtnStylesLoaded() {
  if (isBtnsStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/link-button/link-button.css`,
    ),
  ]);
  isBtnsStylesLoaded = true;
}

/**
 * Decorates a test buttons element
 * @param {HTMLElement} block - The test buttons element
 */
export default async function decorate(block) {
  if (!block) return;
  ensureBtnStylesLoaded();

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Create test buttons container
  const testButtons = document.createElement('div');
  testButtons.style = 'display: flex; width: 100%; align-items: center; gap: 16px; flex-wrap: wrap;';

  // standard button properties
  const text = rows[0]?.textContent?.trim() || 'Button';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const iconSize = rows[2]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const href = rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || '';
  const leftIcon = rows[4]?.textContent?.trim() || '';
  const rightIcon = rows[5]?.textContent?.trim() || '';
  // icon button properties
  const icon = rows[6]?.textContent?.trim() || '';
  const iconBtnVariant = rows[7]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const iconBtnIconSize = rows[8]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const iconBtnHref = rows[9]?.querySelector('a')?.href || rows[9]?.textContent?.trim() || '';
  // link button properties
  const linkText = rows[10]?.textContent?.trim() || 'Link';
  const linkHref = rows[11]?.querySelector('a')?.href
      || rows[11]?.textContent?.trim()
      || '#';
  const linkSize = rows[12]?.textContent?.trim().toLowerCase() || 'm';
  const showLeftIcon = rows[13]?.textContent?.trim() === 'true';
  const showRightIcon = rows[14]?.textContent?.trim() === 'true';

  // Create standard button
  const standardButton = createButton(
    text,
    href,
    variant,
    iconSize,
    leftIcon,
    rightIcon,
  );
  testButtons.appendChild(standardButton);
  // Create icon button
  const iconButton = createIconButton(
    icon,
    iconBtnVariant,
    iconBtnIconSize,
    iconBtnHref,
  );
  testButtons.appendChild(iconButton);
  // Create link button
  const linkButton = createLinkButton(
    linkText,
    linkHref,
    linkSize,
    showLeftIcon,
    showRightIcon,
  );
  testButtons.appendChild(linkButton);
  block.appendChild(testButtons);
}
