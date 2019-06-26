/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
const addToFaveList = (name, id, user, type) => {
  let prefix;
  let docId;
  if (type === 'favorite_flavors') {
    prefix = 'ff';
    docId = 'fave-flav';
  } else if (type === 'favorite_ingredients') {
    prefix = 'fi';
    docId = 'fave-ing';
  } else {
    prefix = 'sc';
    docId = 'starred-cocktails';
  }
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');
  listItem.innerHTML =
    `<div><a class="${prefix}-${id}">${name}</div>` +
    `<div data-id="${id}" user-id="${user}"` +
    `onclick="removeFavoriteFromList(this, ${type})">` +
    `<i class="fas fa-trash-alt"></i>` +
    `</div>` +
    `</li>`;
  document.querySelector(`#${docId}`).appendChild(listItem);
};

const addFavorite = (trigger, type) => {
  const textContent = type.split('_')[1] === 'cocktails' ? '' : trigger.dataset.name;
  const { user, id, name } = trigger.dataset;
  const targetElement = type.split('_')[1] === 'cocktails' ? trigger.parentNode : trigger;
  const icon = trigger.querySelector('i')
    ? trigger.querySelector('i').classList[1]
    : trigger.classList[1];
  loading(targetElement, textContent);

  fetch('/update/favorite_things/', {
    method: 'post',
    body: JSON.stringify({
      type,
      user,
      item_id: id,
      action: 'add'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    addToFaveList(name, id, user, type);
    const allTags = document.getElementsByClassName(type.split('_')[1]);
    if (type.split('_')[1] === 'cocktails') {
      targetElement.innerHTML =
        `<i class="fas ${icon}" data-name="${name}" data-id="${id}"` +
        `data-user="${user}" onclick=removeFavorite(this, ${type})></i>`;
    } else {
      for (let i = 0; i < allTags.length; i += 1) {
        if (allTags[i].dataset.name === name) {
          allTags[i].innerHTML =
            `${textContent}<i class="fas ${icon}"` +
            `data-id="${id}" ` +
            `data-user="${user}"` +
            `</i>`;
          allTags[i].onclick = () => {
            removeFavorite(allTags[i], type);
          };
        }
      }
    }
  });
};

const removeFavorite = (trigger, type) => {
  const textContent = type.split('_')[1] === 'cocktails' ? '' : trigger.dataset.name;
  const { user, id, name } = trigger.dataset;
  const targetElement = type.split('_')[1] === 'cocktails' ? trigger.parentNode : trigger;
  const icon = trigger.querySelector('i')
    ? trigger.querySelector('i').classList[1]
    : trigger.classList[1];
  loading(targetElement, textContent);
  fetch('/update/favorite_things/', {
    method: 'post',
    body: JSON.stringify({
      type,
      user,
      item_id: id,
      action: 'remove'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    const allTags = document.getElementsByClassName(type.split('_')[1]);
    if (type.split('_')[1] === 'cocktails') {
      // remove from favorites list
      targetElement.innerHTML =
        `<i class="far ${icon}" data-name="${name}" data-id="${id}" ` +
        `data-user="${user}" onclick="addFavorite(this, ${type})"` +
        `</i>`;
    } else {
      for (let i = 0; i < allTags.length; i += 1) {
        if (allTags[i].dataset.name === name) {
          allTags[i].innerHTML =
            `${textContent}<i class="far ${icon}"` +
            `data-id="${id}" ` +
            `data-user="${user}"` +
            `</i>`;
          allTags[i].onclick = () => {
            addFavorite(allTags[i], type);
          };
        }
      }
    }
  });
};

const removeFavoriteFromList = (trigger, type) => {
  loading(trigger, '');
  const { user, id } = trigger.dataset;
  fetch('/update/favorite_things/', {
    method: 'post',
    body: JSON.stringify({
      type,
      user,
      item_id: id,
      action: 'remove'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    trigger.parentNode.parentNode.removeChild(trigger.parentNode);
  });
};
