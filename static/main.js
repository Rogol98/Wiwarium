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

// addData(myChart1, "2026.01.12 9:34:49", 30.4)
// addData(myChart1, "2026.01.13 9:34:49", 30.4)
// addData(myChart1, "2026.01.14 9:34:49", 30.4)
// addData(myChart2, "2026.01.15 9:34:49", 51.4)
// addData(myChart2, "2026.01.16 9:34:49", 59.4)
// addData(myChart2, "2026.01.17 9:34:49", 71.4)
// removeData(myChart2)
// removeData(myChart2)
// removeData(myChart2)


function showLastDay() {
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
        let month = dates[1]
        let day = dates[2]

        let hour = times[0]
        let minutes = times[1]
        let seconds = times[2]

        let dateFromChart = new Date(year, month, day, hour, minutes, seconds)
        console.log(dateFromChart.toString())
        if (dateFromChart.getTime() > aDayAgo.getTime()) {
            dateToPush = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
            lastDayLabels.push(dateToPush)
        }

        return lastDayLabels
    }
}

console.log(showLastDay())

myChart1.data.labels.pop()
myChart1.data.labels.pop()
myChart1.update()
myChart2.update()


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
