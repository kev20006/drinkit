let getFormDetails = () => {
    let valid = true;
    let cocktailDetails= {}
    if(document.getElementById("name").value != ""){
        cocktailDetails.name = document.getElementById('name').value; 
    }
    else{
        valid = false;
    }
    if (document.getElementById("image-url").value != "") {
        cocktailDetails.image_url = document.getElementById('image-url').value;
    }
    else {
        valid = false;
    }
    if (document.getElementById('description').value != '') {
        cocktailDetails.description = document.getElementById('description').value;
    }
    else {
        valid = false;
    }
    if (document.getElementById('flavors').value != ''){
        let flavors = document.getElementById('flavors').value.toLowerCase();
        flavors = flavors.split(", ")
        cocktailDetails.flavors = flavors;
    }
    else {
        valid = false;
    } 
    let ingredientsTable = document.getElementById('ingredients-table').children;
    
    cocktailDetails.ingredients = []
    for (let i = 0; i < ingredientsTable.length; i++) {
        let name = ingredientsTable[i].children[1].children[1].value;
        let quantity = ingredientsTable[i].children[2].children[1].value.split(' ')[0];
        let units = "none"
        if (ingredientsTable[i].children[2].children[1].value.split(' ').length == 2){
            units = ingredientsTable[i].children[2].children[1].value.split(' ')[1];
        };
        let type = ingredientsTable[i].querySelectorAll('select')[0].value
        if (name !="" && quantity !="" && units !="" && type !=""){
            cocktailDetails.ingredients.push({
				name: name.toLowerCase(),
				quantity: quantity,
				units: units,
				type: type,
			});
        }
    }
    if (cocktailDetails.ingredients.length == 0){
        valid=false;
    }
    if (document.getElementById("glass").value != ''){
        cocktailDetails.glass = document.getElementById('glass').value; 
    }

    let instructions = document.getElementById("step-by-step").children;
    cocktailDetails.instructions = [];
    for (let i = 0; i < instructions.length; i++){
        if (instructions[i].children[0].value != ""){
            cocktailDetails.instructions.push(instructions[i].children[0].value);
        }
    }
    if (cocktailDetails.instructions.length == 0) {
        valid = false;
    }

    let equipment = document.getElementsByClassName("form-check")
    let equipArray = []

    for(i = 0; i < equipment.length; i++){
        if (equipment[i].children[0].checked) {
            if (equipment[i].children[0].id == 'equip-other'){
                equipArray.push(document.getElementById("other-equipment-name").value)
            }else{
                equipArray.push(equipment[i].children[0].value);
            }
            
		}
    }
    cocktailDetails.equipment = equipArray;

    if (valid){
        console.log(cocktailDetails)
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/c/cocktail_processing', true);
        xhr.setRequestHeader('content-type', 'application/json; charset=UTF-8');
        xhr.send(JSON.stringify(cocktailDetails));
        xhr.onloadend = function () {
            console.log("confirm")
        };
    }
    else{
        alert("show errors")
    }

    
}
