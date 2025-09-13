document.addEventListener("DOMContentLoaded", async () => {
  const id = localStorage.getItem("productID");
  if (!id) {
    // Entraron directo sin seleccionar un producto
    location.replace("products.html");
    return;
  }

  const url = `https://japceibal.github.io/emercado-api/products/${id}.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al cargar producto");
    const p = await res.json();

    // Campos del punto 4
    const el = (id) => document.getElementById(id);

    el("p-name").textContent = p.name ?? "Sin nombre";
    el("p-description").textContent = p.description ?? "—";
    el("p-category").textContent = p.category ?? "—";
    el("p-sold").textContent = p.soldCount ?? 0;

    const imgs = Array.isArray(p.images) ? p.images : [];
    el("p-images").innerHTML = imgs.length
      ? imgs.map(src => `<img src="${src}" alt="${p.name}">`).join("")
      : "<em>Sin imágenes</em>";

  } catch (err) {
    console.error(err);
    const root = document.getElementById("product-detail");
    root.innerHTML = `<div class="alert alert-danger">
      No se pudo cargar el producto. <a class="alert-link" href="products.html">Volver</a>
    </div>`;
  }
});
