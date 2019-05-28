//populate flavors on filters
let filters = {
    flavor_list: [],
    ingredient_list: [],
    type: "or"
}

fetch("/api/flavors/")
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
        data.forEach(flavor => {
            document.querySelector(`#flavor-filter`)
                .innerHTML += `<span id="${flavor._id.$oid}" class="spirit" onclick="addToFilter(this, 'flavor_list')">${flavor.name}</span>`
        })
    })

fetch("/api/ingredients/")
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
        console.log(data)
        data.forEach(ingredient =>{
            document.querySelector(`#ingredients-filter-${ingredient.type}`)
                .innerHTML += `<span id="${ingredient._id.$oid}" class="spirit" onclick="addToFilter(this, 'ingredient_list')">${ingredient.name}</span>`;
        })
    })  

const addToFilter = (target, category) => {
    if (target.classList.contains("selected")){
        for (var i = 0; i < filters[category].length; i++) {
            if (filters[category][i] === target.id) {
                filters[category].splice(i, 1);
            }
        }
        target.classList.remove("selected")
    }
    else{
        filters[category].push(target.id)
        target.classList.add("selected")
        getResultCount()
    }
}

const getResultCount = () =>{
    filters.type = document.querySelector('input[name="and-or"]:checked').value;
    fetch('/advanced_filter/count', {
        method: 'post',
        body: JSON.stringify(filters)
    })
    .then((response)=> response.json())
    .then((data) => {
        console.log(data)
        document.querySelector("#no-of-results").innerHTML = data.count
        
    });
}

const getResults = () =>{
    fetch('/advanced_filter', {
        method: 'post',
        body: JSON.stringify(filters)
    })
    .then((response) => window.location.replace(response.url))
}