/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const getFormDetails = (trigger, type) => {
  trigger.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    submitting...`;
  trigger.enabled = false;
  let valid = true;
  let fetchString;
  const cocktailDetails = {};
  if (type === 'update') {
    cocktailDetails.id = document.querySelector('#name').dataset.id;
    fetchString = `/update/cocktail/`;
  } else {
    fetchString = '/cocktails/';
  }
  if (document.getElementById('name').value !== '') {
    document.querySelector('#name-error').textContent = '';
    cocktailDetails.name = document.getElementById('name').value;
  } else {
    document.querySelector('#name-error').textContent = 'Please name your cocktail';
    valid = false;
  }
  if (document.getElementById('image-url').value !== '') {
    document.querySelector('#image-error').textContent = '';
    cocktailDetails.image_url = document.getElementById('image-url').value;
  } else {
    document.querySelector('#image-error').textContent = 'Please Enter a URL';
    valid = false;
  }
  if (document.getElementById('description').value !== '') {
    document.querySelector('#description-error').textContent = '';
    cocktailDetails.description = document.getElementById('description').value;
  } else {
    valid = false;
    document.querySelector('#description-error').textContent = 'Please type a description';
  }

  cocktailDetails.flavors = addedFlavors;

  const ingredientsTable = document.getElementById('ingredients-table').children;
  document.querySelector('#ingredients-error').textContent = '';
  cocktailDetails.ingredients = [];
  for (let i = 0; i < ingredientsTable.length; i += 1) {
    const name = ingredientsTable[i].children[1].children[1].value;
    const quantity = ingredientsTable[i].children[2].children[1].value.split(' ')[0];
    let units = 'none';
    if (ingredientsTable[i].children[2].children[1].value.split(' ').length === 2) {
      units = ingredientsTable[i].children[2].children[1].value.split(' ')[1];
    }
    const type = ingredientsTable[i].querySelectorAll('select')[0].value;
    if (name !== '' && quantity !== '' && units !== '' && type !== '') {
      cocktailDetails.ingredients.push({
        name: name.toLowerCase(),
        quantity,
        units,
        type
      });
    }
  }
  if (cocktailDetails.ingredients.length === 0) {
    document.querySelector('#ingredients-error').textContent = 'please add some ingredients';
    valid = false;
  }
  if (document.getElementById('glass').value !== '') {
    cocktailDetails.glass = document.getElementById('glass').value;
  }

  const instructions = document.getElementById('step-by-step').children;
  cocktailDetails.instructions = [];
  document.querySelector('#instructions-error').textContent = '';
  for (let i = 0; i < instructions.length; i += 1) {
    if (instructions[i].children[0].value !== '') {
      cocktailDetails.instructions.push(instructions[i].children[0].value);
    }
  }
  if (cocktailDetails.instructions.length === 0) {
    document.querySelector('#instructions-error').textContent = 'please add some instructions';
    valid = false;
  }

  const equipment = document.getElementsByClassName('form-check');
  const equipArray = [];

  for (let i = 0; i < equipment.length; i += 1) {
    if (equipment[i].children[0].checked) {
      if (equipment[i].children[0].id === 'equip-other') {
        equipArray.push(document.getElementById('other-equipment-name').value);
      } else {
        equipArray.push(equipment[i].children[0].value);
      }
    }
  }
  cocktailDetails.equipment = equipArray;

  if (valid) {
    fetch(fetchString, {
      method: 'POST',
      body: JSON.stringify(cocktailDetails),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      window.location.replace('/');
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trigger.innerHTML = `<i class="fas fa-cocktail"></i>submit drink`;
  }
};
