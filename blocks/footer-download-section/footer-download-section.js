/**
 * Footer Download Section Component
 *
 * Questo componente gestisce:
 * - Logo Unipol
 * - Link + testo "Unipol Group"
 * - Icona accanto al link Unipol
 * - QR Code + testo descrittivo
 * - Google Play img + link
 * - App Store img + link
 *
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

/* ----------------------------------------------
   HELPER: preserva attributi AEM sul nuovo blocco
---------------------------------------------- */
function preserveBlockAttributes(source, target) {
  [...source.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      target.setAttribute(attr.name, attr.value);
    }
  });

  if (source.dataset.blockName) {
    target.dataset.blockName = source.dataset.blockName;
  }

  source.classList.forEach((cls) => {
    if (!target.classList.contains(cls)) {
      target.classList.add(cls);
    }
  });
}

/* ----------------------------------------------
   HELPER: estrai immagine dalla row
---------------------------------------------- */
function extractImage(row) {
  if (!row) return null;
  const img = row.querySelector(':scope > div')?.firstElementChild;
  if (img) moveInstrumentation(row, img);
  return img || null;
}

/* ----------------------------------------------
   HELPER: estrai testo (text, richtext…)
---------------------------------------------- */
function extractText(row) {
  if (!row) return '';

  const container = row.querySelector(':scope > div');
  if (!container) return '';

  const hasInstrumentation = container.hasAttribute('data-aue-resource')
    || container.hasAttribute('data-richtext-prop')
    || container.querySelector('[data-aue-resource]')
    || container.querySelector('[data-richtext-prop]');

  if (hasInstrumentation) moveInstrumentation(row, container);

  return container.textContent?.trim() || '';
}

/* ----------------------------------------------
   HELPER: crea link con immagine
---------------------------------------------- */
function createImageLink(href, img, className) {
  if (!img) return null;

  const a = document.createElement('a');
  a.href = href || '#';
  a.setAttribute('aria-label', href || '#');
  a.className = className;
  a.appendChild(img.cloneNode(true));
  return a;
}

/* ----------------------------------------------
   CREAZIONE DEL COMPONENTE (single source of truth)
---------------------------------------------- */
export function createFooterDownloadSection({
  logoUnipol,
  unipolText,
  unipolHref,
  unipolIcon,
  qrImg,
  qrText,
  googleImg,
  googleHref,
  appStoreImg,
  appStoreHref,
}) {
  const root = document.createElement('div');
  root.className = 'footer-download-section block';

  /* --- Container 1: Logo + Unipol group link --- */
  const container1 = document.createElement('div');
  container1.className = 'footer-unipol-button-container';

  if (logoUnipol) container1.appendChild(logoUnipol.cloneNode(true));

  const link1 = document.createElement('a');
  link1.textContent = unipolText || '';
  link1.href = unipolHref || '#';
  link1.className = 'footer-link-unipol-button';
  container1.appendChild(link1);

  if (unipolIcon) container1.appendChild(unipolIcon.cloneNode(true));

  /* --- Container 2: QR Code + label --- */
  const container2 = document.createElement('div');
  container2.className = 'footer-download-qr-container';

  if (qrImg) container2.appendChild(qrImg.cloneNode(true));

  const span = document.createElement('span');
  span.textContent = qrText || '';
  container2.appendChild(span);

  /* --- Container 3: Google Play + App Store --- */
  const container3 = document.createElement('div');
  container3.className = 'footer-download-store-container';

  const googleLink = createImageLink(googleHref, googleImg, 'footer-link-google');
  if (googleLink) container3.appendChild(googleLink);

  const appStoreLink = createImageLink(appStoreHref, appStoreImg, 'footer-link-app-store');
  if (appStoreLink) container3.appendChild(appStoreLink);

  /* --- Wrapper finale di QR + store links --- */
  const downloadWrapper = document.createElement('div');
  downloadWrapper.className = 'footer-link-download-container';
  downloadWrapper.appendChild(container2);
  downloadWrapper.appendChild(container3);

  /* --- Append finale sul root --- */
  root.appendChild(container1);
  root.appendChild(downloadWrapper);

  return root;
}

/* ----------------------------------------------
   DECORATE (estrai dati da UE e crea componente)
---------------------------------------------- */
export default function decorate(block) {
  if (!block) return;

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  if (rows.length < 10) return;

  const data = {
    logoUnipol: extractImage(rows[0]),
    unipolText: extractText(rows[1]),
    unipolHref: extractText(rows[2]),
    unipolIcon: extractImage(rows[3]),

    qrImg: extractImage(rows[4]),
    qrText: extractText(rows[5]),

    googleImg: extractImage(rows[6]),
    googleHref: extractText(rows[7]),

    appStoreImg: extractImage(rows[8]),
    appStoreHref: extractText(rows[9]),
  };

  const newBlock = createFooterDownloadSection(data);

  preserveBlockAttributes(block, newBlock);
  block.replaceWith(newBlock);
}
