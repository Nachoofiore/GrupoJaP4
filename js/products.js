document.addEventListener("DOMContentLoaded", function() {
  const productContainer = document.getElementById("product-container");
  const spinnerWrapper = document.getElementById("spinner-wrapper");
  const url = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

  // --- CÓDIGO NUEVO PARA LA BARRA DE NAVEGACIÓN ---
  const profileDropdownToggle = document.getElementById("profileDropdown");
  const storedUsername = localStorage.getItem("username");

  if (storedUsername) {
    profileDropdownToggle.textContent = storedUsername;
  }
  // --- FIN CÓDIGO NUEVO ---

  // Muestra el spinner al inicio de la carga
  spinnerWrapper.style.display = 'flex';

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const products = data.products;
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
      console.error('Error al cargar los productos:', error);
      productContainer.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.</p>`;
    })
    .finally(() => {
      // Oculta el spinner una vez que la carga finaliza
      spinnerWrapper.style.display = 'none';
    });
});