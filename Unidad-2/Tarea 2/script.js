// ===============================================
//  Actividad III - Panel administrativo con formulario
// ===============================================

const app = document.getElementById("app");

// Referencia al contenedor central (se asigna al construir la estructura)
let contenido;

// Array donde se almacenan los registros del formulario.
// Está fuera de las funciones para que los datos no se pierdan
// al cambiar de sección en el menú.
let registros = [];

// Contador para dar un id único a cada registro
let siguienteId = 1;

// -----------------------------------------------
// Función auxiliar para crear elementos
// -----------------------------------------------
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto) elemento.textContent = texto;
  return elemento;
}

// -----------------------------------------------
// 1. Estructura base: barra superior, menú y contenido
// -----------------------------------------------
function construirEstructura() {
  // Barra superior con botón para esconder/mostrar el menú
  const topbar = crearElemento("header", "topbar");
  const btnToggle = crearElemento("button", "btn-toggle", "☰");
  const titulo = crearElemento("h1", "", "Panel Administrativo");
  titulo.style.fontSize = "20px";
  topbar.appendChild(btnToggle);
  topbar.appendChild(titulo);

  // Menú lateral con dos secciones
  const sidebar = crearElemento("nav", "sidebar");
  const lista = document.createElement("ul");

  const opcion1 = crearElemento("li", "activo", "🏠 Inicio");
  const opcion2 = crearElemento("li", "", "📝 Registros");

  lista.appendChild(opcion1);
  lista.appendChild(opcion2);
  sidebar.appendChild(lista);

  // Contenedor central
  contenido = crearElemento("main", "contenido");

  app.appendChild(topbar);
  app.appendChild(sidebar);
  app.appendChild(contenido);

  // ---- Eventos ----

  // Esconder y volver a mostrar el menú
  btnToggle.addEventListener("click", () => {
    sidebar.classList.toggle("oculto");
    contenido.classList.toggle("expandido");
  });

  // Sección 1: Inicio (botón de saludar)
  opcion1.addEventListener("click", () => {
    marcarActivo(opcion1, opcion2);
    mostrarSeccionSaludo();
  });

  // Sección 2: Panel administrativo (formulario + grid)
  opcion2.addEventListener("click", () => {
    marcarActivo(opcion2, opcion1);
    mostrarPanelAdministrativo();
  });
}

// Resalta la opción seleccionada del menú
function marcarActivo(activa, inactiva) {
  activa.classList.add("activo");
  inactiva.classList.remove("activo");
}

// Borra todo lo que hay en el contenido central
function limpiarContenido() {
  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}

// -----------------------------------------------
// 2. Primera sección: botón que muestra mensajes de bienvenida
// -----------------------------------------------
function mostrarSeccionSaludo() {
  limpiarContenido();

  const titulo = crearElemento("h2", "", "Bienvenido a la sección de inicio");
  const btnSaludar = crearElemento("button", "btn", "Saludar 👋");
  const listaMensajes = crearElemento("div", "lista-mensajes");

  contenido.appendChild(titulo);
  contenido.appendChild(btnSaludar);
  contenido.appendChild(listaMensajes);

  let contador = 0;

  btnSaludar.addEventListener("click", () => {
    contador++;

    const mensaje = crearElemento("div", "mensaje");
    const texto = crearElemento(
      "p",
      "",
      `¡Hola! Bienvenido(a) a la página. Mensaje #${contador}`
    );
    const btnCerrar = crearElemento("button", "btn-cerrar", "✕");
    btnCerrar.title = "Cerrar mensaje";

    btnCerrar.addEventListener("click", () => {
      mensaje.remove();
    });

    mensaje.appendChild(texto);
    mensaje.appendChild(btnCerrar);
    listaMensajes.appendChild(mensaje);
  });
}

// -----------------------------------------------
// 3. Segunda sección: panel administrativo
// -----------------------------------------------
function mostrarPanelAdministrativo() {
  limpiarContenido();

  const titulo = crearElemento("h2", "", "Panel administrativo");
  const panel = crearElemento("div", "panel");

  panel.appendChild(construirFormulario());
  panel.appendChild(construirGrid());

  contenido.appendChild(titulo);
  contenido.appendChild(panel);

  // Dibuja en la tabla los registros que ya existan en el array
  renderizarTabla();
}

