const dice = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

// starting elements
const init = function () {
  document.querySelector("#score--0").textContent = 0;
  document.querySelector("#score--1").textContent = 0;
  document.querySelector(`#current--0`).textContent = 0;
  document.querySelector(`#current--1`).textContent = 0;
  scores = [0, 0];

  document.querySelector(`.player--0`).classList.remove("player--winner");
  document.querySelector(`.player--1`).classList.remove("player--winner");

  document.querySelector(`.player--0`).classList.add("player--active");
  document.querySelector(`.player--1`).classList.remove("player--active");

  currentScore = 0;
  activePlayer = 0;
  dice.classList.remove("hidden");
  playing = true;
};

init();
// rolling dice
btnRoll.addEventListener("click", () => {
  if (playing) {
    const diceNumber = Math.floor(Math.random() * 6) + 1;
    dice.classList.remove("hidden");
    dice.src = `dice-${diceNumber}.png`;
    if (diceNumber === 1) {
      document.querySelector(`.player--0`).classList.toggle("player--active");
      document.querySelector(`.player--1`).classList.toggle("player--active");

      document.querySelector(`#current--${activePlayer}`).textContent = 0;
      activePlayer = activePlayer === 0 ? 1 : 0;
      currentScore = 0;
    } else {
      // add to score
      currentScore = currentScore + diceNumber;
      document.querySelector(`#current--${activePlayer}`).textContent = currentScore;
    }
  }
});

btnHold.addEventListener("click", () => {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.querySelector(`#score--${activePlayer}`).textContent = scores[activePlayer];
    if (scores[activePlayer] >= 20) {
      dice.classList.add("hidden");
      playing = false;
      document.querySelector(`.player--${activePlayer}`).classList.remove("player--active");
      document.querySelector(`.player--${activePlayer}`).classList.add("player--winner");
      document.querySelector(`.name--${activePlayer}`).classList.add("name");
    } else {
      document.querySelector(`#current--${activePlayer}`).textContent = 0;
      activePlayer = activePlayer === 0 ? 1 : 0;
      currentScore = 0;
      document.querySelector(`.player--0`).classList.toggle("player--active");
      document.querySelector(`.player--1`).classList.toggle("player--active");
      // document.querySelector("#score--1").textContent += scores[1];
    }
  }
});

btnNew.addEventListener("click", () => {
  init();
});
