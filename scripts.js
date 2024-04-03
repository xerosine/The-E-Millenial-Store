const itemArray = document.getElementsByClassName("prod"); // HTML collection of grid shopItems
const itemButtons = document.getElementsByClassName("btn"); // HTML collection of shop items buttons
const shopItems = []; // array of all item objects
const cartItems = []; // array of item objects on cart
let cartTableBody = document.getElementById("cart-tbody");
let total = 0; // total cart amount
const cartAmount = document.getElementById("cart-amount"); // displays total cart amount in cart
const cartCounter = document.getElementById("cart-count"); // html element to reflect number of added shopItems

function overlayEffect(index) {
  const imgOverlayWrappers =
    document.getElementsByClassName("prod-img-wrapper");
  let item = imgOverlayWrappers[index];
  let itemImg = item.children[0]; // refers to item image
  let itemImgOverlay = item.children[1]; // refers to image overlay

  // shows image overlay
  function on() {
    itemImgOverlay.style.visibility = "visible";
  }

  // hides image overlay
  function off() {
    itemImgOverlay.style.visibility = "hidden";
  }

  // on and off function assigned to both image and image overlay to avoid flickering
  itemImg.onmouseenter = on;
  itemImgOverlay.onmouseenter = on;
  itemImg.onmouseleave = off;
  itemImgOverlay.onmouseleave = off;
}

// generates fields for given row in cart table
function genCartCols(cartRow, cartIndex) {
  let cells = "";
  cells += "<td>" + (cartIndex + 1) + "</td>";
  cells += '<td class="prod-name"></td>';
  cells += '<td class="prod-price" colspan="2"></td>';
  cells +=
    '<td class="prod-quant-ctrl">' +
    '<button class="reduce">-</button>' +
    '<span class="quant">0</span>' +
    '<button class="increase">+</button></td>';
  cells +=
    '<td class="prod-clear">' + '<button class="clear">remove</button></td>';
  cartRow.innerHTML = cells;
}

// generates rows or records for cart table
function genCartRow(cartIndex) {
  const cartRow = document.createElement("tr");
  cartRow.className = "cart-row";
  genCartCols(cartRow, cartIndex);
  cartTableBody.appendChild(cartRow);

  return cartRow;
}

// shop items class
class Item {
  constructor(index, id, name, price) {
    this.index = index; // original index in shop
    this.id = id; // id of shop item button
    this.name = name;
    this.price = price;
    this.quant = 1;
    this.cartIndex = -1; // index on cart
    overlayEffect(index);
  }

  // adds item to cart
  addToCart() {
    this.cartIndex = cartItems.length;
    const cartRow = genCartRow(this.cartIndex);
    cartRow.children[1].textContent = this.name;
    cartRow.children[2].textContent = this.price;
    cartRow.getElementsByClassName("quant")[0].textContent = `${this.quant}`;
    total += this.price;
    cartAmount.innerHTML = `&#8358;${total}`;
    const thisObj = this;
    cartRow.getElementsByClassName("reduce")[0].onclick = function () {
      // assigns reduce quantity method to  minus button
      thisObj.reduceQuant(cartRow);
    };
    cartRow.getElementsByClassName("increase")[0].onclick = function () {
      // assigns increase quantity method to plus button
      thisObj.increaseQuant(cartRow);
    };
    cartRow.getElementsByClassName("clear")[0].onclick = function () {
      // assigns remove from cart method to remove button
      thisObj.removeFromCart(cartRow);
    };
    this.postAddTransform(this);
    cartItems.push(this);
    cartCounter.innerHTML = cartItems.length;
  }

  // transforms the properties of the main item button to reflect remove from cart instead
  postAddTransform(obj) {
    itemButtons[this.index].textContent = "REMOVE FROM CART";
    itemButtons[this.index].style.backgroundColor = "#FFE9D6";
    itemButtons[this.index].onclick = function () {
      obj.removeFromCart();
    };
  }

  removeFromCart() {
    total -= this.price * this.quant;
    cartAmount.innerHTML = `&#8358;${total}`;
    for (
      // updates serial number and cart index for all items proceeding the removed items
      let nextIndex = this.cartIndex + 1;
      nextIndex < cartItems.length;
      nextIndex++
    ) {
      document.getElementsByClassName("cart-row")[
        nextIndex
      ].children[0].textContent = nextIndex;
      cartItems[nextIndex].cartIndex--;
    }
    cartTableBody.removeChild(
      cartTableBody.getElementsByClassName("cart-row")[this.cartIndex] // removes the removed item from cart table
    );
    this.postRmvTransform(this);
    cartItems.splice(this.cartIndex, 1);
    cartCounter.innerHTML = cartItems.length;
    this.quant = 1;
    this.cartIndex = -1;
  }

