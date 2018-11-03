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
