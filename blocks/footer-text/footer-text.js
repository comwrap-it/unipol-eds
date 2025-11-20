export default function decorate(block) {
  const text = block.querySelector(':scope > div')?.textContent.trim() || '';

  // Pulisci il blocco
  block.innerHTML = '';

  const p = document.createElement('p');
  p.textContent = text;
  block.appendChild(p);
}
