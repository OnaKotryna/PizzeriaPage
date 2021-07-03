$(document).ready(function() {
    $('.note').hide(); 
    $('.sort').hide(); 
    $('.validationNote').hide(); 

    $('#addPizza').click(function(){
        if(createPizza()){
            alert("Pizza Added Successfully!");
        }
    })

    $('.newPizza').click(function (){
            $('.pizzaMenu').hide(); 
            $('.note').hide(); 
            $('.sort').hide(); 
            $('.pizzaForm').show();
        })
    
    $('.menu').click(function () {
        displayPizzas();
    })

}); 
 
var pizzaToppings = [];
function addTopping(){
    topping = $('#pizzaToppings').val();
    if(topping.length >= 1){
        $('#toppingNote').hide();
        pizzaToppings.push(topping);
        document.getElementById('pizzaToppings').value = "";
        $('#toppingList').append("<li name=\"topping\">" + topping + "</li>");
    } else {
        $('#toppingNote').show();
        $('#toppingNote').text("Enter topping");
    }
}

function validateFormFields(){

    validated = false;
    pizzaName = $('#pizzaName').val();

    if(pizzaName.length < 1){
        $('#nameNote').text("Enter Pizza Name");
        $('#nameNote').show();
        validated = false;
    } else {
        $('#nameNote').hide();
        validated = validated + true;
    }
    
    price = parseFloat($('#pizzaPrice').val());
    if(price <= 0 || isNaN(price)) {
        $('#priceNote').show();
        validated = false;
    } else {
        $('#priceNote').hide();
        validated = validated + true;
    }

    heat = parseInt($('#pizzaHeat').val());
    if(heat < 0 || heat > 3) {
        $('#heatNote').show();
        validated = false;
    } else if(heat > 0 && heat < 4){
        $('#heatNote').hide();
        validated = validated + true;
    }

    // check if pizza has at least 2 toppings 
    if(pizzaToppings.length < 2) {
        $('#toppingNote').show();
        $('#toppingNote').text("Enter at least 2 toppings");
        validated = false;
    } else {
        $('#toppingNote').hide();
        validated = validated + true;
    }

    return validated;
}

function getPhoto(){
    if(document.querySelector('input[name="pizza"]:checked')){
        photo = document.querySelector('input[name="pizza"]:checked').value
    } else {
        photo = null;
    }
    return photo;
}

// create pizza 
function createPizza(){
    
    if(validateFormFields()){
        pizzaName = $('#pizzaName').val();

        const newPizza = {
            name: pizzaName,
            price: parseFloat($('#pizzaPrice').val()),
            heat: parseInt($('#pizzaHeat').val()),
            toppings: pizzaToppings,
            photo: getPhoto()
        }
        
        if(sessionStorage.pizzas) {
            pizzas = getPizzas();
            // check if name is unique
            if(!verifyUniqueName(pizzaName, pizzas)) {
                alert("Pizza's name must be unique");
                $('#nameNote').show();
                $('#nameNote').text("Pizza's name must be unique");
                return false;
            }
        } else {
            pizzas = [];
        }



        pizzas.push(newPizza);

        sessionStorage.setItem('pizzas', JSON.stringify(pizzas));

        clearForm();

        return true;
    } else{
        alert("Please Fill fields correctly");
    }
    
}

// check if name is unique
function verifyUniqueName(name, pizzas){
    for(i = 0; i < pizzas.length; i++){
        if(name == pizzas[i].name){
            return false;
        }
    }
    return true;
}

// display pizzas in menu page
function displayPizzas(){
    $('.pizzaForm').hide(); 
    $('.pizzaMenu').show(); 
    $('.sort').show();  
    $('.validationNote').hide(); 

    if(sessionStorage.pizzas) {
        $('.note').hide(); 
        clearMenu();
        
        pizzas = getPizzas();
        sortedPizzas = getSortedPizzaList(pizzas);
        displaySortedPizzas(pizzas);

    } else {
        $('.note').show(); 
        $('.sort').hide(); 
    }
}

function displaySortedPizzas(pizzas){
    for(i = 0; i < pizzas.length; i++){
        a_id = "<article id=\"pizza" + i + "\" class=\"pizzaBox\"> " ;
        a_pizzaName = "<div class=\"nameOfPizza\">" + pizzas[i].name + "</div>";
        a_pizzaPrice = "<div class=\"priceOfPizza\">" + pizzas[i].price + " €</div>";
        a_pizzaToppings = "<div class=\"toppingsOfPizza\">" + pizzas[i].toppings + "</div>";

        if(pizzas[i].heat != null){
            a_heat = "";
            for(j = 0; j < pizzas[i].heat; j++){
                chillies = "<img class=\"pizzasHeat\" src=\"photos/chilli.png\">";
                a_heat = a_heat.concat(chillies);
            }
            a_heat = a_heat.concat("<br/>");
        } else {
            a_heat = "";
        }
        
        if (pizzas[i].photo != null) {
            a_pizzaPhoto = "<img class=\"menuPhoto\" src=\"photos/" +  pizzas[i].photo + ".jpg\" >"
        } else {
            a_pizzaPhoto = "";
        }

        pizzaArticleDetails = a_pizzaName + a_heat + a_pizzaPrice + a_pizzaToppings + a_pizzaPhoto ;
        
        $('.pizzaMenu').append(a_id + pizzaArticleDetails + "</article>");
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

// Sorting
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

    radios = document.getElementsByName('pizza');
    for(i = 0; i < radios.length; i++){
        radios[i].checked = false;
    }

    pizzaToppings = [];
}