var moment = require('moment');
var BPromise = require('bluebird')

var myPromises = [];


module.exports = {
    //or should we just calculate it and send it?
    cache_transactions_raw_array: function(data, redis_client, redis) {},

    get_cached_transactions_raw_array: function(data, redis_client, redis) {
        var transaction_array = get_cached_transactions_raw_array(); //need to wait for this somehow
        for (var i = 0; i < transaction_array.length; i++) {
            for (var j = 0; j < transaction_array[i].transactions.length; j++) {
                all_transactions.push(transaction_array[i].transactions[j]);
            }
        }

    },
    //incomplete
    cache_graph_data: function(data, redis_client, redis) {
        //we have to await the transaction_array;
        var transaction_array = get_cached_transactions_raw_array();
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
        //store the array
        //return graphData;
    },

    get_graph_data: function(data, redis_client, redis, num) {}

};
