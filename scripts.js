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
        
        pizzas = getPizzas();

        clearMenu();
    
        for(i = 0; i < pizzas.length; i++){
        
            pizzaArticleDetails = "id=\"pizza" + i +
            "\" class=\"pizzaBox\"> <div class=\"nameOfPizza\">" + pizzas[i].name + "</div>" +
            "<div class=\"priceOfPizza\">" + pizzas[i].price + " €</div>" +
            "<div class=\"toppingsOfPizza\">" + pizzas[i].toppings + "</div>";

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
            pizzaArticlePhotos = "";
            for(j = 0; j < pizzas[i].photos.length; j++){
                image = "<img class=\"menuPhoto\" src=\"photos/" +  pizzas[i].photos[j] + ".jpg\" >";
                pizzaArticlePhotos = pizzaArticlePhotos.concat(image);
            }
            
            $('.pizzaMenu').append("<article " + pizzaArticleDetails + heat + pizzaArticlePhotos +"</article>");
        }
        
    } else {
        $('.note').show(); 
    }
}


// Utils
function getPizzas() {
    return JSON.parse(sessionStorage.getItem('pizzas'));
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