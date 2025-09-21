document.addEventListener("DOMContentLoaded", () => {

      const id = localStorage.getItem("productID");
      if (!id) {
        // Entraron directo sin seleccionar un producto
        location.replace("products.html");
        return;
      }
  const url = `https://japceibal.github.io/emercado-api/products/${id}.json`;

  // Elementos del DOM
  const pName = document.getElementById("p-name");
  const pDescription = document.getElementById("p-description");
  const pCategory = document.getElementById("p-category");
  const pSold = document.getElementById("p-sold");
  const carrusel = document.getElementById("carrusel");
  const pPrice = document.getElementById("p-price");

  // Función para crear carrusel con Bootstrap
  function crearCarrusel(imagenes) {
    if (!imagenes || imagenes.length === 0) return "";

    let indicadores = "";
    let items = "";

    imagenes.forEach((img, index) => {
      indicadores += `
        <button type="button" data-bs-target="#carouselProduct" data-bs-slide-to="${index}" 
          class="${index === 0 ? "active" : ""}" aria-current="${index === 0 ? "true" : "false"}"></button>
      `;

      items += `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img src="${img}" class="d-block w-100 rounded" alt="Imagen del producto ${index + 1}">
        </div>
      `;
    });

    return `
      <div id="carouselProduct" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">${indicadores}</div>
        <div class="carousel-inner">${items}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselProduct" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselProduct" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>
    `;
  }

  // Cargar datos con fetch
  fetch(url)
    .then(response => response.json())
    .then(data => {
      pName.textContent = data.name;
      pDescription.textContent = data.description;
      pCategory.textContent = data.category;
      pSold.textContent = data.soldCount;
      pPrice.textContent = `${data.currency} ${data.cost}`;
      carrusel.innerHTML = crearCarrusel(data.images);
    })
    .catch(error => {
      console.error("Error al cargar el producto:", error);
    });
});

