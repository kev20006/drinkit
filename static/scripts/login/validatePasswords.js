/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const validatePasswords = trigger => {
  loading(trigger, 'creating account');
  const username = document.getElementById('new-username').value;
  const password1 = document.getElementById('new-password1').value;
  const password2 = document.getElementById('new-password2').value;
  if (password1 !== password2) {
    document.getElementById('new-password1').value = '';
    document.getElementById('new-password2').value = '';
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    trigger.innerText = 'Sign Up';
    document.getElementById(
      'password-error'
    ).innerHTML = `<strong class="red-text darken-2">Passwords did not match</strong>`;
  } else if (password1 === '' || password2 === '') {
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    trigger.innerText = 'Sign Up';
    document.getElementById(
      'password-error'
    ).innerHTML = `<strong class="red-text darken-2">No Password Entered</strong>`;
  } else {
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    fetch(`/api/check_user/${username}`).then(response => {
      response.text().then(text => {
        if (text === 'True') {
          trigger.innerText = 'Sign Up';
          document.getElementById(
            'password-error'
          ).innerHTML = `<strong class="red-text darken-2">User already exists</strong>`;
        } else {
          document.getElementById('new-account').submit();
        }
      });
    });
  }
};
