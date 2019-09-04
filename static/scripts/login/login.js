/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const login = trigger => {
  loading(trigger, 'logging in');
  fetch('/login/', {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    body: JSON.stringify({
      username: document.querySelector('#username').value,
      password: document.querySelector('#password').value
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Successful Login') {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      } else {
        document.querySelector('#login-error-message').innerText = data.message;
        trigger.textContent = 'login';
      }
    });
};
