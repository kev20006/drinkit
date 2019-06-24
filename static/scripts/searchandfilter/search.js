/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const search = (trigger, event) => {
  if (event.keyCode === 13) {
    document.querySelector('#no-results').innerHTML = ``;
    const typeList = ['cocktails', 'users', 'flavors', 'ingredients'];
    if (trigger.value === '') {
      typeList.forEach(() => {
        document.querySelector(`#no-results`).innerHTML = `<p>please enter Search Criteria</p>`;
      });
    } else {
      document.querySelector(`#no-results`).innerHTML =
        `<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>` +
        `submitting...`;
      typeList.forEach(type => {
        document.querySelector(`#${type}-results`).innerHTML = ``;
        fetch(`/search/${type}/${trigger.value}`)
          .then(response => response.json())
          .then(data => {
            document.querySelector(`#no-results`).innerHTML = '';
            if (!data.length < 1) {
              const title = document.createElement('li');
              title.innerHTML = `<strong>${type}</strong>`;
              title.className = 'list-group-item pink mb-2 result-title';
              document.querySelector(`#${type}-results`).appendChild(title);
              data.forEach(element => {
                const newItem = createItem(type, element);
                document.querySelector(`#${type}-results`).appendChild(newItem);
              });
            }
          })
          .then(() => {
            // catch no results returned
            if (
              !document.querySelector(`#cocktails-results`).hasChildNodes() &&
              !document.querySelector(`#users-results`).hasChildNodes() &&
              !document.querySelector(`#flavors-results`).hasChildNodes() &&
              !document.querySelector(`#ingredients-results`).hasChildNodes()
            ) {
              document.querySelector('#no-results').textContent = 'No Results Found';
            } else {
              document.querySelector('#no-results').textContent = '';
            }
          })
          .catch(error => error);
      });
    }
  }
};

const createItem = (type, item) => {
  const newItem = document.createElement('li');
  newItem.className = 'list-group-item';
  switch (type) {
    case 'cocktails':
      newItem.innerHTML = `<a href="/cocktail/${item._id.$oid}">${item.name}</a>`;
      break;
    case 'users':
      newItem.innerHTML = `<a href="/user_profile/${item._id.$oid}">${item.username}</a>`;
      break;
    case 'ingredients':
      newItem.innerHTML = `<a href="/filter/ingredient/${item.name}">${item.name}</a>`;
      break;
    case 'flavors':
      newItem.innerHTML = `<a href="/filter/flavor/${item.name}">${item.name}</a>`;
      break;
    default:
      return false;
  }
  return newItem;
};
