const CATEGORIES_URL = "http://localhost:3000/cats/cat";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell/publish";
const PRODUCTS_URL = "http://localhost:3000/cats_products";
const PRODUCT_INFO_URL = "http://localhost:3000/products";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments";
const CART_INFO_URL = "http://localhost:3000/user_cart";
const CART_BUY_URL = "http://localhost:3000/cart/buy";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url, options = {}){
    let result = {};
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    
    // Agregar el token de autenticación si existe
    const token = localStorage.getItem("token");
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    showSpinner();
    
    return fetch(url, {
        method: options.method || 'GET', 
        headers: headers, 
        body: options.body || null
    })
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            throw Error("No autenticado");
        }
        
        if (response.ok) { 
            return response.json();
        } else {
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

let isAuthenticated = function() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch (error) {
        return false;
    }
}