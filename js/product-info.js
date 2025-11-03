// js/product-info.js
document.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("productID");
  if (!id) {
    location.replace("products.html");
    return;
  }

  const url = `https://japceibal.github.io/emercado-api/products/${id}.json`;
  const urlComments = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`;

  const pName = document.getElementById("p-name");
  const pDescription = document.getElementById("p-description");
  const pCategory = document.getElementById("p-category");
  const pSold = document.getElementById("p-sold");
  const carrusel = document.getElementById("carrusel");
  const pPrice = document.getElementById("p-price");
  const ratingsList = document.getElementById("ratings-list");
  const ratingForm = document.getElementById("rating-form");
  const relatedContainer = document.getElementById("related-products");
  const ratingWrap = document.querySelector(".rating-wrap");

  function estrellas(score) {
    return "★".repeat(score) + "☆".repeat(5 - score);
  }

  function crearCarrusel(imagenes) {
    if (!imagenes || imagenes.length === 0) return "";
    let indicadores = "", items = "";
    imagenes.forEach((img, index) => {
      indicadores += `<button type="button" data-bs-target="#carouselProduct" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}" aria-current="${index === 0 ? "true" : "false"}"></button>`;
      items += `<div class="carousel-item ${index === 0 ? "active" : ""}"><img src="${img}" class="d-block w-100 rounded" alt="Imagen ${index+1}"></div>`;
    });
    return `
      <div id="carouselProduct" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">${indicadores}</div>
        <div class="carousel-inner">${items}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselProduct" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span><span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselProduct" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span><span class="visually-hidden">Siguiente</span>
        </button>
      </div>`;
  }

  function mostrarRelacionados(relacionados) {
    relatedContainer.innerHTML = "";
    relacionados.forEach(prod => {
      relatedContainer.innerHTML += `
        <div class="col-md-3">
          <div class="card h-100 related-card" data-id="${prod.id}" style="cursor:pointer;">
            <img src="${prod.image}" class="card-img-top" alt="${prod.name}">
            <div class="card-body"><h6 class="card-title">${prod.name}</h6></div>
          </div>
        </div>`;
    });

    document.querySelectorAll(".related-card").forEach(card => {
      card.addEventListener("click", () => {
        localStorage.setItem("productID", card.dataset.id);
        location.href = "product-info.html";
      });
    });
  }

  // Cargar datos del producto
  fetch(url)
    .then(res => res.json())
    .then(data => {
      pName.textContent = data.name;
      pDescription.textContent = data.description;
      pCategory.textContent = data.category;
      pSold.textContent = data.soldCount;
      pPrice.textContent = `${data.currency} ${data.cost}`;
      carrusel.innerHTML = crearCarrusel(data.images);
      mostrarRelacionados(data.relatedProducts);
    })
    .catch(err => {
      console.error("Error al cargar el producto:", err);
    });

  // Comentarios (mantengo tu lógica)
  function obtenerComentariosLocales() {
    const stored = localStorage.getItem(`comments_${id}`);
    return stored ? JSON.parse(stored) : [];
  }
  function guardarComentariosLocales(comments) {
    localStorage.setItem(`comments_${id}`, JSON.stringify(comments));
  }

  let comentariosAPI = [];
  fetch(urlComments)
    .then(res => res.json())
    .then(data => {
      comentariosAPI = data;
      const locales = obtenerComentariosLocales();
      mostrarComentarios(locales.concat(comentariosAPI));
    })
    .catch(err => {
      console.error("Error al cargar comentarios:", err);
      mostrarComentarios(obtenerComentariosLocales());
    });

  function mostrarComentarios(comments) {
    ratingsList.innerHTML = "";
    comments.forEach(c => {
      ratingsList.innerHTML += `
        <li class="list-group-item">
          <strong>${c.user}</strong> <small class="text-muted">· ${c.dateTime}</small><br>
          ${estrellas(c.score)}<br><p>${c.description}</p>
        </li>`;
    });
    actualizarValoracionPromedio(comments);
  }
  function actualizarValoracionPromedio(comments) {
    if (!comments.length) {
      ratingWrap.innerHTML = `<strong>Valoración del producto:</strong> <span class="text-muted">Sin calificaciones</span>`;
      return;
    }
    const total = comments.reduce((acc, c) => acc + c.score, 0);
    const promedio = (total / comments.length).toFixed(1);
    ratingWrap.innerHTML = `<strong>Valoración del producto:</strong><span class="stars">${estrellas(Math.round(promedio))}</span><span class="ms-2">(${promedio} / 5, ${comments.length} opiniones)</span>`;
  }

  ratingForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = document.getElementById("rating-text").value;
    const puntaje = parseInt(document.getElementById("rating-score").value);
    if (texto && puntaje) {
      const nuevo = { user: localStorage.getItem("username") || "Anónimo", dateTime: new Date().toLocaleString(), description: texto, score: puntaje };
      const actuales = obtenerComentariosLocales();
      actuales.unshift(nuevo);
      guardarComentariosLocales(actuales);
      mostrarComentarios(actuales.concat(comentariosAPI));
      ratingForm.reset();
    }
  });

  // BOTÓN COMPRAR: agrega y redirige + notifica navbar
  const btnComprar = document.querySelector(".btn-comprar");
  if (btnComprar) {
    btnComprar.addEventListener("click", () => {
      fetch(url)
        .then(res => res.json())
        .then(product => {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existing = cart.find(item => item.id === product.id);
          if (existing) existing.cantidad = (existing.cantidad || 1) + 1;
          else cart.push({ id: product.id, name: product.name, cost: product.cost, currency: product.currency, image: product.images[0], cantidad: 1 });
          localStorage.setItem("cart", JSON.stringify(cart));
          // despachar evento para que navbar actualice badge
          document.dispatchEvent(new Event("cartUpdated"));
          window.location.href = "cart.html";
        })
        .catch(err => console.error("Error al agregar producto:", err));
    });
  }
});
