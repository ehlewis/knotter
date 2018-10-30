var donut1 = document.getElementById("donut1");

var myDoughnutChart = new Chart(donut1, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [10, 25, 30],
            backgroundColor:[
              'rgb(105, 214, 81)',
              'rgb(0, 176, 155)',
              'rgb(0, 73, 176)'
            ],
            borderColor:[
              'white'
            ],
            borderWidth: 4
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Credit',
            'Savings',
            'Investments'
        ]
    },
    options: {
      legend:{
        position:'bottom',
        labels:{
          boxWidth: 20,
        }
      }
    }
});

var donut2 = document.getElementById("donut2");

var myDoughnutChart = new Chart(donut2, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [30, 5, 10],
            backgroundColor:[
              'rgb(224, 47, 47)',
              'rgb(224, 108, 47)',
              'rgb(224, 200, 47)'
            ],
            borderColor:[
              'white'
            ],
            borderWidth: 4
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Credit',
            'Savings',
            'Investments'
        ]
    },
    options: {
      legend:{
        position:'bottom',
        labels:{
          boxWidth: 20,
        }
      }
    }
});

var line = document.getElementById("line");

var myDoughnutChart = new Chart(line, {
    type: 'line',
    data: {
        datasets: [
          {
             data: [100, 342, 490, 490, 490, 830, 1830, 1830, 3300, 3402, 3402],
             backgroundColor:['rgb(105, 214, 81, 0)'],
             borderColor:['rgb(105, 214, 81)'],
             borderWidth: 2,
             label: 'In',
         },
         {
            data: [20, 52, 73, 123, 200, 532, 632, 632, 982, 1320, 2832],
            backgroundColor:['rgb(105, 214, 81, 0)'],
            borderColor:['rgb(224, 47, 47)'],
            borderWidth: 2,
            label: 'Out',
        }
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            '1st',
            '3rd',
            '6th',
            '9th',
            '12th',
            '15th',
            '18th',
            '21st',
            '24th',
            '27th',
            '30th'
        ],
    },
    options: {
      legend:{
        position:'bottom',
        labels:{
          boxWidth: 20,
        }
      },
      elements:{
        line:{
          tension:0,
        }
      }
    }
});


function displayMenu(){
  var menu = document.getElementById('menu');
  if(menu.style.height == "0px"){
    menu.style.height = "115px";
  }else{
    menu.style.height = "0px";
  }
}

function getUserDataFromCache() {
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
            $.get('/api/refresh_cache').success(function(refresh_success) {
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
  var current_cards = ['ins_1', 'ins_2', 'ins_3', 'ins_4', 'ins_5', 'ins_6', 'ins_7', 'ins_9', 'ins_10', 'ins_11', 'ins_13', 'ins_14', 'ins_15', 'ins_16', 'ins_19', 'ins_20', 'ins_21', 'ins_23', 'ins_24', 'ins_27', 'ins_29']
  for (var insitution = 0; insitution < user_institutions.length; insitution++) {
    var ins_id = user_institutions[insitution].item.institution_id;
    //Group by insitution

    var new_subsection = document.createElement('div');
    new_subsection.className = "ins-subsection";
    new_subsection.id = ins_id + "subsection";
    new_subsection.innerHTML = '<button class="show" id="showbtn' + ins_id + '"onclick="expandSubsection(this.parentElement.id, this.id, hidebtn'+ins_id+'.id)"> Show More </button>\
    <button class="hide" id = "hidebtn' + ins_id + '" onclick="collapseSubsection(this.parentElement.id, showbtn'+ins_id+'.id, this.id)"> Show Less </button>';

    document.getElementById('container_block').appendChild(new_subsection);

    for (var account = 0; account < user_institutions[insitution].accounts.length; account++) {
      if ($.inArray(user_institutions[insitution].item.institution_id, current_cards) == -1) {
        var ins = 'default_card';
      } else {
        var ins = user_institutions[insitution].item.institution_id;
      }
      var new_card = document.createElement('div');
      new_card.className = "content";
      new_card.innerHTML = '<div class="card">\
        <div class="card-content" onClick="createMoreInfoModal(this.id)" id="' + user_institutions[insitution].accounts[account].account_id + '">\
          <div class="bank-logo">\
            <img id="img' + user_institutions[insitution].accounts[account].account_id + '" src="assets/cardLogos/' + ins + '.svg">\
        </div>\
          <div class="info">\
            <div class="balance">\
              <p> Current balance: </p>\
              <h2> $' + user_institutions[insitution].accounts[account].balances.current + '</h2>\
              <hr noshade>\
              <div class="vl"></div>\
              <p> Credit remaining: </p>\
              <h2> $' + user_institutions[insitution].accounts[account].balances.available + '</h2>\
            </div>\
          </div>\
          <div class="transactions">\
            <table id="table' + user_institutions[insitution].accounts[account].account_id + '">\
              <tr>\
                <th>Date</th>\
                <th>Name</th>\
                <th>Amount</th>\
              </tr>\
            </table>\
          </div>\
        </div>';

      document.getElementById(ins_id + "subsection").appendChild(new_card);
    }
  }
}

function addTransactions(user_institutions) {
  for (insitution = 0; insitution < user_institutions.length; insitution++) {
    for (transaction = 0; transaction < user_institutions[insitution].transactions.length; transaction++) {
      var new_transaction = document.createElement('tr');
      new_transaction.innerHTML = '<td>' + user_institutions[insitution].transactions[transaction].date + '</td>\
              <td>' + user_institutions[insitution].transactions[transaction].name + '</td>\
              <td>$' + user_institutions[insitution].transactions[transaction].amount + '</td>'
      document.getElementById('table' + user_institutions[insitution].transactions[transaction].account_id).appendChild(new_transaction);
    }
  }
}

function expandSubsection(subsection_id, showbtn_id, hidebtn_id) {
  var subsection = document.getElementById(subsection_id);
  var showbtn = document.getElementById(showbtn_id);
  var hidebtn = document.getElementById(hidebtn_id)
  subsection.style.maxHeight = "100%";
  showbtn.style.display = "none";
  hidebtn.style.display = "block";
  subsection.className = "ins-subsection nofade";
}

function collapseSubsection(subsection_id, showbtn_id, hidebtn_id) {
  var subsection = document.getElementById(subsection_id);
  var showbtn = document.getElementById(showbtn_id);
  var hidebtn = document.getElementById(hidebtn_id)
  subsection.style.maxHeight = "400px";
  showbtn.style.display = "block";
  hidebtn.style.display = "none";
  subsection.className = "ins-subsection";
}
