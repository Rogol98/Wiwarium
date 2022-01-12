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


function getLastDayLabels() {
    let timeFromDB = dataFromDB.time
    let today = new Date();
    let aDayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, today.getHours(), today.getMinutes(), today.getSeconds());
    let lastDayLabels = []
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
        if (dateFromChart.getTime() > aDayAgo.getTime()) {
            dateToPush = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
            lastDayLabels.push(dateToPush)
        }
    }
    return lastDayLabels
}

function getLabelsByTime(fromWhen) {
    let timeFromDB = dataFromDB.time
    let lastDayLabels = []
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
            dateToPush = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
            lastDayLabels.push(dateToPush)
        }
    }
    return lastDayLabels
}

let today = new Date();
let aDayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, today.getHours(), today.getMinutes(), today.getSeconds());

console.log(getLabelsByTime(aDayAgo))

//myChart1.data.labels = getLastDayLabels()

//myChart1.data.datasets[0].data = [32.5, 33.1, 34.7]

myChart1.update()


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
