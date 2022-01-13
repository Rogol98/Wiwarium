dataFromDB = dataFromDB.replaceAll('&#39;', '\"')
dataFromDB = dataFromDB.replaceAll(')', '')
dataFromDB = dataFromDB.replaceAll('(', '')
dataFromDB = JSON.parse(dataFromDB)

let ctx1 = document.getElementById("myChart1").getContext("2d");
let ctx2 = document.getElementById("myChart2").getContext("2d");
let ctx3 = document.getElementById("myChart3").getContext("2d");
let ctx4 = document.getElementById("myChart4").getContext("2d");

let delayed
let today = new Date();
let labels = dataFromDB.time

document.getElementById("selector").onchange = changeListener;


let dataTemperature = {
    labels,
    datasets: [{
        data: dataFromDB.temperature,
        label: "temperatura powietrza",
        borderColor: "green",
        tension: 0.3,
    },
    ],
};

let dataHumidity = {
    labels,
    datasets: [{
        data: dataFromDB.humidity,
        label: "wilgotność powietrza",
        borderColor: "blue",
        tension: 0.3,
    },
    ],
};

let dataSoilMoisture = {
    labels,
    datasets: [{
        data: dataFromDB.soilMoisture,
        label: "wilgotność gleby",
        borderColor: "brown",
        tension: 0.3,
    },
    ],
};

let dataLuminosity = {
    labels,
    datasets: [{
        data: dataFromDB.luminosity,
        label: "natężenie oświetlenia",
        borderColor: "yellow",
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


let configSoilMoisture = {
    type: "line",
    data: dataSoilMoisture,
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

let configLuminosity = {
    type: "line",
    data: dataLuminosity,
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
                        return Math.round(value * 10) / 10 + "lux";
                    },
                },
            },
        },
    },

};

let myChart1 = new Chart(ctx1, configTemperature)
let myChart2 = new Chart(ctx2, configHumidity)
let myChart3 = new Chart(ctx3, configSoilMoisture)
let myChart4 = new Chart(ctx4, configLuminosity)
getLastDayUpdate()

function getLabelsAfterTime(fromWhen) {
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
            dateToPush = year + '-'
            if (month + 1 < 10) {
                dateToPush += '0'
            }
            dateToPush += (month + 1) + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
            labels.push(dateToPush)
        }
    }
    return labels
}

function updateChartsToDate(date) {
    let labelsAfter = getLabelsAfterTime(date)
    let sliceBegin = labels.length - labelsAfter.length
    let temperatureAfter = dataFromDB.temperature.slice(sliceBegin, labels.length)
    let humidityAfter = dataFromDB.humidity.slice(sliceBegin, labels.length)
    console.log()
    let soilMoistureAfter = dataFromDB.soilMoisture.slice(sliceBegin, labels.length)
    let luminosityAfter = dataFromDB.luminosity.slice(sliceBegin, labels.length)
    myChart1.data.labels = labelsAfter
    myChart1.data.datasets[0].data = temperatureAfter
    myChart1.update()
    myChart2.data.labels = labelsAfter
    myChart2.data.datasets[0].data = humidityAfter
    myChart2.update()
    myChart3.data.labels = labelsAfter
    myChart3.data.datasets[0].data = soilMoistureAfter
    myChart3.update()
    myChart4.data.labels = labelsAfter
    myChart4.data.datasets[0].data = luminosityAfter
    myChart4.update()
}

function getLastDayUpdate() {
    let dateADayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, today.getHours(), today.getMinutes(), today.getSeconds());
    updateChartsToDate(dateADayAgo)
}

function getLast3DaysUpdate() {
    let date3DaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, today.getHours(), today.getMinutes(), today.getSeconds());
    updateChartsToDate(date3DaysAgo)
}

function getLastWeekUpdate() {
    let dateWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, today.getHours(), today.getMinutes(), today.getSeconds());
    updateChartsToDate(dateWeekAgo)
}

function getLastMonthUpdate() {
    let dateMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
    updateChartsToDate(dateMonthAgo)
}

function getAllUpdate() {
    let earliestDateAsInt = -8640000000000000
    let earliestDatePossible = new Date(earliestDateAsInt)
    updateChartsToDate(earliestDatePossible)
}

function changeListener() {
    let value = this.value;
    if (value == "1d") {
        getLastDayUpdate();
    } else if (value == "3d") {
        getLast3DaysUpdate();
    } else if (value == "1w") {
        getLastWeekUpdate();
    } else if (value == "1m") {
        getLastMonthUpdate();
    } else if (value == "all") {
        getAllUpdate();
    }
}