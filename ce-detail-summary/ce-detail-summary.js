class DetailSummary extends HTMLElement {
  get expanded() {
    return this.hasAttribute('expanded');
  }

  set expanded(value) {
    if (value === true) {
      this.setAttribute('expanded', '');
    } else {
      this.removeAttribute('expanded');
    }

    // Safari doesn't redraw on attribute changes, we need a class toggle too
    this.classList.toggle('expanded');
  }

  constructor() {
    super();

    const template = document.getElementById('detail-summary-template');
    const node = document.importNode(template.content, true);

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(node);
    shadowRoot.addEventListener('click', this.onClick.bind(this));
  }

  onClick(event) {
    if (event.target.localName === 'button') {
      this.expanded = !this.expanded;
    }
  }
}

customElements.define('detail-summary', DetailSummary);
