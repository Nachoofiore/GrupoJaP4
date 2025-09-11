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

  // Cerrar sesión
  document.querySelector(".Exit").addEventListener("click", function(event) {
    localStorage.removeItem("username"); // Borrar usuario
    window.location.href = "login.html"; // Redirigir
  });

  // Mostrar nombre en el dropdown si está guardado
  if (storedUsername) {
    profileDropdownToggle.textContent = storedUsername;
  }

  // Solicitud de productos
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      const products = data.products;
      productContainer.innerHTML = ""; // limpiar antes de mostrar
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
          </div>
        `;
        productContainer.innerHTML += productHtml;
      });
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
      productContainer.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.</p>`;
    });
});
