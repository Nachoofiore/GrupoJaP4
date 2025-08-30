document.addEventListener("DOMContentLoaded", () => {
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

    // Redirigir al index
    window.location.href = "index.html";
  });
});