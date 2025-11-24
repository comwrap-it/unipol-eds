/**
 * Text List / Text-Link Component (Footer)
 *
 * Gestisce la visualizzazione condizionata tra:
 * - lista testuale (richtext)
 * - singolo link (text + href)
 *
 * Questo file divide la logica in funzioni indipendenti
 * e un createComponent() che diventa single source of truth.
 */

/* -----------------------------
 *  EXTRACT FUNCTIONS
 * ----------------------------- */

/**
 * Estrae i dati dalla singola row del block.
 * Ogni row rappresenta un "text-link" model.
 *
 * @param {HTMLElement} row
 * @returns {Object} { hideTitle, title, linkText, linkHref }
 */
export function extractRowData(row) {
  if (!row) return null;

  const children = [...row.children];
  const hideTextMode = children[0]?.textContent.trim() === 'true';

  const titleDiv = children[1] || null;
  const linkTextP = children[2]?.querySelector('p') || null;
  const linkHrefA = children[3]?.querySelector('a') || null;

  return {
    hideTextMode,
    titleElement: titleDiv,
    linkText: linkTextP?.textContent.trim() ?? '',
    linkHrefElement: linkHrefA,
  };
}

/* -----------------------------
 *  CREATE COMPONENT
 * ----------------------------- */

/**
 * Crea DOM element per ogni item della lista/footer
 *
 * @param {Object} data - risultato di extractRowData()
 * @returns {HTMLElement} rowElement
 */
export function createTextListItem(data) {
  const {
    hideTextMode,
    titleElement,
    linkText,
    linkHrefElement,
  } = data;

  const wrapper = document.createElement('div');
  wrapper.className = 'text-link-item';

  // ===== Title handling =====
  if (titleElement) {
    const clonedTitle = titleElement.cloneNode(true);
    clonedTitle.style.display = hideTextMode ? 'block' : 'none';
    wrapper.appendChild(clonedTitle);
  }

  // ===== Link handling =====
  if (linkHrefElement) {
    const link = linkHrefElement.cloneNode(true);

    if (!hideTextMode) {
      link.style.display = 'block';
      link.textContent = linkText;
    } else {
      link.style.display = 'none';
    }

    wrapper.appendChild(link);
  }

  return wrapper;
}

/* -----------------------------
 *  CREATE BLOCK
 * ----------------------------- */

/**
 * Crea l'intero blocco finale
 *
 * @param {Array<Object>} itemsData
 * @returns {HTMLElement}
 */
export function createTextListBlock(itemsData) {
  const container = document.createElement('div');
  container.className = 'text-list block';

  itemsData.forEach((itemData) => {
    const item = createTextListItem(itemData);
    container.appendChild(item);
  });

  return container;
}

/* -----------------------------
 *  DECORATE
 * ----------------------------- */

/**
 * decorate(block)
 * - legge i dati dalle rows
 * - crea un nuovo block tramite createTextListBlock()
 * - sostituisce il blocco originale
 */

export default function decorate(block) {
  const rows = [...block.children];

  const itemsData = rows
    .map(extractRowData)
    .filter(Boolean);

  const newBlock = createTextListBlock(itemsData);

  block.replaceWith(newBlock);
}
