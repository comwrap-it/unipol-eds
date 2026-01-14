import { createIconButton } from '@unipol-ds/components/atoms/buttons/icon-button/icon-button.js';
import createOverlay from '@unipol-ds/components/atoms/overlay/overlay.js';
import {
  extractInstrumentationAttributes,
  restoreInstrumentation,
} from '@unipol-ds/scripts/utils.js';
import { createTextElementFromObj } from '@unipol-ds/scripts/domHelpers.js';
import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '@unipol-ds/constants/index.js';
import {
  isAuthorMode,
  lockBodyScroll,
  unlockBodyScroll,
} from '../../scripts/utils.js';
import { loadFragment } from '../fragment/fragment.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/overlay/overlay.css`,
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
const closeDownloadDialog = (block, panel, overlay) => {
  if (
    panel.classList.contains('is-closing')
    && overlay.classList.contains('is-closing')
  ) { return; }
  panel.classList.add('is-closing');
  overlay.classList.add('is-closing');
  const wrapper = block.closest('.dialog-download-container')
    || block.closest('.dialog-download-wrapper')
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

async function loadAccordionDownload(reference) {
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion-download-container';

  const fragment = await loadFragment(reference.href);

  restoreInstrumentation(wrapper, reference.instrumentation);

  if (!fragment) return wrapper;

  const sections = fragment?.querySelectorAll(':scope .section');

  sections.forEach((section) => {
    if (section) {
      section.classList.remove('section');
      wrapper.appendChild(section);
    }
  });

  return wrapper;
}

async function buildDownloadAccordions(isAuthor, references = []) {
  let refs = [];

  if (Array.isArray(references)) {
    refs = isAuthor
      ? references
      : references.filter((ref) => ref.href !== null);
  }

  return Promise.all(refs.map(loadAccordionDownload));
}

const extractValuesFromRows = (rows) => {
  const configs = {};
  configs.title = {};

  configs.title.value = rows[0]?.textContent?.trim() || '';
  configs.title.instrumentation = extractInstrumentationAttributes(rows[0]);
  configs.fragments = [];
  rows.shift();

  rows.forEach((row) => {
    const value = {};
    value.instrumentation = extractInstrumentationAttributes(row);
    value.href = row?.querySelector('a')?.getAttribute('href') || row[0]?.textContent?.trim() || '';
    configs.fragments.push(value);
  });

  return configs;
};

/**
 * Decorates a dialog block
 * @param {HTMLElement} block The decorated dialog block element
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();
  lockBodyScroll();

  const rows = Array.from(block.children);
  const values = extractValuesFromRows(rows);

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
  closeButton.setAttribute('aria-label', 'Chiudi la finestra di dialogo');
  closeButton.onclick = () => {
    closeDownloadDialog(block, panel, overlay);
    unlockBodyScroll();
  };
  header.appendChild(closeButton);

  /* Title */
  const titleEl = createTextElementFromObj(values.title, 'dialog-title', 'h2');
  header.appendChild(titleEl);

  panel.appendChild(header);

  /* Text content */
  const textContent = document.createElement('div');
  textContent.className = 'dialog-text-content';

  const isAuthor = isAuthorMode(block);
  const downloadSections = await buildDownloadAccordions(isAuthor, values.fragments ?? []);

  /* Richtext */
  downloadSections.forEach((downloadSection) => {
    textContent.appendChild(downloadSection);
  });

  panel.appendChild(textContent);

  block.appendChild(overlay);
  block.appendChild(panel);
}
