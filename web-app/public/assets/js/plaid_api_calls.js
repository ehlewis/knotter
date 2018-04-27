var NUM_ACCTS = null;
var transaction_post_array = [];
var transaction_data = [];
var account_array = [];
var transactions_loaded = false;


function getNumAccts() {
 return new Promise(function(resolve, reject) {
     $.getJSON("api/user_data", function(data) {
         // Make sure the data contains the username as expected before using it
         if (data.hasOwnProperty('username')) {
             console.log('Username: ' + data.username);
             console.log('Num of accounts: ' + data.num_of_accounts);
             NUM_ACCTS = data.num_of_accounts;
             resolve(NUM_ACCTS);
         }
     });
 });
}

//------- These functions get all accounts (institution) transaction data
function getTransactions(i){
 return new Promise(function(resolve, reject) {
     //for (var i = 0; i < NUM_ACCTS; i++) {
         $.post('/transactions', {params: {var_i: i}}).success(
             function(success){
                //console.log(success);
                resolve(success);
             }).error(
             function(error){
                 console.log(error);
             });
    // }
 });
}

async function getTransactionData() {
 return new Promise(async function(resolve, reject) {
     console.log("Numaccts: " + NUM_ACCTS);
     accounts_array = [];
     for (var i = 0; i < NUM_ACCTS; i++) {
         var accountTransactions = await getTransactions(i);
         transaction_post_array.push(accountTransactions);
     }
     //console.log("array " + accounts_array);
     transactions_loaded = true;
     resolve(transaction_post_array);
 });
}

async function get_user_transactions() {
    var accts = await getNumAccts();
    var data = await getTransactionData();
    //var temp = await populate(data);
    //populate(data);
    //console.log("data" + data);
    //console.log(accts);
}
//--------------------------------------------------

//------- These functions get all accounts (institutions)
function getAccount(i){
 return new Promise(function(resolve, reject) {
     //for (var i = 0; i < NUM_ACCTS; i++) {
         $.get('/accounts', {params: {var_i: i}}).success(
             function(success){
                 //console.log(success);
                 resolve(success);
         }).error(
             function(error){
                 console.log(error);
         });
     //}
 });
}

async function getAllAccounts() {
 return new Promise(async function(resolve, reject) {
     //console.log("Numaccts: " + NUM_ACCTS);
     accounts_array = [];
     for (var i = 0; i < NUM_ACCTS; i++) {
         var account = await getAccount(i);
         account_array.push(account);
     }
     //console.log("array " + accounts_array);
     resolve(account_array);
 });
}

async function get_user_accounts() {
    var accts = await getNumAccts();
    var data = await getAllAccounts();
    //var temp = await populate(data);
    //populate(data);
    //console.log("Num accts: " + accts);
    //console.log("accounts " + data);

}
//--------------------------------------------------
//------- These functions get all items (institutions)
function getItems(i) {
 return new Promise(function(resolve, reject) {
     $.post('/item',{params: {var_i: i}}).success(
     function(success){
         //console.log("returning");
         resolve(success);
     }).error(
     function(error){
         console.log(error);
     });
 });
}

// TODO:
//---------------------------------------------------

//-------These functions manipulate the transaction data

function transactionArraytoCSV() {

   if (transactions_loaded == true) {
       // Here is your next action
   }
 }

 setTimeout(checkVariable, 1000);

//-----------------------------------------------------
