let vote = (trigger, type) => {
    let fetchType = type
    if (trigger.classList.contains("voted")) {
        fetchType = "remove"
        trigger.classList.remove("voted")
        if (type == "up") {
            trigger.parentElement.children[1].innerText = parseInt(trigger.parentElement.children[1].innerText) - 1;
        }
        else {
            trigger.parentElement.children[1].innerText = parseInt(trigger.parentElement.children[1].innerText) + 1;
        }
    }
    else if (type == "up") {
        if (trigger.parentElement.children[2].classList.contains("voted")) {
            trigger.parentElement.children[2].classList.remove("voted");
            trigger.parentElement.children[1].innerText = parseInt(trigger.parentElement.children[1].innerText) + 1;
        }
        trigger.classList.add("voted");
        trigger.parentElement.children[1].innerText = parseInt(trigger.parentElement.children[1].innerText) + 1;
    }
    else if (type == "down") {
        if (trigger.parentElement.children[0].classList.contains("voted")) {
            trigger.parentElement.children[0].classList.remove("voted");
            trigger.parentElement.children[1].innerText = parseInt(trigger.parentElement.children[1].innerText) - 1;
        }
        trigger.classList.add("voted");
        trigger.parentElement.children[1].innerText = parseInt(trigger.parentElement.children[1].innerText) - 1;
    }

    fetch("/u/like_dislike", {
        method: 'post',
        body: JSON.stringify({
            "type": fetchType,
            "user_id": trigger.dataset.user,
            "cocktail_id": trigger.dataset.id,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}