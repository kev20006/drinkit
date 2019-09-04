/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */

// Globals to Store Search Filters
const filters = {
  flavor_list: [],
  ingredient_list: [],
  type: 'or'
};

const addToFilter = (target, category) => {
  if (target.classList.contains('selected')) {
    for (let i = 0; i < filters[category].length; i += 1) {
      if (filters[category][i] === target.id) {
        filters[category].splice(i, 1);
      }
    }
    target.classList.remove('selected');
    getResultCount();
  } else {
    filters[category].push(target.id);
    target.classList.add('selected');
    getResultCount();
  }
};

const getResultCount = () => {
  filters.type = document.querySelector('input[name="and-or"]:checked').value;
  fetch('/advanced_filter/count', {
    method: 'post',
    body: JSON.stringify(filters)
  })
    .then(response => response.json())
    .then(data => {
      document.querySelector('#no-of-results').innerHTML = data.count;
    });
};

const getResults = () => {
  fetch('/advanced_filter', {
    method: 'post',
    body: JSON.stringify(filters)
  })
    .then(response => response.json())
    .then(data => {
      window.location.assign(data.url);
    });
};
