/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// toggle whole page modals
const toggleSearch = () => {
  document.querySelector('#search').classList.toggle('d-none');
};
const toggleAdvFilters = () => {
  document.querySelector('#adv-filter').classList.toggle('d-none');
};

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
let prevScrollpos = window.pageYOffset;
window.onscroll = () => {
  const currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById('nav').style.top = '0';
  } else {
    document.getElementById('nav').style.top = '-60px';
    document.getElementById('context-menu').classList.remove('show');
  }
  prevScrollpos = currentScrollPos;
};

const loading = (trigger, message = '') => {
  trigger.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${message}`;
};
