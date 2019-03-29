let getFormDetails = () => {
    let cocktailDetails= {}
    if(document.getElementById("name").value != ""){
        cocktailDetails.name = document.getElementById('name').value; 
    }
    if (document.getElementById("image-url").value != "") {
        cocktailDetails.image_url = document.getElementById('image-url').value;
    }
    if (document.getElementById('description').value != '') {
        cocktailDetails.image_url = document.getElementById('description').value;
    }
    if (document.getElementById('flavors').value != ''){
        let flavors = document.getElementById('flavors').value;
        flavors = flavors.split(", ")
        cocktailDetails.flavors = flavors;
    } 
    let ingredientsTable = document.getElementById('ingredients-table').children;
    console.log(ingredientsTable);
    cocktailDetails.ingredients = []
    for (let i = 0; i < ingredientsTable.length; i++) {
        cocktailDetails.ingredients.push({
            name: ingredientsTable[i].children[0].textContent,
            quantity: ingredientsTable[i].children[2].textContent.split(' ')[0],
            units: ingredientsTable[i].children[2].textContent.split(' ')[1],
            type: ingredientsTable[i].children[1].textContent
        });
	}
    if (document.getElementById("glass").value != ''){
        cocktailDetails.glass = document.getElementById('glass').value; 
    }

    let instructions = document.getElementById("step-by-step").children;
    cocktailDetails.instructions = [];
    for (let i = 0; i < instructions.length; i++){
        cocktailDetails.instructions.push(instructions[i].children[0].value)
    }

    console.log(cocktailDetails);
}
