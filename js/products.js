document.addEventListener("DOMContentLoaded", function() {
  const productContainer = document.getElementById("product-container");

  // Recuperar el catID desde localStorage
  const storedCatID = localStorage.getItem("catID");
  // Si no existe, usar 101 como valor por defecto
  const catID = storedCatID ? storedCatID : 101;

  // Construir la URL dinámicamente
  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  const profileDropdownToggle = document.getElementById("profileDropdown");
  const storedUsername = localStorage.getItem("username");

  // Arrays para productos
  let currentProducts = [];
  let filteredProducts = [];

  // Cerrar sesión
  document.querySelector(".Exit").addEventListener("click", function(event) {
    localStorage.removeItem("username"); // Borrar usuario
    window.location.href = "login.html"; // Redirigir
  });

  // Mostrar nombre en el dropdown si está guardado
  if (storedUsername) {
    profileDropdownToggle.textContent = storedUsername;
  }

  // Función para renderizar productos
  function showProducts(products) {
    productContainer.innerHTML = "";

    if (products.length === 0) {
      productContainer.innerHTML = `<p class="text-center">No hay productos que coincidan con el filtro.</p>`;
      return;
    }

    products.forEach(product => {
      const productHtml = `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text"><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <small class="text-muted">Vendidos: ${product.soldCount}</small>
            </div>
          </div>
        </div>`;
      productContainer.innerHTML += productHtml;
    });
  }

  // Filtrar por rango de precio
  function filterProducts() {
    const min = parseInt(document.getElementById("minPrice").value) || 0;
    const max = parseInt(document.getElementById("maxPrice").value) || Infinity;

    filteredProducts = currentProducts.filter(p => p.cost >= min && p.cost <= max);
    showProducts(filteredProducts);
  }

  // Ordenar productos
  function sortProducts(criteria) {
    if (criteria === "asc") {
      filteredProducts.sort((a, b) => a.cost - b.cost);
    } else if (criteria === "desc") {
      filteredProducts.sort((a, b) => b.cost - a.cost);
    } else if (criteria === "rel") {
      filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
    }
    showProducts(filteredProducts);
  }

  // Eventos de filtros y ordenamiento
  document.getElementById("filterBtn").addEventListener("click", filterProducts);

  document.getElementById("clearFilterBtn").addEventListener("click", () => {
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    filteredProducts = [...currentProducts];
    showProducts(filteredProducts);
  });

  document.getElementById("sortAsc").addEventListener("click", () => sortProducts("asc"));
  document.getElementById("sortDesc").addEventListener("click", () => sortProducts("desc"));
  document.getElementById("sortRel").addEventListener("click", () => sortProducts("rel"));

  // Cargar productos desde la API
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      currentProducts = data.products;
      filteredProducts = [...currentProducts]; // al inicio no hay filtro
      showProducts(filteredProducts);
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
      productContainer.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.</p>`;
    });
});
