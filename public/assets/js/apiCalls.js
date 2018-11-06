function getUserTransactionsSafe() {
    //Gets users transactions and handles if the cache is empty by refreshing it
    return new Promise(function(resolve, reject) {
        $.getJSON("/api/user_data", function(data) {
            // Make sure the data contains the data as expected before using it
            if (data.user.items.length != 0) {
                //If there are items linked
                $.get('/api/get_cached_transactions').success(function(success) {
                    if (success != null) {
                        resolve(success);
                    } else {
                        //If there are items but nothing in the cache
                        $.get('/api/refresh_cache').success(function(refresh_success) {
                            //Cache refreshes
                            $.get('/api/get_cached_transactions').success(
                                //We try again
                                function(success_transactions) {
                                    if (success_transactions != null) {
                                        resolve(success_transactions);
                                    } else {
                                        cosnole.log("Error: Could not get transactions after cache refresh");
                                    }
                                }).error(
                                function(error) {
                                    console.log(error)
                                });
                        });
                    }
                }).error(
                    function(error) {
                        console.log(error);
                        return error;
                    });
            } else {
                //Runs if there are no items linked
                console.log("Loaded nothing linked");
                resolve();
            }
        });
    });
}

function getUserKnotterdataSafe() {
    //Gets users transactions and handles if the cache is empty by refreshing it
    return new Promise(function(resolve, reject) {
        $.getJSON("/api/user_data", function(data) {
            // Make sure the data contains the data as expected before using it
            if (data.user.items.length != 0) {
                //If there are items linked
                $.get('/api/get_cached_knotter_data').success(function(success) {
                    if (success != null) {
                        resolve(success);
                    } else {
                        //If there are items but nothing in the cache
                        $.get('/api/refresh_cache').success(function(refresh_success) {
                            //Cache refreshes
                            $.get('/api/get_cached_knotter_data').success(
                                //We try again
                                function(knotterdata) {
                                    if (knotterdata != null) {
                                        resolve(knotterdata);
                                    } else {
                                        cosnole.log("Error: Could not get transactions after cache refresh");
                                    }
                                }).error(
                                function(error) {
                                    console.log(error)
                                });
                        });
                    }
                }).error(
                    function(error) {
                        console.log(error);
                        return error;
                    });
            } else {
                //Runs if there are no items linked
                console.log("Loaded nothing linked");
                resolve();
            }
        });
    });
}

function getUserAccounts() {
    //Gets users transactions and handles if the cache is empty by refreshing it
    return new Promise(function(resolve, reject) {
        $.get('/api/get_cached_user_accounts').success(function(success) {
            if (success != null) {
                resolve(success);
            } else {
                reject();
            }
        }).error(
            function(error) {
                console.log(error);
                reject(error);
            });

    });
}

function getUserTransactions() {
    //Gets users transactions and handles if the cache is empty by refreshing it
    return new Promise(function(resolve, reject) {
        $.getJSON("/api/user_data", function(data) {
            // Make sure the data contains the data as expected before using it
            if (data.user.items.length != 0) {
                //If there are items linked
                $.get('/api/get_cached_transactions').success(function(success) {
                    if (success != null) {
                        resolve(success);
                    } else {
                        reject();
                    }
                }).error(
                    function(error) {
                        console.log(error);
                        reject(error);
                    });
            } else {
                //Runs if there are no items linked
                console.log("Loaded nothing linked");
                resolve();
            }
        });
    });
}

function getUser() {
    $.getJSON("api/user_data", function(data) {
        // Make sure the data contains the username as expected before using it
        return data;
    });
}

function linkUpdateMode(item_id){

    //Find the access_token associated with the ITEM_ID
    

    $.post('/api/get_public_token', {
        access_token: access_token_ex
    }, function(response) {
        console.log(response);
        var linkHandler = Plaid.create({
            env: '<%= PLAID_ENV %>',
            clientName: 'Knotter',
            key: '<%= PLAID_PUBLIC_KEY %>',
            product: ['transactions'],
            token: response.publicToken,
            onSuccess: function(public_token, metadata) {
                // You do not need to repeat the /item/public_token/exchange
                // process when a user uses Link in update mode.
                // The Item's access_token has not changed.
            },
            onExit: function(err, metadata) {
                // The user exited the Link flow.
                if (err != null) {
                    // The user encountered a Plaid API error prior
                    // to exiting.
                }
                // metadata contains the most recent API request ID and the
                // Link session ID. Storing this information is helpful
                // for support.
            }
        });
        // Trigger the authentication view

            // Link will automatically detect the institution ID
            // associated with the public token and present the
            // credential view to your user.
            document.getElementById('linkButton').onclick = function() {
                // Link will automatically detect the institution ID
                // associated with the public token and present the
                // credential view to your user.
                linkHandler.open();
            };
    });
}
