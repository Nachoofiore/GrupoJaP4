document.getElementById("btnIngresar").addEventListener("click", function () {
    let usuario = document.getElementById("usuario").value.trim();
    let contrasena = document.getElementById("contrasena").value.trim();

    if (usuario === "" || contrasena === "") {
        alert("Por favor complete todos los campos.");
    } else {
        localStorage.setItem("usuario", usuario);
        window.location.href = "index.html";
    }
});
