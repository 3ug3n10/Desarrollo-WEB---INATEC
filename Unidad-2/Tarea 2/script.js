// ===============================================
//  Datos de los productos
// ===============================================
const productos = [
  { id: "molido-clasico", nombre: "Café Molido Clásico", desc: "Tueste medio, notas de chocolate y caramelo. 454 g.", precio: 280, cat: "molido", icono: "coffee", color: "#8D6E63" },
  { id: "grano-jinotega", nombre: "Grano Entero Jinotega", desc: "Café de altura, ideal para moler en casa. 454 g.", precio: 320, cat: "grano", icono: "grain", color: "#6D4C41" },
  { id: "espresso-intenso", nombre: "Espresso Intenso", desc: "Tueste oscuro, cuerpo fuerte y crema densa. 340 g.", precio: 300, cat: "molido", icono: "local_cafe", color: "#4E342E" },
  { id: "capsulas-matagalpa", nombre: "Cápsulas Matagalpa", desc: "10 cápsulas compatibles, sabor suave y afrutado.", precio: 250, cat: "capsulas", icono: "coffee_maker", color: "#A1887F" },
  { id: "grano-organico", nombre: "Grano Orgánico", desc: "Certificado orgánico, cultivado bajo sombra. 454 g.", precio: 350, cat: "grano", icono: "eco", color: "#5D7B4F" },
  { id: "kit-degustacion", nombre: "Kit Degustación", desc: "3 bolsas de 150 g de diferentes regiones.", precio: 420, cat: "grano", icono: "redeem", color: "#BF8A5A" }
];

// ===============================================
//  Tarjetas de productos (se crean dinámicamente)
// ===============================================
function mostrarProductos(categoria) {
  const grid = document.getElementById("gridProductos");
  grid.innerHTML = "";

  const lista = categoria === "todos"
    ? productos
    : productos.filter((p) => p.cat === categoria);

  lista.forEach((producto, i) => {
    const card = document.createElement("article");
    card.className = "card";
    if (i === 0) card.dataset.md = "Card (elevación 1)";

    card.innerHTML = `
      <div class="card-media" style="background:${producto.color}">
        <span class="material-icons">${producto.icono}</span>
      </div>
      <div class="card-body">
        <h3>${producto.nombre}</h3>
        <p>${producto.desc}</p>
      </div>
      <div class="card-acciones">
        <span class="precio">C$ ${producto.precio}</span>
        <button class="btn btn-primary"><span class="material-icons">add_shopping_cart</span>Agregar</button>
      </div>`;

    card.querySelector("button").addEventListener("click", () => {
      agregarAlCarrito(producto);
      mostrarSnackbar(
        `"${producto.nombre}" agregado al carrito`,
        "Deshacer",
        () => cambiarCantidad(producto.id, -1)
      );
    });

    grid.appendChild(card);
  });
}

// ===============================================
//  Chips de filtro
// ===============================================
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("activo"));
    chip.classList.add("activo");
    mostrarProductos(chip.dataset.cat);
  });
});

// ===============================================
//  Planes, formulario y FAB
// ===============================================
document.querySelectorAll("[data-plan]").forEach((boton) => {
  boton.addEventListener("click", () => {
    mostrarSnackbar(`Elegiste el plan "${boton.dataset.plan}"`);
  });
});

document.getElementById("formContacto").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  mostrarSnackbar("Mensaje enviado. Te contactaremos pronto.");
});

document.getElementById("fab").addEventListener("click", () => {
  mostrarSnackbar("Un asesor te atenderá en breve");
});

// Inicio
mostrarProductos("todos");