export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 8) return;

  // ================================
  // Container 1: Row 0, Row 1, Row 3
  // ================================
  const imgRow0 = rows[0].querySelector(':scope > div')?.firstElementChild;
  const row1Text = rows[1].querySelector(':scope > div')?.textContent.trim();
  const imgRow3 = rows[3].querySelector(':scope > div')?.firstElementChild;

  const container1 = document.createElement('div');
  container1.className = 'footer-row-container';
  container1.style.display = 'flex';
  container1.style.alignItems = 'center';
  container1.style.gap = '10px';

  if (imgRow0) container1.appendChild(imgRow0.cloneNode(true));

  const link1 = document.createElement('a');
  link1.textContent = row1Text || '';
  link1.href = rows[2].querySelector(':scope > div')?.textContent.trim() || '#';
  link1.className = 'footer-link';
  container1.appendChild(link1);

  if (imgRow3) container1.appendChild(imgRow3.cloneNode(true));

  // ================================
  // Container 2: Row 4 (img) + Row 5 (text)
  // ================================
  const imgRow4 = rows[4].querySelector(':scope > div')?.firstElementChild;
  const row5Text = rows[5].querySelector(':scope > div')?.textContent.trim();

  const container2 = document.createElement('div');
  container2.className = 'footer-row-container';
  container2.style.display = 'flex';
  container2.style.alignItems = 'center';
  container2.style.gap = '10px';

  if (imgRow4) container2.appendChild(imgRow4.cloneNode(true));

  const textSpan = document.createElement('span');
  textSpan.textContent = row5Text || '';
  container2.appendChild(textSpan);

  // ================================
  // Container 3: Row 6 (img) - <a>  href Row 7
  // ================================
  const imgRow6 = rows[6].querySelector(':scope > div')?.firstElementChild;
  const row7Href = rows[7].querySelector(':scope > div')?.textContent.trim();

  const container3 = document.createElement('div');
  container3.className = 'footer-row-container';
  container3.style.display = 'flex';
  container3.style.alignItems = 'center';
  container3.style.gap = '10px';

  if (imgRow6) {
    const link2 = document.createElement('a');
    link2.href = row7Href || '#';
    link2.appendChild(imgRow6.cloneNode(true));
    link2.className = 'footer-link';
    container3.appendChild(link2);
  }

    // ================================
    // Container 4: Row 7 (img) - <a>  href Row 8
    // ================================
    const imgRow8 = rows[8].querySelector(':scope > div')?.firstElementChild;
    const row9Href = rows[9].querySelector(':scope > div')?.textContent.trim();

    const container4 = document.createElement('div');
    container4.className = 'footer-row-container';
    container4.style.display = 'flex';
    container4.style.alignItems = 'center';
    container4.style.gap = '10px';

    if (imgRow8) {
      const link3 = document.createElement('a');
      link3.href = row9Href || '#';
      link3.appendChild(imgRow8.cloneNode(true));
      link3.className = 'footer-link';
      container3.appendChild(link3);
    }
  block.innerHTML = '';
  block.appendChild(container1);
  block.appendChild(container2);
  block.appendChild(container3);
}
