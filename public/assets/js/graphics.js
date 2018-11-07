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


function drawOut(){
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



function createCategoryInData(userData){
    //['Checking','Savings','Investments','Loans']
    return new Promise(function(resolve, reject) {
        var categoryData = [0,0,0];
        for (var institution = 0; institution < userData.length; institution++) {
            if(userData[institution].error_code){
                //pass
            }
            else{
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
            if(userData[institution].error_code){
                //pass
            }
            else{
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
            if(userData[institution].error_code){
                //pass
            }
            else{
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
            if(userData[institution].error_code){
                //pass
            }
            else{
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
            if(userData[institution].error_code){
                //pass
            }
            else{
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
            if(userData[institution].error_code){
                //pass
            }
            else{
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
            if(userData[institution].error_code){
                //pass
            }
            else{
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
        }
        console.log(categoryData);
        resolve(categoryData);
    });
}



function renderInsCards(userData){
    for (var institution = 0; institution < userData.length; institution++) {
        if(userData[institution].error_code){
            //pass
            document.getElementById("INS_CARDS").innerHTML += '<div class="cardcontainer fradius" id="' + userData[institution].access_token + '"><div class="banklogo hcenter"></div><hr noshade><div class="totals"><div class="bnktotal bnknums"><p>Total: ERROR </p></div><div class="inout bnknums"><p">In: ERROR</p><p>Out: ERROR </p></div></div></div>'
            linkUpdateMode(userData[institution].access_token);
        }
        else{
            document.getElementById("INS_CARDS").innerHTML += '<div class="cardcontainer fradius"><div class="banklogo hcenter"><img src="assets/bankLogos/'+userData[institution].item.institution_id+'.svg" class="logosvg"></div><hr noshade><div class="totals"><div class="bnktotal bnknums"><p id="bankTotal_'+userData[institution].item.institution_id+'">Total: </p></div><div class="inout bnknums"><p id="bankIn_'+userData[institution].item.institution_id+'">In: </p><p id="bankOut_'+userData[institution].item.institution_id+'">Out: </p></div></div></div>'
        }
    }
}

// INS_CARDS Template
/*<div class="cardcontainer fradius">
    <div class="banklogo hcenter">
        <img src="assets/bankLogos/BoA.svg" class="logosvg">
    </div>
    <hr noshade>
    <div class="totals">
        <div class="bnktotal bnknums">
            <p id="bankTotal">Total: </p>
        </div>
        <div class="inout bnknums">
            <p id="bankIn">In: </p>
            <p id="bankOut">Out: </p>
        </div>
    </div>
</div>*/

function linkUpdateMode(access_token_update){
    //Find the access_token associated with the ITEM_ID
    $.post('/api/get_public_token', {
        access_token: access_token_update
    }, function(response) {
        console.log(response);
        console.log("back");
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
        document.getElementById(access_token_update).onclick = function() {
            // Link will automatically detect the institution ID
            // associated with the public token and present the
            // credential view to your user.
            linkHandler.open();
        };
    });
}
