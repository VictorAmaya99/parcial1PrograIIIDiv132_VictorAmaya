
/*========================================================
    Array de objetos que contienen los productos con id, 
    nombre, precio y una ruta img con la foto.
==========================================================*/

const frutas = [
    {id: 1, nombre: "arandano", precio: 80, rutaImg: "img/arandano.jpg"},
    {id: 2, nombre: "banana", precio: 60, rutaImg: "img/banana.jpg"},
    {id: 3, nombre: "frambruesa", precio: 70, rutaImg: "img/frambruesa.jpg"},
    {id: 4, nombre: "frutilla", precio: 75, rutaImg: "img/frutillas.jpg"},
    {id: 5, nombre: "kiwi", precio: 90, rutaImg: "img/kiwi.jpg"},
    {id: 6, nombre: "mandarina", precio: 120, rutaImg: "img/mandarina.jpg"},
    {id: 7, nombre: "manzana", precio: 110, rutaImg: "img/manzana.jpg"},
    {id: 8, nombre: "naranja", precio: 95, rutaImg: "img/naranja.jpg"},
    {id: 9, nombre: "pera", precio: 100, rutaImg: "img/pera.jpg"},
    {id: 10, nombre: "anana", precio: 85, rutaImg: "img/anana.jpg"},
    {id: 11, nombre: "pomelo-amarillo", precio: 130, rutaImg: "img/pomelo-amarillo.jpg"},
    {id: 12, nombre: "pomelo-rojo", precio: 140, rutaImg: "img/pomelo-rojo.jpg"}   
];

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
    Funcion para imprimir los datos del alumno en la 
    pagina
==========================================================*/

function imprimirDatosAlumno(){
    data = "";
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
            <img src="${a.rutaImg}" alt="${a.nombre}">
            <h3>${a.nombre}</h3>
            <p>$${a.precio}</p>
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
    let busqueda = barraBusqueda.value.toLocaleLowerCase();

    prodFiltrados = frutas.filter(f => f.nombre.toLocaleLowerCase().includes(busqueda));

    mostrarProductos(prodFiltrados);
}

/*========================================================
    Funcion para implementar al carrito
==========================================================*/

function agregarItemCarrito(id){
    let prodSelected = frutas.find(f => f.id === id);
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
            <p class="nombre-item">${e.nombre} - ${e.precio}</p>
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
    let total = carrito.reduce((acc, prod) => acc + prod.precio, 0);

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
    frutas.sort((a, b) => a.precio - b.precio);
    mostrarProductos(frutas);
}

function ordenarNombre(){
    frutas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    mostrarProductos(frutas);
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

function init(){
    imprimirDatosAlumno();
    loadLocalStorage();
    mostrarProductos(frutas);
    visualizarCarrito();
}

/*========================================================
    Inicialización
==========================================================*/

init();


