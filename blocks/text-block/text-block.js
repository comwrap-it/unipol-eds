/**
 * Text Block Component – Updated for dual titles (center/left) and UE-Safe.
 */

import {
  createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES, createButtonFromRows,
} from '../atoms/buttons/standard-button/standard-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export { BUTTON_VARIANTS, BUTTON_ICON_SIZES };

let isPrimaryBtnStyleLoaded = false;
async function ensureBtnStylesLoaded() {
  if (isPrimaryBtnStyleLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
  );
  isPrimaryBtnStyleLoaded = true;
}

/* -----------------------------
   TITLE EXTRACTOR
------------------------------*/
function extractTitleElement(titleRow) {
  if (!titleRow) return null;

  const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
  if (existingHeading) {
    moveInstrumentation(titleRow, existingHeading);
    return existingHeading;
  }

  const title = document.createElement('h2');
  while (titleRow.firstChild) {
    title.appendChild(titleRow.firstChild);
  }
  moveInstrumentation(titleRow, title);

  return title.textContent?.trim() || title.children.length > 0 ? title : null;
}

/* -----------------------------
  TEXT EXTRACTOR
------------------------------*/
function extractTextElement(textRow) {
  if (!textRow) return null;

  let textElement = textRow.querySelector('p');

  // Se non c'è un paragrafo, creiamone uno e muoviamo il contenuto
  if (!textElement) {
    textElement = document.createElement('p');
    while (textRow.firstChild) {
      textElement.appendChild(textRow.firstChild);
    }
  }

  // Spostiamo l'instrumentation dalla riga genitore al paragrafo
  moveInstrumentation(textRow, textElement);

  // Il testo viene avvolto in un div per lo styling
  const textWrapper = document.createElement('div');
  textWrapper.classList.add('text-block-text');
  textWrapper.appendChild(textElement);

  const hasInstrumentation = [...textElement.attributes].some((attr) => attr.name.startsWith('data-aue-'));

  return hasInstrumentation || textElement.textContent?.trim() ? textWrapper : null;
}

/* ------------------------------------------
   PRESERVE BLOCK ATTRIBUTES (RIMOSSA)
------------------------------------------- */
// Rimosso: function preserveBlockAttributes(sourceBlock, targetBlock) { ... }

/* ------------------------------------------
   MAIN CREATOR FUNCTION (Exported per Storybook)
------------------------------------------- */
export function createTextBlock(
  titleContent,
  centered = true,
  textContent = null, // accetta l'HTMLDivElement da extractTextElement
  buttonElement = null,
  buttonConfig = null,
) {
  // NOTA: Questa funzione crea il contenuto interno, NON il blocco principale.
  const textContentContainer = document.createElement('div');
  textContentContainer.className = 'text-block-cont';

  if (titleContent) {
    let titleElement;

    if (titleContent instanceof HTMLElement) {
      // Caso AEM EDS
      titleElement = titleContent;
      titleElement.className = 'text-block-title';
    } else {
      // Caso Storybook
      titleElement = document.createElement('h2');
      titleElement.className = 'text-block-title';
      titleElement.textContent = titleContent;
    }

    textContentContainer.appendChild(titleElement);
  }

  // Aggiungi testo (solo se centered=true)
  if (centered && textContent) {
    let textWrapper;

    if (textContent instanceof HTMLElement) {
      // Caso AEM EDS (textContent è già il div wrapper creato in extractTextElement)
      textWrapper = textContent;
    } else {
      // Caso Storybook (crea il wrapper e il paragrafo)
      textWrapper = document.createElement('div');
      textWrapper.className = 'text-block-text';
      const p = document.createElement('p');
      p.textContent = textContent;
      textWrapper.appendChild(p);
    }

    textContentContainer.appendChild(textWrapper);
  }

  // Aggiungi bottone
  let finalButtonElement = buttonElement;

  if (!finalButtonElement && buttonConfig && buttonConfig.label) {
    finalButtonElement = createButton(
      buttonConfig.label || 'Button',
      buttonConfig.href || '',
      buttonConfig.openInNewTab || false,
      buttonConfig.variant || BUTTON_VARIANTS.PRIMARY,
      buttonConfig.iconSize || BUTTON_ICON_SIZES.MEDIUM,
      buttonConfig.leftIcon || '',
      buttonConfig.rightIcon || '',
      buttonConfig.instrumentation || {},
    );
  }

  if (finalButtonElement) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'text-block-button';
    buttonContainer.appendChild(finalButtonElement);
    textContentContainer.appendChild(buttonContainer);
  }

  return textContentContainer;
}

/* ------------------------------------------
   DECORATE() (UE-Safe)
------------------------------------------- */
export default async function decorate(block) {
  if (!block) return;
  ensureBtnStylesLoaded();

  // Extract rows
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // 0: contentAlignment (boolean)
  const alignmentRow = rows[0];
  const centered = alignmentRow?.querySelector('p')?.textContent
    .trim().toLowerCase() === 'true';

  // 1: center title (shown only if centered)
  const centerTitleRow = rows[1];

  // 2: subtitle (shown only if centered)
  const subtitleRow = rows[2];

  // 3: left title (shown only if NOT centered)
  const leftTitleRow = rows[3];

  // Pick correct title depending on alignment
  const titleElement = centered
    ? extractTitleElement(centerTitleRow)
    : extractTitleElement(leftTitleRow);

  // Extract subtitle ONLY if centered
  const textElement = centered ? extractTextElement(subtitleRow) : null;

  // Rows after titles/subtitle/left-title → buttons
  const buttonRows = rows.slice(4, 10);
  const buttonElement = createButtonFromRows(buttonRows);

  // Create component content
  const newContentContainer = createTextBlock(
    titleElement,
    centered,
    textElement,
    buttonElement,
  );

  // === STEP 4: Iniezione sicura nel blocco originale (UE-Safe) ===

  // 1. Applica le classi di allineamento/stile al blocco originale
  block.classList.remove('text-block-center', 'text-block-left');
  block.classList.add(centered ? 'text-block-center' : 'text-block-left');
  block.classList.add('text-block'); // Assicura la classe base

  // 2. Pulisci il blocco originale (mantieni gli attributi UE)
  block.textContent = '';

  // 3. Trasferisci il contenuto
  while (newContentContainer.firstChild) {
    block.appendChild(newContentContainer.firstChild);
  }
}
