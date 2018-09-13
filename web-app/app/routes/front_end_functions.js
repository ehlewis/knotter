var moment = require('moment');
var logger = require('../../config/logger');
var link_functions = require('./link_functions.js');



module.exports = {
    create_transaction_graph_data: function(request, response, next) {
        var graph_array = [
          ['Month', 'Transactions', 'Spent'],
          ['January'],
          ['February'],
          ['March'],
          ['April'],
          ['May'],
          ['June'],
          ['July'],
          ['August'],
          ['September'],
          ['October'],
          ['November'],
          ['December']];
        var monthly_transactions = ['0','0','0','0','0','0','0','0','0','0','0','0'];
        var monthly_spent = ['0','0','0','0','0','0','0','0','0','0','0','0'];
        redis_client.get(request.user._id.toString() + "transactions", function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                logger.error("error" + err);
            }
            if (reply == '') {
                logger.debug("no data stored");
                return;
            } else {
                logger.debug("LOG1 " + reply);
                logger.debug("Transactions LOG 2" + JSON.parse(reply));
                transactions = JSON.parse(reply);
                //logger.debug("Pulled cached transactions for graph data");
                var transDate = new Date();
                var transMonth = -1;
                for (var i = 0; i < transactions.length; i++) {
                    for (var j = 0; j < transactions[i].transactions.length; j++) {
                        transDate = new Date(transactions[i].transactions[j].date);
                        transMonth = transDate.getMonth();
                        if (transMonth == 0) {
                            monthly_transactions[transMonth] += 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 1) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 2) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 3) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 4) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 5) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 6) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 7) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 8) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 9) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 10) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        } else if (transMonth == 11) {
                            monthly_transactions[transMonth] = parseInt(monthly_transactions[transMonth]) + 1;
                            monthly_spent[transMonth] = parseInt(monthly_spent[transMonth]) + transactions[i].transactions[j].amount;
                        }
                    }
                }
                for (var month = 0; month < 12; month++) {
                    graph_array[month + 1].push(parseInt(monthly_transactions[month]));
                }
                for (var month = 0; month < 12; month++) {
                    graph_array[month + 1].push(parseInt(monthly_spent[month]));
                }
                response.json(graph_array);
                //response.json(JSON.parse(reply));
            }
        });
        //logger.debug("We got some transactions " + transactions);
        /*response.json("aaaa");
        return response;*/

    }
};
