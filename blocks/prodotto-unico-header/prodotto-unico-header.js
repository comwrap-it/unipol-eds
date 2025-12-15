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

  // --- 1. GESTIONE LOGO (Prime 2 righe: logoImage e logoLink) ---
  // Struttura: [nome_campo | valore]
  // Riga 0: logoImage | [img]
  // Riga 1: logoLink | [url]
  const logoImageRow = rows[0];
  const logoLinkRow = rows[1];

  let logoImg = null;
  let logoLinkUrl = '/';

  if (logoImageRow) {
    const cols = Array.from(logoImageRow.children);
    logoImg = cols[1]?.querySelector('img');
  }

  if (logoLinkRow) {
    const cols = Array.from(logoLinkRow.children);
    logoLinkUrl = cols[1]?.querySelector('a')?.href
                  || cols[1]?.textContent?.trim()
                  || '/';
  }

  if (logoImg && logoImageRow) {
    logoImageRow.className = 'header-brand';
    logoImageRow.innerHTML = '';

    // Ottimizzazione LCP
    logoImg.setAttribute('alt', 'UnipolSai Assicurazioni');
    logoImg.loading = 'eager';
    logoImg.fetchPriority = 'high';

    const anchor = document.createElement('a');
    anchor.href = logoLinkUrl;
    anchor.title = 'Vai alla Home';
    anchor.appendChild(logoImg);
    logoImageRow.appendChild(anchor);
  }

  // Nascondi riga logoLink
  if (logoLinkRow) {
    logoLinkRow.style.display = 'none';
  }

  // --- 2. GESTIONE TOOLBAR (Righe successive a coppie: icon, link) ---
  // Struttura: ogni action ha 2 righe
  // Riga N: icon | [cart/user/phone]
  // Riga N+1: link | [url]
  const actionRows = rows.slice(2);
  const actions = [];
  
  for (let i = 0; i < actionRows.length; i += 2) {
    const iconRow = actionRows[i];
    const linkRow = actionRows[i + 1];
    
    if (!iconRow || !linkRow) continue;

    const iconCols = Array.from(iconRow.children);
    const linkCols = Array.from(linkRow.children);

    const fieldName1 = iconCols[0]?.textContent?.trim();
    const fieldName2 = linkCols[0]?.textContent?.trim();

    if (fieldName1 !== 'icon' || fieldName2 !== 'link') continue;

    const iconValue = iconCols[1]?.textContent?.trim().toLowerCase();
    const linkValue = linkCols[1]?.querySelector('a')?.href
                      || linkCols[1]?.textContent?.trim();

    if (iconValue && linkValue) {
      actions.push({
        icon: iconValue,
        link: linkValue,
        iconRow,
        linkRow,
        iconCell: iconCols[1],
        linkCell: linkCols[1],
      });
    }
  }

  if (actions.length > 0) {
    const toolsWrapper = document.createElement('div');
    toolsWrapper.className = 'header-tools';
    const toolsList = document.createElement('ul');

    actions.forEach((action) => {
      const li = document.createElement('li');
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = `header-button header-button-${action.icon}`;

      const a = document.createElement('a');
      a.href = action.link;
      a.className = 'tool-btn';
      a.setAttribute('aria-label', action.icon);

      const iconSpan = document.createElement('span');
      iconSpan.className = `icon icon-${action.icon}`;
      a.appendChild(iconSpan);

      buttonWrapper.appendChild(a);
      li.appendChild(buttonWrapper);

      // Instrumentation
      moveInstrumentation(action.iconCell, buttonWrapper);
      moveInstrumentation(action.linkCell, a);

      toolsList.appendChild(li);

      // Nascondi le righe originali
      action.iconRow.style.display = 'none';
      action.linkRow.style.display = 'none';
    });

    toolsWrapper.appendChild(toolsList);
    block.appendChild(toolsWrapper);
  }

  // Carica gli SVG
  decorateIcons(block);
}
