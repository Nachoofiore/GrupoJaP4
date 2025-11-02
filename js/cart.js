document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  // --- Conversión de moneda ---
const USD_TO_UYU = 40; // ajustá según la tasa actual
const UYU_TO_USD = 1 / USD_TO_UYU;

  // --- Mostrar productos del carrito ---
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="text-center text-muted mt-4">Tu carrito está vacío 🛒</p>`;
      totalElement.textContent = "$0";
      return;
    }

    let html = "";
    
      html += `
        <div class="cart-item d-flex align-items-center justify-content-between border-bottom py-3">
          <div class="d-flex align-items-center">
            <img src="${item.image}" alt="${item.name}" width="70" class="rounded me-3">
            <div>
              <h5 class="mb-1">${item.name}</h5>
              <p class="mb-0 text-muted">${item.currency} ${item.cost}</p>
            </div>
          </div>

          <div class="d-flex align-items-center gap-3">
            <input type="number" min="1" value="${item.cantidad}" 
              class="form-control form-control-sm cantidad-input" data-index="${index}" style="width:70px;">
            <span class="subtotal fw-bold">${item.currency} ${subtotal}</span>
            <button class="btn btn-outline-danger btn-sm eliminar-btn" data-index="${index}">🗑️</button>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;
    totalElement.textContent = `${cart[0]?.currency || "$"} ${total}`;

    // --- Escuchar cambios de cantidad ---
    document.querySelectorAll(".cantidad-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const index = e.target.dataset.index;
        const newQty = parseInt(e.target.value);
        if (newQty < 1) return;
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart[index].cantidad = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        document.dispatchEvent(new Event("cartUpdated"));
      });
    });

    // --- Eliminar producto ---
    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        document.dispatchEvent(new Event("cartUpdated"));
      });
    });
  }

  renderCart();

  // --- Botón “Seguir comprando” ---
  document.querySelector(".seguir").addEventListener("click", () => {
    window.location.href = "products.html";
  });

  // --- Botón “Finalizar compra” ---
  document.querySelector(".finalizar").addEventListener("click", () => {
    alert("¡Gracias por tu compra! 🛍️");
    localStorage.removeItem("cart");
    renderCart();
    document.dispatchEvent(new Event("cartUpdated"));
  });

  // --- Actualizar al recibir cambios desde otras páginas ---
  document.addEventListener("cartUpdated", renderCart);
});
