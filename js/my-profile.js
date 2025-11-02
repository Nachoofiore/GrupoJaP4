document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  const profileImage = document.getElementById("profileImage");
  const uploadPhoto = document.getElementById("uploadPhoto");
  const themeSwitch = document.getElementById("themeSwitch");
  const defaultImage = "img/default-avatar.png"; // cambia ruta si usas otra

  // --- 1️⃣ Precargar email si existe ---
  const savedEmail = localStorage.getItem("userEmail") || "";

  // --- 2️⃣ Cargar perfil guardado ---
  const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  document.getElementById("firstName").value = savedProfile.firstName || "";
  document.getElementById("lastName").value = savedProfile.lastName || "";
  document.getElementById("email").value = savedProfile.email || savedEmail;
  document.getElementById("phone").value = savedProfile.phone || "";

  // Cargar imagen guardada o mostrar la imagen por defecto
  profileImage.src = savedProfile.profileImage || defaultImage;

  // --- 3️⃣ Subir imagen y guardarla localmente ---
  uploadPhoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        profileImage.src = ev.target.result;

        // Guardar imagen junto con el resto del perfil
        const updatedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
        updatedProfile.profileImage = ev.target.result;
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  });

  // --- 4️⃣ Guardar datos del perfil ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const userProfile = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      profileImage: profileImage.src
    };

    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    alert("✅ Datos guardados correctamente");
  });

  // --- 5️⃣ Modo oscuro (persistente) ---
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener("change", () => {
    const dark = themeSwitch.checked;
    document.body.classList.toggle("dark-mode", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  });

  // --- 6️⃣ Función para limpiar campos al cerrar sesión ---
  function clearProfileFields() {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    profileImage.src = defaultImage;

    localStorage.removeItem("userProfile");
  }

  // Escuchar evento de logout desde navbar.js
  document.addEventListener("userLoggedOut", clearProfileFields);

  // Escuchar logout en otra pestaña
  window.addEventListener("storage", (e) => {
    if (e.key === "__logout__") clearProfileFields();
  });
});
