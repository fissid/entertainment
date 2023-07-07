"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// labelWelcome.textContent = "";

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const moves = sort ? [...acc.movements].sort((a, b) => a - b) : acc.movements;
  moves.forEach(function (move, index) {
    const type = move > 0 ? "deposit" : "withdrawal";
    const htmlTag = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index} ${type}</div>
          <div class="movements__value">${move} €</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", htmlTag);
  });
};

// create all accounts username with function and inside of the function
const createUserName = function (accs) {
  accs.forEach((eachAcc) => {
    eachAcc.username = eachAcc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);

// create balance for all accounts and set for them
const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

// all in one function
const calcSummary = function (acc) {
  // deposits
  const deposits = acc.movements.filter((mov) => mov > 0).reduce((acc, each) => acc + each, 0);
  labelSumIn.textContent = `${deposits} €`;

  // withdraws
  const withdraw = acc.movements.filter((mov) => mov < 0).reduce((acc, each) => acc + each, 0);
  labelSumOut.textContent = `${Math.abs(withdraw)} €`;

  // for each deposit bank gives 1.2% interest(greater than 1euro)
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((each) => each >= 1)
    .reduce((acc, red) => acc + red, 0);
  labelSumInterest.textContent = `${interest} €`;
};

const clearInputFields = function () {
  inputLoginUsername.value = inputLoginPin.value = "";
};

const clearTransferInputs = function () {
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
};

const refreshDisplayData = function (acc, sort = false) {
  calcBalance(acc);
  calcSummary(acc);
  displayMovements(acc, sort);
};

// login process
let logedInAcc;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  const logedInUsername = inputLoginUsername.value;
  const logedInPass = inputLoginPin.value;
  logedInAcc = accounts.find((acc) => acc.username === logedInUsername);
  if (logedInAcc) {
    if (logedInAcc.pin === Number(logedInPass)) {
      // display UI app
      containerApp.style.opacity = "1";
      // display message
      labelWelcome.textContent = `Welcome, ${logedInAcc.owner.split(" ")[0]}`;
      // display movements
      // display balance
      // display summary
      refreshDisplayData(logedInAcc);
      // clear inputs
      clearInputFields();
      // clear focus on input
      inputLoginPin.blur();
    } else {
      alert("Wrong Password");
      inputLoginPin.value = "";
    }
  } else {
    alert("Account does not exist!");
    clearInputFields();
    // inputLoginUsername.
  }
});

// make all thing visible for account1 for testing
calcBalance(account1);
calcSummary(account1);
displayMovements(account1);
logedInAcc = account1;

// transfer process
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const accToTransfer = accounts.find((acc) => acc.username === inputTransferTo.value);
  const valToTransfer = Number(inputTransferAmount.value);
  if (accToTransfer && accToTransfer !== logedInAcc && valToTransfer > 0 && logedInAcc.balance >= valToTransfer) {
    const confirmTransfer = confirm(`Amount: ${String(valToTransfer).padStart(30, " ")}\nFrom: ${logedInAcc.owner.padStart(30, " ")}\nTo: ${accToTransfer.owner.padStart(30, " ")}`);
    if (confirmTransfer) {
      logedInAcc.movements.push(-valToTransfer);
      refreshDisplayData(logedInAcc);
      accToTransfer.movements.push(valToTransfer);
      clearTransferInputs();
    } else {
      clearTransferInputs();
    }
  } else {
    alert("Invalid transfer data\nPlease re-check information");
  }
});

// delet process
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const confirmPass = Number(inputClosePin.value);
  const confirmuser = inputCloseUsername.value;
  if (confirmuser === logedInAcc.username && confirmPass === logedInAcc.pin) {
    const removeIndex = accounts.findIndex((acc) => acc.username === logedInAcc.username);

    const deleteConfirm = confirm(`Are you sure ${logedInAcc.owner.split(" ")[0]}?`);
    if (deleteConfirm) {
      accounts.splice(removeIndex, 1);
      containerApp.style.opacity = "0";
    }
    inputClosePin.value = inputCloseUsername.value = "";
  } else {
    alert("Invalid Confirmation!");
    inputClosePin.value = inputCloseUsername.value = "";
    inputClosePin.blur();
  }
});

// loan process
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0 && logedInAcc.movements.some((move) => move >= loanAmount * 0.1)) {
    logedInAcc.movements.push(loanAmount);
    refreshDisplayData(logedInAcc);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  } else {
    alert("Invalid loan amount");
    inputLoanAmount.value = "";
  }
});

// // // overal of all movements
// // const allMovementsArrays = accounts.map((acc) => acc.movements);
// // const allMovementsValues = allMovementsArrays.flat();
// // const overalMovements = allMovementsValues.reduce((acc, mov) => acc + mov, 0);
// // console.log(allMovementsArrays);
// // console.log(allMovementsValues);
// // console.log(overalMovements);

// const overalMovements = accounts.flatMap((acc) => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(overalMovements);

let doSorting = false;
// sort process
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  refreshDisplayData(logedInAcc, !doSorting);
  doSorting = !doSorting;
});

// practice 100 of dicerolls
// // const diceRolls = new Array(100).fill(1).map((cl) => (cl = Math.floor(Math.random() * 6 + 1)));
// const diceRolls = Array.from({ length: 100 }, () => Math.floor(Math.random() * 6 + 1));
// console.log(diceRolls);

// // overal of all movements
// const overalMovementsOfBank = accounts
//   .map((each) => each.movements)
//   .flat()
//   .reduce((acc, each) => acc + each, 0);
// console.log(overalMovementsOfBank);
