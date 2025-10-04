class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['nombre', 'precio', 'descripcion', 'imagen'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const nombre = this.getAttribute('nombre') || '';
    const precio = this.getAttribute('precio') || '';
    const descripcion = this.getAttribute('descripcion') || '';
    const imagen = this.getAttribute('imagen') || '';

    this.shadowRoot.innerHTML = `
        <style>
    .card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  max-width: 250px;
  text-align: center;
  }
  .card img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
  }
  .card h3 {
  margin: 12px 0 8px 0;
  font-size: 1.1em;
  }
  .card .precio {
  color: #e53935;
  font-weight: bold;
  margin-bottom: 8px;
  }
  .card .descripcion {
  font-size: 0.95em;
  color: #555;
  }
      <style>
      
      <div class="card">
        <img src="${imagen}" alt="${nombre}">
        <h3>${nombre}</h3>
        <div class="precio">${precio}</div>
        <div class="descripcion">${descripcion}</div>
      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);