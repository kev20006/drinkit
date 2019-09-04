/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const addFlavor = trigger => {
  const flavor = trigger.value;
  addedFlavors.push(flavor);
  document.querySelector('#flavors').innerHTML = '';
  addedFlavors.forEach(flavorName => {
    const newTag = document.createElement('div');
    newTag.className = 'flavors align-items-center d-flex my-0 mx-1';
    const crossIcon = document.createElement('i');
    crossIcon.addEventListener('click', e => {
      addedFlavors = addedFlavors.filter(element => {
        return element !== flavorName;
      });
      e.currentTarget.parentNode.remove();
    });
    crossIcon.className = 'fas fa-times ml-4 mr-1 my-0';
    const flavorText = document.createElement('p');
    flavorText.className = 'ml-1 my-0';
    flavorText.textContent = flavorName;
    newTag.appendChild(flavorText);
    newTag.appendChild(crossIcon);
    document.querySelector('#flavors').appendChild(newTag);
  });
  newInput = document.createElement('div');
  newInput.classList.add('flavors', 'mx-2', 'w-xs-50', 'w-md-30', 'w-lg-10', 'd-flex');
  newInput.innerHTML =
    `<input style="width:100%; border:none" id="flavor-input" ` +
    `placeholder="add +" oninput="addFlavorListener(this, event)" ` +
    `onkeypress="addFlavorListener(this, event)"> ` +
    `<div type="button" ` +
    `class="blue" onclick="addFlavorListener(document.querySelector('#flavor-input'), event)"> ` +
    `<i class="fas fa-plus"></i> ` +
    `</div>`;
  document.querySelector('#flavors').appendChild(newInput);
  newInput.querySelector('input').focus();
  document.querySelector('#flavor-list').classList.add('d-none');
};

const addFlavorListener = (trigger, event) => {
  // data list was opening on focus, adding datalist on first input as a work around
  if (event.type === 'input' && !trigger.attributes.list) {
    trigger.setAttribute('list', 'flavor-list');
  }
  if ((event.type === 'click' && trigger.value) || [13, 44].indexOf(event.keyCode) !== -1) {
    if (addedFlavors.includes(trigger.value)) {
      trigger.value = '';
    } else {
      addFlavor(trigger);
      trigger.value = '';
    }
  }
};

const unlockOther = trigger => {
  if (trigger.checked) {
    document.getElementById('other-equipment-name').disabled = false;
  } else {
    document.getElementById('other-equipment-name').value = '';
    document.getElementById('other-equipment-name').disabled = false;
  }
};

const newStep = () => {
  const stepByStep = document.getElementById('step-by-step');
  const nextStep =
    stepByStep.children.length >= 1
      ? parseInt(stepByStep.children[stepByStep.children.length - 1].id.split('-')[1], 10) + 1
      : 1;
  const htmlString = `
    <div name="step-${nextStep}" class="col-10 col-md-11">
        <input class="text-input" type="text"
            placeholder="step ${nextStep}"
            onkeydown="next(this, event, newStep)">
    </div>
    <div class="col-2 col-md-1 d-flex justify-content-end"
        onclick="this.parentNode.parentNode.removeChild(this.parentNode)">
        <h3><i class="fas fa-trash-alt"></i></h3>
    </div>
            `;
  const div = document.createElement('div');
  div.className = 'row';
  div.id = `step-${nextStep}`;
  div.innerHTML = htmlString;
  stepByStep.append(div);
  div.querySelector('input').focus();
};

const updatePreview = trigger => {
  document.querySelector('#image-preview').src = trigger.value;
  document.querySelector('#image-preview').onerror = () => {
    this.onerror = null;
    document.querySelector('#image-error').textContent =
      'Invalid image URL placeholder will be used';
    document.querySelector('#image-preview').src = '../static/images/placeholder.jpg';
  };
};
