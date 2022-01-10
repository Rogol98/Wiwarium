
let ctx = document.getElementById("myChart").getContext("2d");

let delayed

let labels = dataFromDB.time

dataFromDB = dataFromDB.replaceAll('&#39;', '\"')
dataFromDB = dataFromDB.replaceAll(')', '')
dataFromDB = dataFromDB.replaceAll('(', '')
dataFromDB = JSON.parse(dataFromDB)
console.log(dataFromDB)
console.log("TYPEOF: " + typeof dataFromDB)
console.log(parsee.temperature)
console.log(parsee['temperature'])

let data = {
    labels,
    datasets: [{
        data: dataFromDB['temperature'],
        label: "temperature",
        borderColor: "green",
        tension: 0.3,
    },
    ],
};

//let data = dataFromDB.temperature

let config = {
    type: "line",
    data: data,
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
                        return Math.round(value * 10) / 10  + "°C";
                    },
                },
            },
        },
    },

};

let myChart = new Chart(ctx, config)


