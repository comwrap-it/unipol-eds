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

  // Mappa delle configurazioni dei bottoni basata sul tipo di icona
  const buttonConfigMap = {
    cart: {
      id: 'cart-button',
      ariaLabel: 'Carrello',
      className: 'header-button header-button-cart',
    },
    phone: {
      id: 'contact-button',
      ariaLabel: 'Richiesta contatto',
      className: 'header-button header-button-contact',
    },
    user: {
      id: 'access-button',
      ariaLabel: 'Accesso',
      className: 'header-button header-button-access',
    },
  };

  // Estrae le azioni configurate dal multifield "actions"
  // In AEM EDS, ogni elemento del multifield può essere rappresentato come:
  // - Una riga con tutte le colonne dei campi (icon, link)
  // - Righe separate per ogni campo (icon, link)
  const configuredActions = [];
  let currentAction = null;

  actionRows.forEach((row) => {
    const cols = [...row.children];

    // Cerca se questa riga contiene tutti i campi di un'azione (icon + link)
    if (cols.length >= 4) {
      // Struttura: colonna 0 = "icon", colonna 1 = valore icon,
      // colonna 2 = "link", colonna 3 = valore link
      const iconLabel = cols[0]?.textContent?.trim().toLowerCase();
      const iconValue = cols[1]?.textContent?.trim().toLowerCase() || '';
      const linkLabel = cols[2]?.textContent?.trim().toLowerCase();
      const linkValue = cols[3]?.querySelector('a')?.href
        || cols[3]?.textContent?.trim()
        || '#';

      if (iconLabel === 'icon' && linkLabel === 'link' && iconValue) {
        configuredActions.push({
          icon: iconValue,
          link: linkValue,
        });
        return;
      }
    }

    // Altrimenti, gestisci come righe separate per campo
    if (cols.length >= 2) {
      const fieldName = cols[0]?.textContent?.trim().toLowerCase();
      const fieldValue = cols[1]?.querySelector('a')?.href
        || cols[1]?.textContent?.trim()
        || '';

      if (fieldName === 'icon') {
        // Nuova azione: salva quella precedente se esiste e inizia una nuova
        if (currentAction && currentAction.icon) {
          configuredActions.push(currentAction);
        }
        currentAction = { icon: fieldValue.toLowerCase() };
      } else if (fieldName === 'link' && currentAction) {
        // Completa l'azione corrente con il link
        currentAction.link = fieldValue || '#';
      }
    }
  });

  // Aggiungi l'ultima azione se presente (per il caso di righe separate)
  if (currentAction && currentAction.icon) {
    configuredActions.push(currentAction);
  }

  // Crea i bottoni solo se configurati
  configuredActions.forEach((action) => {
    const config = buttonConfigMap[action.icon];
    if (!config) return; // Salta icone non riconosciute

    const li = document.createElement('li');
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = config.className;
    buttonWrapper.id = config.id;

    const a = document.createElement('a');
    a.href = action.link || '#';
    a.className = 'tool-btn';
    a.setAttribute('aria-label', config.ariaLabel);

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
