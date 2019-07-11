/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const userId = document.querySelector('#user-card').dataset.id;
const sessionId = document.querySelector('#user-card').dataset.sessionid;

const confirmDelete = trigger => {
  console.log(trigger);
  const account =
    `your account, there is no undoing this action. ` +
    `Any cocktails attached to this account will not be delete, if you ` +
    `wish to remove any cocktails, please delete them first then repeat this action`;
  const { id, name, type } = trigger.dataset;
  document.querySelector('.delete-name').textContent = type === 'user' ? account : name;
  document.querySelector('#delete').addEventListener('click', () => {
    loading(trigger, 'deleting');
    fetch(`/${type}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          if (type === 'user') {
            window.location.replace('/');
          } else {
            window.location.reload();
          }
        } else {
          document.querySelector('#delete-error').textContent = 'could not delete';
        }
      });
  });
};

const generateMiniCocktailCard = cocktail => {
  const template = document.createElement('div');
  template.className = 'col-12 col-md-6 py-1';
  template.innerHTML =
    `<div id="${cocktail._id.$oid}"class="d-flex w-100">` +
    `<div class="image-wrapper mr-2">` +
    `<img onerror="this.onerror=null;this.src='../static/images/placeholder.jpg';" class="cocktail-preview img-thumbnail"` +
    `style="height:100px; width:100px" />` +
    `</div>` +
    `<div class="w-100 text-right pr-2">` +
    `<h5 class="name"><a><strong></strong></a></h5>` +
    `<p>Date</p>` +
    `<div class="contols d-flex justify-content-end"></div>` +
    `</div>` +
    `</div>`;
  template.querySelector('.image-wrapper img').src = cocktail.image_url;
  template.querySelector('.name a').href = `/cocktails/${cocktail._id.$oid}`;
  template.querySelector('.name strong').innerText = cocktail.name;
  template.querySelector('.name').parentNode.children[1].innerText = formatDate(
    new Date(cocktail.created_at)
  );
  if (userId === sessionId) {
    const editButton = document.createElement('button');
    editButton.className = 'sort-btn';
    editButton.innerHTML = `edit <i class="fas fa-pen"></i>`;
    editButton.addEventListener('click', () => {
      editButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> loading...`;
      window.location.replace(`/cocktail/edit/${cocktail._id.$oid}`);
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerHTML = `delete <i class="fas fa-trash"></i>`;
    deleteButton.dataset.toggle = 'modal';
    deleteButton.dataset.target = '#delete';
    deleteButton.dataset.id = cocktail._id.$oid;
    deleteButton.dataset.name = cocktail.name;
    deleteButton.dataset.type = 'cocktail';
    deleteButton.addEventListener('click', () => {
      confirmDelete(deleteButton);
    });
    template.querySelector('.contols').appendChild(editButton);
    template.querySelector('.contols').appendChild(deleteButton);
  }
  return template;
};

fetch(`/api/cocktails/${userId}`)
  .then(response => response.json())
  .then(data => {
    document.querySelector('#users-cocktails').innerHTML = '';
    data.forEach(cocktail => {
      document.querySelector('#users-cocktails').appendChild(generateMiniCocktailCard(cocktail));
    });
  });
