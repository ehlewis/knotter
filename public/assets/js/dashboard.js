function getUserDataFromCache(){
    $.getJSON("api/user_data", function(data) {
        // Make sure the data contains the username as expected before using it
            console.log(data.user);
            if (data.user.items.length != 0) {
              document.getElementById('container_block').innerHTML = ''
                $.get('/api/get_cached_transactions').success(
                    function(success) {
                        if (success != null) {
                            addCards(success);
                            addTransactions(success);
                        } else {
                            console.log("Im null and need to refresh");
                            $.get('/api/refresh_cache').success(function(refresh_success){
                                console.log("I'm running");
                                $.get('/api/get_cached_transactions').success(
                                    function(success_transactions) {
                                        if (success_transactions != null) {
                                            addCards(success_transactions);
                                            addTransactions(success_transactions);
                                        }
                                        console.log(success_transactions);
                                    }).error(
                                    function(error) {
                                        console.log(error)
                                    });
                            });
                        }
                        console.log(success);
                    }).error(
                    function(error) {
                        console.log(error);
                    });
            } else {
                console.log("Loaded");
                document.getElementById('container_block').innerHTML = 'Link an account by pressing the + below'
                //Tell Grey thingy that nothing is going to load or render it idk
            }
        });
}

function addCards(user_institutions) {
    for (insitution = 0; insitution < user_institutions.length; insitution++) {
        for (account = 0; account < user_institutions[insitution].accounts.length; account++) {
            var ins = user_institutions[insitution].item.institution_id;
            var new_card = document.createElement('div');
            new_card.innerHTML = '<div class="content">\
      <div class="card">\
        <div class="card-content">\
          <div class="bank-logo">\
            <img src="assets/cardLogos/'+ ins +'.svg">\
        </div>\
          <div class="info">\
            <div class="balance">\
              <p> Current balance: </p>\
              <h2> $'+ user_institutions[insitution].accounts[account].balances.current +'</h2>\
              <hr noshade>\
              <div class="vl"></div>\
              <p> Credit remaining: </p>\
              <h2> $' + user_institutions[insitution].accounts[account].balances.available + '</h2>\
            </div>\
          </div>\
          <div class="transactions">\
            <table id="' + user_institutions[insitution].accounts[account].account_id +'">\
              <tr>\
                <th>Date</th>\
                <th>Name</th>\
                <th>Amount</th>\
              </tr>\
            </table>\
          </div>\
        </div>\
      </div>'

            document.getElementById('container_block').appendChild(new_card);
        }
    }
}

function addTransactions(user_institutions) {
    for (insitution = 0; insitution < user_institutions.length; insitution++) {
        for (transaction = 0; transaction < user_institutions[insitution].transactions.length; transaction++) {
            var new_transaction = document.createElement('tr');
            new_transaction.innerHTML = '<td>'+user_institutions[insitution].transactions[transaction].date+'</td>\
              <td>'+user_institutions[insitution].transactions[transaction].name+'</td>\
              <td>$'+user_institutions[insitution].transactions[transaction].amount+'</td>'
            document.getElementById(user_institutions[insitution].transactions[transaction].account_id).appendChild(new_transaction);
        }
    }


}
