var moment = require('moment');
var logger = require('../config/logger');
//var cache = require("./cache_functions.js");
var BPromise = require('bluebird');
var myPromises = [];


module.exports = {
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

    cache_user_institutions: async function(request, response, num, next) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        return new Promise(function (resolve, reject) {
        var response_array = [];
            for (var i = 0; i < num; i++) {
                myPromises.push(plaid_client.getAuth(request.user.items[i].access_token, function(error, authResponse) { //this is a callback
                    if (error != null) {
                        //console.log(error);
                        var msg = 'Unable to pull accounts from the Plaid API.';
                        logger.error(msg + '\n' + error);
                        //---------test
                        logger.error("got error in user key: " + request.user._id.toString() + "accounts");
                        response_array.push(error);
                        //redis_client.lpush(request.user._id.toString() + "accounts", JSON.stringify(error), redis.print); //apply logic here too
                        //------------
                        return;
                    }

                    logger.debug("got institution in user key: " + request.user._id.toString() + "accounts");

                    response_array.push(authResponse);
                    return;
                }));
            }

            BPromise.all(myPromises).then(function() {
                // do whatever you need...
                logger.debug(request.user._id + " institutions " + response_array.length + " out of length " + request.user.items.length);
                redis_client.set(request.user._id.toString() + "institutions", JSON.stringify(response_array), redis.print);
                redis_client.expire(request.user._id.toString() + "institutions", 1200);
                //next();
                resolve();
            });
        });
    },

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
                logger.debug(request.user._id + " institutions " + JSON.parse(reply));
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    cache_user_accounts: async function(request, response, num, next) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        return new Promise(function (resolve, reject) {
            var response_array = [];
            for (var i = 0; i < num; i++) {
                myPromises.push(plaid_client.getAccounts(request.user.items[i].access_token, function(error, authResponse) { //this is a callback
                    if (error != null) {
                        //console.log(error);
                        var msg = 'Unable to pull accounts from the Plaid API.';
                        logger.error(msg + '\n' + error);
                        //---------test
                        logger.error("got error in user key: " + request.user._id.toString() + "accounts");
                        response_array.push(error);
                        //redis_client.lpush(request.user._id.toString() + "accounts", JSON.stringify(error), redis.print); //apply logic here too
                        //------------
                        return;
                    }

                    logger.debug("got account in user key: " + request.user._id.toString() + "accounts");

                    response_array.push(authResponse.accounts);
                    return;
                }));
            }

            BPromise.all(myPromises).then(function() {
                // do whatever you need...
                logger.debug(request.user._id + response_array.length + " institutions out of " + request.user.items.length);
                redis_client.set(request.user._id.toString() + "accounts", JSON.stringify(response_array), redis.print);
                redis_client.expire(request.user._id.toString() + "accounts", 1200);
                //next();
                resolve();
            });
        });
    },

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
                logger.debug(request.user._id + " accounts " + JSON.parse(reply));
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
    cache_items: function(request, response, next, plaid_client, num) {
        // Pull the Item - this includes information about available products,
        // billed products, webhook information, and more.
        return new Promise(function (resolve, reject) {
            var item_response_array = [];
            var institution_response_array = [];
            for (var i = 0; i < num; i++) {
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
                logger.debug(request.user._id + " item " + item_response_array.length + " out of length " + request.user.items.length);
                redis_client.set(request.user._id.toString() + "item", JSON.stringify(item_response_array), redis.print);
                redis_client.expire(request.user._id.toString() + "item", 1200);
                //next();
                resolve();
            });
        });
    },

    //I dont want to have to do this I want this to be stored as an array or object and I dont want to have to reconstruct it
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
                logger.debug(request.user._id + " item " + JSON.parse(reply));
                response.json(JSON.parse(reply));
                return;
            }
        });
    },

    //Saves transactions in cache
    cache_transactions: function(request, response, num, next) {
        // Pull transactions for the Item for the last 30 days and store them in the cache
        return new Promise(function (resolve, reject) {
            var response_array = [];
            var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
            var endDate = moment().format('YYYY-MM-DD');
            for (var i = 0; i < num; i++) {
                myPromises.push(
                    plaid_client.getTransactions(request.user.items[i].access_token, startDate, endDate, {
                        count: 250,
                        offset: 0,
                    }, function(error, transactionsResponse) {
                        if (error != null) {
                            logger.error(request.user._id + error);
                            response_array.push(request.user._id + error);
                            return;
                        }
                        response_array.push(transactionsResponse);
                        return;
                    }));
            }
            BPromise.all(myPromises).then(function() {
                logger.debug(request.user._id + "  transactions " + response_array.length + " out of length " + request.user.items.length);
                redis_client.set(request.user._id.toString() + "transactions", JSON.stringify(response_array), redis.print);
                redis_client.expire(request.user._id.toString() + "transactions", 1200);
                //next();
                resolve();
            });
        });
    },

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
                logger.debug(request.user._id + " Pulled cached transactions");
                response.json(JSON.parse(reply));
                return;
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
    }
};
