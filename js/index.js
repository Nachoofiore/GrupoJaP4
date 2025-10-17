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
const boton = document.getElementById("modo-toggle");

boton.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");

  if (document.body.classList.contains("oscuro")) {
    boton.textContent = "☀️ Modo Claro";
  } else {
    boton.textContent = "🌙 Modo Oscuro";
  }
});
