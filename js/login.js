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