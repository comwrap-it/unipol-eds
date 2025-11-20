export class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer><p>${this.getAttribute('text') || 'Footer © 2025'}</p></footer>`;
  }
}
customElements.define('app-footer', AppFooter);
