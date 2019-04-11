fetch('/api/flavors/')
    .then((response) => response.json())
    .then(data => {
        console.log(data);
        let tags = document.getElementById("flavor-tags").children
        console.log(tags)
        for (i = 0; i < tags.length; i++) {
            let action = ""
            if (tags[i].children[1]) {
                action = tags[i].children[1].dataset.action
            }
            let tagContents = data.filter(element => element._id.$oid == tags[i].dataset.id)
            tags[i].innerHTML = tagContents[0].name
            console.log(tags[i].dataset.user)
            if (tags[i].dataset.user) {
                if (action == "remove") {
                    tags[i].innerHTML += `<i class="fas fa-heart" data-id="${tagContents[0]._id.$oid}}" data-name="${tagContents[0].name}" data-user="${tags[i].dataset.user}"
                        onclick="removeFavorite(this , 'favorite_flavors')"></i>`
                }
                else {
                    tags[i].innerHTML += `<i class="far fa-heart" data-id="${tagContents[0]._id.$oid}}" data-name="${tagContents[0].name}" data-user="${tags[i].dataset.user}"
                        onclick="addFavorite(this , 'favorite_flavors')"></i>`
                }
            }
        }
    });

fetch('/api/ingredients/')
    .then((response) => response.json())
    .then(data => {
        let tags = document.getElementById("spirit-tags").children
        for (i = 0; i < tags.length; i++) {
            let action = ""
            if (tags[i].children[1]) {
                action = tags[i].children[1].dataset.action
            }
            console.log(action)
            let tagContents = data.filter(element => element._id.$oid == tags[i].dataset.id)

            tags[i].innerHTML = tagContents[0].name

            if (tags[i].dataset.user) {
                if (action == "remove") {
                    tags[i].innerHTML += `<i class="fas fa-heart" data-id="${tagContents[0]._id.$oid}}" data-name="${tagContents[0].name}" data-user="${tags[i].dataset.user}"
                        onclick="removeFavorite(this , 'favorite_ingredients')"></i>`
                }
                else if (action) {
                    tags[i].innerHTML += `<i class="far fa-heart" data-id="${tagContents[0]._id.$oid}}" data-name="${tagContents[0].name}" data-user="${tags[i].dataset.user}"
                        onclick="addFavorite(this , 'favorite_ingredients')"></i>`
                }
            }
        }
        let ingredientList = document.getElementById("ingredient-list").children
        for (i = 0; i < ingredientList.length; i++) {
            let ingredientName = data.filter(element => element._id.$oid == ingredientList[i].children[0].dataset.id)
            ingredientList[i].children[0].innerText = ingredientName[0].name
        }
    });