const login = (trigger) => {
    loading(trigger, "logging in")
    fetch('/login/', {
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({
            username: document.querySelector("#username").value,
            password: document.querySelector("#password").value
        })
    })
        .then(
            response => response.json())
        .then(data => {
            if (data.message === "Successful Login") {
                location.reload();
            }
            else {
                document.querySelector("#login-error-message").innerText = data.message;
                trigger.textContent = "login"
            }
        })
}