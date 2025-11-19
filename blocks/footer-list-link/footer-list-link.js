import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  if (!block) return;

  // Seleziono eventuale wrapper predefinito
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.footer-list-link-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Creo container finale
  const footerWrapper = document.createElement('div');
  footerWrapper.className = 'footer-list-link-wrapper';

  rows.forEach((row) => {
    if (!row) return;

    // Recupero valori boolean, titolo, testo e link
    const showTitleDiv = row.querySelector('div:nth-child(1)');
    const titleDiv = row.querySelector('div:nth-child(2)');
    const textDiv = row.querySelector('div:nth-child(3)');
    const buttonDiv = row.querySelector('div:nth-child(4) a');

    if (!textDiv || !buttonDiv) return;

    const showTitle = showTitleDiv?.textContent.trim() === 'true';
    const linkText = textDiv.textContent.trim();
    const linkHref = buttonDiv.getAttribute('href');

    // Creo nuovo div per il singolo link
    const newLinkDiv = document.createElement('div');

    // Se showTitle è true, aggiungo <p> con il titolo
    if (showTitle && titleDiv) {
      const p = document.createElement('p');
      p.textContent = titleDiv.textContent.trim();
      newLinkDiv.appendChild(p);
    }

    // Creo il link <a>
    const a = document.createElement('a');
    a.href = linkHref;
    a.title = linkText;
    a.className = 'button';
    a.textContent = linkText;

    newLinkDiv.appendChild(a);

    // Sposto eventuale strumentazione del vecchio div
    moveInstrumentation(row, newLinkDiv);

    footerWrapper.appendChild(newLinkDiv);
  });

  // Preservo attributi del block originale
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      footerWrapper.setAttribute(attr.name, attr.value);
    }
  });

  // Preservo eventuale blockName
  if (block.dataset.blockName) {
    footerWrapper.dataset.blockName = block.dataset.blockName;
  }

  // Mantengo classi del block
  footerWrapper.classList.add('block');
  block.classList.forEach((cls) => {
    if (cls !== 'block') footerWrapper.classList.add(cls);
  });

  // Sostituisco il block originale con quello nuovo
  block.replaceWith(footerWrapper);
}
