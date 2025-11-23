import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  if (!block) return;
  const wrapper = block.querySelector('.default-content-wrapper');
  const rows = wrapper ? [...wrapper.children] : [...block.children];

  if (rows.length === 0) return;

  const titleRow = rows.shift();
  const title = document.createElement('div');
  title.classList.add('text-list-title');

  while (titleRow.firstChild) title.appendChild(titleRow.firstChild);
  moveInstrumentation(titleRow, title);

  const list = document.createElement('ul');
  list.classList.add('text-list-items');

  for (let i = 0; i < rows.length; i += 2) {
    const textRow = rows[i];
    const hrefRow = rows[i + 1];

    if (!textRow || !hrefRow) break;

    const hasContent = textRow.textContent.trim()
      || hrefRow.textContent.trim()
      || textRow.hasAttribute('data-aue-resource')
      || hrefRow.hasAttribute('data-aue-resource');
    if (hasContent) {
      const li = document.createElement('li');
      const a = document.createElement('a');

      // testo
      if (textRow) {
        while (textRow.firstChild) a.appendChild(textRow.firstChild);
        moveInstrumentation(textRow, a);
      }

      // href
      if (hrefRow) {
        const href = hrefRow.textContent.trim();
        if (href) a.href = href;
        moveInstrumentation(hrefRow, a);
      }

      li.appendChild(a);
      list.appendChild(li);
    }
  }

  const container = document.createElement('div');
  container.className = 'text-list block';

  container.appendChild(title);
  container.appendChild(list);

  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      container.setAttribute(attr.name, attr.value);
    }
  });

  block.classList.forEach((cls) => {
    if (!container.classList.contains(cls)) {
      container.classList.add(cls);
    }
  });

  block.replaceWith(container);
}
