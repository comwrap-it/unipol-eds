import { decorateIcons } from '../../scripts/aem.js';

/**
 * Decorates the Prodotto Unico Header block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // 1. Estrazione dei dati dal DOM (che arriva dal documento o UE)
  // Assumiamo che la prima riga sia il Logo, e le successive siano le azioni
  const [logoRow, ...actionRows] = [...block.children];

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

  // 3. Costruzione della Toolbar (Destra)
  const toolsWrapper = document.createElement('div');
  toolsWrapper.className = 'header-tools';
  const toolsList = document.createElement('ul');

  actionRows.forEach((row) => {
    // La prima colonna è il nome icona, la seconda è il link
    const cols = [...row.children];
    const iconName = cols[0]?.textContent?.trim().toLowerCase();
    const actionLink = cols[1]?.querySelector('a')?.href || cols[1]?.textContent?.trim() || '#';

    if (iconName) {
      const li = document.createElement('li');

      const a = document.createElement('a');
      a.href = actionLink;
      a.className = `tool-btn tool-${iconName}`;
      a.setAttribute('aria-label', iconName); // Accessibilità

      // Inseriamo lo span per l'icona che EDS trasformerà in SVG
      const iconSpan = document.createElement('span');
      iconSpan.className = `icon icon-${iconName}`;

      a.appendChild(iconSpan);
      li.appendChild(a);
      toolsList.appendChild(li);
    }
  });

  toolsWrapper.appendChild(toolsList);

  // 4. Pulizia del DOM e assemblaggio finale
  block.textContent = ''; // Svuota il contenuto originale
  block.appendChild(logoWrapper);
  block.appendChild(toolsWrapper);

  // 5. Trigger per caricare gli SVG delle icone (cart.svg, phone.svg, user.svg)
  decorateIcons(block);
}
