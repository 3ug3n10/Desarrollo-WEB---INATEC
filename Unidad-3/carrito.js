const contenedorCarrito = document.getElementById("carritoContenido");

const formatoMoneda = (n) =>
  "C$ " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Los datos vienen de localStorage (manipulable): se sanitizan antes de usar innerHTML
function esc(texto) {
  const mapa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(texto).replace(/[&<>"']/g, (c) => mapa[c]);
}

function colorSeguro(color) {
  return /^#[0-9a-f]{3,8}$/i.test(color) ? color : "#8D6E63";
}

function renderizarCarrito() {
  const items = leerCarrito();

  if (items.length === 0) {
    contenedorCarrito.innerHTML = `
      <div class="card carrito-vacio">
        <span class="material-icons">remove_shopping_cart</span>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega productos desde el catálogo para verlos aquí.</p>
        <a href="index.html#productos" class="btn btn-primary">Ir al catálogo</a>
      </div>`;
    return;
  }

  const unidades = items.reduce((s, i) => s + i.cantidad, 0);
  const subtotal = items.reduce((s, i) => s + (Number(i.precio) || 0) * i.cantidad, 0);

  const filas = items.map((i) => {
    const precio = Number(i.precio) || 0;
    return `
      <article class="card item-carrito">
        <div class="item-media" style="background:${colorSeguro(i.color)}">
          <span class="material-icons">${esc(i.icono)}</span>
        </div>
        <div class="item-info">
          <h3>${esc(i.nombre)}</h3>
          <p>${formatoMoneda(precio)} c/u</p>
        </div>
        <div class="cantidad">
          <button class="icon-btn-sm" data-accion="restar" data-id="${esc(i.id)}" aria-label="Disminuir cantidad">
            <span class="material-icons">remove</span>
          </button>
          <span class="cantidad-valor">${i.cantidad}</span>
          <button class="icon-btn-sm" data-accion="sumar" data-id="${esc(i.id)}" aria-label="Aumentar cantidad">
            <span class="material-icons">add</span>
          </button>
        </div>
        <p class="item-subtotal">${formatoMoneda(precio * i.cantidad)}</p>
        <button class="icon-btn-sm" data-accion="eliminar" data-id="${esc(i.id)}" aria-label="Eliminar producto">
          <span class="material-icons">delete</span>
        </button>
      </article>`;
  }).join("");

  contenedorCarrito.innerHTML = `
    <div class="carrito-layout">
      <div class="carrito-lista">${filas}</div>

      <aside class="card resumen">
        <h3>Resumen del pedido</h3>
        <div class="resumen-fila"><span>Productos (${unidades})</span><span>${formatoMoneda(subtotal)}</span></div>
        <div class="resumen-fila"><span>Envío</span><span>Por calcular</span></div>
        <div class="resumen-fila total"><span>Total</span><span>${formatoMoneda(subtotal)}</span></div>
        <button class="btn btn-contained" data-accion="pagar">
          <span class="material-icons">payments</span>Finalizar compra
        </button>
        <button class="btn btn-outlined" data-accion="vaciar">Vaciar carrito</button>
        <a href="index.html#productos" class="seguir">← Seguir comprando</a>
      </aside>
    </div>`;
}

// Delegación de eventos: un solo listener para todos los botones dinámicos
contenedorCarrito.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-accion]");
  if (!boton) return;

  const { accion, id } = boton.dataset;

  switch (accion) {
    case "sumar":    cambiarCantidad(id, 1); break;
    case "restar":   cambiarCantidad(id, -1); break;
    case "eliminar": eliminarDelCarrito(id); mostrarSnackbar("Producto eliminado del carrito"); break;
    case "vaciar":
      if (confirm("¿Seguro que deseas vaciar el carrito?")) {
        vaciarCarrito();
        mostrarSnackbar("Carrito vaciado");
      }
      break;
    case "pagar":
      mostrarSnackbar("Maqueta académica: aquí iría el proceso de pago.");
      return; // no hay cambios que re-renderizar
  }
  renderizarCarrito();
});

// Si el carrito cambia en otra pestaña, esta vista se actualiza sola
window.addEventListener("storage", (e) => {
  if (e.key === CLAVE_CARRITO) renderizarCarrito();
});

renderizarCarrito();