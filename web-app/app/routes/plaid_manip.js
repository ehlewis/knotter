var moment = require('moment');
var BPromise = require('bluebird')

var myPromises = [];


module.exports = {
    get_access_token: function(request, response, next, plaid_client) {
        PUBLIC_TOKEN = request.body.public_token;
        plaid_client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
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

    accounts: function(request, response, next, plaid_client) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        var i = request.query.params.var_i;
        console.log(i);
        plaid_client.getAuth(request.user.accounts[i].access_token, function(error, authResponse) {
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

    cache_user_accounts: async function(request, response, next, plaid_client, redis_client, redis, num) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        var response_array = [];
        for (var i = 0; i < num; i++) {
            myPromises.push(plaid_client.getAuth(request.user.accounts[i].access_token, function(error, authResponse) { //this is a callback
                if (error != null) {
                    //console.log(error);
                    var msg = 'Unable to pull accounts from the Plaid API.';
                    console.log(msg + '\n' + error);
                    //---------test
                    console.log("got error in user key: " + request.user._id.toString() + "accounts");
                    response_array.push(error);
                    //redis_client.lpush(request.user._id.toString() + "accounts", JSON.stringify(error), redis.print); //apply logic here too
                    //------------
                    return;
                }

                console.log("got account in user key: " + request.user._id.toString() + "accounts");

                response_array.push(authResponse);
                //redis_client.lpush(request.user._id.toString() + "accounts", JSON.stringify(authResponse), redis.print);


                //Change this is ack the plaid_client that the server has cache this req
                response.json({
                    error: false,
                    accounts: authResponse.accounts,
                    numbers: authResponse.numbers,
                });
                return;
            }));
        }

        BPromise.all(myPromises).then(function() {
            // do whatever you need...
            console.log("accounts " + response_array.length + " out of length " + request.user.accounts.length);
            //redis_client.lpush(request.user._id.toString() + "accounts", JSON.stringify(response_array), redis.print);
            redis_client.set(request.user._id.toString() + "accounts", JSON.stringify(response_array), redis.print);
            return;
        });
    },

    get_cached_user_accounts: function(request, response, next, redis_client, redis, num) {
        redis_client.get(request.user._id.toString() + "accounts", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                console.log("error" + err);
            }
            if (reply == '') {
                console.log("no data stored");
                return;
            } else {
                console.log("accounts " + JSON.parse(reply));
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    item: function(request, response, next, plaid_client) {
        // Pull the Item - this includes information about available products,
        // billed products, webhook information, and more.
        var i = request.body.params.var_i;
        console.log(i);
        plaid_client.getItem(request.user.accounts[i].access_token, function(error, itemResponse) {
            if (error != null) {
                console.log(JSON.stringify(error));
                return response.json({
                    error: error
                });
            }

            // Also pull information about the institution
            plaid_client.getInstitutionById(itemResponse.item.institution_id, function(err, instRes) {
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

    //This might work? my testing account is getting a 404 off of accounts that says ITEM_LOGIN_REQUIRED so that could be why this is returning bad
    //Also tho check FOR ALL OF THESE what data were storing ause there could be more data than what were storing
    cache_item: function(request, response, next, plaid_client, redis_client, redis, num) {
        // Pull the Item - this includes information about available products,
        // billed products, webhook information, and more.
        var item_response_array = [];
        var institution_response_array = [];
        for (var i = 0; i < num; i++) {
            myPromises.push(
                plaid_client.getItem(request.user.accounts[i].access_token, function(error, itemResponse) {
                    if (error != null) {
                        console.log(JSON.stringify(error));
                        item_response_array.push(error);
                        return;
                        /*return response.json({
                            error: error
                        });*/
                    }

                    // Also pull information about the institution
                    plaid_client.getInstitutionById(itemResponse.item.institution_id, function(err, instRes) {
                        if (err != null) {
                            var msg = 'Unable to pull institution information from the Plaid API.';
                            console.log(msg + '\n' + error);
                            item_response_array.push(error);
                            return;
                            /*return response.json({
                                error: msg
                            });*/
                        } else {
                            item_response_array.push(itemResponse);
                            /*response.json({
                                item: itemResponse.item,
                                institution: instRes.institution,
                            });*/
                        }
                    });
                })
            );
        }
        BPromise.all(myPromises).then(function() {
            // do whatever you need...
            console.log("items " + item_response_array);
            console.log("institution_response_array " + institution_response_array);
            console.log("item " + item_response_array.length + " out of length " + request.user.accounts.length);
            console.log("institution " + institution_response_array.length + " out of length " + request.user.accounts.length);
            redis_client.set(request.user._id.toString() + "item", JSON.stringify(item_response_array), redis.print);
            return;
        });
    },

    //I dont want to have to do this I want this to be stored as an array or object and I dont want to have to reconstruct it
    get_cached_item: function(request, response, next, redis_client, redis) {
        redis_client.get(request.user._id.toString() + "item", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                console.log("error" + err);
            }
            if (reply == '') {
                console.log("no data stored");
                return;
            } else {
                //console.log(reply);
                console.log("item " + JSON.parse(reply));
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    transactions: function(request, response, next, plaid_client) {
        // Pull transactions for the Item for the last 30 days
        var i = request.body.params.var_i;
        console.log(i);
        var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
        var endDate = moment().format('YYYY-MM-DD');
        plaid_client.getTransactions(request.user.accounts[i].access_token, startDate, endDate, {
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
    },

    //Saves transactions in cache
    cache_transactions: function(request, response, next, plaid_client, redis_client, redis, num) {
        // Pull transactions for the Item for the last 30 days and store them in the cache
        var response_array = [];

        var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
        var endDate = moment().format('YYYY-MM-DD');
        for (var i = 0; i < num; i++) {
            myPromises.push(
                plaid_client.getTransactions(request.user.accounts[i].access_token, startDate, endDate, {
                    count: 250,
                    offset: 0,
                }, function(error, transactionsResponse) {
                    if (error != null) {
                        console.log(error);
                        response_array.push(error);
                        return;
                    }
                    console.log(transactionsResponse);
                    response_array.push(transactionsResponse);
                    return;
                }));
        }
        BPromise.all(myPromises).then(function() {
            // do whatever you need...
            console.log("transactions " + response_array.length + " out of length " + request.user.accounts.length);
            //redis_client.lpush(request.user._id.toString() + "accounts", JSON.stringify(response_array), redis.print);
            redis_client.set(request.user._id.toString() + "transactions", JSON.stringify(response_array), redis.print);
            return;
        });
    },

    get_cached_transactions: function(request, response, next, redis_client, redis, num) {
        redis_client.get(request.user._id.toString() + "transactions", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                console.log("error" + err);
            }
            if (reply == '') {
                console.log("no data stored");
                return;
            } else {
                //console.log(reply);
                console.log("Transactions" + JSON.parse(reply));
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    //or should we just calculate it and send it?
    cache_transactions_raw_array: function(data, redis_client, redis) {},

    get_transactions_raw_array: function(data, redis_client, redis) {},

    cache_graph_data: function(data, redis_client, redis, num) {},

    get_graph_data: function(data, redis_client, redis, num) {}

};
