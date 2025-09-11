document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.getElementById("product-container");
  const searchInput = document.getElementById("searchInput");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const filterBtn = document.getElementById("filterBtn");
  const clearFilterBtn = document.getElementById("clearFilterBtn");

  const profileDropdownToggle = document.getElementById("profileDropdown");
  const storedUsername = localStorage.getItem("username");

  // Variables globales
  let currentProducts = [];
  let filteredProducts = [];

  // Recuperar catID desde localStorage (o usar 101 por defecto)
  const storedCatID = localStorage.getItem("catID");
  const catID = storedCatID ? storedCatID : 101;
  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  // Cerrar sesión
  document.querySelector(".Exit").addEventListener("click", () => {
    localStorage.removeItem("username");
    window.location.href = "login.html";
  });

  // Mostrar usuario en el dropdown
  if (storedUsername) profileDropdownToggle.textContent = storedUsername;

  // Función para mostrar productos
  function showProducts(products) {
    productContainer.innerHTML = "";

    if (products.length === 0) {
      productContainer.innerHTML = `<p class="text-center text-muted">No hay productos que coincidan con el filtro.</p>`;
      return;
    }

    products.forEach((p) => {
      const productHtml = `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text">${p.description}</p>
              <p class="card-text"><strong>Precio:</strong> ${p.currency} ${p.cost}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <small class="text-muted">Vendidos: ${p.soldCount}</small>
            </div>
          </div>
        </div>`;
      productContainer.innerHTML += productHtml;
    });
  }

  // Función para filtrar por precio
  function filterByPrice() {
    const min = parseInt(minPriceInput.value) || 0;
    const max = parseInt(maxPriceInput.value) || Infinity;

    filteredProducts = currentProducts.filter((p) => p.cost >= min && p.cost <= max);
    applySearch(); // aplicar búsqueda después de filtrar
  }

  // Función para ordenar
  function sortProducts(criteria) {
    if (criteria === "asc") filteredProducts.sort((a, b) => a.cost - b.cost);
    else if (criteria === "desc") filteredProducts.sort((a, b) => b.cost - a.cost);
    else if (criteria === "rel") filteredProducts.sort((a, b) => b.soldCount - a.soldCount);

    applySearch(); // mantener búsqueda activa después de ordenar
  }

  // Función para búsqueda en tiempo real
  function applySearch() {
    const query = searchInput.value.toLowerCase();
    const result = filteredProducts.filter(
      (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
    showProducts(result);
  }

  // Eventos
  filterBtn.addEventListener("click", filterByPrice);

  clearFilterBtn.addEventListener("click", () => {
    minPriceInput.value = "";
    maxPriceInput.value = "";
    searchInput.value = "";
    filteredProducts = [...currentProducts];
    showProducts(filteredProducts);
  });

  document.getElementById("sortAsc").addEventListener("click", () => sortProducts("asc"));
  document.getElementById("sortDesc").addEventListener("click", () => sortProducts("desc"));
  document.getElementById("sortRel").addEventListener("click", () => sortProducts("rel"));

  searchInput.addEventListener("input", applySearch);

  // Cargar productos desde la API
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      currentProducts = data.products;
      filteredProducts = [...currentProducts];
      showProducts(filteredProducts);
    })
    .catch((err) => {
      console.error("Error al cargar productos:", err);
      productContainer.innerHTML =
        `<p class="text-danger text-center">No se pudieron cargar los productos. Intente más tarde.</p>`;
    });
});
