

let getIngredients = (trigger) =>{
    document.getElementById('ingredient-selector')
            .innerHTML = 'fetching ingredients...';
    let xhr = new XMLHttpRequest();
    xhr.onload = () =>{
        if (xhr.status >= 200 && xhr.status < 300){
            let target = document.getElementById('ingredient-selector')
            target.innerHTML = '';
            data = JSON.parse(xhr.response);
            let select = document.createElement("select")
            select.id = "ingredient-select"
            select.innerHTML = '<option disabled selected>Choose your option</option>';
            data.forEach(element => {
                select.innerHTML += `<option value="${element.name}">${element.name}</option>`;
            })
            select.innerHTML += `<option value="new">add new</option>`;
            let label= document.createElement('label');
            label.textContent = `type of ${trigger.value}`;
            select.onchange = (event)=>{
                if(event.target.value == "new"){
                    target.innerHTML = '';
                    ingredientInput = document.createElement("input");
                    ingredientInput.id = "ingredient-select";
                    ingredientInput.type = "text";
                    label.for = "ingredient-select";
                    label.textContent = "Enter New Ingredient";
                    target.appendChild(ingredientInput);
                    target.appendChild(label);
                }
            };
            target.appendChild(select);
            target.appendChild(label);
            var selectelems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(selectelems, {});        
        }
        else{
            console.log('The request failed!')
        }
    }

    xhr.open('GET', `/api/ingredients/${trigger.value}`);
    xhr.send();

}


let addToTable = () =>{
    console.log(document.getElementById('ingredient-select').value);
    console.log(document.getElementById('quantity').value);
    console.log(document.getElementById('type-selector').value);
    let htmlString = 
    `<tr>
        <td>${document.getElementById('ingredient-select').value}</td>
        <td>${document.getElementById('type-selector').value}</td>
        <td>${document.getElementById('quantity').value}</td>
    </tr>`
    document.getElementById('ingredients-table').innerHTML += htmlString;
} 

let newIngredient = (e) => {
    let htmlString = `
            <div class="row">
                <div class="input-field col s5">
                    <input id="ingredient-${index} class="ingredient" type="text">
                    <label for="ingredient-${index}">Ingredient</label>
                </div>
                <div class="input-field col s3">
                    <input id="quantity-${index}" type="text" class="quantity">
                    <label for="quantity-${index}">quantity</label>
                </div>
                <div class="input-field col s2">
                    <input id="units-${index}" type="text" class="quantity">
                    <label for="units-${index}">units</label>
                </div>
                <div class="input-field col s2">
                    <a class="waves-effect waves-teal btn-flat"><i id="add-${index}" class="far fa-plus-square" onclick="newIngredient(this)"></i></a>
                </div>
            </div>
        `;
    let div = document.createElement("div");
    div.className = "row";
    div.innerHTML = htmlString;
    document.getElementById("ingredients").append(div);

}

