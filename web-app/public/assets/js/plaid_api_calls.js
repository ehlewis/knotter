var NUM_ACCTS = null;
var transaction_post_array = [];
var transaction_data = [];

//------- These functions get all accounts (institution) transaction data
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
function getItems(i) {
 return new Promise(function(resolve, reject) {
     $.post('/item',{params: {var_i: i}}).success(
     function(success){
         console.log("returning");
         resolve(success);
     }).error(
     function(error){
         console.log(error);
     });
 });
}
function getTransactions(i){
 return new Promise(function(resolve, reject) {
     for (var i = 0; i < NUM_ACCTS; i++) {
         $.post('/transactions', {params: {var_i: i}}).success(
             function(success){
                 console.log(success);
                 resolve(success);
             }).error(
             function(error){
                 console.log(error);
             });
     }
 });
}

async function getTransactionData() {
 return new Promise(async function(resolve, reject) {
     console.log("Numaccts aaaa: " + NUM_ACCTS);
     accounts_array = [];
     for (var i = 0; i < NUM_ACCTS; i++) {
         var account = await getTransactions(i);
         transaction_post_array.push(account);
     }
     //console.log("array " + accounts_array);
     resolve(transaction_post_array);
 });
}

async function get_user_transactions() {
    var accts = await getNumAccts();
    var data = await getTransactionData();
    //var temp = await populate(data);
    //populate(data);
    console.log("data" + data);
    console.log(accts);
}
//--------------------------------------------------
