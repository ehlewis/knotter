var moment = require('moment');
var logger = require('../config/logger');
var BPromise = require('bluebird');
var myPromises = [];

// NOTE:
//All cache_user_X functions work in the following way with X being the Plaid endpoint
////Returns a Promise to the calling function to tell it that it will be resolved and to not use the data until it has been. This function gets passed a variable NUM which is equal to the number of items linked to the user entry in the DB. It then sends out NUM requests to Plaid to the getX endpoint, with each request also being a Promise which will be resolved that gets pushed onto myPromises[], iterating through the array of items stored in the DB under the user's entry to get data for each of the user's institutions. When it gets a response it pushes the response onto the array response_array[] and then resolves that reponse's promise from the promise array myPromises[]. Once the myPromises[] array is empty the function stores the response_array[] array in the Redis server and gives it a TTL. Finally, it resolves the promise that it sent to the function caller to tell the caller that the data has been cached in the Redis server and can now be accessed.



module.exports = {
    //Exchanges a public token for an access token and an item_id from Plaid when a user links a new account and then stores it in the DB by initializing the array named items[] under the user entry and storing the tokens; otherwise by pushing the tokens into the array if the user has previously linked an institution and thus the array is initialized
    get_access_token: function(request, response, next) {
        PUBLIC_TOKEN = request.body.public_token;
        plaid_client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
            if (error != null) {
                var msg = 'Could not exchange public_token!';
                logger.error(msg + '\n' + error);
                return response.json({
                    error: msg
                });
            }
            ACCESS_TOKEN = tokenResponse.access_token;
            ITEM_ID = tokenResponse.item_id;
            logger.debug(request.user._id + ' Exchanged tokens' + '   Access Token: ' + ACCESS_TOKEN + '   Item ID: ' + ITEM_ID);
            if (request.user.items == null) {
                collection.updateOne({
                    '_id': request.user._id
                }, {
                    '$set': {
                        'items': [{
                            "access_token": ACCESS_TOKEN,
                            "item_id": ITEM_ID
                        }]
                    }
                });
            } else {
                collection.updateOne({
                    '_id': request.user._id
                }, {
                    '$push': {
                        'items': {
                            "access_token": ACCESS_TOKEN,
                            "item_id": ITEM_ID
                        }
                    }
                });
            }

            logger.debug(request.user._id + " Inserted" + " access_token: " + ACCESS_TOKEN + " and itemId " + ITEM_ID + " for user " + request.user);

            response.json({
                'error': false
            });
        });
    },

    cache_user_institutions: async function(request, response, next) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        return new Promise(function (resolve, reject) {
        var response_array = [];
            for (var i = 0; i < request.user.items.length; i++) {
                myPromises.push(plaid_client.getAuth(request.user.items[i].access_token, function(error, authResponse) { //this is a callback
                    if (error != null) {
                        var msg = 'Unable to pull accounts from the Plaid API.';
                        logger.error(msg + '\n' + error);
                        logger.error("got error in user key: " + request.user._id.toString() + "accounts");
                        response_array.push(error);
                        return;
                    }

                    logger.silly("got institution in user key: " + request.user._id.toString() + "accounts");

                    response_array.push(authResponse);
                    return;
                }));
            }

            BPromise.all(myPromises).then(function() {
                // do whatever you need...
                logger.silly(request.user._id + " institutions " + response_array.length + " out of length " + request.user.items.length);
                redis_client.set(request.user._id.toString() + "institutions", JSON.stringify(response_array), redis.print);
                redis_client.expire(request.user._id.toString() + "institutions", 900);
                //next();
                resolve();
            });
        });
    },

    //Fetches the cached Plaid Institution data from Redis, converts it from a string back into an object, and sends it back to the caller.
    get_cached_user_institutions: function(request, response, next) {
        redis_client.get(request.user._id.toString() + "institutions", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                logger.error("error" + err);
            }
            if (reply == '') {
                logger.debug(request.user._id + " no data stored");
                return;
            } else {
                logger.silly(request.user._id + " institutions " + JSON.parse(reply));
                redis_client.expire(request.user._id.toString() + "institutions", 900);
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    cache_user_accounts: async function(request, response, next) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        return new Promise(function (resolve, reject) {
            var response_array = [];
            for (var i = 0; i < request.user.items.length; i++) {
                myPromises.push(plaid_client.getAccounts(request.user.items[i].access_token, function(error, authResponse) { //this is a callback
                    if (error != null) {
                        var msg = 'Unable to pull accounts from the Plaid API.';
                        logger.error(msg + '\n' + error);
                        logger.error("got error in user key: " + request.user._id.toString() + "accounts");
                        response_array.push(error);
                        return;
                    }

                    logger.silly("got account in user key: " + request.user._id.toString() + "accounts");

                    response_array.push(authResponse.accounts);
                    return;
                }));
            }

            BPromise.all(myPromises).then(function() {
                // do whatever you need...
                logger.silly(request.user._id + response_array.length + " institutions out of " + request.user.items.length);
                redis_client.set(request.user._id.toString() + "accounts", JSON.stringify(response_array), redis.print);
                redis_client.expire(request.user._id.toString() + "accounts", 900);
                //next();
                resolve();
            });
        });
    },

    //Fetches the cached Plaid Account data from Redis, converts it from a string back into an object, and sends it back to the caller.
    get_cached_user_accounts: function(request, response, next) {
        redis_client.get(request.user._id.toString() + "accounts", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                logger.error("error" + err);
            }
            if (reply == '') {
                logger.debug(request.user._id + " no data stored");
                return;
            } else {
                logger.silly(request.user._id + " accounts " + JSON.parse(reply));
                redis_client.expire(request.user._id.toString() + "accounts", 900);
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    item: function(request, response, next) {
        // Pull the Item - this includes information about available products,
        // billed products, webhook information, and more.
        var i = request.body.params.var_i;
        logger.log("silly",i);
        plaid_client.getItem(request.user.items[i].access_token, function(error, itemResponse) {
            if (error != null) {
                logger.error(request.user._id + JSON.stringify(error));
                return response.json({
                    error: error
                });
            }

            // Also pull information about the institution
            plaid_client.getInstitutionById(itemResponse.item.institution_id, function(err, instRes) {
                if (err != null) {
                    var msg = 'Unable to pull institution information from the Plaid API.';
                    logger.error(request.user._id + msg + '\n' + error);
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

    //Gets item but does NOT convert inst_id into anything useful right now
    cache_items: function(request, response, next, plaid_client) {
        // Pull the Item - this includes information about available products,
        // billed products, webhook information, and more.
        return new Promise(function (resolve, reject) {
            var item_response_array = [];
            var institution_response_array = [];
            for (var i = 0; i < request.user.items.length; i++) {
                myPromises.push(
                    plaid_client.getItem(request.user.items[i].access_token, function(error, itemResponse) {
                        if (error != null) {
                            logger.error(request.user._id + JSON.stringify(error));
                            //item_response_array.push(error);
                            return;
                        }
                        item_response_array.push(itemResponse);
                        return;
                    })
                );
            }
            BPromise.all(myPromises).then(function() {
                // do whatever you need...
                logger.silly(request.user._id + " item " + item_response_array.length + " out of length " + request.user.items.length);
                redis_client.set(request.user._id.toString() + "item", JSON.stringify(item_response_array), redis.print);
                redis_client.expire(request.user._id.toString() + "item", 900);
                //next();
                resolve();
            });
        });
    },

    //Fetches the cached Plaid Institution data from Redis, converts it from a string back into an object, and sends it back to the caller.
    get_cached_items: function(request, response, next) {
        redis_client.get(request.user._id.toString() + "item", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                logger.error(request.user._id + " error" + err);
            }
            if (reply == '') {
                logger.debug(request.user._id + " no data stored");
                return;
            } else {
                //console.log(reply);
                logger.silly(request.user._id + " item " + JSON.parse(reply));
                redis_client.expire(request.user._id.toString() + "item", 900);
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    cache_transactions: function(request, response, next) {
        // Pull transactions for the Item for the last 30 days and store them in the cache
        return new Promise(function (resolve, reject) {
            var response_array = [];
            var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
            var endDate = moment().format('YYYY-MM-DD');
            for (var i = 0; i < request.user.items.length; i++) {
                myPromises.push(
                    plaid_client.getTransactions(request.user.items[i].access_token, startDate, endDate, {
                        count: 250,
                        offset: 0,
                    }, function(error, transactionsResponse) {
                        if (error != null) {
                            logger.error(error);
                            response_array.push(error);
                            return;
                        }
                        response_array.push(transactionsResponse);
                        return;
                    }));
            }
            BPromise.all(myPromises).then(function() {
                logger.silly(request.user._id + "  transactions " + response_array.length + " out of length " + request.user.items.length);
                redis_client.set(request.user._id.toString() + "transactions", JSON.stringify(response_array), redis.print);
                redis_client.expire(request.user._id.toString() + "transactions", 900);
                //next();
                resolve();
            });
        });
    },

    //Fetches the cached Plaid Institution data from Redis, converts it from a string back into an object, and sends it back to the caller.
    get_cached_transactions: function(request, response, next) {
        redis_client.get(request.user._id.toString() + "transactions", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                logger.error(request.user._id + " error" + err);
            }
            if (reply == '') {
                logger.debug(request.user._id + " no data stored");
                return;
            } else {
                logger.silly(request.user._id + " Pulled cached transactions");
                redis_client.expire(request.user._id.toString() + "transactions", 900);
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    //Makes an array of requests for item transactions because this call gives us all the data we need and stores it in an array. After all promises for transactions have been completed we for through and give each account in each item a new array for it's associated transactions. We then for through each item and in each item each account and then every account we hit we for through the transaction list and put any transaction whos account_id matches the account_id of the account were currently in and push it onto the array of that accounts transactions. After we get through all of the accounts in an item we delete the transactions in that item and move onto the next item. After we get through we store the data in the cache and resolve the promise.
    plaid_to_knotter_json: function(request, response, next) {
        return new Promise(function (resolve, reject) {
            var response_array = [];
            var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
            var endDate = moment().format('YYYY-MM-DD');
            for (var i = 0; i < request.user.items.length; i++) {
                myPromises.push(
                        getTransactionsHelper(request.user.items[i].access_token, startDate, endDate).then(function(answer){response_array.push(answer)})
                    );
            }
            BPromise.all(myPromises).then(function() {

                plaidData = JSON.parse(JSON.stringify(response_array));
                var knotterJSON = plaidData;

                for (var institutionCounter = 0; institutionCounter < knotterJSON.length; institutionCounter++) {
                    if(knotterJSON[institutionCounter].accounts){
                        for (var accountCounter = 0; accountCounter < knotterJSON[institutionCounter].accounts.length; accountCounter++) {
                            knotterJSON[institutionCounter].accounts[accountCounter].transactions = new Array();
                        }
                    }
                    else{
                        //pass
                    }
                }
                for (var institutionCounter = 0; institutionCounter < knotterJSON.length; institutionCounter++) {
                    if(knotterJSON[institutionCounter].accounts){
                        for (var accountCounter = 0; accountCounter < knotterJSON[institutionCounter].accounts.length; accountCounter++) {
                            for (var transactionCounter = 0; transactionCounter < knotterJSON[institutionCounter].transactions.length; transactionCounter++) {
                                if (knotterJSON[institutionCounter].accounts[accountCounter].account_id == knotterJSON[institutionCounter].transactions[transactionCounter].account_id){
                                    knotterJSON[institutionCounter].accounts[accountCounter].transactions.push(knotterJSON[institutionCounter].transactions[transactionCounter]);
                                }
                            }
                        }
                        delete knotterJSON[institutionCounter].transactions;
                    }
                    else{
                        //pass
                    }
                }

                redis_client.set(request.user._id.toString() + "knotterdata", JSON.stringify(knotterJSON), redis.print);
                redis_client.expire(request.user._id.toString() + "knotterdata", 900);

                resolve();
            });
        });
    },

    get_knotter_data: function(request, response, next) {
        redis_client.get(request.user._id.toString() + "knotterdata", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                logger.error(request.user._id + " error" + err);
            }
            if (reply == '') {
                logger.debug(request.user._id + " no data stored");
                return;
            } else {
                logger.silly(request.user._id + " Pulled cached knotterdata");
                redis_client.expire(request.user._id.toString() + "knotterdata", 900);

                response.json(JSON.parse(reply));

            }
        });


    },

    get_institution_by_id: function(request, response, ins_id, next) {
        plaid_client.getInstitutionById(ins_id, function(err, instRes) {
            if (err != null) {
                var msg = 'Unable to pull institution information from the Plaid API.';
                logger.error(request.user._id + msg + '\n' + error);
                return response.json({
                    error: msg
                });
            } else {
                response.json({
                    institution: instRes.institution,
                });
            }
        });
    },
    remove_item: function(request, response, next) {
        return new Promise(function(resolve, reject) {
            for (var item = 0; item < request.user.items.length; item++) {
                if (request.user.items[item].item_id == request.body.item_id) {
                    plaid_client.removeItem(request.user.items[item].access_token, (err, result) => {
                        // Handle err
                        // The Item has been removed and the
                        // access token is now invalid
                        if (err) {
                            logger.error(err);
                        } else {
                            collection.updateOne({
                                '_id': request.user._id
                            }, {
                                $pull: {
                                    'items': {
                                        'item_id': request.body.item_id
                                    }
                                }
                            });

                            logger.debug(request.user._id + " removed item: " + request.body.item_id);
                        }
                        const isRemoved = result.removed;
                        request.login(request.user, function(err) {
                            if (err) {
                                resolve(False);
                            }
                            resolve(isRemoved);
                        });
                    });
                }
            }
        });
    },

    createTempPublicToken: function(request, response, next) {
        return new Promise(function (resolve, reject) {
            plaid_client.createPublicToken(request.body.access_token, (err, result) => {
                // Handle err
                if(err){
                    logger.error(err);
                    reject(err);
                }
                // Use the generated public_token to initialize Plaid Link in update
                // mode for a user's Item so that they can provide updated credentials
                // or MFA information
                else{
                    const publicToken = result.public_token;
                    resolve(publicToken);
                }
                // Initialize Link with the token parameter
                // set to the generated public_token for the Item

            });
        });
    }
};

function getTransactionsHelper(access_token, startDate, endDate){
    return new Promise(function (resolve, reject) {
        plaid_client.getTransactions(access_token, startDate, endDate, {
            count: 250,
            offset: 0,
        }, function(error, transactionsResponse) {
            if (error) {
                logger.error(error);
                error.access_token = access_token;
                resolve(error);
            }
            resolve(transactionsResponse);
        })
    });
}// This helper function is created for this call soley to allow us to attach the account_id to an error message if there is an error so we know which item threw the error. Otherwise it behaves as a standard GET from Plaid.
