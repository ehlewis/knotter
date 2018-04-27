var NUM_ACCTS = null;
var transaction_array = [];
var all_transactions = [];
var account_array = [];
var transactions_loaded = false;
var graphDataLoaded = false;
var graphData = [0,0,0,0,0,0,0,0,0,0,0,0];


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
         transaction_array.push(accountTransactions);
     }
     //console.log("array " + accounts_array);
     transactions_loaded = true;
     resolve(transaction_array);
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
       for(var i = 0; i < transaction_array.length; i++){
           for (var j = 0; j < transaction_array[i].transactions.length; j++) {
               all_transactions.push(transaction_array[i].transactions[j]);
           }
       }
       console.log(all_transactions);
   }
}

function transactionCSVtoFrequencyGraph() {
   if (transactions_loaded == true) {
       var transDate = new Date();
       var temp = -1;
       for(var i = 0; i < transaction_array.length; i++){
           for (var j = 0; j < transaction_array[i].transactions.length; j++) {
               transDate = new Date(transaction_array[i].transactions[j].date);
               //console.log(transDate.getMonth());
               temp = transDate.getMonth();
                if(temp == 0){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 1){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 2){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 3){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 4){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 5){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 6){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 7){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 8){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 9){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 10){
                    graphData[temp] = graphData[temp] + 1;
                }
                else if(temp == 11){
                    graphData[temp] = graphData[temp] + 1;
                }
           }
       }
       console.log(graphData);
       graphDataLoaded = true;
       //return graphData;
   }
}

//-----------------------------------------------------

//------------------misc

function account_id_to_name(in_id) {
    //ported but untested
    for (var i = 0; i < accounts_array.length; i++) {
        if(accounts_array[i].account_id === in_id){
            console.log(acct.name);
            return acct.name;
        }
    }
}



function makeChart(){
    if (graphDataLoaded == true) {
        console.log("Making graph " + graphData);
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [{
                    backgroundColor: '#00b09b', /*rgb(255, 99, 132)*/
                    borderColor: '#00b09b', /*rgb(255, 99, 132)*/
                    data: graphData,
                }]
            },

            // Configuration options go here
            options: {
                legend: {
                    display: false,
                    labels: {
                        fontColor: 'rgb(255, 99, 132)'
                    }
                },
                responsive: false
            }
        });
    }
}

//------------------------
