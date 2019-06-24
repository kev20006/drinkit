/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const generateMiniCocktailCard = cocktail => {
  const template = document.createElement('div');
  template.className = 'col-12 col-md-6';
  template.innerHTML = `
        <div id="${cocktail._id.$oid}"class="d-flex w-100">
            <div class="image-wrapper mr-2">
                <img class="img-thumbnail" style="height:100px; width:100px"
                    src="" />
            </div>
            <div class="w-100 text-right pr-2">
                <h5 class="name"><a><strong></strong></a></h5>
                <p>Date</p>
                <div class="contols d-flex justify-content-end"></div>
            </div>


        </div>
    `;
  template.querySelector('.image-wrapper img').src = cocktail.image_url;
  template.querySelector('.name a').href = `/cocktail/${cocktail._id.$oid}`;
  template.querySelector('.name strong').innerText = cocktail.name;
  template.querySelector('.name').parentNode.children[1].innerText = formatDate(
    new Date(cocktail.created_at)
  );
  if (userId === sessionId) {
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-primary btn-sm';
    editButton.innerHTML = `edit <i class="fas fa-pen"></i>`;
    editButton.addEventListener('click', () => {
      editButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> loading...`;
      window.location.replace(`/cocktail/edit/${cocktail._id.$oid}`);
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.innerHTML = `delete <i class="fas fa-trash"></i>`;
    deleteButton.addEventListener('click', e => {
      deleteButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> deleting...`;
      fetch('/cocktail/delete', {
        method: 'post',
        body: JSON.stringify({
          object_id: cocktail._id.$oid
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        window.location.reload();
      });
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
