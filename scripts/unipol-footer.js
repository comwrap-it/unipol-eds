export default function initUnipolFooter() {
  const footerRoot = document.querySelector(
    '.footer-download-link-container, .footer-text-container',
  )?.closest('.section');

  if (!footerRoot) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.classList.add('unipol-top-footer');

  const blocksToWrap = footerRoot.querySelectorAll(
    '.text-list-wrapper, .footer-download-link-wrapper',
  );

  if (blocksToWrap.length === 0) {
    return;
  }

  blocksToWrap[0].insertAdjacentElement('beforebegin', wrapper);

  blocksToWrap.forEach((el) => wrapper.appendChild(el));
}
