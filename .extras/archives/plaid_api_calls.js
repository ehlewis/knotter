var NUM_ACCTS = null;
var transaction_array = [];
var all_transactions = [];
var account_array = [];
var transactions_loaded = false;
var accounts_loaded = false;
var graphDataLoaded = false;

var graphData = [0,0,0,0,0,0,0,0,0,0,0,0];
var graphLoaded = false;
var cardsLoaded = false;


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
function getTransactions(i) {
    return new Promise(function(resolve, reject) {
        //for (var i = 0; i < NUM_ACCTS; i++) {
        $.post('/transactions', {
            params: {
                var_i: i
            }
        }).success(
            function(success) {
                //console.log(success);
                resolve(success);
            }).error(
            function(error) {
                console.log(error);
            });
        // }
    });
}

async function getTransactionData() {
    return new Promise(async function(resolve, reject) {
        //console.log("Numaccts: " + NUM_ACCTS);
        //accounts_array = [];
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
function getAccount(i) {
    return new Promise(function(resolve, reject) {
        //for (var i = 0; i < NUM_ACCTS; i++) {
        $.get('/accounts', {
            params: {
                var_i: i
            }
        }).success(
            function(success) {
                //console.log(success);
                resolve(success);
            }).error(
            function(error) {
                console.log(error);
            });
        //}
    });
}

async function getAllAccounts() {
    return new Promise(async function(resolve, reject) {
        //console.log("Numaccts: " + NUM_ACCTS);
        account_array = [];
        for (var i = 0; i < NUM_ACCTS; i++) {
            var account = await getAccount(i);
            console.log(account);
            account_array.push(account);
        }
        console.log("array " + account_array);
        accounts_loaded = true;
        resolve(account_array);
    });
}

async function get_user_accounts() {
    var accts = await getNumAccts();
    var data = await getAllAccounts();
    //var temp = await populate(data);
    //populate(data);
    //console.log("Num accts: " + accts);
    //console.log("maaccounts " + account_array);

}
//--------------------------------------------------
//------- These functions get all items (institutions)
function getItems(i) {
    return new Promise(function(resolve, reject) {
        $.post('/item', {
            params: {
                var_i: i
            }
        }).success(
            function(success) {
                //console.log("returning");
                resolve(success);
            }).error(
            function(error) {
                console.log(error);
            });
    });
}

// TODO:
//---------------------------------------------------

//-------These functions manipulate the transaction data

function transactionArraytoCSV() {
    if (transactions_loaded == true) {
        for (var i = 0; i < transaction_array.length; i++) {
            for (var j = 0; j < transaction_array[i].transactions.length; j++) {
                all_transactions.push(transaction_array[i].transactions[j]);
            }
        }
        //console.log(all_transactions);
    }
}

function transactionCSVtoFrequencyGraph() {
    if (transactions_loaded == true) {
        var transDate = new Date();
        var temp = -1;
        for (var i = 0; i < transaction_array.length; i++) {
            for (var j = 0; j < transaction_array[i].transactions.length; j++) {
                transDate = new Date(transaction_array[i].transactions[j].date);
                //console.log(transDate.getMonth());
                temp = transDate.getMonth();
                if (temp == 0) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 1) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 2) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 3) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 4) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 5) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 6) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 7) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 8) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 9) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 10) {
                    graphData[temp] = graphData[temp] + 1;
                } else if (temp == 11) {
                    graphData[temp] = graphData[temp] + 1;
                }
            }
        }
        //console.log(graphData);
        graphDataLoaded = true;
        //return graphData;
    }
}

//-----------------------------------------------------

//------------------Graphical Manipulation

function account_id_to_name(in_id) {
    //ported but untested
    for (var i = 0; i < account_array.length; i++) {
        if (account_array[i].account_id === in_id) {
            console.log(acct.name);
            return acct.name;
        }
    }
}



function makeChart() {
    if (graphDataLoaded == true) {
        //console.log("Making graph " + graphData);
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [{
                    backgroundColor: '#00b09b',
                    /*rgb(255, 99, 132)*/
                    borderColor: '#00b09b',
                    /*rgb(255, 99, 132)*/
                    data: graphData,
                }]
            },

            // Configuration options go here
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            display: false
                        }
                    }]
                },
                legend: {
                    display: false,
                    labels: {
                        fontColor: 'rgb(255, 99, 132)'
                    }
                },
                responsive: false
            }
        });
        graphLoaded = true;
    }
}


function createAccountCards() {
    if (accounts_loaded == true) {
            var div = document.getElementById('accountCards');
            //console.log(div);
            console.log("Not waiting " + account_array);
            var html = '';
            console.log("making account cards " + account_array.length);
            for (var i = 0; i < account_array.length; i++) {
                for (var j = 0; j < account_array[i].accounts.length; j++) {
                    //account_array[i]
                    if (account_array[i].accounts[j].subtype == 'cd'){}
                    else if (account_array[i].accounts[j].subtype == 'checking'){
                        html += '<a href="/accounts.ejs"><div class="card"><img src="assets/';
                        var account_picture = 'fidelity_card.svg';
                        html += account_picture;
                        html+='"><div class="container"><p class="balance">$';
                        //var account_balance = 11023.45;
                        var account_balance = account_array[i].accounts[j].balances.available;
                        html += account_balance;
                        html += '<p><p>';
                        console.log("cd");
                        var account_name = account_array[i].accounts[j].name;
                        //var account_name = 'hi';
                        html += account_name;
                        html += '</p></div></div></a>';
                    }
                    else if (account_array[i].accounts[j].subtype == 'savings'){
                        html += '<a href="/accounts.ejs"><div class="card"><img src="assets/';
                        var account_picture = 'fidelity_card.svg';
                        html += account_picture;
                        html+='"><div class="container"><p class="balance">$';
                        //var account_balance = 11023.45;
                        var account_balance = account_array[i].accounts[j].balances.current;
                        html += account_balance;
                        html += '<p><p>';
                        console.log("savings");
                        var account_name = account_array[i].accounts[j].name;
                        //var account_name = 'hi';
                        html += account_name;
                        html += '</p></div></div></a>';
                    }
                    else if (account_array[i].accounts[j].subtype == 'credit card'){
                        html += '<a href="/accounts.ejs"><div class="card"><img src="assets/';
                        var account_picture = 'fidelity_card.svg';
                        html += account_picture;
                        html+='"><div class="container"><p class="balance">$';
                        //var account_balance = 11023.45;
                        var account_balance = account_array[i].accounts[j].balances.current;
                        html += account_balance;
                        html += '<p><p>';
                        console.log("credit card");
                        var account_name = account_array[i].accounts[j].name;
                        //var account_name = 'hi';
                        html += account_name;
                        html += '</p></div></div></a>';
                    }
                }
            }
            //console.log(html);
            console.log("Creating Tiles");
            cardsLoaded = true;
            div.innerHTML += html;

    }
}

function removeGraphSpinner(){
    if(graphLoaded == true){
        console.log("removing graph spinner");
        $('#chartDiv').removeClass('spinner');
    }

}

function removeCardSpinner(){
    if(cardsLoaded == true){
        console.log("removing card spinner");
        $('#accountCards').removeClass('spinner');
    }
}


/*async function getJSONAsync(){

    // The await keyword saves us from having to write a .then() block.
    let json = await axios.get('https://tutorialzine.com/misc/files/example.json');

    // The result of the GET request is available in the json variable.
    // We return it just like in a regular synchronous function.
    return json;
}

getJSONAsync().then( function(result) {
    // Do something with result.
});*/

//------------------------
