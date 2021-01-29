// and a name just in case
let name = '';
let score = 0;

const nameInput = document.querySelector('input[type=text]');
const saveNameBtn = document.querySelector('#saveName');
const nameNav = document.querySelector('#nameNav');
const scoreElement = document.querySelector('#score');
const increaseScoreBtn = document.querySelector('#inc');
const decreaseScoreBtn = document.querySelector('#dec');

increaseScoreBtn.addEventListener('click', () => {
  scoreElement.innerText = parseInt(scoreElement.innerText) + 1
})

decreaseScoreBtn.addEventListener('click', () => {
  scoreElement.innerText = Math.max(parseInt(scoreElement.innerText) - 1, 0)
})

saveNameBtn.addEventListener('click', (event) => {
  
  if(nameInput.value !== ''){
    name = nameInput.value;
    nameNav.innerText = name;
    nameInput.disabled = true;
  }
  
});