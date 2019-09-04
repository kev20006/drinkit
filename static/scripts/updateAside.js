//AJAX scripts to replace the ID's with values on the sidebar

const updateAside = (data, location) => {
    [...document.querySelector(`#${location}-list`).children[1].children].forEach(li => {
        const name = data.filter(element => {
            return element._id.$oid == li.dataset.id
        })
        if (name[0]) {
            li.innerText = name[0].name
            li.innerHTML = `<a href="/filter/${location}/${name[0].name}">${name[0].name}</a>`;
        } else {
            removeItemFromDb("flavor", li.textContent)
            li.parentNode.removeChild(li)
        }

    })
}

removeItemFromDb = (type, itemId) =>{
    fetch("/update/favorite_things/", {
        method: 'post',
        body: JSON.stringify({
            "type": type,
            "user": document.getElementsByTagName("main")[0].dataset.id,
            "item_id": itemId,
            "action": "remove"
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


let starred_ids = [...document.querySelector("#starred-list").children].map(element => element.innerText);
console.log(starred_ids)
fetch("/api/cocktails/").then((response) => response.json()).then(data =>{
    data.forEach(cocktail => {
        if (starred_ids.includes(cocktail._id.$oid)){
            console.log(cocktail._id.$oid)
            document.getElementById(`${cocktail._id.$oid}`).innerHTML = `<a href="/cocktail/${cocktail._id.$oid}">${cocktail.name}</a>`
        }
    })
});