// Simulación de datos guardados en localStorage
// (En tu sitio real, estos llegan desde la página de productos)
if (!localStorage.getItem("cart")) {
  const ejemploCart = [
    {
      nombre: "Pelota de básquetbol",
      precio: 2999,
      img: "https://m.media-amazon.com/images/I/61XjD6J0YBL._AC_SL1500_.jpg",
      cantidad: 1
    }
  ];
  localStorage.setItem("cart", JSON.stringify(ejemploCart));
}

const cartContainer = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const itemHTML = `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.nombre}">
        <div class="item-info">
          <h3>${item.nombre}</h3>
          <p>Precio: $${item.precio}</p>
        </div>
        <div class="item-actions">
          <input type="number" min="1" value="${item.cantidad}" data-index="${index}" class="cantidad-input">
          <p><strong>Subtotal:</strong> $<span class="subtotal">${subtotal}</span></p>
        </div>
      </div>
    `;
    cartContainer.insertAdjacentHTML("beforeend", itemHTML);
  });

  totalEl.textContent = `$${total}`;
  addEvents();
}

function addEvents() {
  const inputs = document.querySelectorAll(".cantidad-input");
  inputs.forEach(input => {
    input.addEventListener("input", e => {
      const index = e.target.dataset.index;
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      let cantidad = parseInt(e.target.value);
      if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
      cart[index].cantidad = cantidad;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

// Botones
document.querySelector(".seguir").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.querySelector(".finalizar").addEventListener("click", () => {
  alert("Compra finalizada con éxito 🛒");
  localStorage.removeItem("cart");
  renderCart();
});

renderCart();
