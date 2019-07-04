/* eslint-disable no-param-reassign */
// Loader function to load all the details from the APIs

/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

const fillItemPreviews = (data, prefix) => {
  data.forEach(element => {
    if (document.querySelector(`.${prefix}-${element._id.$oid}`)) {
      [...document.querySelectorAll(`.${prefix}-${element._id.$oid}`)].forEach(tag => {
        tag.innerText = prefix === 'user' ? element.username : element.name;
        tag.parentNode.dataset.name = prefix === 'user' ? element.username : element.name;
      });
    }
  });
};

const fillFaveMenus = (data, prefix) => {
  data.forEach(element => {
    if (document.querySelector(`.${prefix}-${element._id.$oid}`)) {
      document.querySelector(`.${prefix}-${element._id.$oid}`).innerText = element.name;
      document
        .querySelector(`.${prefix}-${element._id.$oid}`)
        .closest('li')
        .querySelector('.delete-wrapper').dataset.name = element.name;
      if (prefix === 'sc') {
        document
          .querySelector(`.${prefix}-${element._id.$oid}`)
          .closest('li')
          .querySelector('i').dataset.name = element.name;
      }
      if (prefix !== 'sc') {
        const search = prefix === 'ff' ? 'flavor' : 'ingredient';
        document.querySelector(`.${prefix}-${element._id.$oid}`).href = `/filter/${search}/${
          element.name
        }`;
      }
    }
  });
};

// eslint-disable-next-line no-unused-vars
const populateBrowser = async () => {
  document.querySelector('#quick-filters').innerHTML = '';
  loading(document.querySelector('#quick-filters'), 'fetching ingredients');

  // make all API calls in parallel
  const [cocktails, flavors, ingredients, spirits, users] = await Promise.all([
    fetch('/api/cocktails/').then(response => response.json()),
    fetch('/api/flavors/').then(response => response.json()),
    fetch('/api/ingredients/').then(response => response.json()),
    fetch('/api/ingredients/spirit').then(response => {
      document.querySelector('#quick-filters').innerHTML = '';
      return response.json();
    }),
    fetch('/api/users/').then(response => response.json())
  ]);

  // use api results to update the app

  // populate favorites
  fillFaveMenus(cocktails, 'sc');
  fillFaveMenus(flavors, 'ff');
  fillFaveMenus(ingredients, 'fi');

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

  ingredients.forEach(ingredient => {
    // populate adv. filter
    document.querySelector(`#ingredients-filter-${ingredient.type}`).innerHTML += `<span id="${
      ingredient._id.$oid
    }" class="spirit" onclick="addToFilter(this, 'ingredient_list')">${ingredient.name}</span>`;
  });

  // fill in preview details
  fillItemPreviews(flavors, 'flav');
  fillItemPreviews(ingredients, 'ing');
  fillItemPreviews(users, 'user');

  // populate starred cocktails

  // populate tags
  if (typeof updateFlavorTags === 'function') {
    updateFlavorTags(flavors);
    updateIngredientTags(ingredients);
  }

  if (typeof editFlavorTags === 'function') {
    editFlavorTags(flavors);
  }

  // update ingredient names on the view cocktails pages
  if (document.querySelector('.ingredient-name')) {
    [...document.querySelectorAll('.ingredient-name')].forEach(tag => {
      const ingredientName = ingredients.filter(
        ingredient => ingredient._id.$oid === tag.dataset.id
      );
      tag.textContent = ingredientName[0].name;
    });
  }
};
