import createOverlay from '../atoms/overlay/overlay.js';
import {
  getValuesFromBlock,
  lockBodyScroll,
  unlockBodyScroll,
  restoreInstrumentation,
} from '../../scripts/utils.js';
import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';
import {
  createButton,
} from '../atoms/buttons/standard-button/standard-button.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../constants/index.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`,
    ),
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
  if (
    panel.classList.contains('is-closing')
    && overlay.classList.contains('is-closing')
  ) { return; }
  panel.classList.add('is-closing');
  overlay.classList.add('is-closing');
  const wrapper = block.closest('.dialog-container')
    || block.closest('.dialog-wrapper')
    || block;

  const onAnimEnd = (e) => {
    if (e.target !== panel) return;
    panel.removeEventListener('animationend', onAnimEnd);
    if (wrapper.isConnected) {
      wrapper.remove();
    }
  };

  panel.addEventListener('animationend', onAnimEnd, { once: true });

  // safety fallback in case animationend never fires
  setTimeout(() => {
    if (wrapper.isConnected) wrapper.remove();
  }, 800);
};

/**
 * Decorates a dialog block
 * @param {HTMLElement} block The decorated dialog block element
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();
  lockBodyScroll();

  const properties = [
    'dialogTitleLabel',
    'dialogTextContentRichtext',
    'standardButtonLabel',
    'standardButtonVariant',
    'standardButtonHref',
    'standardButtonOpenInNewTab',
    'standardButtonSize',
    'standardButtonLeftIcon',
    'standardButtonRightIcon',
    'actionButtonConfig',
  ];

  const values = getValuesFromBlock(block, properties);

  block.textContent = '';
  block.classList.add('dialog');

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
    closeDialog(block, panel, overlay);
    unlockBodyScroll();
  };
  header.appendChild(closeButton);

  /* Title */
  const titleEl = document.createElement('h2');
  titleEl.className = 'dialog-title';
  titleEl.textContent = values.dialogTitleLabel?.value || '';
  restoreInstrumentation(titleEl, values.dialogTitleLabel?.instrumentation);
  header.appendChild(titleEl);

  panel.appendChild(header);

  /* Text content */
  const textContent = document.createElement('div');
  textContent.className = 'dialog-text-content';

  /* Richtext */
  if (values.dialogTextContentRichtext?.value) {
    textContent.append(...values.dialogTextContentRichtext.value);
  }

  panel.appendChild(textContent);

  /* Footer */
  const footer = document.createElement('div');
  footer.className = 'dialog-footer';

  /* Action button */
  if (values.standardButtonLabel?.value) {
    const button = createButton(
      values.standardButtonLabel?.value,
      values.standardButtonHref?.value,
      values.standardButtonOpenInNewTab?.value,
      values.standardButtonVariant?.value,
      values.standardButtonSize?.value,
      values.standardButtonLeftIcon?.value,
      values.standardButtonRightIcon?.value,
    );

    footer.appendChild(button);
  }

  panel.appendChild(footer);

  block.appendChild(overlay);
  block.appendChild(panel);
}
