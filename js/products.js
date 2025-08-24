// URL de la API para obtener productos de la categoría 101 (Autos)
const API_URL = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

// Elementos del DOM que vamos a manipular
const contenedorProductos = document.getElementById('contenedorProductos');
const categoriaNombre = document.getElementById('categoriaNombre');

// Función para formatear precios en formato USD
function formatearPrecio(precio) {
  return `USD$ ${precio.toLocaleString('en-US')}`;
}

// Función para mostrar los productos en la página
function mostrarProductos(productos, categoria) {
  // Actualizar el nombre de la categoría
  if (categoria) {
    categoriaNombre.textContent = categoria;
  }
  
  // Limpiar el contenedor
  contenedorProductos.innerHTML = '';
  
  // Verificar si hay productos
  if (productos.length === 0) {
    contenedorProductos.innerHTML = '<div class="error">No se encontraron productos en esta categoría.</div>';
    return;
  }
  
  // Crear y agregar cada producto al contenedor
  productos.forEach(producto => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    
    tarjeta.innerHTML = `
      <img src="${producto.image}" alt="${producto.name}">
      <div class="tarjeta-contenido">
        <h2>${producto.name}</h2>
        <p class="descr">${producto.description}</p>
        <p class="precio">${formatearPrecio(producto.cost)}</p>
        <p class="vendidos">Cantidad de vendidos: ${producto.soldCount}</p>
      </div>
    `;
    
    contenedorProductos.appendChild(tarjeta);
  });
}

// Función para mostrar un mensaje de error
function mostrarError(mensaje) {
  contenedorProductos.innerHTML = `<div class="error">${mensaje}</div>`;
}

// Función principal que obtiene los productos de la API
async function obtenerProductos() {
  try {
    // Mostrar indicador de carga
    contenedorProductos.innerHTML = '<div class="cargando">Cargando productos...</div>';
    
    // Realizar la petición a la API
    const respuesta = await fetch(API_URL);
    
    // Verificar si la respuesta es correcta
    if (!respuesta.ok) {
      throw new Error(`Error al obtener los productos: ${respuesta.status}`);
    }
    
    // Convertir la respuesta a JSON
    const datos = await respuesta.json();
    
    // Mostrar los productos en la página
    mostrarProductos(datos.products, datos.catName);
  } catch (error) {
    // Mostrar mensaje de error
    console.error('Error:', error);
    mostrarError('No se pudieron cargar los productos. Por favor, intenta nuevamente más tarde.');
  }
}

// Ejecutar la función para obtener productos cuando se cargue la página
document.addEventListener('DOMContentLoaded', obtenerProductos);