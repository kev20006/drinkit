/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
const vote = (trigger, type, collection) => {
  let fetchType = type;
  if (trigger.classList.contains('voted')) {
    fetchType = 'remove';
    trigger.classList.remove('voted');
    if (type === 'up') {
      trigger.parentElement.children[1].innerText =
        parseInt(trigger.parentElement.children[1].innerText, 10) - 1;
    } else {
      trigger.parentElement.children[1].innerText =
        parseInt(trigger.parentElement.children[1].innerText, 10) + 1;
    }
  } else if (type === 'up') {
    if (trigger.parentElement.children[2].classList.contains('voted')) {
      trigger.parentElement.children[2].classList.remove('voted');
      trigger.parentElement.children[1].innerText =
        parseInt(trigger.parentElement.children[1].innerText, 10) + 1;
    }
    trigger.classList.add('voted');
    trigger.parentElement.children[1].innerText =
      parseInt(trigger.parentElement.children[1].innerText, 10) + 1;
  } else if (type === 'down') {
    if (trigger.parentElement.children[0].classList.contains('voted')) {
      trigger.parentElement.children[0].classList.remove('voted');
      trigger.parentElement.children[1].innerText =
        parseInt(trigger.parentElement.children[1].innerText, 10) - 1;
    }
    trigger.classList.add('voted');
    trigger.parentElement.children[1].innerText =
      parseInt(trigger.parentElement.children[1].innerText, 10) - 1;
  }

  // eslint-disable-next-line no-undef
  fetch('/update/like_dislike', {
    method: 'post',
    body: JSON.stringify({
      type: fetchType,
      user_id: trigger.dataset.user,
      object_id: trigger.dataset.id,
      collection
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
