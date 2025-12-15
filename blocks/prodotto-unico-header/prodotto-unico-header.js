import { decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the Prodotto Unico Header block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = Array.from(block.children);

  // Validazione minima
  if (rows.length < 1) return;

  // --- 1. GESTIONE LOGO (Assumiamo sia sempre la prima riga) ---
  // Strategia: La prima riga contiene [Immagine Logo] e [Link Logo]
  // Questa è una struttura "a tabella" anche per la config principale.
  const logoRow = rows[0];
  const logoCols = Array.from(logoRow.children);

  const logoImgCol = logoCols[0]; // Colonna 1: Immagine
  const logoLinkCol = logoCols[1]; // Colonna 2: Link (Opzionale)

  const logoImg = logoImgCol?.querySelector('img');
  const logoLinkUrl = logoLinkCol?.querySelector('a')?.href
                   || logoLinkCol?.textContent?.trim()
                   || '/';

  if (logoImg) {
    logoRow.className = 'header-brand';
    logoRow.innerHTML = ''; // Puliamo la riga per ricostruire l'HTML semantico

    // Ottimizzazione LCP (Cruciale per l'header)
    logoImg.setAttribute('alt', 'UnipolSai Assicurazioni');
    logoImg.loading = 'eager';
    logoImg.fetchPriority = 'high';

    const anchor = document.createElement('a');
    anchor.href = logoLinkUrl;
    anchor.title = 'Vai alla Home';
    anchor.appendChild(logoImg);
    logoRow.appendChild(anchor);

    // Spostiamo l'instrumentation UE dall'immagine originale al nuovo link wrapper
    if (logoImgCol) moveInstrumentation(logoImgCol, anchor);
  }

  // --- 2. GESTIONE TOOLBAR (Tutte le righe successive alla prima) ---
  const actionRows = rows.slice(1);

  if (actionRows.length > 0) {
    const toolsWrapper = document.createElement('div');
    toolsWrapper.className = 'header-tools';
    const toolsList = document.createElement('ul');

    actionRows.forEach((row) => {
      const cols = Array.from(row.children);
      // Skip righe malformate (meno di 2 colonne)
      if (cols.length < 2) return;

      // Colonna 1: Icona (es. 'cart', 'user')
      // Colonna 2: Link
      const iconCol = cols[0];
      const linkCol = cols[1];

      const iconName = iconCol.textContent.trim().toLowerCase();
      const linkUrl = linkCol.querySelector('a')?.href || linkCol.textContent.trim();

      if (!iconName || !linkUrl) return;

      // Creazione Item
      const li = document.createElement('li');
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = `header-button header-button-${iconName}`;

      const a = document.createElement('a');
      a.href = linkUrl;
      a.className = 'tool-btn';
      a.setAttribute('aria-label', iconName);

      // Struttura icona per il plugin aem.js
      a.innerHTML = `<span class="icon icon-${iconName}"></span>`;

      // Instrumentation: Fondamentale per far funzionare l'editor sulle singole celle
      // Colleghiamo l'editabilità della cella icona all'intero bottone o all'icona stessa
      moveInstrumentation(iconCol, a);

      // Nota: Potremmo voler preservare anche l'instrumentation del link,
      // ma di solito basta mappare l'elemento principale.

      buttonWrapper.appendChild(a);
      li.appendChild(buttonWrapper);
      toolsList.appendChild(li);

      // Rimuoviamo la riga originale dal DOM visibile (ora trasformata in LI)
      row.remove();
    });

    toolsWrapper.appendChild(toolsList);

    // Aggiungiamo il wrapper dei tools al blocco
    // Nota: logoRow è già dentro block (è rows[0]), quindi appendiamo toolsWrapper dopo.
    block.appendChild(toolsWrapper);
  }

  // Carica gli SVG
  decorateIcons(block);
}
