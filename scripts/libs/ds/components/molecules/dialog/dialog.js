import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../../constants/index.js';
import { loadCSS } from '../../../scripts/aem.js';
import { lockBodyScroll, unlockBodyScroll } from '../../../scripts/utils.js';
import { createIconButton } from '../../atoms/buttons/icon-button/icon-button.js';
import { createButton } from '../../atoms/buttons/standard-button/standard-button.js';
import createOverlay from '../../atoms/overlay/overlay.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  await Promise.all([
    loadCSS('../../atoms/buttons/standard-button/standard-button.css'),
    loadCSS('../../atoms/buttons/icon-button/icon-button.css'),
  ]);
  isStylesLoaded = true;
}

/**
 * Closes the dialog with animation and removes it from DOM
 * @param {HTMLElement} block The dialog block
 * @param {HTMLElement} panel The dialog panel
 * @param {HTMLElement} overlay The dialog overlay
 */
const closeDialog = (block, panel, overlay) => {
  if (panel.classList.contains('is-closing')
    && overlay.classList.contains('is-closing')) {
    return;
  }
  panel.classList.add('is-closing');
  overlay.classList.add('is-closing');
  const wrapper = block.closest('.dialog-container') || block.closest('.dialog-wrapper') || block;

  const onAnimEnd = (e) => {
    if (e.target !== panel) return;
    panel.removeEventListener('animationend', onAnimEnd);
    if (wrapper.isConnected) {
      wrapper.remove();
    }
    unlockBodyScroll();
  };

  panel.addEventListener('animationend', onAnimEnd, { once: true });

  // safety fallback in case animationend never fires
  setTimeout(() => {
    if (wrapper.isConnected) wrapper.remove();
  }, 800);
};

/**
 * Creates a dialog block
 * @param {string} dialogTitle The dialog title
 * @param {HTMLCollection} dialogText The dialog richtext content
 * @param {string} btnLabel The button label
 * @param {string} btnVariant The button variant
 * @param {string} btnHref The button href
 * @param {boolean} btnOpenInNewTab Whether the button opens in a new tab
 * @param {string} btnSize The button size
 * @param {string} btnLeftIcon The button left icon
 * @param {string} btnRightIcon The button right icon
 * @param {HTMLElement} dialog The dialog block element
 */
export default async function createDialog(
  dialogTitle,
  dialogText,
  btnLabel,
  btnVariant,
  btnHref,
  btnOpenInNewTab,
  btnSize,
  btnLeftIcon,
  btnRightIcon,
) {
  await ensureStylesLoaded();
  lockBodyScroll();

  const dialog = document.createElement('div');
  dialog.classList.add('dialog');

  /* Overlay */
  const overlay = createOverlay();
  overlay.classList.add('dialog-overlay');

  /* Panel */
  const panel = document.createElement('aside');
  panel.className = 'dialog-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');

  /* Header */
  const header = document.createElement('header');
  header.className = 'dialog-header';

  const closeButton = createIconButton(
    'un-icon-close',
    BUTTON_VARIANTS.PRIMARY,
    BUTTON_ICON_SIZES.MEDIUM,
  );
  closeButton.classList.add('dialog-close');
  closeButton.onclick = () => {
    closeDialog(dialog, panel, overlay);
  };
  header.appendChild(closeButton);

  /* Title */
  const titleEl = document.createElement('h2');
  titleEl.className = 'dialog-title';
  titleEl.textContent = dialogTitle || '';
  header.appendChild(titleEl);

  panel.appendChild(header);

  /* Text content */
  const textContent = document.createElement('div');
  textContent.className = 'dialog-text-content';

  /* Richtext */
  if (dialogText) {
    textContent.append(...dialogText);
  }

  panel.appendChild(textContent);

  /* Footer */
  const footer = document.createElement('div');
  footer.className = 'dialog-footer';

  /* Action button */
  if (btnLabel) {
    const button = createButton(
      btnLabel,
      btnHref,
      btnOpenInNewTab,
      btnVariant,
      btnSize,
      btnLeftIcon,
      btnRightIcon,
    );

    footer.appendChild(button);
  }

  panel.appendChild(footer);

  dialog.appendChild(overlay);
  dialog.appendChild(panel);

  return dialog;
}
