// ===============================================
//  Capa de datos del carrito (localStorage)
// ===============================================
const CLAVE_CARRITO = "aromaNicaCarrito";

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    return Array.isArray(datos) ? datos : [];
  } catch (e) {
    return []; // JSON corrupto o storage no disponible
  }
}

function guardarCarrito(items) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  } catch (e) {
    console.error("No se pudo guardar el carrito:", e);
  }
  actualizarBadge();
}

function agregarAlCarrito(producto) {
  const items = leerCarrito();
  const existente = items.find((i) => i.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      icono: producto.icono,
      color: producto.color,
      cantidad: 1
    });
  }
  guardarCarrito(items);
}

function cambiarCantidad(id, delta) {
  const items = leerCarrito()
    .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
    .filter((i) => i.cantidad > 0); // si llega a 0, se elimina
  guardarCarrito(items);
}

function eliminarDelCarrito(id) {
  guardarCarrito(leerCarrito().filter((i) => i.id !== id));
}

function vaciarCarrito() {
  guardarCarrito([]);
}

function actualizarBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  const total = leerCarrito().reduce((suma, i) => suma + (Number(i.cantidad) || 0), 0);
  badge.textContent = total;
  badge.hidden = total === 0;
}

// ===============================================
//  Snackbar
// ===============================================
const snackbar = document.getElementById("snackbar");
const snackTexto = document.getElementById("snackTexto");
const snackAccion = document.getElementById("snackAccion");
let temporizador;

function mostrarSnackbar(texto, textoAccion = "Cerrar", accion = null) {
  if (!snackbar) return;
  snackTexto.textContent = texto;
  snackAccion.textContent = textoAccion;
  snackAccion.onclick = () => {
    if (accion) accion();
    snackbar.classList.remove("visible");
  };
  snackbar.classList.add("visible");
  clearTimeout(temporizador);
  temporizador = setTimeout(() => snackbar.classList.remove("visible"), 3500);
}

// ===============================================
//  Navigation drawer (menú en móvil)
// ===============================================
const drawer = document.getElementById("drawer");
const scrim = document.getElementById("scrim");

function abrirDrawer(abrir) {
  drawer.classList.toggle("abierto", abrir);
  scrim.classList.toggle("visible", abrir);
}

document.getElementById("btnMenu").addEventListener("click", () => abrirDrawer(true));
scrim.addEventListener("click", () => abrirDrawer(false));
drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => abrirDrawer(false)));

// ===============================================
//  Inicialización y sincronización entre pestañas
// ===============================================
actualizarBadge();
window.addEventListener("storage", (e) => {
  if (e.key === CLAVE_CARRITO) actualizarBadge();
});