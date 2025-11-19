export default function decorate(block) {
  const rows = [...block.children];

  const container = document.createElement('div');
  container.className = 'footer-privacy-link-container';
  container.style.display = 'flex';
  rows.forEach(row => {
    const textDiv = row.querySelector('div:first-child p');
    const text = textDiv ? textDiv.textContent : '';

    const linkEl = row.querySelector('div:last-child a');
    if (linkEl && text) {
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.title = linkEl.title;
      a.className = 'button';
      a.textContent = text;

      container.appendChild(a);
    }
  });

  block.innerHTML = '';
  block.appendChild(container);
}
