document.addEventListener("DOMContentLoaded", function(){

  const profileDropdownToggle = document.getElementById("profileDropdown");
  const storedUsername = localStorage.getItem("username");

  // Verificar si el usuario ha iniciado sesión
  if (!storedUsername) {
    // Redirigir al login con mensaje
    localStorage.setItem("loginMessage", "Por favor inicie sesión");
    window.location.href = "login.html";
    return; // Detener la ejecución del resto del código
  }

  if (storedUsername) {
    profileDropdownToggle.textContent = storedUsername;
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