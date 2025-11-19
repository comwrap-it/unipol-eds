import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  if (!block) return;

  const items = Array.from(block.children);

  const cleanWrapper = document.createElement('div');
  cleanWrapper.className = 'footer-list-link';

  items.forEach((item) => {
    const rows = Array.from(item.children);

    let boolRow = rows[0];
    let titleRow = rows[1];
    let textRow = rows[2];
    let linkRow = rows[3];

    let boolValue = null;

    if (boolRow && boolRow.textContent.trim()) {
      const raw = boolRow.textContent.trim().toLowerCase();
      if (raw === 'true') boolValue = true;
      if (raw === 'false') boolValue = false;
    }

    const showTitle = boolValue === true;

    // --- 2) Ricavo valori --------------------------
    const titleText = titleRow?.textContent?.trim() || '';
    const linkText = textRow?.textContent?.trim() || '';
    const linkEl = linkRow?.querySelector('a');

    // Evita item vuoti senza link
    if (!linkEl) return;

    // --- 3) Creo item finale --------------------------------------------
    const outItem = document.createElement('div');

    // --- titolo (solo se showTitle === true)
    if (showTitle && titleText) {
      const titleDiv = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = titleText;
      titleDiv.appendChild(p);
      outItem.appendChild(titleDiv);
    }

    // --- link
    const linkDiv = document.createElement('div');
    const p = document.createElement('p');
    p.className = 'button-container';

    const newLink = document.createElement('a');
    newLink.href = linkEl.href;
    newLink.className = 'button';
    newLink.textContent = linkText || linkEl.textContent || '';
    newLink.title = linkText || linkEl.textContent || '';

    p.appendChild(newLink);
    linkDiv.appendChild(p);
    outItem.appendChild(linkDiv);

    cleanWrapper.appendChild(outItem);
  });

  // Mantieni attributi di block (strumentazione AEM)
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      cleanWrapper.setAttribute(attr.name, attr.value);
    }
  });

  cleanWrapper.classList.add('block');
  block.classList.forEach((cls) => {
    if (cls !== 'block') cleanWrapper.classList.add(cls);
  });

  block.replaceWith(cleanWrapper);
}
