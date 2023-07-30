const nameInput = document.querySelector("#name");
const numInput = document.querySelector("#num");
const monthInput = document.querySelector("#month");
const yearInput = document.querySelector("#year");
const cvvInput = document.querySelector("#cvv");
const cartNum = document.querySelector(".cart-number");
const cartName = document.querySelector(".card-name");
const cardMonth = document.querySelector(".card-month");
const cardYear = document.querySelector(".card-year");
const cardCvv = document.querySelector(".card-cvv");

nameInput.addEventListener("keyup", function () {
  cartName.textContent = this.value;
});

numInput.addEventListener("keyup", function (e) {
  // check to each input key is a numbere
  if (!isNaN(Number(e.key)) && numInput.value.length > 0) {
    if (numInput.value.replaceAll(" ", "").length % 4 == 0) {
      numInput.value += " ";
    }
    cartNum.textContent = this.value;
    numInput.classList.remove("is-invalid");
  } else if (e.key === "Backspace") {
    cartNum.textContent = this.value;
    numInput.classList.remove("is-invalid");
  } else {
    cartNum.textContent = " ";
    numInput.classList.add("is-invalid");
  }
  // check input length to not extend more than 16 char
  if (this.value.replaceAll(" ", "").length === 16) {
    this.blur();
  }
});

const checkTmp = function (inpValue, nodeText, key, compVal) {
  if (Number(inpValue) > compVal) {
    nodeText.textContent = "--";
  } else if (key === "Backspace") {
    nodeText.textContent = inpValue;
  } else if (inpValue % 1 !== 0) {
    nodeText.textContent = "--";
  } else if (key === "Enter") {
    nodeText.textContent = inpValue;
  } else if (isNaN(Number(key))) {
    nodeText.textContent = "--";
  } else {
    nodeText.textContent = inpValue;
  }
};

monthInput.addEventListener("keyup", function (e) {
  checkTmp(this.value, cardMonth, e.key, 12);
});

yearInput.addEventListener("keyup", function (e) {
  checkTmp(this.value, cardYear, e.key, 99);
});

cvvInput.addEventListener("keyup", function (e) {
  checkTmp(this.value, cardCvv, e.key, 999);
});

document.querySelector(".submit").addEventListener("click", function (e) {
  e.preventDefault();
  numInput.classList.remove("is-invalid");
  monthInput.classList.remove("is-invalid");
  yearInput.classList.remove("is-invalid");
  cvvInput.classList.remove("is-invalid");
  if (isNaN(Number(cartNum.textContent.replaceAll(" ", "")))) {
    numInput.classList.add("is-invalid");
  } else if (Number(cardMonth.textContent) === 0) {
    monthInput.classList.add("is-invalid");
  } else if (Number(cardYear.textContent) === 0) {
    yearInput.classList.add("is-invalid");
  } else if (Number(cardCvv.textContent) === 0) {
    cvvInput.classList.add("is-invalid");
  } else {
    document.querySelector("form").classList.add("d-none");
    document.querySelector(".added").classList.remove("d-none");
  }
});

document.querySelector(".reload").addEventListener("click", function (e) {
  location.reload();
});
