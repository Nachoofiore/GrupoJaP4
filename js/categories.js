const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria;
let minCount;
let maxCount;

function sortCategories(criteria, array) {
  if (criteria === ORDER_ASC_BY_NAME) {
    return array.sort((a, b) => a.name.localeCompare(b.name));
  } else if (criteria === ORDER_DESC_BY_NAME) {
    return array.sort((a, b) => b.name.localeCompare(a.name));
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    return array.sort((a, b) => b.productCount - a.productCount);
  }
  return array;
}

function setCatID(id) {
  localStorage.setItem("catID", id);
  window.location = "products.html";
}

function showCategoriesList() {
  const container = document.getElementById("cat-list-container");
  let html = "";

  for (let category of currentCategoriesArray) {
    if (
      (minCount === undefined || category.productCount >= minCount) &&
      (maxCount === undefined || category.productCount <= maxCount)
    ) {
      html += `
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
      </div>`;
    }
  }
  container.innerHTML = html;
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria;
  if (categoriesArray) currentCategoriesArray = categoriesArray;
  currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);
  showCategoriesList();
}

document.addEventListener("navbarLoaded", () => {
  getJSONData(CATEGORIES_URL).then(resultObj => {
    if (resultObj.status === "ok") {
      currentCategoriesArray = resultObj.data;
      showCategoriesList();
    }
  });

  document.getElementById("sortAsc").addEventListener("click", () => sortAndShowCategories(ORDER_ASC_BY_NAME));
  document.getElementById("sortDesc").addEventListener("click", () => sortAndShowCategories(ORDER_DESC_BY_NAME));
  document.getElementById("sortByCount").addEventListener("click", () => sortAndShowCategories(ORDER_BY_PROD_COUNT));

  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    minCount = maxCount = undefined;
    showCategoriesList();
  });

  document.getElementById("rangeFilterCount").addEventListener("click", () => {
    minCount = parseInt(document.getElementById("rangeFilterCountMin").value) || undefined;
    maxCount = parseInt(document.getElementById("rangeFilterCountMax").value) || undefined;
    showCategoriesList();
  });
});
