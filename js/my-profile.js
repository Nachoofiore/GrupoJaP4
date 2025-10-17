document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  const profileImage = document.getElementById("profileImage");
  const uploadPhoto = document.getElementById("uploadPhoto");
  const themeSwitch = document.getElementById("themeSwitch");

  // --- 1️⃣ Precargar email si existe ---
  const savedEmail = localStorage.getItem("userEmail") || "";
  document.getElementById("email").value = savedEmail;

  // --- 2️⃣ Cargar perfil guardado ---
  const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  document.getElementById("firstName").value = savedProfile.firstName || "";
  document.getElementById("lastName").value = savedProfile.lastName || "";
  document.getElementById("email").value = savedProfile.email || savedEmail;
  document.getElementById("phone").value = savedProfile.phone || "";

  // --- 3️⃣ Subir imagen (solo visual, no se guarda localmente) ---
  uploadPhoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        profileImage.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // --- 4️⃣ Guardar datos del perfil ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const userProfile = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
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
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });
});
