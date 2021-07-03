$(document).ready(function() {
    $('.note').hide(); 
    $('.sort').hide(); 
    $('.validationNote').hide(); 
    $('.morePhotos').hide(); 
    $('#showLess').hide(); 

    // Button's 'Add Pizza' function
    $('#addPizza').click(function(){
        if(createPizza()){
            alert("Pizza Added Successfully!");
        }
    })

    // Button's 'Add New Pizza' in Navigation bar function
    $('.newPizza').click(function (){
            $('.pizzaMenu').hide(); 
            $('.note').hide(); 
            $('.sort').hide(); 
            $('.morePhotos').hide(); 
            $('.validationNote').hide(); 
            $('#showMore').show(); 
            $('.pizzaForm').show();
            clearForm();
        })
    
    // Button's 'Menu' in Navigation bar function
    $('.menu').click(function () {
        displayPizzas();
    })

}); 
 
var pizzaToppings = [];
// Adding and saving toppings to array
function addTopping(){
    topping = $('#pizzaToppings').val();
    // validation for not empty field
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

// Validation of Form Fields
function validateFormFields(){

    validated = false;
    pizzaName = $('#pizzaName').val();

    // Validation of Name field (cannot be empty)
    if(pizzaName.length < 1){
        $('#nameNote').text("Enter Pizza Name");
        $('#nameNote').show();
        validated = false;
    } else {
        $('#nameNote').hide();
        validated = validated + true;
    }
    
    // Validation of Name field (cannot be empty or negative)
    price = parseFloat($('#pizzaPrice').val());
    if(price <= 0 || isNaN(price)) {
        $('#priceNote').show();
        validated = false;
    } else if (price > 0){
        $('#priceNote').hide();
        validated = validated + true;
    }

    // Validation of Heat range 1-3
    heat = parseInt($('#pizzaHeat').val());
    if(heat < 0 || heat > 3) {
        $('#heatNote').show();
        validated = false;
    } else if(heat > 0 && heat < 4){
        $('#heatNote').hide();
        validated = validated + true;
    }

    // Validation of Pizza's toppings. Must have at least 2 toppings 
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


// Creates pizza and if is valid, adds to SessioStorage
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
            // Checks if name is unique
            if(!verifyUniqueName(pizzaName, pizzas)) {
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
        alert("Please Fill Fields Correctly");
    }
    
}

// Checks if name is unique
function verifyUniqueName(name, pizzas){
    for(i = 0; i < pizzas.length; i++){
        if(name == pizzas[i].name){
            return false;
        }
    }
    return true;
}

// Displays pizzas in menu page
function displayPizzas(){
    $('.pizzaForm').hide(); 
    $('.pizzaMenu').show(); 
    $('.sort').show();  
    $('.validationNote').hide(); 

    if(sessionStorage.pizzas) {
        $('.note').hide(); 
        
        pizzas = getPizzas();
        clearMenu(pizzas);
        // Checks if there are any pizzas in sessionStorage
        if(pizzas.length > 0) {
            sortedPizzas = getSortedPizzaList(pizzas);
            displaySortedPizzas(sortedPizzas);
        } else {
            $('.note').show(); 
            $('.sort').hide(); 
        }
    } else {
        $('.note').show(); 
        $('.sort').hide(); 
    } 
}

// Displays pizzas in menu by adding new tags to html file
function displaySortedPizzas(pizzas){
    for(i = 0; i < pizzas.length; i++){
        table = "<table class=\"pizzaDetails\"> "
        a_pizzaName = "<td class=\"nameOfPizza\">" + pizzas[i].name ;
        a_pizzaPrice = "<td class=\"priceOfPizza\">" + pizzas[i].price + " €</td>";
        a_pizzaToppings = "<td colspan=\"3\" class=\"toppingsOfPizza\">" + "Toppings: <br/>" + pizzas[i].toppings + "</td>";

        if(pizzas[i].heat != null){
            a_heat = "<section class=\"chillies\">";
            for(j = 0; j < pizzas[i].heat; j++){
                chillies = "<img class=\"pizzasHeat\" src=\"photos/chilli.png\">";
                a_heat = a_heat.concat(chillies);
            }
            a_heat = a_heat.concat("</section>" + "</td>");
        } else {
            a_heat = " </td>";
        }
        
        if (pizzas[i].photo != null) {
            a_pizzaPhoto = "<td rowspan=\"2\" class=\"pizzaMenuPhoto\"> <img class=\"menuPhoto\" src=\"photos/" +  pizzas[i].photo + ".jpg\" > </td>"
        } else {
            a_pizzaPhoto = "";
        }

        deleteButton = "<td rowspan=\"2\" class=\"deletePizza\"><button onclick=\"deletePizza('"+ pizzas[i].name +"')\" id=\"deletePizza\">Delete</button></td>"

        pizzaArticleDetails = "<tr>" + table + a_pizzaPhoto + a_pizzaName + a_heat + a_pizzaPrice + deleteButton + "</tr>" + 
                            "<tr>" + a_pizzaToppings + "</tr> </table>";
        
        $('.pizzaMenu').append("<article id=\"pizza" + i + "\" class=\"pizzaBox\"> " + pizzaArticleDetails + "</article>");
    }
}

// Deletes chosen pizza from SessionStorage
function deletePizza(pizzaToDelete){

    confirmation = confirm("Delete " + pizzaToDelete + " Pizza?")

    if(confirmation){
        pizzas = getPizzas();
        for(i = 0; i < pizzas.length; i++){
            if(pizzas[i].name == pizzaToDelete){
                if (i > -1) {
                    pizzas.splice(i, 1);
                    sessionStorage.setItem('pizzas', JSON.stringify(pizzas));
                    break;
                }
            }
        }
        alert(pizzaToDelete + " is deleted.")
        displayPizzas();
    }
}

// Utils
// Get Pizza List from SessionStorage
function getPizzas() {
    return JSON.parse(sessionStorage.getItem('pizzas'));
}

// Get a photo if chosen
function getPhoto(){
    if(document.querySelector('input[name="pizza"]:checked')){
        photo = document.querySelector('input[name="pizza"]:checked').value
    } else {
        photo = null;
    }
    return photo;
}

// Sorting
// Sorts Piza List by given choice
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

// Clear pizzas menu
function clearMenu(){
    document.getElementById('pizzaMenu').innerHTML = "";
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

    showLessPhotos(); 
}

function showMorePhotos(){
    $('.morePhotos').show(); 
    $('#showMore').hide(); 
    $('#showLess').show(); 
}

function showLessPhotos(){
    $('.morePhotos').hide();
    $('#showMore').show(); 
    $('#showLess').hide(); 
}