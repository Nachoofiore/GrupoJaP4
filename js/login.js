document.addEventListener("DOMContentLoaded", () => {
  const btnIngresar = document.getElementById("btnIngresar");

  btnIngresar.addEventListener("click", () => {
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (usuario === "" || contrasena === "") {
      alert("Por favor complete todos los campos");
      return;
    }

    // Guardar usuario en localStorage
    localStorage.setItem("usuario", usuario);

    // Redirigir al index
    window.location.href = "index.html";
  });
});