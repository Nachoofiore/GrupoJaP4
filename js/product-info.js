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
// === Galería robusta: click en miniatura -> pasa a principal ===
(function () {
  const gallery = document.getElementById("p-images");
  if (!gallery) return;

  // Devuelve el NodeList de imágenes dentro de #p-images
  const getImgs = () => gallery.querySelectorAll("img");

  // Marca miniaturas clickeables cuando existan imágenes
  const hydrate = () => {
    const imgs = getImgs();
    if (imgs.length < 2) return false; // aún no hay suficientes
    imgs.forEach((img, i) => { if (i > 0) img.style.cursor = "pointer"; });
    return true;
  };

  // 1) Intenta hidratar ahora; si aún no hay imágenes, observa el contenedor
  if (!hydrate()) {
    const mo = new MutationObserver(() => {
      if (hydrate()) mo.disconnect();
    });
    mo.observe(gallery, { childList: true, subtree: true });
  }

  // 2) Delegación: un único listener para todos los <img> (presentes o futuros)
  gallery.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;

    const imgs = getImgs();
    if (imgs.length === 0) return;

    const main = imgs[0];
    if (target === main) return; // si clickean la grande, no hacemos nada

    // Intercambia las fuentes
    const tmp = main.src;
    main.src = target.src;
    target.src = tmp;
  });
})();