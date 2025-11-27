document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  const esLogin = window.location.pathname.includes("login.html");
  const token = localStorage.getItem("token");
  const storedUsername = localStorage.getItem("username");

  // Si NO hay usuario y NO estamos en login, redirigimos
  if (!token && !esLogin) {
    localStorage.setItem("loginMessage", "Por favor inicie sesión");
    window.location.href = "login.html";
    return;
  }

  // Cargar navbar solo si NO estamos en login
  if (!esLogin && navbarContainer) {
    fetch("navbar.html")
      .then(res => res.text())
      .then(html => {
        navbarContainer.innerHTML = html;

        // --- Elementos del navbar ---
        const profileDropdownToggle = document.getElementById("profileDropdown");
        const cartBadge = document.getElementById("nav-cart-badge");
        const modoToggle = document.getElementById("modo-toggle");

        // --- Mostrar nombre de usuario ---
        if (storedUsername && profileDropdownToggle) {
          profileDropdownToggle.textContent = storedUsername;
        }

        // --- EVENT DELEGATION para cerrar sesión ---
        document.addEventListener("click", (e) => {
          if (e.target.classList.contains("Exit")) {
            console.log("Cerrar sesión clickeado");
            localStorage.removeItem("username");
            localStorage.removeItem("userProfile");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("cart");
            localStorage.removeItem("modo");
            localStorage.removeItem("token");

            document.body.classList.remove("modo-oscuro");
            document.body.classList.remove("dark-mode");
            
            window.location.href = "login.html";
          }
        });

        // --- Badge del carrito ---
        function getCartCount() {
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          return cart.reduce((sum, it) => sum + (parseInt(it.cantidad) || 0), 0);
        }

        function updateCartBadge() {
          if (!cartBadge) return;
          const total = getCartCount();
          if (total > 0) {
            cartBadge.textContent = total;
            cartBadge.style.display = "inline-block";
          } else {
            cartBadge.textContent = "";
            cartBadge.style.display = "none";
          }
        }

        updateCartBadge();
        document.addEventListener("cartUpdated", updateCartBadge);
        window.addEventListener("storage", (e) => {
          if (e.key === "cart") updateCartBadge();
        });

        // --- Modo oscuro ---
        const savedModo = localStorage.getItem("modo") || "claro";
        const navbar = document.querySelector(".navbar");

        if (savedModo === "oscuro") {
          document.body.classList.add("modo-oscuro");
          if (navbar) {
            navbar.classList.remove("navbar-light", "bg-light");
            navbar.classList.add("navbar-dark", "bg-dark");
          }
          if (modoToggle) modoToggle.checked = true;
        }

        if (modoToggle) {
          modoToggle.addEventListener("change", () => {
            const oscuro = modoToggle.checked;
            document.body.classList.toggle("modo-oscuro", oscuro);
            localStorage.setItem("modo", oscuro ? "oscuro" : "claro");
            if (navbar) {
              navbar.classList.toggle("navbar-dark", oscuro);
              navbar.classList.toggle("bg-dark", oscuro);
              navbar.classList.toggle("navbar-light", !oscuro);
              navbar.classList.toggle("bg-light", !oscuro);
            }
          });
        }

        document.dispatchEvent(new Event("navbarLoaded"));
      })
      .catch(err => console.error("Error cargando navbar:", err));
  }
});