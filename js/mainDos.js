/*========================================================
    Array de objetos con mis datos para ser incluidos en 
    el nav de la pagina
==========================================================*/

const alumno = [
    {dni: 94681337, nombre: "Victor", apellido: "Amaya"}
];

/*========================================================
    Variables del DOM
==========================================================*/

let productos = [];

let imprimirDatos = document.querySelector("#datosAlumno");
let contenedorProductos = document.querySelector("#contenedorProductos")
let barraBusqueda = document.querySelector("#barraBusqueda");
let contenedorCarrito = document.querySelector("#contenedorCarrito");
let contenedorVaciarPrecioTotal = document.querySelector("#contenedorVaciarPrecioTotal");
let contadorCarrito = document.querySelector("#contadorCarrito");
let ordenarPorNombre = document.querySelector("#ordenarPorNombre");
let ordenarPorPrecio = document.querySelector("#ordenarPorPrecio");

let carrito = [];

// FUNCIONES:

/*========================================================
    Funcion async para cargar los productos
==========================================================*/

async function cargarProductos() {
    try {
        let response = await fetch('https://dummyjson.com/products/search?q=phone');
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        productos = data.products;

        mostrarProductos(productos);
        console.table(productos);
    } catch (error) {
        console.error(error);
        contenedorProductos.innerHTML = "<p>Error al cargar productos. Revisa la consola.</p>";
    }
}

/*========================================================
    Funcion para imprimir los datos del alumno en la 
    pagina
==========================================================*/

function imprimirDatosAlumno(){
    let data = "";
    alumno.forEach(a => {
        data += `
        <h3>${a.nombre} ${a.apellido}</h3>
        `;
    });

    imprimirDatos.innerHTML = data;
    console.log(data);    
}

/*========================================================
    Funcion para mostrar los productos de la pagina
==========================================================*/

function mostrarProductos(array){
    let cardProducto = "";
    array.forEach(a => {
        cardProducto += `
        <div class="card-producto">
            <img src="${a.images[0]}" alt="${a.title}">
            <h3>${a.title}</h3>
            <p>$${a.price}</p>
            <button onclick="agregarItemCarrito(${a.id})">Agregar al carrito</button>
        </div>
        `;
    });

    contenedorProductos.innerHTML = cardProducto;
}

/*========================================================
    Manejar la busqueda y filtracion de los productos
==========================================================*/

barraBusqueda.addEventListener("keyup", filtrarProd);

function filtrarProd(){
    let busqueda = barraBusqueda.value.trim().toLocaleLowerCase();

    prodFiltrados = productos.filter(f => f.title.toLocaleLowerCase().includes(busqueda));

    mostrarProductos(prodFiltrados);
}

/*========================================================
    Funcion para implementar al carrito
==========================================================*/

function agregarItemCarrito(id){
    let prodSelected = productos.find(f => f.id === id);
    carrito.push(prodSelected);

    console.table(prodSelected);

    guardarLocalStorage();
    visualizarCarrito();
    vaciarPrecioTotal()
    contadorProd();
    
}

/*========================================================
    Funcion para mostrar los productos seleccionados en 
    el carrito
==========================================================*/

function visualizarCarrito(){
    let cardCarrito = "<ul>";    
    carrito.forEach((e, indice) =>{          
        cardCarrito += `        
        <li class="bloque-item">
            <p class="nombre-item">${e.title} - ${e.price}</p>
            <button class="boton-eliminar" onclick="eliminarProducto(${indice})">Eliminar</button>
        </li>
        `;
    });

    cardCarrito += "</ul>"
    contenedorCarrito.innerHTML = cardCarrito;

    vaciarPrecioTotal();
}

/*========================================================
    Funcion para manejar el boton de vaciado del carrito
    y el precio total
==========================================================*/

function vaciarPrecioTotal(){
    //usamos reduce para sumar el precio y presentar el total
    let total = carrito.reduce((acc, prod) => acc + prod.price, 0);

    // inicialiamos en 0 para aparezca cuando hay un producto
    if(carrito.length > 0){
        let cardVaciarPrecioTotal = `
        <div class="vaciar-precioTotal">
            <button class="boton-vaciar" onclick="vaciarCarrito()">Vaciar carrito</button>
            <p class="total-precio">Total: ${total}</p>
        </div>
        `;

        contenedorVaciarPrecioTotal.innerHTML = cardVaciarPrecioTotal;
    } else{
        contenedorVaciarPrecioTotal.innerHTML = "";
    }
}    
    

/*========================================================
    Funcion para eliminar el producto seleccionado
==========================================================*/

function eliminarProducto(indice){
    carrito.splice(indice, 1);

    guardarLocalStorage();
    visualizarCarrito();
    contadorProd();

}

// FUNCIONES PARA MANJERA LOCALSTORAGE

/*========================================================
    Funcion para guardar productos seleccionados en
    localStorage
==========================================================*/

function guardarLocalStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito)); //"carrito", representan los productos agregados
    // Con JSON.stringify se convierte el array en una cadena Json.
}

/*========================================================
    Funcion para cargar desde localStorage
==========================================================*/

function loadLocalStorage(){
    let datos = localStorage.getItem("carrito"); //Aca se trae el producto guardado

    // Si datos es verdadero entonces el carrito se convierte el json en un array de objetos, sino muestra un carrito vacio
    if(datos){
        carrito = JSON.parse(datos);
    } else {
        carrito = [];
    }
}

/*========================================================
    Funcion que sirve como contador de productos agregados
    al carrito
==========================================================*/

function contadorProd(){
    contadorCarrito.innerHTML = `Carrito: <span class="cantidadProductos">${carrito.length}</span> productos`;
}

/*========================================================
    Funciones que manejan el ordenamiento de los 
    productos
==========================================================*/

ordenarPorNombre.addEventListener("click", ordenarNombre);
ordenarPorPrecio.addEventListener("click", ordenarPrecioDesc);

function ordenarPrecioDesc(){
    productos.sort((a, b) => a.price - b.price);
    mostrarProductos(productos);
}

function ordenarNombre(){
    productos.sort((a, b) => a.title.localeCompare(b.title));
    mostrarProductos(productos);
}

/*========================================================
    Funcion para vaciar carrito
==========================================================*/

function vaciarCarrito(){
    carrito = [];
    contenedorCarrito.innerHTML = "";
    
    guardarLocalStorage();
    contadorProd();
    vaciarPrecioTotal();
}

/*========================================================
    Funcion para inicializar la pagina y sus componentes
==========================================================*/

async function init(){
    imprimirDatosAlumno();
    loadLocalStorage();
    await cargarProductos()
    // mostrarProductos(frutas);
    visualizarCarrito();
    contadorProd();
}

/*========================================================
    Inicialización
==========================================================*/

init();


