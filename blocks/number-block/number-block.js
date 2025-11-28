import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Crea il DOM per un singolo Number Item
 */
const createNumberItem = (item) => {
  const itemWrapper = document.createElement('div');
  itemWrapper.classList.add('number-item');

  // --- 1. Titolo (Numero) ---
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('number-item-title');

  if (item.title instanceof HTMLElement) {
    moveInstrumentation(item.title, titleDiv);
    // Sposta tutti i figli (inclusi p, strong, ecc.)
    while (item.title.firstChild) {
      titleDiv.appendChild(item.title.firstChild);
    }
  } else {
    titleDiv.textContent = item.title || '';
  }
  itemWrapper.appendChild(titleDiv);

  // --- 2. Descrizione ---
  const descDiv = document.createElement('div');
  descDiv.classList.add('number-item-description');

  if (item.description instanceof HTMLElement) {
    moveInstrumentation(item.description, descDiv);
    while (item.description.firstChild) {
      descDiv.appendChild(item.description.firstChild);
    }
  } else {
    const p = document.createElement('p');
    p.textContent = item.description || '';
    descDiv.appendChild(p);
  }
  itemWrapper.appendChild(descDiv);

  return itemWrapper;
};

export function createNumberBlock(items = []) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('number-block-wrapper');

  items.forEach((item) => {
    if (!item.title && !item.description) return;
    const itemEl = createNumberItem(item);
    wrapper.appendChild(itemEl);
  });

  return wrapper;
}

export default function decorate(block) {
  const rows = [...block.children];
  const items = [];

  // --- MODIFICA FONDAMENTALE ---
  // Iteriamo di 2 in 2 perché nel DOM flat di AEM/UE:
  // Riga i   = Numero
  // Riga i+1 = Descrizione
  for (let i = 0; i < rows.length; i += 2) {
    const titleRow = rows[i];
    const descRow = rows[i + 1]; // Può essere undefined se dispari

    // Estraiamo il primo figlio della riga (che contiene il valore e l'instrumentation)
    // Se la riga è un div wrapper semplice, prendiamo quello.
    items.push({
      title: titleRow ? titleRow.firstElementChild || titleRow : null,
      description: descRow ? descRow.firstElementChild || descRow : null,
    });
  }

  const numberBlockDOM = createNumberBlock(items);

  block.textContent = '';
  block.appendChild(numberBlockDOM);
}