// ---------- Formulario ----------
function construirFormulario() {
  const tarjeta = crearElemento("section", "tarjeta");
  const subtitulo = crearElemento("h3", "", "Nuevo registro");
  const formulario = crearElemento("form", "formulario");

  const campos = [
    { id: "nombre", etiqueta: "Nombre", tipo: "text", placeholder: "Escribe tu nombre" },
    { id: "correo", etiqueta: "Correo electrónico", tipo: "email", placeholder: "correo@ejemplo.com" },
    { id: "edad", etiqueta: "Edad", tipo: "number", placeholder: "Tu edad" }
  ];

  campos.forEach((campo) => {
    const grupo = crearElemento("div", "campo");

    const label = crearElemento("label", "", campo.etiqueta);
    label.setAttribute("for", campo.id);

    const input = document.createElement("input");
    input.type = campo.tipo;
    input.id = campo.id;
    input.name = campo.id;
    input.placeholder = campo.placeholder;
    input.required = true;

    if (campo.tipo === "number") {
      input.min = 1;
      input.max = 120;
    }

    grupo.appendChild(label);
    grupo.appendChild(input);
    formulario.appendChild(grupo);
  });

  const btnGuardar = crearElemento("button", "btn", "💾 Guardar");
  btnGuardar.type = "submit";
  formulario.appendChild(btnGuardar);

  const aviso = crearElemento("p", "aviso");

  tarjeta.appendChild(subtitulo);
  tarjeta.appendChild(formulario);
  tarjeta.appendChild(aviso);

  // Al guardar: se crea un objeto, se agrega al array y se actualiza la grid
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nuevoRegistro = {
      id: siguienteId++,
      nombre: formulario.nombre.value.trim(),
      correo: formulario.correo.value.trim(),
      edad: formulario.edad.value
    };

    registros.push(nuevoRegistro);
    renderizarTabla();

    formulario.reset();
    formulario.nombre.focus();

    aviso.textContent = `✔ Registro de "${nuevoRegistro.nombre}" guardado correctamente`;
    setTimeout(() => (aviso.textContent = ""), 2500);
  });

  return tarjeta;
}

// ---------- Grid (tabla) ----------
function construirGrid() {
  const tarjeta = crearElemento("section", "tarjeta");

  const cabecera = crearElemento("div", "cabecera-tabla");
  const subtitulo = crearElemento("h3", "", "Registros guardados");
  subtitulo.style.marginBottom = "0";
  const contador = crearElemento("span", "contador");
  contador.id = "contador";
  cabecera.appendChild(subtitulo);
  cabecera.appendChild(contador);

  const contenedor = crearElemento("div", "tabla-contenedor");
  const tabla = crearElemento("table", "tabla");

  // Encabezados de la tabla
  const thead = document.createElement("thead");
  const filaEncabezado = document.createElement("tr");
  ["#", "Nombre", "Correo", "Edad", "Acción"].forEach((texto) => {
    filaEncabezado.appendChild(crearElemento("th", "", texto));
  });
  thead.appendChild(filaEncabezado);

  // Cuerpo de la tabla (se llena en renderizarTabla)
  const tbody = document.createElement("tbody");
  tbody.id = "cuerpo-tabla";

  tabla.appendChild(thead);
  tabla.appendChild(tbody);
  contenedor.appendChild(tabla);

  tarjeta.appendChild(cabecera);
  tarjeta.appendChild(contenedor);

  return tarjeta;
}

// Vuelve a dibujar las filas de la tabla a partir del array
function renderizarTabla() {
  const tbody = document.getElementById("cuerpo-tabla");
  const contador = document.getElementById("contador");
  if (!tbody) return;

  // Borrar las filas actuales
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  contador.textContent = `${registros.length} registro(s)`;

  // Si no hay datos, mostrar un mensaje
  if (registros.length === 0) {
    const fila = document.createElement("tr");
    const celda = crearElemento("td", "vacio", "No hay registros guardados todavía");
    celda.colSpan = 5;
    fila.appendChild(celda);
    tbody.appendChild(fila);
    return;
  }

  // Crear una fila por cada registro del array
  registros.forEach((registro, indice) => {
    const fila = document.createElement("tr");

    fila.appendChild(crearElemento("td", "", String(indice + 1)));
    fila.appendChild(crearElemento("td", "", registro.nombre));
    fila.appendChild(crearElemento("td", "", registro.correo));
    fila.appendChild(crearElemento("td", "", registro.edad));

    const celdaAccion = document.createElement("td");
    const btnEliminar = crearElemento("button", "btn-eliminar", "🗑 Eliminar");
    btnEliminar.addEventListener("click", () => eliminarRegistro(registro.id));
    celdaAccion.appendChild(btnEliminar);
    fila.appendChild(celdaAccion);

    tbody.appendChild(fila);
  });
}

// Elimina un registro del array por su id y actualiza la grid
function eliminarRegistro(id) {
  const registro = registros.find((r) => r.id === id);
  if (!registro) return;

  if (!confirm(`¿Deseas eliminar el registro de "${registro.nombre}"?`)) return;

  registros = registros.filter((r) => r.id !== id);
  renderizarTabla();
}

// -----------------------------------------------
// Inicio de la aplicación
// -----------------------------------------------
construirEstructura();
mostrarSeccionSaludo(); // Por defecto se muestra la primera sección