export default async function handleDataTableWidget() {
  const block = document.querySelector('.data-table-container');
  if (!block) return;

  const rows = [...block.children];

  const styleValue = rows[1]?.textContent?.trim();

  const section = block.closest('.section.text-block-container.data-table-container');
  const benefitContainers = document.querySelectorAll('.data-table .benefit-container');

  if (styleValue) {
    section?.style.setProperty('background-color', styleValue);

    benefitContainers.forEach((el) => {
      el.style.setProperty('color', styleValue);
    });
  } else {
    section?.style.removeProperty('background-color');
    benefitContainers.forEach((el) => {
      el.style.removeProperty('color');
    });
  }
}
