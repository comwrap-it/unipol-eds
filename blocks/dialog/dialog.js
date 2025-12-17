import createOverlay from '../atoms/overlay/overlay.js';
import {
  getValuesFromBlock,
  restoreInstrumentation,
} from '../../scripts/utils.js';
import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';
import {
  createButton,
  BUTTON_VARIANTS,
  BUTTON_ICON_SIZES,
} from '../atoms/buttons/standard-button/standard-button.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`),
  ]);
  isStylesLoaded = true;
}

export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const properties = [
    'dialogTitleLabel',
    'dialogSubtitleLabel',
    'dialogDescriptionLabel',
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
    panel.classList.add('is-closing');
    overlay.classList.add('is-closing');
  };
  header.appendChild(closeButton);

  panel.appendChild(header);

  /* Text content */
  const textContent = document.createElement('div');
  textContent.className = 'dialog-text-content';

  /* Title */
  const titleEl = document.createElement('h2');
  titleEl.className = 'dialog-title';
  titleEl.textContent = values.dialogTitleLabel?.value || '';
  restoreInstrumentation(titleEl, values.dialogTitleLabel?.instrumentation);
  textContent.appendChild(titleEl);

  /* dialog-subtexts-wrapper */
  const dialogSubtextsWrapper = document.createElement('div');
  dialogSubtextsWrapper.className = 'dialog-subtexts-wrapper';

  /* Subtitle */
  if (values.dialogSubtitleLabel?.value) {
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'dialog-subtitle';
    subtitleEl.textContent = values.dialogSubtitleLabel.value;
    restoreInstrumentation(
      subtitleEl,
      values.dialogSubtitleLabel.instrumentation,
    );
    dialogSubtextsWrapper.appendChild(subtitleEl);
  }

  /* Description */
  if (values.dialogDescriptionLabel?.value) {
    const descriptionEl = document.createElement('p');
    descriptionEl.className = 'dialog-description';
    descriptionEl.textContent = values.dialogDescriptionLabel.value;
    restoreInstrumentation(
      descriptionEl,
      values.dialogDescriptionLabel.instrumentation,
    );
    dialogSubtextsWrapper.appendChild(descriptionEl);
  }

  textContent.appendChild(dialogSubtextsWrapper);
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
