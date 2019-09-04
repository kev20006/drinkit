const validatePasswords = (trigger) => {
    loading(trigger, "creating account")
    let username = document.getElementById("new-username").value;
    let password1 = document.getElementById("new-password1").value;
    let password2 = document.getElementById("new-password2").value;
    document.getElementById("new-password1").value = "";
    document.getElementById("new-password2").value = "";
    if (password1 != password2) {
        event.preventDefault();
        trigger.innerText = "Sign Up"
        document.getElementById("password-error").innerHTML = `<strong class="red-text darken-2">Passwords did not match</strong>`;
    }
    else if (password1 == "" || password2 == ""){
        event.preventDefault();
        trigger.innerText = "Sign Up"
        document.getElementById("password-error").innerHTML = `<strong class="red-text darken-2">No Password Entered</strong>`;
    }
    else {
        event.preventDefault();
        fetch(`/api/check_user/${username}`)
            .then((response) => {
                response.text().then((text)=> {
                    if (text == "True"){
                        trigger.innerText = "Sign Up"
                        document.getElementById("password-error").innerHTML = `<strong class="red-text darken-2">User already exists</strong>`; 
                    }
                    else{
                        document.getElementById("new-account").submit();
                    }
                });
            })
    }
}
