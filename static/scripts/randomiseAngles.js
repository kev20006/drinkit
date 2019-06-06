//script to randomise the rotation of block text page elements

[...document.querySelectorAll(".pink")].forEach(element => {
    element.style.transform = `rotate(${Math.floor(Math.random() * (2)) - 1}deg)`
});
[...document.querySelectorAll(".blue")].forEach(element => {
    element.style.transform = `rotate(${Math.floor(Math.random() * (2)) - 1}deg)`
});

[...document.querySelectorAll(".timestamp")].forEach(time => {
    time.innerText = formatDate(new Date(time.innerText))
});