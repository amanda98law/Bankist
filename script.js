'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//function of adding movements to user interface
const addMovements = function(movements, sort = false){
  //first clean the container
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit':'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__value">${Math.abs(mov)}€</div>
      </div>`
      //which div want to add?
      containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// insertAdjacentHTML is an order to overwrite html sentence


//computing inputUsername
//map()
//for each account do as below

const createUser = function(accs){
  accs.forEach(function(acc){
    acc.userName = acc.owner
    .toLowerCase()
    .split(' ')
    .map(function(name){
      return name[0];
    })
    .join('')
    .toUpperCase();
    console.log(acc.userName);
  })
}
createUser(accounts); //function called and automaticly added username into object
/*console.log(accounts); //check if error*/

const calPrintBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.innerHTML = `${acc.balance}€`;
}
//calculateBalance
const calculateBalance = function(acc){
  const depositBal = acc.movements.filter(mov => mov > 0).reduce((acc, dep) => acc + dep, 0);
  labelSumIn.innerHTML = `${depositBal}€`;

  const withdrawBal = acc.movements.filter(mov => mov < 0).reduce((accu, wit) => accu + wit, 0);
  labelSumOut.innerHTML = `${Math.abs(withdrawBal)}€`;

  const interestBal = acc.movements.filter(mov => mov > 0).map(amt => amt * acc.interestRate/100).filter(amt => amt > 1).reduce((accu, amt) => accu + amt, 0);
  labelSumInterest.innerHTML = `${interestBal}€`;
}

let currentUser;
const updateUI = function(acc){
  addMovements(acc.movements);
  calculateBalance(acc);
  calPrintBalance(acc);
}

btnLogin.addEventListener('click', function(event){
  event.preventDefault();
  currentUser = accounts.find(acc => acc.userName === inputLoginUsername.value.toUpperCase());
  if (currentUser?.pin === Number(inputLoginPin.value)){
    labelWelcome.innerHTML = `Welcome back, ${currentUser.owner.split(' ')[0]}!`;
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    updateUI(currentUser);
  }
})
//transfer function
btnTransfer.addEventListener('click', function(e){
  event.preventDefault();
  const transferTo = accounts.find(acc => acc.userName === inputTransferTo.value.toUpperCase());
  const transferAmount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  if (transferAmount > 0 && transferTo && currentUser.balance >= transferAmount && transferTo?.userName !== currentUser.userName){
    currentUser.movements.push(-transferAmount);
    transferTo.movements.push(transferAmount);
    updateUI(currentUser);
  }
})
btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if (inputCloseUsername.value.toUpperCase() === currentUser.userName && Number(inputClosePin.value) === currentUser.pin){
    const index = accounts.findIndex(acc => acc.userName === currentUser.userName);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount*0.1)){
    currentUser.movements.push(amount);
    updateUI(currentUser);
  }
  inputLoanAmount.value = '';
})
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  addMovements(currentUser.movements, !sorted);
  sorted = !sorted;
})

//get data from website
labelBalance.addEventListener('click', function(){
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€','')));
  //Array.from have their own bulit in map function (second position)
  console.log(movementsUI);
})