  // transforms the properties of the main item button to reflect add to cart instead
  postRmvTransform(obj) {
    itemButtons[this.index].textContent = "ADD TO CART";
    itemButtons[this.index].style.backgroundColor = "#FF7A00";
    itemButtons[this.index].onclick = function () {
      obj.addToCart();
    };
  }

  // reduces the quantity of item on cart
  reduceQuant(cartRow) {
    if (this.quant === 1) {
      this.removeFromCart(); // removes item if quantity is 1
    } else {
      this.quant--;
      cartRow.getElementsByClassName("quant")[0].textContent = `${this.quant}`;
      cartRow.children[2].innerHTML = `&#8358;${this.price * this.quant}`;
      total -= this.price;
      cartAmount.innerHTML = `&#8358;${total}`;
    }
  }

  // increases the quantity of item on cart
  increaseQuant(cartRow) {
    this.quant++;
    cartRow.getElementsByClassName("quant")[0].textContent = `${this.quant}`;
    cartRow.children[2].innerHTML = `&#8358;${this.price * this.quant}`;
    total += this.price;
    cartAmount.innerHTML = `&#8358;${total}`;
  }
}

// instantiates all six provided items
shopItems[0] = new Item(0, "btn1", "Samsung TV", 500000);
shopItems[1] = new Item(1, "btn2", "Pixel 4A", 250000);
shopItems[2] = new Item(2, "btn3", "PS 5", 300000);
shopItems[3] = new Item(3, "btn4", "MacBook Air", 800000);
shopItems[4] = new Item(4, "btn5", "Apple Watch", 95000);
shopItems[5] = new Item(5, "btn6", "Air Pods", 75000);
let inventory = shopItems.length; //keeps track of number of available shop items

// assigns addToCart() to all shop items' button click events
for (let j = 0; j < inventory; j++) {
  itemButtons[j].onclick = function () {
    shopItems[j].addToCart();
  };
}

const cartBtn = document.getElementById("cart-btn"); // fetches the cart button
const cartModal = document.getElementById("cart-modal"); // fetches the cart modal
const modalContainers = document.getElementsByClassName("modal-container"); // fetches the landing page

// This function displays the cart modal on click of the cart button
cartBtn.onclick = function (event) {
  modalContainers[0].style.display = "block";
  event.stopPropagation(); // prevents cart click from triggering function below

  // This function closes the cartModal on click anywhere outside the cart modal and its children elements
  window.onclick = function (event) {
    if (event.target != cartModal && !cartModal.contains(event.target)) {
      modalContainers[0].style.display = "none";
    }
  };
};

// This function closes the cartModal on click on 'continue shopping' button
document.getElementById("continue-btn").onclick = function () {
  modalContainers[0].style.display = "none";
};

const inputArr = document.getElementsByClassName("details"); // HTML collection of form inputs
const warningArr = document.getElementsByClassName("warn"); // HTML collection of warning elements

// object for storing customer info on checkout
const customerInfo = {
  custName: "",
  custEmail: "",
  custNum: "",
};

// This function warns the user on incorrect input
function invalid(index, text) {
  inputArr[index].style.borderColor = "red";
  warningArr[index].style.display = "inline";
  warningArr[index].innerHTML = text;
}

const fieldValidity = []; // array for validity of three inputs

