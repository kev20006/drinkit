/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const viewCocktail = (trigger, event) => {
  if (![...event.target.classList].includes('clickable')) {
    window.location.href = trigger.dataset.hyperlink;
  }
};
// update the timestamps from js date strings to human readable dates
[...document.querySelectorAll('.timestamp')].forEach(element => {
  element.innerText = formatDate(new Date(element.innerText));
});
