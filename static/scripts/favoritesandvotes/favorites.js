/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
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
  const icon = trigger.querySelector('i').classList[1];
  trigger.innerHTML = textContent;
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
    // add to favorites list
    const allTags = document.getElementsByClassName(type.split('_')[1]);
    if (type.split('_')[1] === 'cocktails') {
      trigger.innerHTML =
        `${trigger.dataset.name}` +
        `<i class="fas ${icon}" data-id="${trigger.dataset.id}"` +
        `data-user="${trigger.dataset.user}"`;
      trigger.onclick = () => {
        removeFavorite(trigger, type);
      };
    } else {
      for (let i = 0; i < allTags.length; i += 1) {
        if (allTags[i].dataset.name === trigger.dataset.name) {
          allTags[i].innerHTML =
            `${textContent}<i class="fas ${icon}"` +
            `data-id="${trigger.dataset.id}" ` +
            `data-user="${trigger.dataset.user}"` +
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
  let textContent;
  if (type.split('_')[1] === 'cocktails') {
    textContent = '';
  } else {
    textContent = trigger.dataset.name;
  }
  const icon = trigger.querySelector('i').classList[1];
  trigger.innerHTML = textContent;
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
      // remove from favorites list
      trigger.innerHTML =
        `${trigger.dataset.name}` +
        `<i class="far ${icon}" data-id="${trigger.dataset.id}" ` +
        `data-user="${trigger.dataset.user}"` +
        `</i>`;
      trigger.onlcick = () => {
        addFavorite(trigger, type);
      };
    } else {
      for (let i = 0; i < allTags.length; i += 1) {
        if (allTags[i].dataset.name === trigger.dataset.name) {
          allTags[i].innerHTML =
            `${textContent}<i class="far ${icon}"` +
            `data-id="${trigger.dataset.id}" ` +
            `data-user="${trigger.dataset.user}"` +
            `</i>`;
          allTags[i].onclick = () => {
            addFavorite(allTags[i], type);
          };
        }
      }
    }
  });
};
