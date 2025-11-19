export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, i) => {
    const content = row.querySelector(':scope > div'); // 1° livello
    if (!content) return;

    const inner = content.firstElementChild; // il vero valore
    console.log(`Row ${i}:`, inner?.innerHTML.trim());
  });
}
