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
  if(document.getElementById("cart")) { setupCartPage(); }
 

  setupExtole();
  setupLoginModal();
  getCartMap();
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
		    $("<span>").addClass("productPrice").text(products[productSku].price)
	      ).append(
            $("<img>").addClass("productImage").attr("src", "img/" + products[productSku].img)
	      )
	    )
	  );
    }
  }
}

function setupExtole() {
    (function(c,b,f,k,a){c[b]=c[b]||{};for(c[b].q=c[b].q||[];a<k.length;)f(k[a++],c[b])})(window,"extole",function (c,b){b[c]=b[c]||function (){b.q.push([c,arguments])}},["createZone"],0);
    
    extole.createZone({
        name: "global_header",
        element_id: 'extole_zone_global_header'
    });
    extole.createZone({
        name: "global_footer",
        element_id: 'extole_zone_global_footer'
    });
    extole.createZone({
        name: "overlay",
        element_id: 'extole_zone_overlay'
    });
    extole.createZone({
        name: "product",
        element_id: 'extole_zone_product'
    });	
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

function setupCartPage() {
  if(document.getElementById("cart")) {
    var cartMap = getCartMap();

    for (var productSku in cartMap.products) {
      if (cartMap.products.hasOwnProperty(productSku)) {           
        // console.log(productSku, cartMap.products[productSku]);
        
        $("#cart").append(
	      $("<div>").addClass("cartProduct").append(
		    $("<img>").addClass("cartProductImage").attr("src","img/" + products[productSku].img)
	      ).append(
		    $("<div>").addClass("cartProductTitle").text(products[productSku].name)
	      ).append(
		    $("<div>").addClass("cartProductQuantity").text(cartMap.products[productSku].quantity + " for ").append(
			    $("<span>").addClass("cartPrice").text("$" + cartMap.products[productSku].total)
		    )
	      )
        );

      }
    }
  }
  
   	$("#clearCartButton").click(function() {
   		clearCart();
   	})

   	$("#checkoutButton").click(function() {
	   	// If not logged in, then login
	   	
	   	if(!getLoginEmail()) {
	   	  $("#modalLoginForm").modal();
	   	} else {
		  checkout();
	   	}
   	})
}

function checkout() {
	var cartMap = getCartMap();
	if(cartMap.items == 0) {
		alert("Cart is empty.");
		return;
	}
	
    (function(c,e,k,l,a){c[e]=c[e]||{};for(c[e].q=c[e].q||[];a<l.length;)k(l[a++],c[e])})(window,"extole",function(c,e){e[c]=e[c]||function(){e.q.push([c,arguments])}},["createZone"],0);

      extole.createZone({
        name: 'conversion',
        data: {
          "email": getLoginEmail(),
          "partner_conversion_id": (new Date()).getTime(),
          "cart_value": cartMap.price.toFixed(2)
        }
      });
	
	clearCart();
      extole.createZone({
        name: 'confirmation'
      });
	
	
}

function setupLoginModal() {
  if(document.getElementById("navMyAccount")) {
   	$("#navMyAccount").click(function() {
   		$("#modalLoginForm").modal();
   	})	  
  }
  
  if(document.getElementById("loginButton")) {
   	$("#loginButton").click(function() {
	   	var loginEmail = $("#loginEmail").val();
	   	if(validateEmail(loginEmail)) {
		  loginUser(loginEmail);
          $('#modalLoginForm').modal('hide') 	
	   	}
	   	
   	})	  
  }
}

function addToCart(productSku) {
	var cart = sessionStorage.getItem("cart");
	if(cart == null) cart = "";
	
	cart = cart + "," + productSku;
	sessionStorage.setItem("cart",cart);
	
	getCartMap();
}

function clearCart() {
	sessionStorage.removeItem("cart");
	$("#cart").empty();
	getCartMap();
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
		  if(cartMap.products[item] == null) {
		  	cartMap.products[item] = {};
		  }
		  if(cartMap.products[item].quantity == null) {
		  	cartMap.products[item].quantity = 1;
		  	cartMap.products[item].total = products[item].price;
		  } else {
		  	cartMap.products[item].quantity++;
		  	cartMap.products[item].total += products[item].price;
		  }
		}
    });
    
    if(document.getElementById("cartCount")) {
	    $("#cartCount").text(" (" + cartMap.items + ")");
    }
    
    if(document.getElementById("checkoutButton")) {
	    if(cartMap.items > 0) {
		    $("#checkoutButton").prop("disabled",false);
	    } else {
		    $("#checkoutButton").prop("disabled",true);
	    }
    }
    
    // console.log("Cart Map: " + JSON.stringify(cartMap));
    return cartMap;
}


function loginUser(email) {
	var loginEmail = sessionStorage.getItem("loginEmail");
	
	if(loginEmail && loginEmail !== "" && loginEmail !== email) {
	  logoutUser();
	} else {
	  sessionStorage.setItem("loginEmail", email);
      (function(c,e,k,l,a){c[e]=c[e]||{};for(c[e].q=c[e].q||[];a<l.length;)k(l[a++],c[e])})(window,"extole",function(c,e){e[c]=e[c]||function(){e.q.push([c,arguments])}},["createZone"],0);

      extole.createZone({
       name: 'registration',
       data: {
         "email": email
       }
     });
  
	}
	
	// Trigger an identify event
}

function logoutUser() {
	sessionStorage.removeItem("loginEmail");
	// Trigger Extole Logout
}

function getLoginEmail() {
	var loginEmail = sessionStorage.getItem("loginEmail");
	if(loginEmail && validateEmail(loginEmail)) {
		return loginEmail;
	} else {
		return null;
	}
}

function logout() {
	
}


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}