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
      carrusel.innerHTML = crearCarrusel(data.images);
    })
    .catch(error => {
      console.error("Error al cargar el producto:", error);
    });
});

// === Galería robusta: click en miniatura -> pasa a principal ===
(function () {
  const gallery = document.getElementById("p-images");
  if (!gallery) return;

  // Devuelve el NodeList de imágenes dentro de #p-images
  const getImgs = () => gallery.querySelectorAll("img");

  // Marca miniaturas clickeables cuando existan imágenes
  const hydrate = () => {
    const imgs = getImgs();
    if (imgs.length < 2) return false; // aún no hay suficientes
    imgs.forEach((img, i) => { if (i > 0) img.style.cursor = "pointer"; });
    return true;
  };

  // 1) Intenta hidratar ahora; si aún no hay imágenes, observa el contenedor
  if (!hydrate()) {
    const mo = new MutationObserver(() => {
      if (hydrate()) mo.disconnect();
    });
    mo.observe(gallery, { childList: true, subtree: true });
  }

  // 2) Delegación: un único listener para todos los <img> (presentes o futuros)
  gallery.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;

    const imgs = getImgs();
    if (imgs.length === 0) return;

    const main = imgs[0];
    if (target === main) return; // si clickean la grande, no hacemos nada

    // Intercambia las fuentes
    const tmp = main.src;
    main.src = target.src;
    target.src = tmp;
  });
})();