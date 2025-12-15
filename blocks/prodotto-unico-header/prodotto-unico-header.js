import { decorateIcons } from '../../scripts/aem.js';

/**
 * Decorates the Prodotto Unico Header block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // 1. Estrazione dei dati dal DOM (che arriva dal documento o UE)
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Assumiamo che la prima riga sia il Logo, e le successive siano le azioni
  const logoRow = rows[0];
  const actionRows = rows.slice(1);

  // 2. Costruzione della struttura del Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'header-brand';

  if (logoRow) {
    const img = logoRow.querySelector('img');
    const link = logoRow.querySelector('a')?.href || '/';

    if (img) {
      // Ottimizzazione: assicuriamo dimensioni corrette e lazy loading off per LCP
      img.setAttribute('alt', 'UnipolSai Assicurazioni');
      img.loading = 'eager';

      const anchor = document.createElement('a');
      anchor.href = link;
      anchor.title = 'Vai alla Home';
      anchor.appendChild(img);
      logoWrapper.appendChild(anchor);
    }
  }

  // 3. Costruzione della Toolbar (Destra) - Legge configurazione da AEM EDS Universal Editor
  const toolsWrapper = document.createElement('div');
  toolsWrapper.className = 'header-tools';
  const toolsList = document.createElement('ul');

  // Estrae le azioni configurate dagli items del blocco
  // Ogni item è rappresentato da due righe consecutive:
  // 1. headerButtonsActionsIcon -> tipo di icona (cart/phone/user)
  // 2. headerButtonsActionsLink -> URL del link
  const configuredActions = [];
  let currentAction = {};

  actionRows.forEach((row) => {
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
