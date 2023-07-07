var number = Math.floor(Math.random() * 20 + 1);
var score = 20;
var scoreInPage = document.querySelector(".score-inpage");

const decreaseScore = function () {
  score--;
  scoreInPage.textContent = score;
};

const massage = function (iconClass, textMessage) {
  var msg = document.querySelector(".msg");
  msg.querySelector("i").className = iconClass;
  msg.querySelector("span").textContent = textMessage;
};

document.querySelector(".check").addEventListener("click", (e) => {
  e.preventDefault();
  var guess = Number(document.querySelector("#user-input").value);
  if (!guess) {
    massage("fa-solid fa-triangle-exclamation fa-lg", "Insert your Guess!");
  } else if (guess > 20 || guess < 1) {
    massage("fa-solid fa-triangle-exclamation fa-lg", "Between 1 to 20");
  } else if (score <= 1) {
    scoreInPage.textContent = 0;
    massage("fa-solid fa-ban fa-lg", "You Lost!");
    document.querySelector("body").className = "bg-danger";
    document.querySelector(".again").className = "again btn btn-light btn-lg";
  } else if (guess > number) {
    massage("fa-solid fa-arrow-trend-down fa-lg", "Lower!");
    decreaseScore();
  } else if (guess < number) {
    massage("fa-solid fa-arrow-trend-up fa-lg", "Higher!");
    decreaseScore();
  } else if (guess === number) {
    document.querySelector(".number").textContent = number;
    document.querySelector(".number").style.width = "110%";
    massage("fa-solid fa-trophy fa-lg", "You Won!");
    document.querySelector("body").className = "bg-success";
    document.querySelector(".again").className = "again btn btn-light btn-lg";
  }
  document.querySelector("#user-input").value = "";
});

document.querySelector(".again").addEventListener("click", () => {
  document.querySelector("body").className = "bg-dark";
  if (Number(document.querySelector(".high").textContent) < score) {
    document.querySelector(".high").textContent = score;
  }
  scoreInPage.textContent = score = 20;
  number = Math.floor(Math.random() * 20 + 1);
  document.querySelector(".again").className =
    "again btn btn-light btn-lg disabled";
});
