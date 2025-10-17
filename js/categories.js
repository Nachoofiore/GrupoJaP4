const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

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


function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}


//Funcion que nos lleva al producto por categoría
//Hay que crear los demas html por producto
function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data
            showCategoriesList()
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showCategoriesList();
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("modo-toggle");

  // Ver si el usuario tenía guardado el modo
  const modoActual = localStorage.getItem("modo") || "claro";
  if (modoActual === "oscuro") {
    activarModoOscuro();
    toggle.checked = true;
  }

  // Escuchar el cambio del switch
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      activarModoOscuro();
      localStorage.setItem("modo", "oscuro");
    } else {
      desactivarModoOscuro();
      localStorage.setItem("modo", "claro");
    }
  });
});

// Funciones para aplicar estilos
function activarModoOscuro() {
  document.body.classList.add("modo-oscuro");

  // Cambiar Bootstrap navbar
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.remove("navbar-light", "bg-light");
    navbar.classList.add("navbar-dark", "bg-dark");
  }

  // Cambiar color de cards
  document.querySelectorAll(".card").forEach(card => {
    card.classList.add("bg-dark", "text-white");
  });

  // Cambiar color de botones
  document.querySelectorAll(".btn").forEach(btn => {
    btn.classList.add("btn-outline-light");
    btn.classList.remove("btn-outline-dark");
  });
}

function desactivarModoOscuro() {
  document.body.classList.remove("modo-oscuro");

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.remove("navbar-dark", "bg-dark");
    navbar.classList.add("navbar-light", "bg-light");
  }

  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("bg-dark", "text-white");
  });

  document.querySelectorAll(".btn").forEach(btn => {
    btn.classList.remove("btn-outline-light");
    btn.classList.add("btn-outline-dark");
  });
}
