
const shopItems = [{
    index: 1,
    id: 'p1',
    name: 'Samsung TV',
    price: 500000,
},
{
    index: 2,
    id: 'p2',
    name: 'Pixel 4a',
    price: 250000
},
{
    index: 3,
    id: 'p3',
    name: 'PS 5',
    price: 300000
},
{
    index: 4,
    id: 'p4',
    name: 'MacBook Air',
    price: 800000
},
{
    index: 5,
    id: 'p5',
    name: 'Apple Watch',
    price: 95000
},
{
    index: 6,
    id: 'p6',
    name: 'Air Pods',
    price: 75000
},
]

var itemArray = document.getElementsByClassName('prod');        //HTML collection of grid shopItems
var inventory = shopItems.length;    //keeps track of number of available shop items

function overlayEffect(i){
    let item = itemArray[i];                    //temporary value for storing shopItems
    let itemImg = item.children[0];             //refers to shop shopItems image
    let itemImgOverlay = item.children[1];      //refers to image overlay

    //renders image overlay visible and reduces brightness
    function on(){                              
        itemImg.style.filter = 'brightness(40%)';        
        itemImgOverlay.style.visibility = 'visible';     
    }

    //hides image overlay and returns brightness to original value
    function off(){                             
        itemImg.style.filter = 'brightness(100%)';
        itemImgOverlay.style.visibility = 'hidden';
    }

    //on and off function assigned to both image and image overlay to avoid flickering
    itemImg.onmouseenter = on;                     
    itemImgOverlay.onmouseenter = on;                     
    itemImg.onmouseleave = off;
    itemImgOverlay.onmouseleave = off;
}

const shopOrdBnIDArr = [];           //array to store original IDs of shopItems' add-to-cart buttons
const itemsBtnArr = document.getElementsByClassName('btn');      //HTML collection of shop items buttons

//creates unchanging array of shopItems' original IDs
function createStaticIDArray(i){
    shopOrdBnIDArr.push(itemsBtnArr[i].id);
}

//loops through all shopItems to perform functions defined above
for(let i=0; i<inventory; i++){                         
    overlayEffect(i);
    createStaticIDArray(i);
}


let cartTableBody = document.getElementById('cart-tbody');

function genCartRow(itemCartPos){
    let cartRow = document.createElement('tr');
    cartRow.id = `cart-row${itemCartPos}`; 
    cartRow.className = "cart-row";
    genCartCols(cartRow, itemCartPos);
    cartTableBody.appendChild(cartRow);
}

function genCartCols(cartRow, itemCartPos){
    let cells = '';
    cells += '<td>' + (itemCartPos + 1) + '</td>';
    cells += '<td class="prod-name"></td>';
    cells += '<td class="prod-price" colspan="2"></td>';
    cells += '<td class="prod-quant-ctrl">'
        + '<button class="reduce" id="redu' + (itemCartPos + 1) + '">-</button>'
        + '<showQuantArr class="quant">0</showQuantArr>'
        + '<button class="increase" id="incr' + (itemCartPos + 1) + '">+</button></td>';
    cells += '<td class="prod-clear">'
        + '<button class="clear" id="clr' + (itemCartPos + 1) + '">Remove</button></td>';
    cartRow.innerHTML = cells;
}

let cartItemsCount = 0;        //To reflect number of items added to cart
const cartItemsArr = document.getElementsByClassName('cart-row');  //HTML collection of rows to be displayed on cart
const quantArr = [];           //array storing various individual quantities of items added to cart
const showQuantArr = document.getElementsByClassName('quant');     //array of spaces to display item quantities on cart
const quantPriceArr = [];      //array storing price of given quantity of individual items
let total = 0;                 //overall cart amount
const cartAmount = document.getElementById('cart-amount');         //displays overall cart amount in cart
const link = [];               //array that uses added item's cart position to access it's shop (original) position 
const cartOrdBnIDArr = [];     //array of new IDs give to items' buttons in the order in which they were added to cart
const cartCounter = document.getElementById('cart-count');         //html element to reflect number of added shopItems