for (let j = 0; j < 3; j++) {
  fieldValidity[j] = false;
  // This function checks for validity of inputs and displays warning when invalid
  inputArr[j].onchange = function () {
    console.log(inputArr[j]);
    let inputBox = inputArr[j];
    switch (true) {
      case inputBox.value == "":
        // warning for no input
        invalid(j, "&#9888; This field cannot be empty"); //&#9888; refers to HTML symbol for warning
        fieldValidity[j] = false;
        break;
      case inputBox.name == "user-name" &&
        (inputBox.value.length > 30 || inputBox.value.length < 3):
        // warning for name above 30 or under 3 characters
        invalid(j, "&#9888; Input must be between 3 and 30 characters");
        fieldValidity[j] = false;
        break;
      case inputBox.name == "user-email" &&
        (!inputBox.value.includes("@") || !inputBox.value.includes(".")):
        // warning for invalid email
        invalid(j, "&#9888; Invalid Email");
        fieldValidity[j] = false;
        break;
      case inputBox.name == "user-contact" &&
        (inputBox.value.length != 11 || !inputBox.value.startsWith("0")) &&
        (inputBox.value.length != 14 || !inputBox.value.startsWith("+234")):
        // warning for invalid phone number
        invalid(j, "&#9888; Invalid Phone Number");
        fieldValidity[j] = false;
        break;
      default:
        // code for valid input
        inputBox.style.borderColor = "green";
        fieldValidity[j] = true; // updates validity of input to true
        warningArr[j].style.display = "none";
        switch (j) {
          // stores customer info in object
          case 0:
            customerInfo.custName = inputBox.value;
            break;
          case 1:
            customerInfo.custEmail = inputBox.value;
            break;
          case 2:
            customerInfo.custNum = inputBox.value;
        }
    }
  };
}

const summColArr = []; // array of columns to be added to row in summary modal

// This function creates columnns, appends them to summary table row and fills the columns
function fillSummRow(summRowPos) {
  for (let i = 0; i < 3; i++) {
    // creates three columns and appends them to row
    summColArr[i] = document.createElement("td");
    summRowArr[summRowPos].appendChild(summColArr[i]);
  }
  summColArr[0].textContent = `${summRowArr.length}`;
  summColArr[1].textContent =
    document.getElementsByClassName("prod-name")[summRowPos].textContent;
  summColArr[2].textContent = `${
    document.getElementsByClassName("quant")[summRowPos].textContent
  }`;
}

const summRowArr = []; // array of rows to be added to table in showSummary modal

// This function fills summary modal with necessary input and displays it
function showSummary() {
  document.getElementById("username").textContent = customerInfo.custName; // inserts customer name in first paragraph
  for (let summRowPos = 0; summRowPos < cartItems.length; summRowPos++) {
    summRowArr[summRowPos] = document.createElement("tr");
    fillSummRow(summRowPos);
    document
      .getElementById("summary-table")
      .appendChild(summRowArr[summRowPos]); // appends complete row to summary table
  }
  modalContainers[1].style.display = "block"; // displays summary
}

function payWithPaystack() {
  let handler = PaystackPop.setup({
    key: "pk_test_021e71d8b2c7c3f7b9f2f3b1f4ce19642ed240a7", // replaced with the public key
    email: customerInfo.custEmail, // replaced with email gotten from input
    amount: total * 100, // replaced with overall amount
    ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or removeBtnArr the line entirely so our API will generate one for you
    // label: "Optional string that replaces customer email"
    onClose: function () {
      alert("Window closed.");
    },
    callback: showSummary, // initial callback replaced with showSummary function
  });

  handler.openIframe();
}

//This function checks validity and calls payWithPaystack() on click of checkout button (form submit)
document.getElementById("cart-form").onsubmit = function () {
  //checks validity of all three inputs and ensures at least 1 shop item is selected
  if (fieldValidity.every((x) => x === true) && cartCounter.innerHTML !== "0") {
    payWithPaystack();
    modalContainers[0].style.display = "none"; // hides first cartModal
    return true;
  } else if (cartCounter.innerHTML == "0") {
    alert("Select at least 1 shop item to proceed"); // warning for no shop shopItems selected
    return false;
  } else {
    alert("Please enter your details appropriately"); // warning for invalid input
    return false;
  }
};

// This function resets all summary input and empties cart on click of 'ok'
document.getElementById("ok-btn").onclick = function () {
  summItemsCount = 0;
  // This clears all form values
  for (let i = 0; i < 3; i++) {
    inputArr[i].value = "";
    inputArr[i].style.borderColor = "revert";
  }
  // This removes appended rows in summary modal
  for (let summRowPos = 0; summRowPos < cartItems.length; summRowPos++) {
    summRowArr[summRowPos].remove();
    summRowArr[summRowPos] = null;
  }
  // This empties the shopping cart by imitating minus button removal of items and continuously removing topmost shop item
  for (let i = 0; i < cartItems.length; i++) {
    cartItems[i].removeFromCart();
  }
  modalContainers[1].style.display = "none"; // hides showSummary cartModal
};

// By Ayanga Oluwamurewa
