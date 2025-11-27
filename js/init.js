<<<<<<< Updated upstream
constante  CATEGORÍAS_URL  =  "https://japceibal.github.io/emercado-api/cats/cat.json" ;
const  PUBLISH_PRODUCT_URL  =  "https://japceibal.github.io/emercado-api/sell/publish.json" ;
const  PRODUCTOS_URL  =  "https://japceibal.github.io/emercado-api/cats_products/" ;
const  PRODUCT_INFO_URL  =  "https://japceibal.github.io/emercado-api/productos/" ;
const  PRODUCT_INFO_COMMENTS_URL  =  "https://japceibal.github.io/emercado-api/products_comments/" ;
const  CART_INFO_URL  =  "https://japceibal.github.io/emercado-api/user_cart/" ;
const  CART_BUY_URL  =  "https://japceibal.github.io/emercado-api/cart/buy.json" ;
constante  EXT_TYPE  =  ".json" ;
=======
const CATEGORIES_URL = "http://localhost:3000/cats/cat";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell/publish";
const PRODUCTS_URL = "http://localhost:3000/cats_products";
const PRODUCT_INFO_URL = "http://localhost:3000/products";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments";
const CART_INFO_URL = "http://localhost:3000/user_cart";
const CART_BUY_URL = "http://localhost:3000/cart/buy";

>>>>>>> Stashed changes


let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