//This function is used to add items to cart
function addToCart(){
    let itemCartPos = cartItemsCount; //1   
    genCartRow(itemCartPos); //2
    
    for(let itemShopPos = 0; itemShopPos < inventory; itemShopPos++){ //3
        if(this.id == `btn${itemShopPos + 1}`){ //4
            cartItemsArr[itemCartPos].children[1].innerHTML = shopItems[itemShopPos].name; //5
            cartItemsArr[itemCartPos].children[2].innerHTML = `&#8358;${shopItems[itemShopPos].price}`; //6
            quantArr.push(1); //7
            showQuantArr[itemCartPos].innerHTML = `${quantArr[itemCartPos]}`; //8
            quantPriceArr[itemCartPos] = shopItems[itemShopPos].price; //9
            total += shopItems[itemShopPos].price; //10
            cartAmount.innerHTML = `&#8358;${total}`; //11
            link[itemCartPos] = itemShopPos; //12  
            cartOrdBnIDArr.push(`bn${itemCartPos + 1}`); //13
            this.id = cartOrdBnIDArr[itemCartPos]; //14
            break; //15
        }    
    }
           
    setItemRemove(itemCartPos); //16
    setItemQuant(itemCartPos);  //17
    postAddTransform(itemCartPos); //18
    cartItemsCount++; //19
    cartCounter.innerHTML = cartItemsCount; //20

    /* addToCart comments
    line 1 - equates added shop items' cart position to current number (length) of rows
    " 2 - function that generates new row in cart table for added shop item
    " 3(for loop) - loops through IDs of shop items' buttons to determine shop position of clicked shop items
    " 4(if statement) - executes block of code once the looping item shop position variable matches clicked item ID
    " 5 - assigns shop item's name from array of objects (shopItems) to cart table's name column (second column)
    " 6 - assigns original item price to cart table's price column (third column)
    " 7 - initiates selected item quantity in cart to 1 by pushing 1 to array of items' cart quantities
    " 8 - assigns initiated item quantity to cart table's quantity column (fourth column)
    " 9 - initiates total price of quantity of selected item to single item price (since default quant is one)
    " 10 - adds newly added item's price to overall cart amount (total)
    " 11 - displays updated overall cart price
    " 12 - array that uses added item's cart position to access it's shop (original) position 
    " 13 - creates new ID for added item while on cart and pushes the ID to respective array
    " 14 - replaces item id with newly created ID
    " 15 - breaks out of for loop once if statement condition is fulfilled (i.e item's shop position is found)
    " 16 - sets item remove function to click event of the item's remove button on cart
    " 17 - sets quantity increase and decrease functions to respective buttons for the added item
    " 18 - transforms the "Add To Cart" button in shop after item add and assigns item remove function to it
    " 19 - Increments number of items in cart to reflect newly added item
    " 20 - displays updated number of items in cart
*/
}

//assigns addToCart() to all shop items' button's click events
for (let j=0; j<inventory; j++){
    itemsBtnArr[j].onclick = addToCart;            
}

//transforms the "Add To Cart" button in shop after item is added and assigns item remove function to it
function postAddTransform(itemCartPos){
    itemsBtnArr[link[itemCartPos]].innerHTML = "REMOVE FROM CART";
    itemsBtnArr[link[itemCartPos]].style.backgroundColor = "#FFE9D6";
    itemsBtnArr[link[itemCartPos]].onclick = itemRemove;
}

//finds the position of button responsible for item removal using said button's ID (the argument)
function findRemoverPos(rmvBtnID){
    let rmvBtnPos = 0;
    for(let j = 0; j < inventory; j++){
    //the number in the ID is always one digit above the position
    if(rmvBtnID == `bn${j+1}` || rmvBtnID == `clr${j+1}` || rmvBtnID == `redu${j+1}`){
            rmvBtnPos = j;      
            break;
    }
    }
    return rmvBtnPos;
}

let zeroQuant = false;             //To check whether item removal is due to zero quantity
let zeroQuantID = 0;               //stores the id of minus button clicked for zero quantit removal

