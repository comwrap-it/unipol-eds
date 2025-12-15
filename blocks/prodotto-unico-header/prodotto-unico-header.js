import { decorateIcons } from '../../scripts/aem.js';

/**
 * Decorates the Prodotto Unico Header block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // 1. Estrazione dei dati dal DOM (che arriva dal documento o UE)
  const rows = Array.from(block.children);

  // 2. Estrazione dei campi del modello principale (logoImage, logoLink)
  // Prima riga: logoImage
  // Seconda riga: logoLink
  const logoImageRow = rows[0];
  const logoLinkRow = rows[1];

  const logoImg = logoImageRow?.querySelector('img');
  const logoLink = logoLinkRow?.querySelector('a')?.href
    || logoLinkRow?.textContent?.trim()
    || '/';

  // Rimuove le righe del modello principale
  if (logoImageRow) logoImageRow.remove();
  if (logoLinkRow) logoLinkRow.remove();

  // 3. Costruzione della struttura del Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'header-brand';

  if (logoImg) {
    // Ottimizzazione: assicuriamo dimensioni corrette e lazy loading off per LCP
    logoImg.setAttribute('alt', 'UnipolSai Assicurazioni');
    logoImg.loading = 'eager';

    const anchor = document.createElement('a');
    anchor.href = logoLink;
    anchor.title = 'Vai alla Home';
    anchor.appendChild(logoImg);
    logoWrapper.appendChild(anchor);
  }

  // 4. Costruzione della Toolbar (Destra) - Legge configurazione da AEM EDS Universal Editor
  const toolsWrapper = document.createElement('div');
  toolsWrapper.className = 'header-tools';
  const toolsList = document.createElement('ul');

  // Estrae le azioni configurate dagli items del blocco
  // Le righe rimanenti sono gli items (ogni item ha 2 righe)
  // 1. headerButtonsActionsIcon -> tipo di icona (cart/phone/user)
  // 2. headerButtonsActionsLink -> URL del link
  const remainingRows = Array.from(block.children);
  const configuredActions = [];
  let currentAction = {};

  remainingRows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const fieldName = cols[0]?.textContent?.trim();
    const fieldValue = cols[1]?.querySelector('a')?.href
      || cols[1]?.textContent?.trim()
      || '';

    if (fieldName === 'headerButtonsActionsIcon') {
      // Salva l'azione precedente se completa
      if (currentAction.icon) {
        configuredActions.push(currentAction);
      }
      // Inizia una nuova azione
      currentAction = { icon: fieldValue.toLowerCase() };
    } else if (fieldName === 'headerButtonsActionsLink') {
      // Completa l'azione corrente con il link
      currentAction.link = fieldValue;
    }
  });

  // Aggiungi l'ultima azione se completa
  if (currentAction.icon) {
    configuredActions.push(currentAction);
  }

  // Crea i bottoni solo se configurati
  configuredActions.forEach((action) => {
    if (!action.icon || !action.link) return;

    const li = document.createElement('li');
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = `header-button header-button-${action.icon}`;

    const a = document.createElement('a');
    a.href = action.link;
    a.className = 'tool-btn';
    a.setAttribute('aria-label', action.icon);

    // Inseriamo lo span per l'icona che EDS trasformerà in SVG
    const iconSpan = document.createElement('span');
    iconSpan.className = `icon icon-${action.icon}`;

    a.appendChild(iconSpan);
    buttonWrapper.appendChild(a);
    li.appendChild(buttonWrapper);
    toolsList.appendChild(li);
  });

  toolsWrapper.appendChild(toolsList);

  // 4. Pulizia del DOM e assemblaggio finale
  block.textContent = ''; // Svuota il contenuto originale
  block.appendChild(logoWrapper);
  block.appendChild(toolsWrapper);

  // 5. Trigger per caricare gli SVG delle icone (cart.svg, phone.svg, user.svg)
  decorateIcons(block);
}
