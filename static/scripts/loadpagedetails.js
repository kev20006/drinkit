// Loader function to load all the details from the APIs

/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

const fillItemPreviews = (data, prefix) => {
  data.forEach(element => {
    if (document.querySelector(`.${prefix}-${element._id.$oid}`)) {
      [...document.querySelectorAll(`.${prefix}-${element._id.$oid}`)].forEach(tag => {
        tag.innerText = prefix === 'user' ? element.username : element.name;
        tag.dataset.name = prefix === 'user' ? element.username : element.name;
      });
    }
  });
};

// eslint-disable-next-line no-unused-vars
const populateBrowser = async () => {
  document.querySelector('#quick-filters').innerHTML = '';
  loading(document.querySelector('#quick-filters'), 'fetching ingredients');
  const cocktails = await fetch('/api/cocktails/').then(response => response.json());
  const flavors = await fetch('/api/flavors/').then(response => response.json());
  const ingredients = await fetch('/api/ingredients/').then(response => response.json());
  const spirits = await fetch('/api/ingredients/spirit').then(response => response.json());
  const users = await fetch('/api/users/').then(response => response.json());
  // populate drop down
  spirits.forEach(({ name }) => {
    document.querySelector(
      '#quick-filters'
    ).innerHTML += `<a class="dropdown-item" href="/filter/ingredient/${name}">${name}</a>`;
  });
  // populate adv. filter
  flavors.forEach(flavor => {
    document.querySelector(`#flavor-filter`).innerHTML += `<span id="${
      flavor._id.$oid
    }" class="spirit" onclick="addToFilter(this, 'flavor_list')">${flavor.name}</span>`;
  });

  // populate adv. filter
  ingredients.forEach(ingredient => {
    document.querySelector(`#ingredients-filter-${ingredient.type}`).innerHTML += `<span id="${
      ingredient._id.$oid
    }" class="spirit" onclick="addToFilter(this, 'ingredient_list')">${ingredient.name}</span>`;
  });

  // fill in preview details
  fillItemPreviews(flavors, 'flav');
  fillItemPreviews(spirits, 'ing');
  fillItemPreviews(users, 'user');

  if (typeof updateAside === 'function') {
    updateAside(flavors, 'flavor');
    updateAside(ingredients, 'ingredient');
    getCocktailName(cocktails);
  }
  // populate tags
  if (typeof updateFlavorTags === 'function') {
    updateFlavorTags(flavors);
    updateIngredientTags(ingredients);
  }

  if (typeof editFlavorTags === 'function') {
    editFlavorTags(flavors);
  }
};
