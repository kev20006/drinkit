let addFavorite = (trigger, type) => {
    let textContent;
    if (type.split("_")[1] == "cocktails") {
        textContent = "";
    } else {
        textContent = trigger.dataset.name
    }
    let icon = trigger.classList[1]
    let parentElement = trigger.parentNode
    parentElement.innerHTML = textContent;
    fetch("/u/favorite_things/", {
        method: 'post',
        body: JSON.stringify({
            "type": type,
            "user": trigger.dataset.user,
            "item_id": trigger.dataset.id,
            "action": "add"
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            let allTags = document.getElementsByClassName(type.split("_")[1])
            if (type.split("_")[1] == "cocktails") {
                parentElement.innerHTML = `<i class="fas ${icon}" data-id="${trigger.dataset.id}"
                                data-user="${trigger.dataset.user}" data-name="${trigger.dataset.name}"
                                onclick="removeFavorite(this, '${type}')" ></i>`;
            } else {
                for (i = 0; i < allTags.length; i++) {

                    if (allTags[i].children.length == 0 || allTags[i].children[0].dataset.name == trigger.dataset.name) {
                        allTags[i].innerHTML =
                            `${textContent}<i class="fas ${icon}" data-id="${trigger.dataset.id}" 
                                data-user="${trigger.dataset.user}" data-name="${trigger.dataset.name}" 
                                onclick="removeFavorite(this, '${type}')" ></i>`
                    }
                }
            }

        });
}

let removeFavorite = (trigger, type) => {
    let textContent;
    if (type.split("_")[1] == "cocktails") {
        textContent = "";
    } else {
        textContent = trigger.dataset.name
    }
    let icon = trigger.classList[1]
    let parentElement = trigger.parentNode
    parentElement.innerHTML = textContent;
    fetch("/u/favorite_things/", {
        method: 'post',
        body: JSON.stringify({
            "type": type,
            "user": trigger.dataset.user,
            "item_id": trigger.dataset.id,
            "action": "remove"
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            let allTags = document.getElementsByClassName(type.split("_")[1])
            if (type.split("_")[1] == "cocktails") {
                parentElement.innerHTML = `<i class="far ${icon}" data-id="${trigger.dataset.id}" 
                                data-user="${trigger.dataset.user}" data-name="${trigger.dataset.name}" 
                                onclick="addFavorite(this, '${type}')" ></i>`
            }
            else {
                for (i = 0; i < allTags.length; i++) {
                    if (allTags[i].children.length == 0 || allTags[i].children[0].dataset.name == trigger.dataset.name) {
                        allTags[i].innerHTML =
                            `${textContent}<i class="far ${icon}" data-id="${trigger.dataset.id}" 
                                data-user="${trigger.dataset.user}" data-name="${trigger.dataset.name}" 
                                onclick="addFavorite(this, '${type}')" ></i>`
                    }
                }
            }

        });
}