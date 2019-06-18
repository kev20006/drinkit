let genCommentHTML = (comment) => {
    console.log(comment)
    let currentUser = document.getElementById("spirit-tags").children[0].dataset.user
    console.log(`current user is: ${currentUser}`)
    let upVoteButton = document.createElement("i");
    upVoteButton.className = "far fa-arrow-alt-circle-up"
    upVoteButton.setAttribute("data-user", currentUser)
    upVoteButton.setAttribute("data-id", comment._id.$oid)

    if (comment.votes.upvotes.includes(currentUser)) {
        upVoteButton.className += " voted";
        upVoteButton.addEventListener("click", function () { vote(this, "up", "comments") });
    }
    else {
        upVoteButton.addEventListener("click", function () { vote(this, "up", "comments") });
    }

    let downVoteButton = document.createElement("i");
    downVoteButton.className = "far fa-arrow-alt-circle-down"
    downVoteButton.setAttribute("data-user", currentUser)
    downVoteButton.setAttribute("data-id", comment._id.$oid)
    if (comment.votes.downvotes.includes(currentUser)) {
        downVoteButton.className += " voted";
        downVoteButton.addEventListener("click", function () { vote(this, "down", "comments") });
    }
    else {
        downVoteButton.addEventListener("click", function () { vote(this, "down", "comments") });
    }

    let votes = document.createElement("span")
    votes.className = "votes"


    let commentHTML = document.createElement("div")
    commentHTML.innerHTML =
        `
            <div class="card my-2 comment ">
                <div class="row mx-0">
                    <div class="comment-body col-12 pr-0">
                        <p><span class="author">[comment by]</span> - <span class="time"></span></p>
                        <p class="comment-content"></p>
                        <div class="d-flex justify-content-between">
                        <div class="vote-controls">
                        </div>
                         <div>
                            <button type="button" class="btn btn-outline-primary reply-btn" onclick="reply(this)">Reply</button> 
                            <button type="button" class="btn btn-outline-danger"> Report </button>
                        </div>
                    </div>
                    <div class="d-none col-12 reply">
                        <div class="col-12 mt-2">
                            <div class="card-content">
                                <textarea class="col-12"></textarea>
                            </div>
                            <div>
                                <button type="button" class="btn btn-primary ml-auto reply-button" 
                                onclick="addComment(this)">Reply</button>
                            </div>
                        </div>
                    </div>
                    <div class="responses">
                    </div>
                </div>
            </div>
        `
    commentHTML.querySelector(".comment").id = comment._id.$oid;
    commentHTML.querySelector(".author").innerHTML = comment.user_info[0].username;
    commentHTML.querySelector(".comment-content").innerHTML = comment.comment;
    commentHTML.querySelector(".time").innerHTML = formatDate(new Date(comment.created_at));
    commentHTML.querySelector(".reply-button").dataset.parent = comment._id.$oid;
    commentHTML.querySelector(".reply-button").dataset.cocktail = comment.cocktail_id.$oid;
    commentHTML.querySelector(".reply-button").dataset.user = currentUser;
    if (currentUser) commentHTML.querySelector(".vote-controls").appendChild(upVoteButton);
    commentHTML.querySelector(".vote-controls").appendChild(votes);
    commentHTML.querySelector(".votes").innerHTML = comment.votes.upvotes.length - comment.votes.downvotes.length;
    if (currentUser) commentHTML.querySelector(".vote-controls").appendChild(downVoteButton);
    return commentHTML
}

let reply = (trigger) => {
    let reply = trigger.parentNode.parentNode.parentNode.querySelector(".reply")
    reply.classList.toggle("d-none")
}

let updateComments = () => {
    let commentContainer = document.querySelector("#comments-area")
    fetch(`/api/comments/${commentContainer.dataset.cocktail}`)
        .then((response) => response.json())
        .then(data => {
            if (data.length == 0) {
                commentContainer.textContent = "No Comments on this Cocktail"
            }
            else {
                commentContainer.textContent = ""

                data.forEach(comment => {
                    console.log(comment)
                    let commentHTML = genCommentHTML(comment)
                    if (comment.parent == "") {
                        commentContainer.appendChild(commentHTML)
                    }
                    else {
                        let responses = document.getElementById(comment.parent.$oid);
                        responses.querySelector(".responses").appendChild(commentHTML);
                    }

                })
            }
        })
}


let addComment = (trigger) => {
    if (trigger.parentNode.parentNode.parentNode.classList.contains("reply")) {
        trigger.parentNode.parentNode.parentNode.classList.toggle("d-none")
    }
    let comment = {}
    comment.comment = trigger.parentNode.parentNode.children[0].children[0].value
    comment.cocktail = trigger.dataset.cocktail
    comment.user_id = trigger.dataset.user
    if (trigger.dataset.parent) {
        comment.parent = trigger.dataset.parent
    }
    fetch("/add_comment/", {
        method: 'post',
        body: JSON.stringify(comment),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            updateComments()
        })
}
updateComments()