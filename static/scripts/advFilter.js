//populate flavors on filters

fetch("/api/flavors/")
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
        data.forEach(flavor => {
            document.querySelector(`#flavor-filter`)
                .innerHTML += `<span id="${flavor._id.$oid}" class="spirit">${flavor.name}</span>`
        })
    })

fetch("/api/ingredients/")
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
        console.log(data)
        data.forEach(ingredient =>{
            document.querySelector(`#ingredients-filter-${ingredient.type}`)
                .innerHTML += `<span id="${ingredient._id.$oid}" class="spirit">${ingredient.name}</span>`
        })
    })  