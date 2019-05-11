//AJAX scripts to replace the ID's with values on the sidebar

fetch('/api/flavors/')
    .then((response) => response.json())
    .then(data => {
        [...document.querySelector("#flavor-list").children[1].children].forEach(li => {
            flavorName = data.filter(element => {
                return element._id.$oid == li.dataset.id
            })
            if (flavorName[0]) {
                li.innerText = flavorName[0].name
                li.innerHTML = `<a href="/v/flavor/${flavorName[0].name}">${flavorName[0].name}</a>`;
            } else {
                li.innerText = "flavor has been removed"
            }

        })
    })

fetch('/api/ingredients/')
    .then((response) => response.json())
    .then(data => {
        [...document.querySelector("#ingredient-list").children[1].children].forEach(li => {
            ingredientsName = data.filter(element => {
                return element._id.$oid == li.dataset.id
            })
            if (ingredientsName[0]) {
                li.innerHTML = `<a href="/v/ingredient/${ingredientsName[0].name}">${ingredientsName[0].name}</a>`;

            } else {
                li.innerText = "ingredients has been removed"
            }

        })
    })

let starred_ids = [...document.querySelector("#starred-list").children].map(element => element.innerText);
document.querySelector("#starred-list").innerHTML = "loading";
Promise.all(starred_ids.map(id => fetch(`/api/cocktail/${id}`)))
    .then(response => Promise.all(response.map(r => r.json())))
    .then(data => {
        document.querySelector("#starred-list").innerHTML = "";
        data.forEach(cocktail => {
            let listItem = document.createElement("li");
            listItem.classList = "list-group-item";
            listItem.innerHTML = `<a href="/v/cocktail/${cocktail._id.$oid}s>${cocktail.name}</a>`;
            document.querySelector("#starred-list").appendChild(listItem);
        })
    });