validatePasswords = () => {
    let password1 = document.getElementById("new-password1").value;
    let password2 = document.getElementById("new-password2").value;
    if (password1 != password2) {
        event.preventDefault();
        document.getElementById("new-password1").value = "";
        document.getElementById("new-password2").value = "";
        document.getElementById("password-error").innerHTML = `<strong class="red-text darken-2">Passwords did not match</strong>`;
    } else {
        return true;
    }
}
/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("nav").style.top = "0";
    } else {
        document.getElementById("nav").style.top = "-50px";
    }
    prevScrollpos = currentScrollPos;
}