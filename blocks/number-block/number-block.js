import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Crea il DOM per un singolo Number Item
 * Gestisce sia nodi DOM (da AEM) che stringhe (da Storybook)
 */
const createNumberItem = (item) => {
  const itemWrapper = document.createElement('div');
  itemWrapper.classList.add('number-item');

  // --- 1. Gestione Titolo (Numero) ---
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('number-item-title');

  if (item.title instanceof HTMLElement) {
    // AEM EDS: Spostiamo la strumentazione e i figli per mantenere l'editing
    moveInstrumentation(item.title, titleDiv);
    while (item.title.firstChild) {
      titleDiv.appendChild(item.title.firstChild);
    }
  } else {
    // Storybook: È una stringa/numero
    titleDiv.textContent = item.title || '';
  }
  itemWrapper.appendChild(titleDiv);

  // --- 2. Gestione Descrizione ---
  const descDiv = document.createElement('div');
  descDiv.classList.add('number-item-description');

  if (item.description instanceof HTMLElement) {
    // AEM EDS
    moveInstrumentation(item.description, descDiv);
    while (item.description.firstChild) {
      descDiv.appendChild(item.description.firstChild);
    }
  } else {
    // Storybook
    const p = document.createElement('p');
    p.textContent = item.description || '';
    descDiv.appendChild(p);
  }
  itemWrapper.appendChild(descDiv);

  return itemWrapper;
};

/**
 * Funzione di creazione principale (Exported per Storybook)
 * @param {Array} items - Array di oggetti { title, description }
 * @returns {HTMLElement} Il wrapper del blocco completo
 */
export function createNumberBlock(items = []) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('number-block-wrapper');

  items.forEach((item) => {
    // Ignora item vuoti
    if (!item.title && !item.description) return;

    const itemEl = createNumberItem(item);
    wrapper.appendChild(itemEl);
  });

  return wrapper;
}

/**
 * Funzione di decorazione per AEM EDS
 */
export default function decorate(block) {
  // 1. Estrazione Dati dal DOM esistente (Table approach)
  // Assumiamo che ogni riga del blocco sia un item:
  // Col 1 = Titolo/Numero, Col 2 = Descrizione
  const items = [...block.children].map((row) => {
    const [titleEl, descEl] = [...row.children];

    // Non restituiamo stringhe, ma gli elementi DOM stessi
    // per preservare data-aue-resource, data-aue-prop, etc.
    return {
      title: titleEl, // Passiamo l'intero elemento <div>
      description: descEl, // Passiamo l'intero elemento <div>
    };
  });

  // 2. Creazione della nuova struttura
  const numberBlockDOM = createNumberBlock(items);

  // 3. Pulizia e Inserimento
  // IMPORTANTE: Non usiamo replaceWith sul 'block' principale
  // perché contiene l'ID della risorsa principale.
  block.textContent = '';
  block.appendChild(numberBlockDOM);
}
