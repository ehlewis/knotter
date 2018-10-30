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


function createPieChartData(userData){
    //['Credit','Savings','Investments','Loans']
    var chartData = [];

    return chartData;
}
