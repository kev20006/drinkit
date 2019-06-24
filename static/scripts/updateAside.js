/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// AJAX scripts to replace the ID's with values on the sidebar

const removeItemFromDb = (type, itemId) => {
  fetch('/update/favorite_things/', {
    method: 'post',
    body: JSON.stringify({
      type,
      user: document.getElementsByTagName('main')[0].dataset.id,
      item_id: itemId,
      action: 'remove'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const updateAside = (data, location) => {
  [...document.querySelector(`#${location}-list`).children[1].children].forEach(li => {
    const name = data.filter(element => {
      return element._id.$oid === li.dataset.id;
    });
    if (name[0]) {
      li.innerText = name[0].name;
      li.innerHTML = `<a href="/filter/${location}/${name[0].name}">${name[0].name}</a>`;
    } else {
      removeItemFromDb('flavor', li.textContent);
      li.parentNode.removeChild(li);
    }
  });
};

const getCocktailName = data => {
  const starredIds = [...document.querySelector('#starred-list').children].map(
    element => element.innerText
  );
  document.querySelector('#starred-list').innerHTML = '';
  data.forEach(cocktail => {
    if (starredIds.includes(cocktail._id.$oid)) {
      document
        .querySelector('#starred-list')
        .append(`<a href="/cocktails/${cocktail._id.$oid}">${cocktail.name}</a>`);
    }
  });
};
