function addCards(user_institutions) {
    for (insitution = 0; insitution < user_institutions.length; insitution++) {
        for (account = 0; account < user_institutions[insitution].accounts.length; account++) {
            var new_card = document.createElement('div');
            new_card.innerHTML = '<div class="content">\
      <div class="card">\
        <div class="card-content">\
          <div class="bank-logo">\
            <img src="assets/graphics/BoACardLogo.svg">\
        </div>\
          <div class="info">\
            <div class="balance">\
              <p> Current balance: </p>\
              <h2>'+ user_institutions[insitution].accounts[account].balances.current +'</h2>\
              <hr>\
              <p> Credit remaining: </p>\
              <h2>' + user_institutions[insitution].accounts[account].balances.available + '</h2>\
            </div>\
          </div>\
          <div class="transactions">\
            <table id="' + user_institutions[insitution].accounts[account].account_id +'">\
              <tr>\
                <th>Company</th>\
                <th>Contact</th>\
                <th>Country</th>\
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
              <td>'+user_institutions[insitution].transactions[transaction].amount+'</td>'
            document.getElementById(user_institutions[insitution].transactions[transaction].account_id).appendChild(new_transaction);
        }
    }


}
