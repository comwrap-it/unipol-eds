export default function decorate(block) {
  const rows = [...block.children];

  // Creo il container finale
  const container = document.createElement('div');
  container.className = 'footer-privacy-link-container';
  container.style.display = 'flex';
  container.style.gap = '1rem'; // spazio tra i link

  rows.forEach(row => {
    const [textDiv, linkDiv] = [...row.children];

    if (!textDiv || !linkDiv) return;

    // Prendo il testo dal primo div
    const linkText = textDiv.querySelector('p')?.textContent.trim();
    // Prendo il link dal secondo div
    const linkEl = linkDiv.querySelector('a');

    if (linkText && linkEl) {
      // Creo nuovo <a> con href già presente
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.title = linkEl.title;
      a.className = 'button';
      a.textContent = linkText;

      // Aggiungo il link al container
      container.appendChild(a);
    }
  });

  // Pulisco il block originale e inserisco il container
  block.innerHTML = '';
  block.appendChild(container);
}
