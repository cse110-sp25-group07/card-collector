class NavBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main Navigation');

    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="decks.html">Decks</a>
      <a href="upload.html">Upload</a>
    `;

    this.shadowRoot.append(nav);
  }
}

customElements.define('nav-bar', NavBar);
