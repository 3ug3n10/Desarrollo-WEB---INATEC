
const app = document.getElementById("app");
// ===============================================
    //  Datos de los productos
    // ===============================================
    const productos = [
      { nombre: "Café Molido Clásico", desc: "Tueste medio, notas de chocolate y caramelo. 454 g.", precio: 280, cat: "molido", icono: "coffee", color: "#8D6E63" },
      { nombre: "Grano Entero Jinotega", desc: "Café de altura, ideal para moler en casa. 454 g.", precio: 320, cat: "grano", icono: "grain", color: "#6D4C41" },
      { nombre: "Espresso Intenso", desc: "Tueste oscuro, cuerpo fuerte y crema densa. 340 g.", precio: 300, cat: "molido", icono: "local_cafe", color: "#4E342E" },
      { nombre: "Cápsulas Matagalpa", desc: "10 cápsulas compatibles, sabor suave y afrutado.", precio: 250, cat: "capsulas", icono: "coffee_maker", color: "#A1887F" },
      { nombre: "Grano Orgánico", desc: "Certificado orgánico, cultivado bajo sombra. 454 g.", precio: 350, cat: "grano", icono: "eco", color: "#5D7B4F" },
      { nombre: "Kit Degustación", desc: "3 bolsas de 150 g de diferentes regiones.", precio: 420, cat: "grano", icono: "redeem", color: "#BF8A5A" }
    ];

    let carrito = 0;
    const badge = document.getElementById("badge");

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
          cambiarCarrito(1);
          mostrarSnackbar(`"${producto.nombre}" agregado al carrito`, "Deshacer", () => cambiarCarrito(-1));
        });

        grid.appendChild(card);
      });
    }

    function cambiarCarrito(cantidad) {
      carrito = Math.max(0, carrito + cantidad);
      badge.textContent = carrito;
      badge.hidden = carrito === 0;
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
    //  Snackbar
    // ===============================================
    const snackbar = document.getElementById("snackbar");
    const snackTexto = document.getElementById("snackTexto");
    const snackAccion = document.getElementById("snackAccion");
    let temporizador;

    function mostrarSnackbar(texto, textoAccion = "Cerrar", accion = null) {
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

    // ===============================================
    //  Mostrar / ocultar los nombres de los componentes
    // ===============================================
    document.getElementById("toggleAnot").addEventListener("click", () => {
      document.body.classList.toggle("anotar");
    });

    // Inicio
    mostrarProductos("todos");