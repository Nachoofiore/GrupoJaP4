document.getElementById("btnIngresar").addEventListener("click", function () {
    let usuario = document.getElementById("usuario").value.trim();
    let contrasena = document.getElementById("contrasena").value.trim();

    if (usuario === "" || contrasena === "") {
        alert("Por favor complete todos los campos.");
    } else {
        localStorage.setItem("usuario", usuario);
        window.location.href = "index.html";
    }

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

    // Redirigir a otra página
    window.location.href = "index.html";
  });

});
