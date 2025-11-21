export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 8) return;
  const imgRow0 = rows[0].querySelector(':scope > div')?.firstElementChild;
  const row1Text = rows[1].querySelector(':scope > div')?.textContent.trim();
  const imgRow3 = rows[3].querySelector(':scope > div')?.firstElementChild;

  const container1 = document.createElement('div');
  container1.className = 'footer-unipol-button-container';
  container1.style.display = 'flex';
  container1.style.alignItems = 'center';
  container1.style.gap = '8px';

  if (imgRow0) container1.appendChild(imgRow0.cloneNode(true));

  const link1 = document.createElement('a');
  link1.textContent = row1Text || '';
  link1.href = rows[2].querySelector(':scope > div')?.textContent.trim() || '#';
  link1.className = 'footer-link-unipol-button';
  container1.appendChild(link1);

  if (imgRow3) container1.appendChild(imgRow3.cloneNode(true));

  const imgRow4 = rows[4].querySelector(':scope > div')?.firstElementChild;
  const row5Text = rows[5].querySelector(':scope > div')?.textContent.trim();

  const container2 = document.createElement('div');
  container2.className = 'footer-download-qr-container';
  container2.style.display = 'flex';
  container2.style.alignItems = 'center';
  container2.style.gap = '8px';

  if (imgRow4) container2.appendChild(imgRow4.cloneNode(true));

  const textSpan = document.createElement('span');
  textSpan.textContent = row5Text || '';
  container2.appendChild(textSpan);
  const imgRow6 = rows[6].querySelector(':scope > div')?.firstElementChild;
  const row7Href = rows[7].querySelector(':scope > div')?.textContent.trim();

  const container3 = document.createElement('div');
  container3.className = 'footer-download-store-container';
  container3.style.display = 'flex';
  container3.style.alignItems = 'center';
  container3.style.gap = '8px';

  if (imgRow6) {
    const link2 = document.createElement('a');
    const href2 = row7Href || '#';

    link2.href = href2;
    link2.setAttribute('aria-label', href2);
    link2.appendChild(imgRow6.cloneNode(true));
    link2.className = 'footer-link-google';

    container3.appendChild(link2);
  }
  const imgRow8 = rows[8].querySelector(':scope > div')?.firstElementChild;
  const row9Href = rows[9].querySelector(':scope > div')?.textContent.trim();

  if (imgRow8) {
    const link3 = document.createElement('a');
    const href3 = row9Href || '#';

    link3.href = href3;
    link3.setAttribute('aria-label', href3);
    link3.appendChild(imgRow8.cloneNode(true));
    link3.className = 'footer-link-app-store';

    container3.appendChild(link3);
  }

  const downloadWrapper = document.createElement('div');
  downloadWrapper.className = 'footer-link-download-container';
  downloadWrapper.style.display = 'flex';
  downloadWrapper.style.flexDirection = 'column';
  downloadWrapper.style.gap = '8px';

  downloadWrapper.appendChild(container2);
  downloadWrapper.appendChild(container3);

  block.innerHTML = '';
  block.appendChild(container1);
  block.appendChild(downloadWrapper);
}
