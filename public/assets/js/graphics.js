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


//Creates OUT data by CATEGORY by for'ing through each account and then for'ing through it's transactions, matching each account to it's category and then summing all POSITIVE transactions to the appropriate entry in the running category total array.
function createCategoryInData(userData){
    //['Checking','Savings','Investments','Credit']
    return new Promise(function(resolve, reject) {
        var categoryData = [0,0,0,0];
        for (var institution = 0; institution < userData.length; institution++) {
            if(userData[institution].error_code){
                //pass
            }
            else{
                for (var account = 0; account < userData[institution].accounts.length; account++) {
                    for (var transaction = 0; transaction < userData[institution].accounts[account].transactions.length; transaction++) {
                        if(userData[institution].accounts[account].transactions[transaction].amount){
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
        }
        resolve(categoryData);
        //resolve(parseFloat(categoryData).toFixed(2));
    });
}

//Creates OUT data by CATEGORY by for'ing through each account and then for'ing through it's transactions, matching each account to it's category and then summing all NEGATIVE transactions to the appropriate entry in the running category total array.
function createCategoryOutData(userData){
    //['Checking','Savings','Investments','Credit']
    return new Promise(function(resolve, reject) {
        var categoryData = [0,0,0,0];
        for (var institution = 0; institution < userData.length; institution++) {
            if(userData[institution].error_code){
                //pass
            }
            else{
                for (var account = 0; account < userData[institution].accounts.length; account++) {
                    for (var transaction = 0; transaction < userData[institution].accounts[account].transactions.length; transaction++) {
                        if(userData[institution].accounts[account].transactions[transaction].amount > 0){
                            if(userData[institution].accounts[account].transactions[transaction].amount){
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
        }
        resolve(categoryData);
    });
}

//Given an account id, parses the given data to find the item with the matching account_id and then sums the smount of POSITIVE transactions
function createAccountInData(userData, accountId){
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
        resolve(accountData);
    });
}

//Given an account id, parses the given data to find the item with the matching account_id and then sums the smount of NEGATIVE transactions
function createAccountOutData(userData, accountId){
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
        resolve(accountData);
    });
}

//Given an institution id, parses the given data to find the item with the matching ins_id and then sums the smount of POSITIVE transactions
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
                            if(userData[institution].accounts[account].transactions[transaction].amount < 0){
                                accountData += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                            }
                        }
                    }
                }
            }
        }
        resolve(accountData);
    });
}

//Given an institution id, parses the given data to find the item with the matching ins_id and then sums the smount of NEGATIVE transactions
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
                            if(userData[institution].accounts[account].transactions[transaction].amount > 0){
                                accountData += parseFloat(userData[institution].accounts[account].transactions[transaction].amount);
                            }
                        }
                    }
                }
            }
        }
        resolve(accountData);
    });
}

// Creates BALANCE data by institution by for'ing through each account and  adding its available balance to the appropriate entry in the running category total.
function createInstitutionBalanceData(userData){
    //['Checking','Savings','Investments','Credit']
    return new Promise(function(resolve, reject) {
        var categoryData = 0;
        for (var institution = 0; institution < userData.length; institution++) {
            if(userData[institution].error_code){
                //pass
            }
            else{
                for (var account = 0; account < userData[institution].accounts.length; account++) {
                    if(userData[institution].accounts[account].balances.available){
                        categoryData += userData[institution].accounts[account].balances.available;
                    }
                }
            }
        }
        resolve(categoryData);
    });
}

// Creates BALANCE data by CATEGORY by for'ing through each account and matching the account.subtype to a category then adding its available balance to the appropriate entry in the running category total array.
function createCategoryBalanceData(userData){
    //['Checking','Savings','Investments','Credit']
    return new Promise(function(resolve, reject) {
        var categoryData = [0,0,0,0];
        for (var institution = 0; institution < userData.length; institution++) {
            if(userData[institution].error_code){
                //pass
            }
            else{
                for (var account = 0; account < userData[institution].accounts.length; account++) {
                    if(userData[institution].accounts[account].balances.available){
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
        }
        resolve(categoryData);
    });
}



function renderInsCards(userData){
    for (var institution = 0; institution < userData.length; institution++) {
        if(userData[institution].error_code){
            //pass
            document.getElementById("INS_CARDS").innerHTML += '<div class="cardcontainer fradius" id="' + userData[institution].access_token + '"><div class="banklogo hcenter"><img src="assets/bankLogos/error.svg" class="logosvg"></div><hr noshade><div class="totals"><div class="bnktotal bnknums"><p>ERROR </p></div><div class="inout bnknums"><p">ERROR</p><p>ERROR </p></div></div></div>'
            linkUpdateMode(userData[institution].access_token);
        }
        else{
            var ins_id_supported = ['ins_1','ins_2','ins_3','ins_4','ins_5','ins_6','ins_7','ins_9','ins_10','ins_11','ins_13','ins_14','ins_16','ins_19','ins_20','ins_21','ins_23','ins_24','ins_27','ins_28','ins_29'];
            var logo_filename = '';
            if(ins_id_supported.includes(userData[institution].item.institution_id)){
                logo_filename = userData[institution].item.institution_id;
            }
            else{
                logo_filename = 'default';
            }
            document.getElementById("INS_CARDS").innerHTML += '<div class="cardcontainer fradius"><div class="banklogo hcenter"><img src="assets/bankLogos/'+logo_filename+'.svg" class="logosvg"></div><hr noshade><div class="totals"><div class="bnktotal bnknums"><p id="bankTotal_'+userData[institution].item.institution_id+'"></p></div><div class="inout bnknums"><p id="bankIn_'+userData[institution].item.institution_id+'" style="color:green;"></p><p id="bankOut_'+userData[institution].item.institution_id+'" style="color:red;"> </p></div></div></div>'
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
