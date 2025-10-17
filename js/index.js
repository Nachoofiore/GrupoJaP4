document.addEventListener("DOMContentLoaded", function(){

  const profileDropdownToggle = document.getElementById("profileDropdown");
  const storedUsername = localStorage.getItem("username");
    //Cerrar sesion
  document.querySelector(".Exit").addEventListener("click", function(event) {
    // Borrar solo el username del localStorage
    localStorage.removeItem("username");

    // Redirigir a login.html
    window.location.href = "login.html";
});

   if (storedUsername) {
    profileDropdownToggle.textContent = storedUsername;
  }

    // Verificar si el usuario ha iniciado sesión
  if (!storedUsername) {
    // Redirigir al login con mensaje
    localStorage.setItem("loginMessage", "Por favor inicie sesión");
    window.location.href = "login.html";
    return; // Detener la ejecución del resto del código
  }
  

    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("modo-toggle");

  // Ver si el usuario tenía guardado el modo
  const modoActual = localStorage.getItem("modo") || "claro";
  if (modoActual === "oscuro") {
    activarModoOscuro();
    toggle.checked = true;
  }

  // Escuchar el cambio del switch
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      activarModoOscuro();
      localStorage.setItem("modo", "oscuro");
    } else {
      desactivarModoOscuro();
      localStorage.setItem("modo", "claro");
    }
  });
});

// Funciones para aplicar estilos
function activarModoOscuro() {
  document.body.classList.add("modo-oscuro");

  // Cambiar Bootstrap navbar
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.remove("navbar-light", "bg-light");
    navbar.classList.add("navbar-dark", "bg-dark");
  }

  // Cambiar color de cards
  document.querySelectorAll(".card").forEach(card => {
    card.classList.add("bg-dark", "text-white");
  });

  // Cambiar color de botones
  document.querySelectorAll(".btn").forEach(btn => {
    btn.classList.add("btn-outline-light");
    btn.classList.remove("btn-outline-dark");
  });
}

function desactivarModoOscuro() {
  document.body.classList.remove("modo-oscuro");

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.remove("navbar-dark", "bg-dark");
    navbar.classList.add("navbar-light", "bg-light");
  }

  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("bg-dark", "text-white");
  });

  document.querySelectorAll(".btn").forEach(btn => {
    btn.classList.remove("btn-outline-light");
    btn.classList.add("btn-outline-dark");
  });
}
