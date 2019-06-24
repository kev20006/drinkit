/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
const addFavorite = (trigger, type) => {
  let textContent;
  if (type.split('_')[1] === 'cocktails') {
    textContent = '';
  } else {
    textContent = trigger.dataset.name;
  }
  const icon = trigger.classList[1];
  const parentElement = trigger.parentNode;
  parentElement.innerHTML = textContent;
  fetch('/update/favorite_things/', {
    method: 'post',
    body: JSON.stringify({
      type,
      user: trigger.dataset.user,
      item_id: trigger.dataset.id,
      action: 'add'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    const allTags = document.getElementsByClassName(type.split('_')[1]);
    if (type.split('_')[1] === 'cocktails') {
      parentElement.innerHTML =
        `<i class="fas ${icon}" data-id="${trigger.dataset.id}"` +
        `data-user="${trigger.dataset.user}" data-name="${trigger.dataset.name}"` +
        `onclick="removeFavorite(this, '${type}')" ></i>`;
    } else {
      for (let i = 0; i < allTags.length; i += 1) {
        if (
          allTags[i].children.length === 0 ||
          allTags[i].children[0].dataset.name === trigger.dataset.name
        ) {
          allTags[i].innerHTML = `${textContent}<i class="fas ${icon}" data-id="${
            trigger.dataset.id
          }" 
                                data-user="${trigger.dataset.user}" data-name="${
            trigger.dataset.name
          }" 
                                onclick="removeFavorite(this, '${type}')" ></i>`;
        }
      }
    }
  });
};

const removeFavorite = (trigger, type) => {
  let textContent;
  if (type.split('_')[1] === 'cocktails') {
    textContent = '';
  } else {
    textContent = trigger.dataset.name;
  }
  const icon = trigger.classList[1];
  const parentElement = trigger.parentNode;
  parentElement.innerHTML = textContent;
  fetch('/update/favorite_things/', {
    method: 'post',
    body: JSON.stringify({
      type,
      user: trigger.dataset.user,
      item_id: trigger.dataset.id,
      action: 'remove'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    const allTags = document.getElementsByClassName(type.split('_')[1]);
    if (type.split('_')[1] === 'cocktails') {
      parentElement.innerHTML = `<i class="far ${icon}" data-id="${trigger.dataset.id}" 
                                data-user="${trigger.dataset.user}" data-name="${
        trigger.dataset.name
      }" 
                                onclick="addFavorite(this, '${type}')" ></i>`;
    } else {
      for (let i = 0; i < allTags.length; i += 1) {
        if (
          allTags[i].children.length === 0 ||
          allTags[i].children[0].dataset.name === trigger.dataset.name
        ) {
          allTags[i].innerHTML = `${textContent}<i class="far ${icon}" data-id="${
            trigger.dataset.id
          }" 
                                data-user="${trigger.dataset.user}" data-name="${
            trigger.dataset.name
          }" 
                                onclick="addFavorite(this, '${type}')" ></i>`;
        }
      }
    }
  });
};
