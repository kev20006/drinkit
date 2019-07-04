/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const addProfile = (pic = 'https://makemeacocktail.com/images/no_cocktail.png', bio = '') => {
  console.log(pic, bio);
  document.querySelector('#profile').innerHTML = `<div class="row px-2">
                            <div class="col-12">
                                <img src="${pic}" alt="placeholder">
                            </div>
                            <div class="col-12 form-group">
                                <label for="profile-pic-url">Add an image url for your profile</label>
                                <input type="email" class="form-control" id="profile-pic-url" placeholder="Image Url">
                            </div>
                            <div class="col-12 form-group">
                                <label for="exampleFormControlTextarea1">Type a short bio about yourself for other users to read</label>
                                <textarea class="form-control" id="bio" rows="3">${bio}</textarea>
                            </div>
                            <div class="col-12 mb-4">
                                <input type="button" class="modal-button" value="submit profile" onclick="nextAction()"/>
                            </div>
                            <div id="errorText"></div>
                        </div>`;
};

const nextAction = () => {
  const profilePic = document.querySelector('#profile-pic-url').value;
  const bio = document.querySelector('#bio').value;
  fetch(`/user/update/${userId}`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      profile_url: profilePic,
      bio
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.querySelector('#profile').innerHTML = `<div class="col-12">
                            <img src="${profilePic}" alt="placeholder">
                        </div>
                        <div class="col-12">
                            <h5 class="bold">bio</h5>
                            <p>${bio}</p>
                        </div>`;
      } else {
        document.querySelector('#profile').innerHTML = 'Could not add profile';
      }
    });
};
