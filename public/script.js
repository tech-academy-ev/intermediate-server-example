// and a name just in case
let name = '';
let score = 0;
let leaderBoard = [];
let notificationOpen = false;

const nameInput = document.querySelector('input[type=text]');
const saveNameBtn = document.querySelector('#saveName');
const nameNav = document.querySelector('#nameNav');
const scoreElement = document.querySelector('#score');
const increaseScoreBtn = document.querySelector('#inc');
const decreaseScoreBtn = document.querySelector('#dec');
const tableElement = document.querySelector('.table');
const bodyElement = document.querySelector('body');

increaseScoreBtn.addEventListener('click', () => {
  if(name !== '') {
    score = parseInt(scoreElement.innerText) + 1;
    scoreElement.innerText = score;

    updateLeaderboard();
  } else {
    makeNotification();
  }
});

decreaseScoreBtn.addEventListener('click', () => {
  if(name !== '') {
    score = Math.max(parseInt(scoreElement.innerText) - 1, 0);
    scoreElement.innerText = score;

    updateLeaderboard();
  } else {
    makeNotification();
  }
});

let updateLeaderboard = () => {
  var filterTrue = [];
  var filterFalse = [];

  // make two arrays, one containing user, one containin the rest
  leaderBoard.forEach((value) => {
      (value.name === name ? filterTrue : filterFalse).push(value);
  });

  let el = filterTrue[0];

  // add user hours and push back into leaderboard
  filterFalse.push({...el, hours: score});

  leaderBoard = filterFalse;

  updateTableElements();
};

saveNameBtn.addEventListener('click', (event) => {
  
  if(nameInput.value !== ''){
    name = nameInput.value;
    nameNav.innerText = name;
    nameInput.disabled = true;
    leaderBoard.push({
      name: name,
      hours: 0,
    })
    updateTableElements();
  }
  
});

// we want to fill the leaderboard when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  leaderBoard = await fetch("/data");
  leaderBoard = await leaderBoard.json();

  updateTableElements();
});

let updateTableElements = () => {
  
  // sort leaderBoard descending by hours
  leaderBoard.sort(compareTableElements);
      
  purgeLeaderBoard();

  leaderBoard.forEach(({name, hours}) => {
    // here is our table row template that needs to be filled with data
    let listElement = `
      <span class="name">${name}</span>
      <span class="hours">${hours}</span>
    `;
  
    // create a new element for the table
    var temp = document.createElement('li');
  
    // fill the list element with the filled template
    temp.innerHTML = listElement;
  
    // add it to the page
    tableElement.appendChild(temp);
  })


};

// remove current elements before adding updated list
let purgeLeaderBoard = () => {

  let currentListElements = document.querySelectorAll('li');

  currentListElements.forEach(element => {

    // added custom attribute to "heading row" in html,
    // so it will not be removed
    if(!(element.getAttribute('heading') === 'true')) {
      element.remove();
    };
  });

};

let makeNotification = () => {

  if(!notificationOpen) {
      // create a new element for the notification
      var temp = document.createElement('div');
      temp.classList.add('notification');
    
      // fill the notification with some text
      temp.innerHTML = 'Please enter a name first!';
    
      // add it to the page
      bodyElement.appendChild(temp);
    
      // set it to true, so we'll know not to open multiple
      notificationOpen = true;
    
      // automatically remove it from the page again
      setTimeout(() => {
        const notificationElement = document.querySelector('.notification');
        notificationElement.remove();
        notificationOpen = false;
      }, 222500);
  }
}

// sort objects in leaderBoard array descending by hours
let compareTableElements = (a, b) => {
  if ( a.hours < b.hours ){
    return 1;
  }
  if ( a.hours > b.hours ){
    return -1;
  }
  return 0;
};