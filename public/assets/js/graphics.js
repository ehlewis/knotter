function drawPieChart(userData, chart, colors, labels){
    var myDoughnutChart = new Chart(document.getElementById(chart), {
        type: 'doughnut',
        data: {
            datasets: [{
                data: userData,
                backgroundColor: colors,
                borderColor:[
                  'white'
                ],
                borderWidth: 4
            }],
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: labels
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
}

function drawIn(userData){
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
                'Investments',
                'Loans'
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
}

function drawOut(userData){
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
}

function drawLineDifference(userDataIn, userDataOut, chart){
    var myDoughnutChart = new Chart(document.getElementById(chart), {
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
            labels: ['','','','','','','','','','','',''],
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
}

function drawInOut(userDataIn, userDataOut){
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
}


function createCategoryInData(userData){
    //['Checking','Savings','Investments','Loans']
    return new Promise(function(resolve, reject) {
        var categoryData = [0,0,0];
        for (var institution = 0; institution < userData.length; institution++) {
            for (var account = 0; account < userData[institution].accounts.length; account++) {
                for (var transaction = 0; transaction < userData[institution].accounts[account].transactions.length; transaction++) {
                    if(userData[institution].accounts[account].transactions[transaction].amount > 0){
                        if(userData[institution].accounts[account].subtype == "checking"){
                                categoryData[0] += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                        else if(userData[institution].accounts[account].subtype == "savings"){
                                categoryData[1] += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                        else if(userData[institution].accounts[account].subtype == "cd" || userData[institution].accounts[account].subtype == "money market"){
                                categoryData[2] += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                        else if(userData[institution].accounts[account].subtype == "credit" || userData[institution].accounts[account].subtype == "credit card"){
                                categoryData[3] += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                        else{
                            console.log(userData[i][j].subtype);
                        }
                    }
                }
            }
        }
        console.log(categoryData);
        resolve(categoryData);
    });
}

function createCategoryOutData(userData){
    //['Checking','Savings','Investments','Loans']
    return new Promise(function(resolve, reject) {
        var categoryData = [0,0,0];
        for (var institution = 0; institution < userData.length; institution++) {
            for (var account = 0; account < userData[institution].accounts.length; account++) {
                for (var transaction = 0; transaction < userData[institution].accounts[account].transactions.length; transaction++) {
                    if(userData[institution].accounts[account].transactions[transaction].amount < 0){
                        if(userData[institution].accounts[account].subtype == "checking"){
                                categoryData[0] += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                        else if(userData[institution].accounts[account].subtype == "savings"){
                                categoryData[1] += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                        else if(userData[institution].accounts[account].subtype == "cd" || userData[institution].accounts[account].subtype == "money market"){
                                categoryData[2] += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                        else if(userData[institution].accounts[account].subtype == "credit" || userData[institution].accounts[account].subtype == "credit card"){
                                categoryData[3] += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                        else{
                            console.log(userData[i][j].subtype);
                        }
                    }
                }
            }
        }
        console.log(categoryData);
        resolve(categoryData);
    });
}

function createAccountInData(userData, accountId){
    //['Checking','Savings','Investments','Loans']
    return new Promise(function(resolve, reject) {
        var accountData = 0;
        for (var institution = 0; institution < userData.length; institution++) {
            for (var account = 0; account < userData[institution].accounts.length; account++) {
                if(userData[institution].accounts[account].account_id == accountId){
                    for (var transaction = 0; transaction < userData[institution].accounts[account].transactions.length; transaction++) {
                        if(userData[institution].accounts[account].transactions[transaction].amount > 0){
                            accountData += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                    }
                }
            }
        }
        console.log(accountData);
        resolve(accountData);
    });
}

function createAccountOutData(userData, accountId){
    //['Checking','Savings','Investments','Loans']
    return new Promise(function(resolve, reject) {
        var accountData = 0;
        for (var institution = 0; institution < userData.length; institution++) {
            for (var account = 0; account < userData[institution].accounts.length; account++) {
                if(userData[institution].accounts[account].account_id == accountId){
                    for (var transaction = 0; transaction < userData[institution].accounts[account].transactions.length; transaction++) {
                        if(userData[institution].accounts[account].transactions[transaction].amount < 0){
                            accountData += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                    }
                }
            }
        }
        console.log(accountData);
        resolve(accountData);
    });
}

function createInstitutionInData(userData, insId){
    //['Checking','Savings','Investments','Loans']
    return new Promise(function(resolve, reject) {
        var accountData = 0;
        for (var institution = 0; institution < userData.length; institution++) {
            if(userData[institution].item.institution_id == insId){
                for (var account = 0; account < userData[institution].accounts.length; account++) {
                    for (var transaction = 0; transaction < userData[institution].accounts[account].transactions.length; transaction++) {
                        if(userData[institution].accounts[account].transactions[transaction].amount > 0){
                            accountData += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                    }
                }
            }
        }
        console.log(accountData);
        resolve(accountData);
    });
}

function createInstitutionOutData(userData, insId){
    //['Checking','Savings','Investments','Loans']
    return new Promise(function(resolve, reject) {
        var accountData = 0;
        for (var institution = 0; institution < userData.length; institution++) {
            if(userData[institution].item.institution_id == insId){
                for (var account = 0; account < userData[institution].accounts.length; account++) {
                    for (var transaction = 0; transaction < userData[institution].accounts[account].transactions.length; transaction++) {
                        if(userData[institution].accounts[account].transactions[transaction].amount < 0){
                            accountData += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                        }
                    }
                }
            }
        }
        console.log(accountData);
        resolve(accountData);
    });
}

function createCategoryBalanceData(userData){
    //['Checking','Savings','Investments','Loans']
    return new Promise(function(resolve, reject) {
        var categoryData = [0,0,0];
        for (var institution = 0; institution < userData.length; institution++) {
            for (var account = 0; account < userData[institution].accounts.length; account++) {
                if(userData[institution].accounts[account].subtype == "checking"){
                        categoryData[0] += parseFloat(userData[institution].accounts[account].balances.available);
                }
                else if(userData[institution].accounts[account].subtype == "savings"){
                        categoryData[1] += parseFloat(userData[institution].accounts[account].balances.available);
                }
                else if(userData[institution].accounts[account].subtype == "cd" || userData[institution].accounts[account].subtype == "money market"){
                        categoryData[2] += parseFloat(userData[institution].accounts[account].balances.available);
                }
                else if(userData[institution].accounts[account].subtype == "credit" || userData[institution].accounts[account].subtype == "credit card"){
                        categoryData[3] += parseFloat(userData[institution].accounts[account].balances.available);
                }
                else{
                    console.log(userData[i][j].subtype);
                }
            }
        }
        console.log(categoryData);
        resolve(categoryData);
    });
}
 function createAccountBalanceData(userData, account){
    return new Promise(function(resolve, reject) {
        var categoryData = 0;
        for (var institution = 0; institution < userData.length; institution++) {
            for (var account = 0; account < userData[institution].accounts.length; account++) {
                if(userData[institution].accounts[account].account_id == account){
                        categoryData0 += parseFloat(userData[institution].accounts[account].balances.available);
                }
            }
        }
        console.log(categoryData);
        resolve(categoryData);
    });
}