//This function is used to remove shop items from cart regardless of button used
function itemRemove(){
    let lastItemPos = cartItemsCount - 1; //1
    let rmvBtnPos = 0; //2
    if (zeroQuant == true){ this.id = zeroQuantID; } //3
    let rmvBtnID = ""; //4
    rmvBtnID = this.id; //5
    rmvBtnPos = findRemoverPos(rmvBtnID); //6
    let itemShopPos = link[rmvBtnPos]; //7
    
    total -= quantPriceArr[rmvBtnPos]; //8
    cartAmount.innerHTML = `&#8358;${total}`; //9

    for (let j = lastItemPos; j > rmvBtnPos; j--){
            itemsBtnArr[link[j]].id = itemsBtnArr[link[j-1]].id; 
    }

    for (let j = rmvBtnPos; j < lastItemPos; j++){ //10
        cartItemsArr[j].children[0].innerHTML = j + 1; //11
        cartItemsArr[j].children[1].innerHTML = cartItemsArr[j+1].children[1].innerHTML; //12
        quantPriceArr[j] = quantPriceArr[j+1]; //13
        cartItemsArr[j].children[2].innerHTML = `&#8358;${quantPriceArr[j]}`; //14
        quantArr[j] = quantArr[j+1]; //15
        showQuantArr[j].innerHTML = `${quantArr[j]}`; //16
        link[j] = link[j+1]; //18
    }

    quantArr.pop();
    quantPriceArr.pop();
    cartTableBody.removeChild(cartItemsArr[lastItemPos]); //19
    postRmvTransform(itemShopPos); //20
    zeroQuant = false; //21
    cartItemsCount--; //22
    cartCounter.innerHTML = cartItemsCount; //23

/* itemRemove comments
    line 1 - equates position of last cart item to one less than cart length
    " 2 - declares variable to store id of button responsible for item removal
    " 3 - assigns id of minus button responsible for setting zero quantity to this.id if that is the cause of removal
    " 4 - declares variable for storing this.id
    " 5 - assigns variable to this.id
    " 6 - assigns original item price to cart table's price column (third column)
    " 7 - declares and assigns variable to store item's original position in shop, from position linking array
    " 8 - subtracts price of slected quantity of removed item from overall cart amount
    " 9 - reflects updated overall cart amount
    " 10(for loop) - loops through all items from removed item to end of cart, importing 
    details of the next row into the current row to shift all items after removed item one row upwards
    " 11 - assigns item's serial number (children[0]) to one digit above it's position
    " 12 - imports name of the next row's item into the current row
    " 13 - shifts next row's price value to current row slot in price storing array
    " 14 - display shifted price in cart
    " 15 - shifts next row's quantity value to current row slot in quantity storing array
    " 16 - displays shifted quantity in cart
    " 17(if statement) - assigns item's id to previous item's id from last item to removed item if shop button
     is responsible for removal, this is to ensure the items maintain the right id according to their position
    " 18 - shifts removed item link value off the cart-to-shop position linking array
    " 19 - removes last child to avoid repitition after cart has been rearranged
    " 20 - transforms the "Remove From Cart" button in shop after item removal and assigns "add to cart" function to it
    " 21 - sets zero quantity back to false
    " 22 - decrements number of items in cart to reflect newly added item
    " 23 - displays updated number of items in cart
*/
}

//transforms the "Remove From Cart" button in shop after item is removed and assigns "add to cart" function to it
function postRmvTransform(itemShopPos){
    itemsBtnArr[itemShopPos].innerHTML = "ADD TO CART";
    itemsBtnArr[itemShopPos].style.backgroundColor = "#FF7A00";
    itemsBtnArr[itemShopPos].id = shopOrdBnIDArr[itemShopPos];    //converts id from cart id to original
    itemsBtnArr[itemShopPos].onclick = addToCart;           
}

const removeBtnArr = document.getElementsByClassName('clear');     //HTML collection of on-cart removeBtnArr buttons

//This function assigns itemRemove() to all on-cart remove buttons, called when item is added to cart
function setItemRemove(itemCartPos){
    removeBtnArr[itemCartPos].onclick = itemRemove;
}

const minusBtnArr = document.getElementsByClassName('reduce');    //HTML collection of minus buttons
const plusBtnArr = document.getElementsByClassName('increase');      //HTML collection of plus buttons

