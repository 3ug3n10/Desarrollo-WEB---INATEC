// ===============================================
//  Actividad II - Construcción dinámica de HTML
// ===============================================

const app = document.getElementById("app");

// Referencia al contenedor central (se asigna al construir la estructura)
let contenido;

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
  const titulo = crearElemento("h1", "", "Actividad II");
  titulo.style.fontSize = "20px";
  topbar.appendChild(btnToggle);
  topbar.appendChild(titulo);

  // Menú lateral con dos secciones
  const sidebar = crearElemento("nav", "sidebar");
  const lista = document.createElement("ul");

  const opcion1 = crearElemento("li", "activo", "🏠 Inicio");
  const opcion2 = crearElemento("li", "", "📝 Formulario");

  lista.appendChild(opcion1);
  lista.appendChild(opcion2);
  sidebar.appendChild(lista);

  // Contenedor central
  contenido = crearElemento("main", "contenido");

  // Agregar todo al documento
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

  // Sección 2: Formulario
  opcion2.addEventListener("click", () => {
    marcarActivo(opcion2, opcion1);
    mostrarSeccionFormulario();
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

  // Cada click crea un nuevo mensaje de bienvenida
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

    // Al cerrar, el mensaje se elimina del DOM
    btnCerrar.addEventListener("click", () => {
      mensaje.remove();
    });

    mensaje.appendChild(texto);
    mensaje.appendChild(btnCerrar);
    listaMensajes.appendChild(mensaje);
  });
}

// -----------------------------------------------
// 3. Segunda sección: formulario con tres campos
// -----------------------------------------------
function mostrarSeccionFormulario() {
  limpiarContenido();

  const titulo = crearElemento("h2", "", "Formulario de registro");
  const formulario = crearElemento("form", "formulario");

  // Definición de los tres campos
  const campos = [
    { id: "nombre", etiqueta: "Nombre", tipo: "text", placeholder: "Escribe tu nombre" },
    { id: "correo", etiqueta: "Correo electrónico", tipo: "email", placeholder: "correo@ejemplo.com" },
    { id: "edad", etiqueta: "Edad", tipo: "number", placeholder: "Tu edad" }
  ];

  // Construcción dinámica de cada campo
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

    grupo.appendChild(label);
    grupo.appendChild(input);
    formulario.appendChild(grupo);
  });

  const btnEnviar = crearElemento("button", "btn", "Enviar");
  btnEnviar.type = "submit";
  formulario.appendChild(btnEnviar);

  contenido.appendChild(titulo);
  contenido.appendChild(formulario);

  // Al enviar, se muestra un resumen de los datos
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const anterior = contenido.querySelector(".resultado");
    if (anterior) anterior.remove();

    const nombre = formulario.nombre.value;
    const correo = formulario.correo.value;
    const edad = formulario.edad.value;

    const resultado = crearElemento(
      "p",
      "resultado",
      `✔ Datos recibidos: ${nombre} - ${correo} - ${edad} años`
    );
    contenido.appendChild(resultado);
    formulario.reset();
  });
}

// -----------------------------------------------
// Inicio de la aplicación
// -----------------------------------------------
construirEstructura();
mostrarSeccionSaludo(); // Por defecto se muestra la primera sección