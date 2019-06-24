/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const addFlavor = trigger => {
  if (trigger.value[trigger.value.length - 1] === ',') {
    if (addedFlavors.includes(trigger.value)) {
      trigger.value = '';
    } else {
      const flavor = trigger.value.substring(0, trigger.value.length - 1);
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
      newInput.classList = 'flavors mx-2 w-xs-50 w-md-30 w-lg-10';
      newInput.innerHTML = `<input style="width:100%" list="flavor-list" id="flavor-input"  placeholder="add +"  oninput="addFlavor(this)">`;
      document.querySelector('#flavors').appendChild(newInput);
      newInput.focus();
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
    parseInt(stepByStep.children[stepByStep.children.length - 1].id.split('-')[1], 10) + 1;
  const htmlString = `
                    <input class="form-control steps" type="text" placeholder="step ${nextStep}" onkeydown="next(this, event, newStep)">
            `;
  const div = document.createElement('div');
  div.className = 'form-group';
  div.id = `step-${nextStep}`;
  div.innerHTML = htmlString;
  stepByStep.append(div);
  div.focus();
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
