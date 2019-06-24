/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const getIngredients = trigger => {
  const idNumber = trigger.id.split('-')[2];
  document.getElementById(`label-ingredient-select-${idNumber}`).textContent =
    'fetching ingredients...';

  fetch(`/api/ingredients/${trigger.value}`)
    .then(response => response.json())
    .then(data => {
      const target = document.getElementById(`ingredient-selector-${idNumber}`);
      target.innerHTML = '';
      const select = document.createElement('select');
      select.id = `ingredient-select-${idNumber}`;
      select.classList = 'form-control';
      select.innerHTML = '';
      data.forEach(element => {
        select.innerHTML += `<option value="${element.name}">${element.name}</option>`;
      });
      select.innerHTML += `<option value="new">add new</option>`;
      const label = document.createElement('label');
      label.textContent = `type of ${trigger.value}`;
      label.id = `label-ingredient-select-${idNumber}`;
      label.for = `ingredient-select-${idNumber}`;
      select.onchange = event => {
        if (event.target.value === 'new') {
          target.innerHTML = '';
          ingredientInput = document.createElement('input');
          ingredientInput.id = `ingredient-select-${idNumber}`;
          ingredientInput.classList = 'form-control';
          ingredientInput.type = 'text';
          label.id = `label-ingredient-select-${idNumber}`;
          label.for = `ingredient-select-${idNumber}`;
          label.textContent = 'New Ingredient';
          target.appendChild(label);
          target.appendChild(ingredientInput);
        }
      };
      target.appendChild(label);
      target.appendChild(select);
    });
};

const addMore = () => {
  const ingredients = document.getElementById('ingredients-table');
  const nextIndex =
    parseInt(ingredients.children[ingredients.children.length - 1].id.split('-')[2], 10) + 1;
  const newRow = document.createElement('div');
  const help = document.querySelector('#flavorHelp');
  if (help) {
    help.parentNode.removeChild(help);
  }
  newRow.id = `ingredients-row-${nextIndex}`;
  newRow.classList = 'row mx-0 px-4';
  newRow.innerHTML = `
            <div class="col-md-4">
                <label for="type-selector-${nextIndex}">Type of Ingredient</label>
                <select id="type-selector-${nextIndex}" class="form-control" onchange="getIngredients(this);">
                    <option disabled>Choose your option</option>
                    <option value="spirit">Spirit</option>
                    <option value="garnish">Garnish</option>
                    <option value="mixer">Mixer</option>
                    <option value="others">Other</option>
                </select>
            </div>
            <div id="ingredient-selector-${nextIndex}" class="col-md-4">
                <label id="label-ingredient-select-${nextIndex}" for="ingredient-select-${nextIndex}" >Select Ingredient</label>
                <input id="ingredient-select-${nextIndex}" class="form-control" type="text" placeholder="select type first" disabled>
            </div>
                <div class="col-md-4">
                    <label for="quantity-${nextIndex}">quantity</label>
                    <input id="quantity-${nextIndex}" class="form-control" type="text" placeholder="quantity" onkeydown="next(this, event, addMore)">
                </div>
                <hr>
    `;
  ingredients.append(newRow);
};

const next = (target, event, callback) => {
  if (event.keyCode === 13 && !target.classList.contains('fired')) {
    callback();
    target.classList.add('fired');
  }
};

const newIngredient = () => {
  const htmlString = `
            <div class="row">
                <div class="input-field col s5">
                    <input id="ingredient-${index} class="ingredient" type="text">
                    <label for="ingredient-${index}">Ingredient</label>
                </div>
                <div class="input-field col s3">
                    <input id="quantity-${index}" type="text" class="quantity">
                    <label for="quantity-${index}">quantity</label>
                </div>
                <div class="input-field col s2">
                    <input id="units-${index}" type="text" class="quantity">
                    <label for="units-${index}">units</label>
                </div>
                <div class="input-field col s2">
                    <a class="waves-effect waves-teal btn-flat"><i id="add-${index}" class="far fa-plus-square" onclick="newIngredient(this)"></i></a>
                </div>
                <hr>
            </div>
        `;
  const div = document.createElement('div');
  div.className = 'row';
  div.innerHTML = htmlString;
  document.getElementById('ingredients').append(div);
  div.focus();
};
