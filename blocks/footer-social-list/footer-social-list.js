export default function decorate(block) {
  const rows = [...block.children];

  const container = document.createElement('div');
  container.className = 'footer-social-container';
  container.style.display = 'flex';
  container.style.gap = '1rem';

  rows.forEach((row) => {
    const picture = row.querySelector('div:first-child picture');

    const linkEl = row.querySelector('div:last-child a');

    if (picture && linkEl) {
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.title = linkEl.title;
      a.className = 'button';

      a.appendChild(picture.cloneNode(true));

      container.appendChild(a);
    }
  });

  block.innerHTML = '';
  block.appendChild(container);
}
