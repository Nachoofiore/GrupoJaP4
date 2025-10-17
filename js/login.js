document.addEventListener("DOMContentLoaded", function() {
  const btnIngresar = document.getElementById("btnIngresar");
  const usuarioInput = document.getElementById("usuario");
  const contrasenaInput = document.getElementById("contrasena");
  const errorMsg = document.getElementById("error-msg");

  btnIngresar.addEventListener("click", function(event) {
    event.preventDefault();

    const usuario = usuarioInput.value.trim();
    const contrasena = contrasenaInput.value.trim();

    if (usuario === "" || contrasena === "") {
      alert("Por favor, ingrese su usuario y contraseña.");
      return;
    }

     // Verificar longitud de la contraseña
    if (contrasena.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
     // Guardar en localStorage con la misma clave que usa index.js
    localStorage.setItem("username", usuario);

    // Redirigir al index
    window.location.href = "index.html";
  });

  function mostrarError(mensaje) {
    if (errorMsg) {
      errorMsg.textContent = mensaje;
      errorMsg.style.display = "block";
    } else {
      alert(mensaje);
    }
  }

  // Ocultar mensaje de error al empezar a escribir
  if (usuarioInput && contrasenaInput && errorMsg) {
    usuarioInput.addEventListener("input", ocultarError);
    contrasenaInput.addEventListener("input", ocultarError);
  }

  function ocultarError() {
    if (errorMsg) {
      errorMsg.style.display = "none";
    }
  }
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
