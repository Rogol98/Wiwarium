
let ctx = document.getElementById("myChart").getContext("2d");

let delayed

let labels = [
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
];
parsee = dataFromDB.replaceAll('&#39;', '\'')
console.log(parsee)
console.log("TYPEOF parsee: " + typeof parsee)
//parsee = JSON.parse(parsee)
//console.log(dataFromDB)
console.log("TYPEOF: " + typeof dataFromDB)
console.log(parsee.temperature)
console.log(parsee['temperature'])
let data = {
    labels,
    datasets: [{
        data: /*[167, 267, 248, 319, 225, 189, 297, 267, 305]*/parsee['temperature'],
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
                        return value + "°C";
                    },
                },
            },
        },
    },

};

let myChart = new Chart(ctx, config)