//This function assigns the functions for increase and decrease of item quantity to respective buttons
function setItemQuant(itemCartPos){
    
    
    minusBtnArr[itemCartPos].onclick = function(){
        let minusPos = findQuantBtnPos(this.id, itemCartPos);
        //minusPos - contains position of the minus button being clicked
        
        if (quantArr[minusPos] == 1) {  //minus removal carried out when quantity is one and minus is clicked
            zeroQuant = true;           //Equates zeroQuant to true to notify itemRemove() of minus removal
            itemRemove();               //calls itemRemove()
        }else {
            quantArr[minusPos]--;       //decrements item quantity if quantity is not one
            quantPriceArr[minusPos] = (quantArr[minusPos] * shopItems[link[minusPos]].price);
            //recalculates price of specific item based on updated quantity
            showQuantArr[minusPos].innerHTML = `${quantArr[minusPos]}`;  //reflects updated quantity in cart
            cartItemsArr[minusPos].children[2].innerHTML = `&#8358;${quantPriceArr[minusPos]}`;
            //reflects updated price in cart
            total -= shopItems[link[minusPos]].price;   
            //subtracts single item's price from overall cart price to reflect reduced quantity
            cartAmount.innerHTML = `&#8358;${total}`;   //displays updated overall cart price
        }
    };

    //plusPos - reflects which plus button is being clicked based on on-cart position
    plusBtnArr[itemCartPos].onclick = function(){
        let plusPos = findQuantBtnPos(this.id, itemCartPos);
        //plusPos - contains position of the plus button being clicked
        quantArr[plusPos]++;            //increments item quantity
        quantPriceArr[plusPos] = (quantArr[plusPos] * shopItems[link[plusPos]].price);
        //recalculates price of specific item based on updated quantity
        showQuantArr[plusPos].innerHTML = `${quantArr[plusPos]}`;   //reflects updated quantity in cart
        cartItemsArr[plusPos].children[2].innerHTML = `&#8358;${quantPriceArr[plusPos]}`;
        //reflects updated price in cart
        total += shopItems[link[plusPos]].price;
        //adds single item's price to overall cart price to reflect increased quantity
        cartAmount.innerHTML = `&#8358;${total}`;   //displays updated overall cart price
    };
}

//this function finds the position of quantity control buttons based on their IDs
function findQuantBtnPos(quantBtnID, itemCartPos){
    let btnPos = 0;
    for(let j = 0; j <= itemCartPos; j++){
        switch (true){
            case (quantBtnID == `redu${j+1}`):
                btnPos = j;
                zeroQuantID = `redu${j+1}`; //sets zeroQuantID to minus button ID for potential minus removal
                break;
            case (quantBtnID == `incr${j+1}`):
                btnPos = j;
                break;
        }
    }
    return btnPos;
}

//object for storing customer info on checkout
const info = {
    custName: "",
    custEmail: "",
    custNum: ""
}

cartBtn = document.getElementById('cart-btn');      //DOM object for the cart button
const cartModal = document.getElementById('cart-modal');        //DOM object for the cart modal
const modalCont = document.getElementsByClassName('modal-container');      //DOM object for landing page

//This function displays the cart modal on click of the cart button
cartBtn.onclick = function(event){
    modalCont[0].style.display = 'block';
    event.stopPropagation();       //prevents cart click from triggering function below

    //This function closes the cartModal on click anywhere outside the cart modal and its children elements 
    window.onclick = function(event){
        if (event.target != cartModal && cartModal.contains(event.target) === false){
            modalCont[0].style.display = 'none';
        }
    
    }
}

const next = document.getElementById('continue-btn');       //DOM object for continue button

//This function closes the cartModal on click on 'continue shopping' button
next.onclick = function(){
    modalCont[0].style.display = 'none';
}

const inputArr = document.getElementsByClassName('details');     //HTML collection of form inputs
const warningArr = document.getElementsByClassName('warn');     //HTML collection of warningArr statements

//This function describes the warning on incorrect input
function invalid (j, text){
    inputArr[j].style.borderColor = 'red';
    warningArr[j].style.display = 'inline';
    warningArr[j].innerHTML = text;    
}

const validityArr = []                 //array for validity of three inputs

for(let j = 0; j < 3; j++){
    //This function checks for validity of inputs and displays warning when invalid
    inputArr[j].onblur = function(){
        let inputBox = inputArr[j]
        switch(true){
            case (inputBox.value == ''):        
                //warning for no input
                invalid(j, '&#9888; This field cannot be empty');    //&#9888; refers to HTML symbol for warning
                break;
            case (inputBox.name == 'user-name' && inputBox.value.length > 30):
                //warning for name above 30 characters
                invalid(j, '&#9888; Input cannot exceed 30 characters');
                break;
            case (inputBox.name == 'user-email' && (!inputBox.value.includes('@') || !inputArr[1].value.includes('.'))):
                //warning for invalid email
                invalid(j, '&#9888; Invalid Email');
                break;
            case (inputBox.name == 'user-contact' && ((inputBox.value.length != 11 || !inputBox.value.startsWith('0')) && 
                (inputBox.value.length != 14 || !inputBox.value.startsWith('+234')))):
                //warning for invalid phone number
                invalid(j, '&#9888; Invalid Phone Number');
                break;
            default:
                //code for valid input
                inputBox.style.borderColor = 'green';
                validityArr[j] = true;          //updates validity of input to true
                warningArr[j].style.display = 'none';
                switch(j){
                    //stores customer info in object
                    case 0:
                        info.custName = inputBox.value;
                        break;
                    case 1:
                        info.custEmail = inputBox.value;
                        break;
                    case 2:
                        info.custNum = inputBox.value
                };
        }
    }
}

