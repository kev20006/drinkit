let addFlavor = (trigger) => {
    console.log(trigger.value[trigger.value.length - 1]);
    if (trigger.value[trigger.value.length - 1] == ",") {
        if (addedFlavors.includes(trigger.value)) {
            trigger.value = "";
        } else {
            let flavor = trigger.value.substring(0, trigger.value.length - 1)
            addedFlavors.push(flavor)
            document.querySelector("#flavors").innerHTML = ""
            console.log(addedFlavors)
            addedFlavors.forEach(flavor => {
                let newTag = document.createElement("div")
                newTag.className = "flavors align-items-center d-flex my-0 mx-1"
                let crossIcon = document.createElement("i")
                crossIcon.addEventListener("click", (e) => {
                    console.log(addedFlavors)
                    addedFlavors = addedFlavors.filter(element => {
                        return element != flavor
                    })
                    console.log(addedFlavors)
                    e.currentTarget.parentNode.remove()
                })
                crossIcon.className = "fas fa-times ml-4 mr-1 my-0"
                let flavorText = document.createElement("p")
                flavorText.className = "ml-1 my-0"
                flavorText.textContent = flavor
                newTag.appendChild(flavorText);
                newTag.appendChild(crossIcon);
                document.querySelector("#flavors").appendChild(newTag)
            })
            newInput = document.createElement("div")
            newInput.classList = "flavors mx-2 w-xs-50 w-md-30 w-lg-10"
            newInput.innerHTML = `<input style="width:100%" list="flavor-list" id="flavor-input"  placeholder="add +"  oninput="addFlavor(this)">`
            document.querySelector("#flavors").appendChild(newInput)
            newInput.focus()
        }
    }
}

let unlockOther = (trigger) => {
    if (trigger.checked) {
        document.getElementById("other-equipment-name").disabled = false;
    } else {
        document.getElementById("other-equipment-name").value = "";
        document.getElementById("other-equipment-name").disabled = false;
    }
}

let newStep = () => {
    let stepByStep = document.getElementById("step-by-step")
    let nextStep = parseInt(stepByStep.children[stepByStep.children.length - 1].id.split("-")[1]) + 1
    let htmlString = `
                    <input class="form-control steps" type="text" placeholder="step ${nextStep}" onkeydown="next(this, event, newStep)">
            `
    let div = document.createElement("div");
    div.className = "form-group";
    div.id = `step-${nextStep}`
    div.innerHTML = htmlString;
    stepByStep.append(div);
    div.focus()
}

let updatePreview = (trigger) => {
    document.querySelector("#image-preview").src = trigger.value
    document.querySelector("#image-preview").onerror = () => {
        this.onerror = null;
        document.querySelector("#image-error").textContent = "Invalid image URL placeholder will be used";
        document.querySelector("#image-preview").src = '../static/images/placeholder.jpg';
    };
}