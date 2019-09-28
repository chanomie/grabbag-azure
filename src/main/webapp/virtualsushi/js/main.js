//
// This is the main JS file.  Virtual Sushi avoids server-side logic in favor of client-side
// JavaScript for fun.


// The Product Database
var products = {
  "VCR": {
  	"name":"Virtual California Roll",
  	"price":4.99,
  	"img":"virtual-california-roll.png",
  	"description":"Delicious crab and avocado rolled together."
  },
  "VST": {
  	"name":"Virtual Spicy Tuna",
  	"price":7.99,
  	"img":"virtual-spicy-tuna.png",
  	"description":"Spicy tuna and cucumber rolled together"  	
  }		
};

$( document ).ready(function() {
  if(document.getElementById("productList")) { setupProductList(); }
  if(document.getElementById("product")) { setupProductPage(); }
});


// If the productList element is on the page, dynamicall build the product list.
function setupProductList() {
  if(document.getElementById("productList")) {
    for (productSku of Object.keys(products)) {
	  // products[productSku].name	
	  $("#productList").append(
	    $("<a>").attr("href","product.html?sku=" + productSku).append(	    
          $("<div>").addClass("productItem").append(
	        $("<h2>").addClass("productTitle").text(products[productSku].name)
	      ).append(
            $("<img>").addClass("productImage").attr("src", "img/" + products[productSku].img)
	      )
	    )
	  );
    }
  }
}

function setupProductPage() {
	var productSku = getUrlParameter("sku");
	productSku = productSku.toUpperCase();
	
	$("#product").append(
	  $("<h2>").addClass("productTitle").text(products[productSku].name)
	).append(
	  $("<img>").addClass("productImage").attr("src","img/" + products[productSku].img)
	);
  	
  	$('meta[property="og:url"]').attr('content', window.location.href);  	
  	$('meta[property="og:title"]').attr('content', "Virtual Sushi - " + products[productSku].name);
  	$('meta[property="og:description"]').attr('content', products[productSku].description);
   	$('meta[property="og:image"]').attr('content', "img/" + products[productSku].img);
   	
   	$("#addToCartButton").click(function() {
   		addToCart(productSku);
   		$("#cartModal").modal();
   	})
}

function addToCart(productSku) {
	var cart = sessionStorage.getItem("cart");
	if(cart == null) cart = "";
	
	cart = cart + "," + productSku;
	sessionStorage.setItem("cart",cart);
}

function getCartMap() {
	var cart = sessionStorage.getItem("cart");
	var cartMap = {
		"price": 0,
		"items": 0,
		"products": {}
	};
	if(cart == null) cart = "";	
	var productArray = cart.split(",");
	
	productArray.forEach(function (item, index) {
		if(products[item]) {
		  cartMap.price += products[item].price;
		  cartMap.items++;
		  if(cartMap[item] == null) {
		  	cartMap[item] = {};
		  }
		  if(cartMap[item].quantity == null) {
		  	cartMap[item].quantity = 1;
		  	cartMap[item].total = products[item].price;
		  } else {
		  	cartMap[item].quantity++;
		  	cartMap[item].total += products[item].price;
		  }
		}
    });
    
    console.log("Cart Map: " + JSON.stringify(cartMap));
}



function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};