let summItemsCount = 0;           //counts number of shop items in summary modal
const summColArr = [];            //array of columns to be added to row in summary modal

//This function creates columnns, appends them to summary table row and fills the columns
function fillSummRow(summRowPos){                //stores position of row being printed in s\ummary
    summItemsCount++;
    for (let i = 0; i < 3; i++){                 //creates three columns and appends them to row
        summColArr[i] = document.createElement('td');
        summRowArr[summRowPos].appendChild(summColArr[i]);
    }
    summColArr[0].innerHTML = `${summItemsCount}`;                   //displays length of summary items as serial number in first columnn
    summColArr[1].innerHTML = cartItemsArr[summRowPos].children[1].innerHTML;    //displays name of shop items from cart modal
    summColArr[2].innerHTML = `${quantArr[summRowPos]}`;         //displays selected quantity of said shop items
}

const summRowArr = [];       //array of rows to be added to table in showSummary modal

//This function fills summary modal with necessary input and displays it
function showSummary(){
    document.getElementById('username').innerHTML = info.custName;         //inserts customer name in first paragraph
    //creates as many rows as the number of rows in cart modal and calls fillSummRow function
    for (let summRowPos = 0; summRowPos < cartItemsCount; summRowPos++){
        summRowArr[summRowPos] = document.createElement('tr');
        fillSummRow(summRowPos);
        document.getElementById('summary-table').appendChild(summRowArr[summRowPos]);    //appends complete row to summary table
    }
    modalCont[1].style.display = 'block';     //displays summary
}

function payWithPaystack() {
    let handler = PaystackPop.setup({
        key: 'pk_test_021e71d8b2c7c3f7b9f2f3b1f4ce19642ed240a7', // Replace with your public key
        email: info.custEmail,             //replaced with email gotten from input
        amount: total * 100,              //replaced with overall amount
        ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or removeBtnArr the line entirely so our API will generate one for you
        // label: "Optional string that replaces customer email"
        onClose: function(){
        alert('Window closed.');
        },
        callback: showSummary               //initial callback replaced with showSummary function
    });
  
    handler.openIframe();
}

//This function checks validity and calls payWithPaystack() on click of checkout button (form submit)
document.getElementById('cart-form').onsubmit = function(){
    //checks validity of all three inputs and ensures at least 1 shop item is selected
    if (validityArr.every( x => x == true) && cartCounter.innerHTML !== '0'){
        payWithPaystack();
        modalCont[0].style.display = 'none';                      //hides first cartModal
        return true;
    } else if (cartCounter.innerHTML == '0'){
        alert("Select at least 1 shop items to proceed");      //warning for no shop shopItems selected
        return false;
    } else {
        alert("Please enter your details appropriately")       //warningArr for invalid input
        return false;
    }
    
}

//This function resets all summary input and empties cart on click of 'ok'
document.getElementById('ok-btn').onclick = function(){
    summItemsCount = 0;
    let temp = cartItemsCount;
    //This clears all form values
    for(let i=0; i<3; i++){
        inputArr[i].value = '';
        inputArr[i].style.borderColor = 'revert';
    }
    //This removes appended rows in summary modal
    for(let summRowPos = 0; summRowPos < cartItemsCount; summRowPos++){
        summRowArr[summRowPos].remove();
        summRowArr[summRowPos] = null;
    }
    //This empties the shopping cart by imitating minus button removal of items and continuously removing topmost shop item
    for(let i = 0; i < temp; i++){
        zeroQuant = true;            //sets condition for zeroQuant or minus removal
        zeroQuantID = `d1`;          //imitates topmost minus button
        itemRemove();
    }
    modalCont[1].style.display = 'none';      //hides showSummary cartModal
}

//By Ayanga Oluwamurewa