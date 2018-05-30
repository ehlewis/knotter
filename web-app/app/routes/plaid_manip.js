var moment = require('moment');
var wait = require('wait.for-es6');
var BPromise = require('bluebird')

var myPromises = [];


module.exports = {
    foo: function() {
        console.log("HELLO");
    },
    get_access_token: function(request, response, next, client) {
        PUBLIC_TOKEN = request.body.public_token;
        client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
            if (error != null) {
                var msg = 'Could not exchange public_token!';
                console.log(msg + '\n' + error);
                return response.json({
                    error: msg
                });
            }
            ACCESS_TOKEN = tokenResponse.access_token;
            ITEM_ID = tokenResponse.item_id;
            console.log('Exchanged'.green + ' tokens');
            console.log('   Access Token: ' + ACCESS_TOKEN);
            console.log('   Item ID: ' + ITEM_ID);

            //Inserts this data into our db

            //This needs to append not overwrite
            if (request.user.accounts == null) {
                collection.update({
                    '_id': request.user._id
                }, {
                    '$set': {
                        'accounts': [{
                            "access_token": ACCESS_TOKEN,
                            "item_id": ITEM_ID
                        }]
                    }
                });
            } else {
                collection.update({
                    '_id': request.user._id
                }, {
                    '$push': {
                        'accounts': {
                            "access_token": ACCESS_TOKEN,
                            "item_id": ITEM_ID
                        }
                    }
                });
            }

            console.log("Inserted".green + " access_token: " + ACCESS_TOKEN + " and itemId " + ITEM_ID + " for user " + request.user);
            console.log("Length of accounts is now: " + request.user.accounts.length);

            response.json({
                'error': false
            });
        });
    },

    accounts: function(request, response, next, client) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        var i = request.query.params.var_i;
        console.log(i);
        client.getAuth(request.user.accounts[i].access_token, function(error, authResponse) {
            if (error != null) {
                var msg = 'Unable to pull accounts from the Plaid API.';
                console.log(msg + '\n' + error);
                return response.json({
                    error: msg
                });
            }

            //console.log(authResponse.accounts);
            response.json({
                error: false,
                accounts: authResponse.accounts,
                numbers: authResponse.numbers,
            });
        });
    },


    cache_user_accounts : async function(request, response, next, client, redis_client, redis, num) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        for (var i = 0; i < num; i++) {
            myPromises.push(client.getAuth(request.user.accounts[i].access_token, function(error, authResponse) { //this is a callback
                if (error != null) {
                    console.log(error);
                    var msg = 'Unable to pull accounts from the Plaid API.';
                    console.log(msg + '\n' + error);
                    //---------test
                    console.log("setting key");
                    redis_client.set(request.user._id.toString(), "string val", redis.print);
                    //------------
                    return;
                }

                //first this needs to work then it needs new logic
                    // first get to see if the key exists
                    // if the key exists then do .add not .set (or do we use append)
                //memcached.set(request.user._id, authResponse, 10000000, function (err) { /* stuff */ });
                console.log("setting key");
                redis_client.set(request.user._id, "string val", redis.print);


                //Change this is ack the client that the server has cache this req
                response.json({
                    error: false,
                    accounts: authResponse.accounts,
                    numbers: authResponse.numbers,
                });
            }));
        }


        BPromise.all(myPromises).then(function(){
            console.log("DONR ");// do whatever you need...
            return;
        });

    },









    item: function(request, response, next, client) {
        // Pull the Item - this includes information about available products,
        // billed products, webhook information, and more.
        var i = request.body.params.var_i;
        console.log(i);
        client.getItem(request.user.accounts[i].access_token, function(error, itemResponse) {
            if (error != null) {
                console.log(JSON.stringify(error));
                return response.json({
                    error: error
                });
            }

            // Also pull information about the institution
            client.getInstitutionById(itemResponse.item.institution_id, function(err, instRes) {
                if (err != null) {
                    var msg = 'Unable to pull institution information from the Plaid API.';
                    console.log(msg + '\n' + error);
                    return response.json({
                        error: msg
                    });
                } else {
                    response.json({
                        item: itemResponse.item,
                        institution: instRes.institution,
                    });
                }
            });
        });
    },

    transactions: function(request, response, next, client) {
        // Pull transactions for the Item for the last 30 days
        var i = request.body.params.var_i;
        console.log(i);
        var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
        var endDate = moment().format('YYYY-MM-DD');
        client.getTransactions(request.user.accounts[i].access_token, startDate, endDate, {
            count: 250,
            offset: 0,
        }, function(error, transactionsResponse) {
            if (error != null) {
                console.log(JSON.stringify(error));
                return response.json({
                    error: error
                });
            }
            console.log('pulled '.green + transactionsResponse.transactions.length + ' transactions');
            response.json(transactionsResponse);
        });
        //}
    }
};

//wont be exposed



/*And in your app file:

// app.js
// ======
var tools = require('./tools');
console.log(typeof tools.foo); // => 'function'
console.log(typeof tools.bar); // => 'function'
console.log(typeof tools.zemba); // => undefined*/
