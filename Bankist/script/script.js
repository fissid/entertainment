"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: ["2022-11-18T21:31:17.178Z", "2022-12-23T07:42:02.383Z", "2023-01-28T09:15:04.904Z", "2023-04-01T10:17:24.185Z", "2023-07-06T14:11:59.604Z", "2023-07-09T17:01:17.194Z", "2023-07-10T23:36:17.929Z", "2023-07-11T10:51:36.790Z"],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};
// console.log(new Date());
const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: ["2022-11-01T13:15:33.035Z", "2022-11-30T09:48:16.867Z", "2022-12-25T06:04:23.907Z", "2023-01-25T14:18:46.235Z", "2023-07-06T16:33:06.386Z", "2023-04-10T14:43:26.374Z", "2023-06-25T18:49:59.371Z", "2023-07-26T12:01:20.894Z"],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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
const formatMovementDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  switch (daysPassed) {
    case 0:
      return "Today";
      break;
    case 1:
      return "Yesterday";
      break;
  }
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    return Intl.DateTimeFormat(locale).format(date);
  }
};

const fromatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: `currency`,
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const moves = sort ? [...acc.movements].sort((a, b) => a - b) : acc.movements;

  moves.forEach(function (move, index) {
    const type = move > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[index]);
    const displayDate = formatMovementDates(date, acc.locale);
    const formattedMov = fromatCur(move, acc.locale, acc.currency);
    const htmlTag = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
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
  const formattedMov = fromatCur(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formattedMov}`;
};

// all in one function
const calcSummary = function (acc) {
  // deposits
  const deposits = acc.movements.filter((mov) => mov > 0).reduce((acc, each) => acc + each, 0);
  labelSumIn.textContent = `${fromatCur(deposits, acc.locale, acc.currency)}`;

  // withdraws
  const withdraw = acc.movements.filter((mov) => mov < 0).reduce((acc, each) => acc + each, 0);
  labelSumOut.textContent = `${fromatCur(withdraw, acc.locale, acc.currency)}`;

  // for each deposit bank gives 1.2% interest(greater than 1euro)
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((each) => each >= 1)
    .reduce((acc, red) => acc + red, 0);
  labelSumInterest.textContent = `${fromatCur(interest, acc.locale, acc.currency)}`;
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

  // display local date
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "numeric",
    day: "numeric",
    month: "2-digit",
    year: "numeric",
    // weekday: "long",
  };
  labelDate.textContent = new Intl.DateTimeFormat(logedInAcc.locale, options).format(now);

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

// // make all thing visible for account1 for testing
// calcBalance(account2);
// calcSummary(account2);
// displayMovements(account2);
// logedInAcc = account2;

// transfer process
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const accToTransfer = accounts.find((acc) => acc.username === inputTransferTo.value);
  const valToTransfer = Number(inputTransferAmount.value);
  if (accToTransfer && accToTransfer !== logedInAcc && valToTransfer > 0 && logedInAcc.balance >= valToTransfer) {
    const confirmTransfer = confirm(`Amount: ${String(valToTransfer).padStart(30, " ")}\nFrom: ${logedInAcc.owner.padStart(30, " ")}\nTo: ${accToTransfer.owner.padStart(30, " ")}`);
    if (confirmTransfer) {
      // do the transfer
      logedInAcc.movements.push(-valToTransfer);
      // add transfer date
      logedInAcc.movementsDates.push(new Date());
      accToTransfer.movementsDates.push(new Date());
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
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (loanAmount > 0 && logedInAcc.movements.some((move) => move >= loanAmount * 0.1)) {
    setTimeout(function () {
      logedInAcc.movements.push(loanAmount);
      logedInAcc.movementsDates.push(new Date());
      refreshDisplayData(logedInAcc);
    }, 3000);
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
// const movementsOveral = accounts
//   .map((each) => each.movements)
//   .flat()
//   .reduce((acc, each) => acc + each, 0);
// console.log(movementsOveral);

// const movementsDeposits = accounts
//   .flatMap((each) => each.movements)
//   .filter((each) => each > 0)
//   .reduce((acc, each) => acc + each, 0);
// console.log(movementsDeposits);

// const movementsWithdraws = accounts
//   .map((each) => each.movements)
//   .flat()
//   .filter((each) => each < 0)
//   .reduce((acc, each) => acc + each, 0);
// console.log(movementsWithdraws);

// console.log(`Overal of all movements of the bank: ${movementsDeposits + movementsWithdraws}`);

// // how many deposits which are atleast 1000 dollar
// const upperThan1K = accounts.flatMap((each) => each.movements).filter((move) => move > 1000).length;
// console.log(upperThan1K);

// // create an pbject which has both sum of the deposits and withdraws
// const both = {
//   sumDeposits: accounts
//     .flatMap((each) => each.movements)
//     .filter((each) => each > 0)
//     .reduce((acc, each) => acc + each, 0),
//   sumWithdraws: accounts
//     .map((each) => each.movements)
//     .flat()
//     .filter((each) => each < 0)
//     .reduce((acc, each) => acc + each, 0),
// };

// make a timer on the top left side of the page
setInterval(() => {
  document.querySelector(".timer").textContent = new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}, 1000);
