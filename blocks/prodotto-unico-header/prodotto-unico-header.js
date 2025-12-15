import { decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const rows = Array.from(block.children);

  // --- BEST PRACTICE: Validazione Input ---
  if (rows.length < 2) return; // Evita errori se il blocco è vuoto

  // 1. LOGO & LINK (Prime 2 righe fisse come da modello)
  // Nota: È meglio usare destructuring per chiarezza
  const [logoImgRow, logoLinkRow, ...actionRows] = rows;

  const logoImg = logoImgRow?.querySelector('img');
  // Supporto sia per link raw che per HTML anchor
  const logoLink = logoLinkRow?.querySelector('a')?.href 
    || logoLinkRow?.textContent?.trim();

  // Pulizia DOM Logo
  if (logoImg) {
    logoImgRow.className = 'header-brand';
    logoImgRow.innerHTML = ''; // Svuota per ricostruire pulito
    
    // LCP Optimization
    logoImg.setAttribute('alt', 'UnipolSai Assicurazioni');
    logoImg.loading = 'eager';
    logoImg.fetchPriority = 'high'; // Aggiunta moderna per LCP

    const anchor = document.createElement('a');
    anchor.href = logoLink || '/';
    anchor.title = 'Vai alla Home';
    anchor.appendChild(logoImg);
    logoImgRow.appendChild(anchor);
    
    // IMPORTANTE: Sposta l'instrumentation sul container visibile o sull'anchor
    moveInstrumentation(logoImg, anchor); 
  }
  
  // Rimuovi la riga del link dal DOM invece di nasconderla (più pulito)
  // A meno che l'instrumentation non sia su quella riga specifica.
  if (logoLinkRow) logoLinkRow.remove();

  // 2. TOOLBAR (Parsing più robusto)
  const toolsList = document.createElement('ul');
  
  // Qui assumo che il tuo modello JSON attuale generi righe separate per proprietà.
  // Tuttavia, per robustezza, proviamo a parsare gli items in modo più sicuro.
  
  let currentItem = {};
  
  actionRows.forEach((row) => {
    const cols = [...row.children];
    // Controllo difensivo
    if (cols.length < 2) return;

    const key = cols[0].textContent.trim();
    const contentCell = cols[1];

    // Logica Key-Value (quella che usi tu)
    if (key === 'headerButtonsActionsIcon') {
        // Se c'era un item precedente in sospeso, processalo (edge case)
        if (currentItem.icon && currentItem.link) buildToolItem(currentItem, toolsList);
        
        // Nuovo item
        currentItem = { 
            icon: contentCell.textContent.trim().toLowerCase(), 
            iconEl: contentCell // Salviamo l'elemento per l'instrumentation
        };
        row.remove(); // Rimuovi riga processata
    } 
    else if (key === 'headerButtonsActionsLink') {
        if (currentItem) {
            currentItem.link = contentCell.querySelector('a')?.href || contentCell.textContent.trim();
            currentItem.linkEl = contentCell; // Salviamo l'elemento per l'instrumentation
            
            // Item completo? Costruiscilo
            if (currentItem.icon && currentItem.link) {
                buildToolItem(currentItem, toolsList);
                currentItem = {}; // Reset
            }
        }
        row.remove(); // Rimuovi riga processata
    }
  });

  // Se abbiamo trovato items, creiamo il wrapper
  if (toolsList.children.length > 0) {
      const toolsWrapper = document.createElement('div');
      toolsWrapper.className = 'header-tools';
      toolsWrapper.appendChild(toolsList);
      
      // Inseriamo la toolbar nella prima riga disponibile o nel blocco stesso
      // Creiamo un container dedicato per layout flex
      const headerInner = document.createElement('div');
      headerInner.className = 'prodotto-unico-header-inner';
      // Appendiamo Logo (già modificato in place su logoImgRow) e Tools
      // Nota: logoImgRow è già nel block. 
      // La cosa più pulita in EDS è appendere il wrapper tools alla fine del blocco
      // e usare CSS grid/flex sul blocco stesso.
      block.appendChild(toolsWrapper); 
  }
  
  decorateIcons(block);
}

// Helper function per tenere il decorate() pulito
function buildToolItem(item, container) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'tool-btn';
    a.href = item.link;
    a.innerHTML = `<span class="icon icon-${item.icon}"></span>`;
    
    // Sposta instrumentation dagli elementi originali al nuovo wrapper
    // Questo permette di cliccare sull'icona in UE e aprire il campo giusto
    if (item.iconEl) moveInstrumentation(item.iconEl, a);
    
    li.appendChild(a);
    container.appendChild(li);
}