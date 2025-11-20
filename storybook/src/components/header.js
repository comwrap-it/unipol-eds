export class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<header><h1>${this.getAttribute('title') || 'Header'}</h1></header>`;
  }
}
customElements.define('app-header', AppHeader);
