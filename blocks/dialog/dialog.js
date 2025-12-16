import createOverlay from '../atoms/overlay/overlay.js';
import { getValuesFromBlock, restoreInstrumentation } from '../../scripts/utils.js';
import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';
import { createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';

export default function decorate(block) {
  if (!block) return;

  const properties = [
    'dialogTitleLabel',
    'dialogSubtitleLabel',
    'dialogDescriptionLabel',
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
    BUTTON_ICON_SIZES.MEDIUM
  );
  closeButton.classList.add('dialog-close');
  header.appendChild(closeButton);

  panel.appendChild(header);

  /* Title */
  const titleEl = document.createElement('h2');
  titleEl.className = 'dialog-title';
  titleEl.textContent = values.dialogTitleLabel?.value || '';
  restoreInstrumentation(titleEl, values.dialogTitleLabel?.instrumentation);
  panel.appendChild(titleEl);

  /* Text wrapper */
  const textWrapper = document.createElement('div');
  textWrapper.className = 'dialog-text';

  if (values.dialogSubtitleLabel?.value) {
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'dialog-subtitle';
    subtitleEl.textContent = values.dialogSubtitleLabel.value;
    restoreInstrumentation(subtitleEl, values.dialogSubtitleLabel.instrumentation);
    textWrapper.appendChild(subtitleEl);
  }

  if (values.dialogDescriptionLabel?.value) {
    const descriptionEl = document.createElement('p');
    descriptionEl.className = 'dialog-description';
    descriptionEl.textContent = values.dialogDescriptionLabel.value;
    restoreInstrumentation(descriptionEl, values.dialogDescriptionLabel.instrumentation);
    textWrapper.appendChild(descriptionEl);
  }

  panel.appendChild(textWrapper);

  /* Footer */
  const footer = document.createElement('footer');
  footer.className = 'dialog-footer';

  /* Action button */
  if (values.actionButtonConfig?.value) {
    const btnProps = values.actionButtonConfig.value;

    const button = createButton(
      btnProps.label,
      btnProps.href,
      btnProps.openInNewTab,
      btnProps.variant,
      btnProps.iconSize,
      btnProps.leftIcon,
      btnProps.rightIcon,
      btnProps.instrumentation
    );

    footer.appendChild(button);
  }

  panel.appendChild(footer);

  document.body.appendChild(overlay);
  document.body.appendChild(panel);
}
