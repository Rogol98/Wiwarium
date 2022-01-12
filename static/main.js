dataFromDB = dataFromDB.replaceAll('&#39;', '\"')
dataFromDB = dataFromDB.replaceAll(')', '')
dataFromDB = dataFromDB.replaceAll('(', '')
console.log(dataFromDB)

dataFromDB = JSON.parse(dataFromDB)
console.log(dataFromDB)
console.log("TYPEOF: " + typeof dataFromDB)



let ctx1 = document.getElementById("myChart1").getContext("2d");
let ctx2 = document.getElementById("myChart2").getContext("2d");

let delayed

let labels = dataFromDB.time

let dataTemperature = {
    labels,
    datasets: [{
        data: dataFromDB.temperature,
        label: "temperature",
        borderColor: "green",
        tension: 0.3,
    },
    ],
};

let dataHumidity = {
    labels,
    datasets: [{
        data: dataFromDB.humidity,
        label: "humidity",
        borderColor: "blue",
        tension: 0.3,
    },
    ],
};

let configTemperature = {
    type: "line",
    data: dataTemperature,
    options: {
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 50 + context.datasetIndex * 20;
                }
                return delay;
            },
        },
        radius: 2,
        responsive: true,
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return Math.round(value * 10) / 10 + "°C";
                    },
                },
            },
        },
    },

};

let configHumidity = {
    type: "line",
    data: dataHumidity,
    options: {
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 50 + context.datasetIndex * 20;
                }
                return delay;
            },
        },
        radius: 2,
        responsive: true,
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return Math.round(value * 10) / 10 + "%";
                    },
                },
            },
        },
    },

};

let myChart1 = new Chart(ctx1, configTemperature)
let myChart2 = new Chart(ctx2, configHumidity)


function getLabelsByTime(fromWhen) {
    let timeFromDB = dataFromDB.time
    let labels = []
    for (i = 0; i < timeFromDB.length; i++) {
        let date = timeFromDB[i].split(' ')[0]
        let dates = date.split('-')
        let time = timeFromDB[i].split(' ')[1]
        let times = time.split(':')

        let year = dates[0]
        let month = dates[1] - 1
        let day = dates[2]

        let hour = times[0]
        let minutes = times[1]
        let seconds = times[2]

        let dateFromChart = new Date(year, month, day, hour, minutes, seconds)
        if (dateFromChart.getTime() > fromWhen.getTime()) {
            dateToPush = year + '-' + (month + 1) + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
            labels.push(dateToPush)
        }
    }
    return labels
}

getLastDayUpdate()

function getLastDayUpdate() {
    let today = new Date();
    let dateADayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, today.getHours(), today.getMinutes(), today.getSeconds());
    let labelsADayAgo = getLabelsByTime(dateADayAgo)
    let temperatureADayAgo = dataFromDB.temperature.slice(labelsADayAgo.length - 1, labels.length)
    let humidityADayAgo = dataFromDB.humidity.slice(labelsADayAgo.length - 1, labels.length)
    let soilMoistureADayAgo
    let luminosityADayAgo
    myChart1.data.labels = labelsADayAgo
    myChart1.data.datasets[0].data = temperatureADayAgo
    myChart1.update()
    myChart2.data.labels = labelsADayAgo
    myChart2.data.datasets[0].data = temperatureADayAgo
    myChart2.update()
    
}

function getLast3DaysLabels() {
    let today = new Date();
    let aDayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, today.getHours(), today.getMinutes(), today.getSeconds());
    return getLabelsByTime(aDayAgo)
}

function getLastWeekLabels() {
    let today = new Date();
    let aDayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, today.getHours(), today.getMinutes(), today.getSeconds());
    let temperatureFromWeek = a

    return getLabelsByTime(aDayAgo)
}

function getLastMonthLabels() {
    let today = new Date();
    let aDayAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
    return getLabelsByTime(aDayAgo)
}

function getAllLabels() {
    return dataFromDB.time
}





// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }

// function removeData(chart) {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
// }
