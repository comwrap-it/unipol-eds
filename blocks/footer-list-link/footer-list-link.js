/**
 * Footer List Link Block
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);

  // Nuovo wrapper finale
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-list-link';

  rows.forEach((row) => {
    const cols = Array.from(row.children);
    if (!cols.length) return;

    // ------------------------------------------
    // 1) Lettura hide flag (true/false)
    // ------------------------------------------
    let rawFlag = cols[0]?.textContent?.trim() || null;
    const hasFlag = rawFlag === 'true' || rawFlag === 'false';
    const showTitle = hasFlag ? rawFlag === 'true' : false; // se il flag NON c’è ⇒ false

    // Rimuovo il flag dal DOM
    if (hasFlag) cols[0].remove();

    // Ora la struttura è:
    // col[0] → Title
    // col[1] → Link text
    // col[2] → Link URL

    const titleCol = cols[1];
    console.log(titleCol);
    const textCol = cols[2];
    console.log(textCol);

    const hrefCol = cols[3];
    console.log(hrefCol);


    const linkText = textCol?.textContent?.trim() || '';
    const linkHref = hrefCol?.querySelector('a')?.getAttribute('href') || '';

    // ------------------------------------------
    // 2) Costruisco il nuovo item
    // ------------------------------------------
    const item = document.createElement('div');

    // ----- TITLE (creato solo se showTitle === true)
    if (titleCol && showTitle) {
      const titleWrapper = document.createElement('div');
      titleWrapper.innerHTML = titleCol.innerHTML;
      item.appendChild(titleWrapper);
    }


    // ----- LINK
    if (hrefCol) {
      const newLinkWrapper = document.createElement('div');
      const newP = document.createElement('p');
      newP.classList.add('button-container');

      const a = document.createElement('a');
      a.href = linkHref;
      a.className = 'button';
      a.textContent = linkText;
      a.title = linkText;

      newP.appendChild(a);
      newLinkWrapper.appendChild(newP);
      item.appendChild(newLinkWrapper);
    }

    // ------------------------------------------
    // 3) Move instrumentation (AEM EDS)
    // ------------------------------------------
    row.querySelectorAll('[data-aue-resource], [data-richtext-prop]').forEach((instr) => {
      moveInstrumentation(instr, item);
    });

    wrapper.appendChild(item);
  });

  // Mantengo attributi instrumentation del block originale
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      wrapper.setAttribute(attr.name, attr.value);
    }
  });

  wrapper.classList.add('block');
  block.classList.forEach((cls) => {
    if (cls !== 'block') wrapper.classList.add(cls);
  });

  block.replaceWith(wrapper);
}
