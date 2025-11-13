document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  // Conversión
  const USD_TO_UYU = 40;
  const UYU_TO_USD = 1 / USD_TO_UYU;

  // --- función: calcular costos (muestra subtotal, envío y total) ---
  function calcularCostos(totalUYU) {
    const envioSeleccionado = document.querySelector("input[name='tipoEnvio']:checked");
    let costoEnvio = 0;
    if (envioSeleccionado) {
      const porcentaje = parseFloat(envioSeleccionado.value);
      costoEnvio = totalUYU * porcentaje;
    }
    const totalFinal = totalUYU + costoEnvio;

    document.getElementById("costo-subtotal").textContent = `$${totalUYU.toFixed(0)} UYU`;
    document.getElementById("costo-envio").textContent = `$${costoEnvio.toFixed(0)} UYU`;
    document.getElementById("costo-total-final").textContent = `$${totalFinal.toFixed(0)} UYU`;
  }

  // --- Mostrar productos del carrito ---
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="text-center text-muted mt-4">Tu carrito está vacío 🛒</p>`;
      totalElement.textContent = "$0";
      calcularCostos(0);
      return;
    }

    let html = "";
    let totalUYU = 0;
    let totalUSD = 0;

    cart.forEach((item, index) => {
      const subtotal = item.cost * item.cantidad;
      let subtotalUSD = 0;
      let subtotalUYU = 0;

      if (item.currency === "USD") {
        subtotalUSD = subtotal;
        subtotalUYU = subtotal * USD_TO_UYU;
      } else {
        subtotalUYU = subtotal;
        subtotalUSD = subtotal * UYU_TO_USD;
      }

      totalUSD += subtotalUSD;
      totalUYU += subtotalUYU;

      html += `
        <div class="cart-item d-flex align-items-center justify-content-between border-bottom py-3">
          <div class="d-flex align-items-center">
            <img src="${item.image}" alt="${item.name}" width="120" class="rounded me-3">
            <div>
              <h5 class="mb-1">${item.name}</h5>
              <p class="mb-1 text-muted precio">${item.currency} ${item.cost}</p>
              <p class="subtotal mb-0"><strong>Subtotal:</strong> U$S ${subtotalUSD.toFixed(2)} | $${subtotalUYU.toFixed(0)} UYU</p>
            </div>
          </div>

          <div class="d-flex align-items-center gap-3">
            <input type="number" min="1" value="${item.cantidad}"
              class="form-control form-control-sm cantidad-input" data-index="${index}" style="width:70px;">
            <button class="btn btn-outline-danger btn-sm eliminar-btn" data-index="${index}">🗑️</button>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;
    totalElement.innerHTML = `<strong>Total:</strong> U$S ${totalUSD.toFixed(2)} | $${totalUYU.toFixed(0)} UYU`;

    // actualizar costos (subtotal / envio / total)
    calcularCostos(totalUYU);

    // listeners para inputs de cantidad
    document.querySelectorAll(".cantidad-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const index = e.target.dataset.index;
        const newQty = parseInt(e.target.value, 10);
        if (isNaN(newQty) || newQty < 1) return;
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart[index].cantidad = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        document.dispatchEvent(new Event("cartUpdated"));
      });
    });

    // listeners para botones eliminar
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

  // --- listener para cambio de tipo de envío (actualiza costos) ---
  function attachEnvioListeners() {
    document.querySelectorAll("input[name='tipoEnvio']").forEach(radio => {
      radio.addEventListener("change", () => {
        // recalcular subtotal en UYU desde el cart
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalUYU = 0;
        cart.forEach(item => {
          const subtotal = item.cost * item.cantidad;
          if (item.currency === "USD") totalUYU += subtotal * USD_TO_UYU;
          else totalUYU += subtotal;
        });
        calcularCostos(totalUYU);
      });
    });
  }

  // --- mostrar/ocultar campos de forma de pago (opcional visual) ---
  function attachPagoListeners() {
    const tarjetaDiv = document.getElementById("datos-tarjeta");
    const transfDiv = document.getElementById("datos-transferencia");
    document.querySelectorAll("input[name='tipoPago']").forEach(radio => {
      radio.addEventListener("change", () => {
        if (radio.value === "tarjeta") {
          tarjetaDiv.style.display = "block";
          transfDiv.style.display = "none";
        } else if (radio.value === "transferencia") {
          tarjetaDiv.style.display = "none";
          transfDiv.style.display = "block";
        }
      });
    });
  }

  // --- Botón “Seguir comprando” ---
  document.querySelector(".seguir").addEventListener("click", () => {
    window.location.href = "products.html";
  });

  // --- Botón “Finalizar compra” con validaciones ---
  document.querySelector(".finalizar").addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // cantidades válidas
    for (let item of cart) {
      if (!item.cantidad || item.cantidad < 1) {
        alert("Todas las cantidades deben ser mayores a 0.");
        return;
      }
    }

    // dirección completa
    const camposDireccion = ["departamento", "localidad", "calle", "numdepuerta", "esquina"];
    for (let c of camposDireccion) {
      const el = document.getElementById(c);
      if (!el || el.value.trim() === "") {
        alert("Completa todos los campos de la dirección.");
        return;
      }
    }

    // envío seleccionado
    const envio = document.querySelector("input[name='tipoEnvio']:checked");
    if (!envio) {
      alert("Selecciona un tipo de envío.");
      return;
    }

    // pago seleccionado
    const pago = document.querySelector("input[name='tipoPago']:checked");
    if (!pago) {
      alert("Selecciona una forma de pago.");
      return;
    }

    // validar campos de la forma de pago seleccionada (ejemplo)
    if (pago.value === "tarjeta") {
      const n = document.getElementById("tarjeta-num").value.trim();
      const t = document.getElementById("tarjeta-tit").value.trim();
      if (!n || !t) {
        alert("Completa los datos de la tarjeta.");
        return;
      }
    } else if (pago.value === "transferencia") {
      const cbu = document.getElementById("ctacte").value.trim();
      if (!cbu) {
        alert("Completa los datos de la transferencia.");
        return;
      }
    }

  
    alert("¡Compra realizada con éxito! 🎉");
    localStorage.removeItem("cart");
    renderCart();
    document.dispatchEvent(new Event("cartUpdated"));
  });

  // actualizar cuando otras páginas emiten cartUpdated
  document.addEventListener("cartUpdated", renderCart);

  // inicializar
  renderCart();
  attachEnvioListeners();
  attachPagoListeners();
});
