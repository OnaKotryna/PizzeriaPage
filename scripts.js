$(document).ready(function() {
    $('.note').hide(); 
    $('.sort').hide(); 

    $('#addPizza').click(function(){
        if(createPizza()){
            alert("Pizza Added Successfully!");
        }
    })

    $('.newPizza').click(function (){
            $('.pizzaMenu').hide(); 
            $('.pizzaForm').show();
            $('.note').hide(); 
            $('.sort').hide(); 
            
        })
    
    $('.menu').click(function (){
        displayPizzas();
    })

}); 
 
var pizzaToppings = [];
function addTopping(){
    topping = $('#pizzaToppings').val();
    if(topping.length >= 1){
        pizzaToppings.push(topping);
        document.getElementById('pizzaToppings').value = "";
        $('#toppingList').append("<li name=\"topping\">" + topping + "</li>");
    } else {
        alert("Enter topping");     
    }
}

var chosenPhotos = [];
function addPhotos(){
    photos = document.querySelectorAll('input[name="pizza"]:checked')
    photos.forEach(photo => {
        chosenPhotos.push(photo.value);
    });
}

// create pizza 
function createPizza(){
    
    pizzaName = $('#pizzaName').val();
    addPhotos();
    const newPizza = {
        name: pizzaName,
        price: parseFloat($('#pizzaPrice').val()),
        heat: parseInt($('#pizzaHeat').val()),
        toppings: pizzaToppings,
        photos: chosenPhotos
    }
    
    if(sessionStorage.pizzas) {
        pizzas = getPizzas();
        // check if name is unique
        if(!verifyUniqueName(pizzaName, pizzas)) {
            alert("Pizza's name must be unique");
            return false;
        }
    } else {
        pizzas = [];
    }
    // check if pizza has at least 2 toppings 
    if(pizzaToppings.length < 2){
        alert("Pizza has to gave at least 2 toppings");
        return false;
    }

    pizzas.push(newPizza);

    sessionStorage.setItem('pizzas', JSON.stringify(pizzas));

    clearForm();

    return true;
}

// check if name is unique
function verifyUniqueName(name, pizzas){
    for(i = 0; i < pizzas.length; i++){
        // if(name == pizzas[i].name){
        //     return false;
        // }
    }
    
    return true;
}

// display pizzas in menu page
function displayPizzas(){
    $('.pizzaForm').hide(); 
    $('.pizzaMenu').show(); 
    $('.sort').show();  

    if(sessionStorage.pizzas) {
        $('.note').hide(); 
        clearMenu();
        
        pizzas = getPizzas();
        sortedPizzas = getSortedPizzaList(pizzas);
        displaySortedPizzas(pizzas);

    } else {
        $('.note').show(); 
    }
}

function displaySortedPizzas(pizzas){
    for(i = 0; i < pizzas.length; i++){
        articleId = "<article id=\"pizza" + i + "\" class=\"pizzaBox\"> " ;
        articlePizzaName = "<div class=\"nameOfPizza\">" + pizzas[i].name + "</div>";
        articlePizzaPrice = "<div class=\"priceOfPizza\">" + pizzas[i].price + " €</div>";
        articlePizzaToppings = "<div class=\"toppingsOfPizza\">" + pizzas[i].toppings + "</div>";

        if(pizzas[i].photos.length != 0){
            articlePizzaPhotos = "<img class=\"menuPhoto\" src=\"photos/" +  pizzas[i].photos[0] + ".jpg\" >"
        } else {
            articlePizzaPhotos = "";
        }
        
        if(pizzas[i].heat != null){
            heat = "";
            for(j = 0; j < pizzas[i].heat; j++){
                chillies = "<img class=\"pizzasHeat\" src=\"photos/chilli.png\">";
                heat = heat.concat(chillies);
            }
            heat = heat.concat("<br/>");
        } else {
            heat = "";
        }

        pizzaArticleDetails = articlePizzaName + heat + articlePizzaPrice + articlePizzaToppings;
        
        
        $('.pizzaMenu').append(articleId + pizzaArticleDetails + articlePizzaPhotos +"</article>");
    }
}

function getSortedPizzaList(pizzas){
    sort = $('.sort').val();
    if(sort == "byNameAsc"){
        pizzas.sort(function(a, b) {
            var nameA = a.name; 
            var nameB = b.name; 
            return sortPizzasAsc(nameA, nameB);
        });
    } else if(sort == "byNameDesc"){
        pizzas.sort(function(a, b) {
            var nameA = a.name; 
            var nameB = b.name; 
            return sortPizzasDesc(nameA, nameB);
        });
    } else if(sort == "byPriceAsc"){
        pizzas.sort(function(a, b) {
            var priceA = a.price;
            var priceB = b.price; 
            return sortPizzasAsc(priceA, priceB);
        });
    } else if(sort == "byPriceDesc"){
        pizzas.sort(function(a, b) {
            var priceA = a.price;
            var priceB = b.price; 
            return sortPizzasDesc(priceA, priceB);
        });
    } else if(sort == "byHeatAsc"){
        pizzas.sort(function(a, b) {
            var heatA = a.heat;
            var heatB = b.heat; 
            return sortPizzasAsc(heatA, heatB);
        });
    } else if(sort == "byHeatDesc"){
        pizzas.sort(function(a, b) {
            var heatA = a.heat;
            var heatB = b.heat; 
            return sortPizzasDesc(heatA, heatB);
        });
    }
    return pizzas;
}


// Utils
function getPizzas() {
    return JSON.parse(sessionStorage.getItem('pizzas'));
}

function sortPizzasAsc(a, b){
    if(a < b) {
        return -1;
    }
    if(a > b) {
        return 1;
    }
    return 0;
}

function sortPizzasDesc(a, b){
    if(a > b) {
        return -1;
    }
    if(a < b) {
        return 1;
    }
    return 0;
}
// Clear menu
function clearMenu(){
    if(document.getElementById('pizza0')){
        for(i = 0; i < pizzas.length; i++){
            var clearMenu = document.getElementById('pizza' + i);
            $(clearMenu).remove();
        }
    }
}

// Clear form 
function clearForm(){
    document.getElementById('pizzaName').value = "";
    document.getElementById('pizzaPrice').value = "";
    document.getElementById('pizzaHeat').value = "";
    document.getElementById('toppingList').innerHTML = "";

    checkboxes = document.getElementsByName('pizza');
    for(i = 0; i < checkboxes.length; i++){
        checkboxes[i].checked = false;
    }

    pizzaToppings = [];
    chosenPhotos = [];
}