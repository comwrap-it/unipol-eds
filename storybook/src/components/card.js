export class AppCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Card Title';
    const text = this.getAttribute('text') || 'Card content goes here.';
    const img = this.getAttribute('img') || 'https://via.placeholder.com/300x200';
    this.innerHTML = `
      <div class="card">
        <img src="${img}" alt="${title}" />
        <div class="card-content">
          <h3>${title}</h3>
          <p>${text}</p>
        </div>
      </div>`;
  }
}
customElements.define('app-card', AppCard);
